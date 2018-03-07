import { MongoClient, Db, ObjectId } from 'mongodb';
import { LoggerInstance } from 'winston';
import { SentimentExtract, Suggestion, Option, suggestions } from '../interfaces/SentimentExtract';
import { InteractiveComponentPayload } from '../interfaces/Slack';
import ListService from './ListService';

export default class DatabaseService {
    private connection: Db;

    constructor (
        private url: string,
        private client: MongoClient,
        private logger: LoggerInstance,
        private listService: ListService,
        private collection: string
    ) {
        this.logger.info(`Database "${this.url}" Collection "${this.collection}"`);
    }

    public async getRandomExtracts (total: number): Promise<SentimentExtract[]> {
        try {
            await this.connect();
            return await this.connection.collection(this.collection).aggregate([
                { $sample: { size: total } }
            ]).toArray();
        } finally {
            this.close();
        }
    }

    public async getUniqueExtract (): Promise<SentimentExtract> {
        await this.connect();

        const extracts: SentimentExtract[] = await this.connection.collection(this.collection)
            .aggregate([
                { $sample: { size: 15000 } }
            ]).toArray();
        const unique: SentimentExtract = extracts.find((extract: SentimentExtract) => {
            return !extract.suggestions.length;
        });

        this.close();

        if (unique) {
            return unique;
        } else {
            return extracts[0];
        }
    }

    public async getAllExtracts (): Promise<SentimentExtract[]> {
        try {
            await this.connect();
            return await this.connection.collection(this.collection).find({}).toArray();
        } finally {
            this.close();
        }
    }

    public async updateExtractSuggestions (
        extractId: string,
        userId: string,
        value: suggestions,
        options?: Option[]
    ) {
        const suggestion: Suggestion = {
            user_id: userId,
            value: value,
            options: options
        };

        try {
            await this.connect();
            await this.connection.collection(this.collection)
                .findOneAndUpdate(
                    { _id : new ObjectId(extractId) },
                    { $push: { suggestions: suggestion }, $set: { has_suggestion: true } }
                );
        } finally {
            this.close();
        }
    }

    public async getNextExtract (userId: string): Promise<SentimentExtract> {
        try {
            await this.connect();

            // Get 100 random extracts from the database
            const extracts: SentimentExtract[] = await this.connection.collection(this.collection).aggregate([
                { $sample: { size: 5000 } }
            ]).toArray();
            // Try to get a unique extract from the database
            const unique: SentimentExtract[] = extracts.filter((extract: SentimentExtract) => {
                return !extract.suggestions.length;
            });

            // If there are no unique extracts in the random sample, return a duplicate
            return unique.length ? this.listService.getRandomItem(unique) : extracts[0];
        } finally {
            this.close();
        }
    }

    private async connect (): Promise<any> {
        this.connection = await this.client.connect(this.url);
    }

    private async close (): Promise<any> {
        // this.connection.close();
    }
}
