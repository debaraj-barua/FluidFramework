/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { assert } from "@fluidframework/common-utils";
import {
    ITreeCursor,
    TreeNavigationResult,
    mapCursorField,
} from "../forest";
import {
    FieldKey,
    FieldMap,
    getGenericTreeField,
    JsonableTree,
    TreeType,
    Value,
} from "../tree";

/**
 * This modules provides support for reading and writing a human readable (and editable) tree format.
 *
 * This implementation can handle all trees (so it does not need a fallback for any special cases),
 * and is not optimized.
 *
 * It's suitable for testing and debugging,
 * though it could also reasonably be used as a fallback for edge cases or for small trees.
 *
 * TODO: Use placeholders.
 * build / add operations should be able to include detached ranges instead of children directly.
 * summaries should be able to reference unloaded chunks instead of having children directly.
 * Leverage placeholders in the types below to accomplish this.
 * Determine how this relates to Cursor: should cursor be generic over placeholder values?
 * (Could use them for errors to allow non erroring cursors?)
 *
 * Note:
 * Currently a lot of Tree's codebase is using json for serialization.
 * Because putting json strings inside json works poorly (adds lots of escaping),
 * for now this library actually outputs and inputs the Json compatible type JsonableTree
 * rather than actual strings.
 */

/**
 * An ITreeCursor implementation for JsonableTree.
 *
 * TODO: object-forest's cursor is mostly a superset of this functionality.
 * Maybe do a refactoring to deduplicate this.
 */
export class TextCursor implements ITreeCursor {
    // Ancestors traversed to visit this node (including this node and the root).
    private readonly nodeStack: JsonableTree[] = [];
    // Keys traversed to visit this node
    private readonly keyStack: FieldKey[] = [];
    // Indices traversed to visit this node
    private readonly indexStack: number[] = [];

    private siblings: readonly JsonableTree[];
    private readonly root: readonly JsonableTree[];

    public constructor(root: JsonableTree) {
        this.root = [root];
        this.indexStack.push(0);
        this.siblings = this.root;
        this.nodeStack.push(root);
    }

    getNode(): JsonableTree {
        return this.nodeStack[this.nodeStack.length - 1];
    }

    getFields(): Readonly<FieldMap<JsonableTree>> {
        return this.getNode().fields ?? {};
    }

    getField(key: FieldKey): readonly JsonableTree[] {
        // Save result to a constant to work around linter bug:
        // https://github.com/typescript-eslint/typescript-eslint/issues/5014
        const field: readonly JsonableTree[] = this.getFields()[key as string] ?? [];
        return field;
    }

    get value(): Value {
        return this.getNode().value;
    }

    get type(): TreeType {
        return this.getNode().type;
    }

    get keys(): Iterable<FieldKey> {
        return Object.getOwnPropertyNames(this.getFields()) as Iterable<FieldKey>;
    }

    down(key: FieldKey, index: number): TreeNavigationResult {
        const siblings = this.getField(key);
        const child = siblings[index];
        if (child !== undefined) {
            this.nodeStack.push(child);
            this.indexStack.push(index);
            this.keyStack.push(key);
            this.siblings = siblings;
            return TreeNavigationResult.Ok;
        }
        return TreeNavigationResult.NotFound;
    }

    seek(offset: number): { result: TreeNavigationResult; moved: number; } {
        const index = offset + this.indexStack[this.indexStack.length - 1];
        const child = this.siblings[index];
        if (child !== undefined) {
            this.indexStack[this.indexStack.length - 1] = index;
            this.nodeStack[this.nodeStack.length - 1] = child;
            return { result: TreeNavigationResult.Ok, moved: offset };
        }
        // TODO: Maybe truncate move, and move to end?
        return { result: TreeNavigationResult.NotFound, moved: 0 };
    }

    up(): TreeNavigationResult {
        const length = this.nodeStack.length;
        assert(this.indexStack.length === length, "Unexpected indexStack.length");
        assert(this.keyStack.length === length - 1, "Unexpected keyStack.length");

        // If nodeStack (which includes the current node) contains only one item,
        // then the current node is the root, and we can not navigate up.
        if (length === 1) {
            return TreeNavigationResult.NotFound;
        }

        assert(length > 1, "Unexpected nodeStack.length");
        this.nodeStack.pop();
        this.indexStack.pop();
        this.keyStack.pop();
        // TODO: maybe compute siblings lazily or store in stack? Store instead of keyStack?
        if (length === 2) {
            // Before navigation, cursor was one below the root (height 2), so now it's at the root.
            // At the root it cannot get the sibling list by looking at the parent (since there is none),
            // so use the saved root array.
            this.siblings = this.root;
        } else {
            const newParent = this.nodeStack[this.nodeStack.length - 2];
            const key = this.keyStack[this.keyStack.length - 1];
            this.siblings = getGenericTreeField(newParent, key, false);
        }
        return TreeNavigationResult.Ok;
    }

    length(key: FieldKey): number {
        return this.getField(key).length;
    }
}

/**
 * Extract a JsonableTree from the contents of the given ITreeCursor's current node.
 */
export function jsonableTreeFromCursor(cursor: ITreeCursor): JsonableTree {
    let fields: FieldMap<JsonableTree> | undefined;
    for (const key of cursor.keys) {
        fields ??= {};
        const field: JsonableTree[] = mapCursorField(cursor, key, jsonableTreeFromCursor);
        fields[key as string] = field;
    }

    const node: JsonableTree = {
        type: cursor.type,
        value: cursor.value,
        fields,
    };
    // Normalize object by only including fields that are required.
    if (fields === undefined) {
        delete node.fields;
    }
    if (node.value === undefined) {
        delete node.value;
    }
    return node;
}