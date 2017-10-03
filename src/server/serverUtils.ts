import { Db } from 'mongodb';
import { SentimentExtract } from '../types';
import { LoggerInstance } from 'winston';

// Get a list extracts from database
export async function getRandomExtracts (db: Db, logger: LoggerInstance, total: number): Promise<SentimentExtract[]> {
    return new Promise(async (
        resolve: (value: SentimentExtract[]) => void, 
        reject: (value: string) => void
    ) => {
        try {
            resolve(await db.collection('extracts').aggregate([
                { $sample: { size: total } }
            ]).toArray());
        } catch (error) {
            logger.error(error);
            reject(error);
        }
    });
}