import { MongoClient, Db, ObjectId } from 'mongodb';
import { LoggerInstance } from 'winston';
import { SentimentExtract, Suggestion } from '../interfaces/SentimentExtract';
import { InteractiveComponentPayload } from '../interfaces/Slack';
import ListService from './ListService';

export default class DatabaseService {
    private connection: Db;

    constructor (
        private url: string,
        private client: MongoClient,
        private logger: LoggerInstance,
        private listService: ListService
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

    public async updateExtractSuggestions (extractId: string, userId: string, value: string) {
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

    public async getNextExtract (userId: string): Promise<SentimentExtract> {
        try {
            await this.connect();

            // Get 100 random extracts from the database
            const extracts: SentimentExtract[] = await this.connection.collection('extracts').aggregate([
                { $sample: { size: 100 } }
            ]).toArray();
            // Try to get a unique extract from the database
            const unique: SentimentExtract[] = extracts.filter((extract: SentimentExtract) => {
                return !extract.suggestions.find((suggestion: Suggestion) => {
                    return suggestion.user_id === userId;
                });
            });

            return unique.length ? this.listService.getRandomItem(unique) : extracts[0];
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
