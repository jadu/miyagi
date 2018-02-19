import DatabaseService from './DatabaseService';
import Miyagi from './Miyagi';
import { suggestions } from '../interfaces/SentimentExtract';

export default class ResponseService {
    constructor (
        private databaseService: DatabaseService,
        private miyagi: Miyagi
    ) {}

    public continue (extractId: string, userId: string, value: suggestions) {
        this.databaseService.updateExtractSuggestions(extractId, userId, value);
        this.miyagi.resumeThread();
    }

    public end () {
        this.miyagi.nextThread();
    }
}
