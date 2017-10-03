import { Db } from 'mongodb';
import { LoggerInstance } from 'winston';
import { SentimentExtract } from '../types';

// Get a list extracts from database
export async function getRandomExtracts (db: Db, logger: LoggerInstance, total: number): Promise<SentimentExtract[]> {
    return new Promise(async (
        resolve: (value: SentimentExtract[]) => void,
        reject: (value: string) => void
    ) => {
        logger.debug(`Getting ${total} extract${total === 1 ? '' : 's'} from  the database`);

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