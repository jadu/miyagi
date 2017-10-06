import { MongoClient, Db, ObjectId } from 'mongodb';
import { LoggerInstance } from 'winston';
import { SentimentExtract, Suggestion } from '../interfaces/SentimentExtract';
import { InteractiveComponentPayload } from '../interfaces/Slack';

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

    public async handleExtractSuggestion (extractId: string, userId: string, value: string) {
        const suggestion: Suggestion = {
            user_id: userId,
            value: value
        };

        await this.connect();
        return await this.connection.collection('extracts')
            .findOneAndUpdate(
                { _id : new ObjectId(extractId) },
                { $push: { suggestions: suggestion }}
            );
    }

    private async connect (): Promise<any> {
        this.connection = await this.client.connect(this.url);
    }

    private async close (): Promise<any> {
        this.connection.close();
    }
}
