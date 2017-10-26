import ResponseService from '../services/ResponseService';
import DatabaseService from '../services/DatabaseService';
import Miyagi from '../services/Miyagi';

export default class ResponseServiceFactory {
    public create (
        databaseService: DatabaseService,
        miyagi: Miyagi
    ): ResponseService {
        return new ResponseService(
            databaseService,
            miyagi
        );
    }
}
