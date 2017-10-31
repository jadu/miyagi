import DatabaseService from '../services/DatabaseService';
import ListService from '../services/ListService';
import { LoggerInstance } from 'winston';
import { MongoClient } from 'mongodb';

export default class DatabaseServiceFactory {
    public create (
        url: string,
        logger: LoggerInstance,
        dev: boolean = false
    ): DatabaseService {
        return new DatabaseService(
            url,
            new MongoClient(),
            logger,
            new ListService(),
            dev
        );
    }
}
