import DatabaseService from './DatabaseService';
import Miyagi from './Miyagi';

export default class ResponseService {
    constructor (
        private databaseService: DatabaseService,
        private miyagi: Miyagi
    ) {}

    public continue (extractId: string, userId: string, value: string) {
        this.databaseService.updateExtractSuggestions(extractId, userId, value);
        this.miyagi.resumeThread();
    }

    public end () {
        this.miyagi.nextThread();
    }
}
