/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { ICollection, IDocument } from "@fluidframework/server-services-core";
import { Lumberjack, getLumberBaseProperties } from "@fluidframework/server-services-telemetry";
import { FluidError, FluidErrorCode } from "./errorUtils";

export async function deleteSummarizedOps(
    opCollection: ICollection<unknown>,
    documentsCollection: ICollection<IDocument>,
    softDeleteRetentionPeriodMs: number,
    offlineWindowMs: number,
    softDeletionEnabled: boolean,
    permanentOpsDeletionEnabled: boolean): Promise<void> {
        if (!softDeletionEnabled) {
            const error: FluidError = new Error(`Operation deletion is not enabled ${softDeletionEnabled}`);
            error.code = FluidErrorCode.FeatureDisabled;
            return Promise.reject(error);
        }

        const uniqueDocuments = await documentsCollection.aggregate(
            { _id: { documentId: "$documentId", tenantId: "$tenantId"}},
        ).toArray();
        Lumberjack.info(`Unique docs length = ${uniqueDocuments.length}`);

        const currentEpochTime = new Date().getTime();
        const epochTimeBeforeOfflineWindow =  currentEpochTime - offlineWindowMs;
        const scheduledDeletionEpochTime = currentEpochTime + softDeleteRetentionPeriodMs;
        Lumberjack.info(`Current epoch time ${currentEpochTime}
        scheduledDeletionEpochTime ${scheduledDeletionEpochTime}`);

        for (const doc of uniqueDocuments) {
            const lumberjackProperties = getLumberBaseProperties(doc.documentId, doc.tenantId);
            try {
                const lastSummarySequenceNumber = JSON.parse(doc.scribe).lastSummarySequenceNumber;
                Lumberjack.info(`LastsummarySequenceNumber = ${lastSummarySequenceNumber}`);

                // first "soft delete" operations older than the offline window, which have been summarised
                // soft delete is done by setting a scheduled deletion time
                await opCollection.updateMany({
                    $and: [
                        {
                            documentId: doc.documentId,
                        },
                        {
                            tenantId: doc.tenantId,
                        },
                        {
                            "operation.timestamp": { $lte: epochTimeBeforeOfflineWindow },
                        },
                        {
                            "operation.sequenceNumber": { $lte: lastSummarySequenceNumber },
                        },
                        {
                            scheduledDeletionTime: { $exists: false },
                        },
                    ]},
                    { scheduledDeletionTime: scheduledDeletionEpochTime },
                    undefined);

                if (permanentOpsDeletionEnabled) {
                    Lumberjack.info(`Trying to permanently delete`);
                    // then permanently delete ops that have passed their retention period
                    // delete if current epoch time is greater than the scheduled deletion time of the op
                    await opCollection.deleteMany({
                        documentId: doc.documentId,
                        tenantId: doc.tenantId,
                        scheduledDeletionTime: { $lte: currentEpochTime },
                    });
                }
            } catch (error) {
                Lumberjack.error(`Error while trying to delete ops`, lumberjackProperties, error);
                throw error;
            }
        }
}
