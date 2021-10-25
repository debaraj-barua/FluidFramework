/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { ScriptoriumLambdaFactory } from "@fluidframework/server-lambdas";
import * as services from "@fluidframework/server-services";
import { ICollection, IDocument, IPartitionLambdaFactory, MongoManager } from "@fluidframework/server-services-core";
import { Lumberjack } from "@fluidframework/server-services-telemetry";
import { deleteSummarizedOps, executeOnInterval, FluidErrorCode } from "@fluidframework/server-services-utils";
import { Provider } from "nconf";

export async function create(config: Provider): Promise<IPartitionLambdaFactory> {
    const mongoUrl = config.get("mongo:endpoint") as string;
    const mongoExpireAfterSeconds = config.get("mongo:expireAfterSeconds") as number;
    const deltasCollectionName = config.get("mongo:collectionNames:deltas");
    const documentsCollectionName = config.get("mongo:collectionNames:documents");
    const createCosmosDBIndexes = config.get("mongo:createCosmosDBIndexes");
    const softDeletionRetentionPeriodMs = config.get("mongo:softDeletionRetentionPeriodMs") as number;
    const offlineWindowMs = config.get("mongo:offlineWindowMs") as number;
    const softDeletionEnabled = config.get("mongo:softDeletionEnabled");
    const permanentDeletionEnabled = config.get("mongo:permanentDeletionEnabled");
    const deletionIntervalMs = config.get("mongo:deletionIntervalMs") as number;
    const mongoFactory = new services.MongoDbFactory(mongoUrl);
    const mongoManager = new MongoManager(mongoFactory, false);

    const db = await mongoManager.getDatabase();
    const documentsCollection: ICollection<IDocument> = db.collection(documentsCollectionName);
    const opCollection = db.collection(deltasCollectionName);
    await opCollection.createIndex(
        {
            "documentId": 1,
            "operation.term": 1,
            "operation.sequenceNumber": 1,
            "tenantId": 1,
        },
        true);

    if (createCosmosDBIndexes) {
        Lumberjack.info(`createcosmosdbindexes enabled ${createCosmosDBIndexes}`);
        await opCollection.createIndex({
            "operation.term": 1,
            "operation.sequenceNumber": 1,
        }, false);

        await opCollection.createIndex({
            "operation.sequenceNumber": 1,
        }, false);
    }

    if (mongoExpireAfterSeconds > 0) {
        if (createCosmosDBIndexes) {
            await opCollection.createTTLIndex({_ts:1}, mongoExpireAfterSeconds);
        } else {
            await opCollection.createTTLIndex(
                {
                    mongoTimestamp: 1,
                },
                mongoExpireAfterSeconds,
            );
        }
    }

    Lumberjack.info(`Soft deletion enabled value is ${softDeletionEnabled}`);

    executeOnInterval(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        async () => deleteSummarizedOps(
            opCollection,
            documentsCollection,
            softDeletionRetentionPeriodMs,
            offlineWindowMs,
            softDeletionEnabled,
            permanentDeletionEnabled),
        deletionIntervalMs,
        "deleteSummarizedOps",
        undefined,
        (error) => { return error.code === FluidErrorCode.FeatureDisabled; },
    );

    return new ScriptoriumLambdaFactory(mongoManager, opCollection);
}
