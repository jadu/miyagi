import ResponseHandler from '../handlers/ResponseHandler';
import ResponseService from '../services/ResponseService';
import DatabaseService from '../services/DatabaseService';
import Miyagi from '../services/Miyagi';
import { LoggerInstance } from 'winston';

export default class ResponseHandlerFactory {
    public create (
        databaseService: DatabaseService,
        miyagi: Miyagi,
        logger: LoggerInstance,
        limit: number = 1000
    ): ResponseHandler {
        const responseService: ResponseService = new ResponseService(
            databaseService,
            miyagi
        );

        return new ResponseHandler(
            responseService,
            logger,
            limit
        );
    }
}
