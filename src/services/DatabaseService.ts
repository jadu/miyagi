import { MongoClient, Db } from 'mongodb';
import { LoggerInstance } from 'winston';
import { SentimentExtract } from '../interfaces/SentimentExtract';

export default class DatabaseService {
    private connection: Db;

    constructor (
        private url: string,
        private client: MongoClient,
        private logger: LoggerInstance
    ) {}

    public async getRandomExtracts (total: number): Promise<SentimentExtract[]> {
        try {
            await this.connect();
            return await this.connection.collection('extracts').aggregate([
                { $sample: { size: total } }
            ]).toArray();
        } finally {
            this.close();
        }
    }

    private async connect (): Promise<any> {
        this.connection = await this.client.connect(this.url);
    }

    private async close (): Promise<any> {
        this.connection.close();
    }
}
