import DatabaseService from '../../src/services/DatabaseService';
import { MongoClient } from 'mongodb';
import { mock, instance, when, verify } from 'ts-mockito';
import LoggerMock from '../mocks/Logger';
import ListService from '../../src/services/ListService';

describe('DatabaseService', () => {
    let databaseService: DatabaseService;
    let mongoClient: MongoClient;
    let logger: LoggerMock;
    let listService: ListService;

    beforeEach(() => {
        mongoClient = mock(MongoClient);
        logger = new LoggerMock();
        listService = mock(ListService);
        databaseService = new DatabaseService(
            'test/path/to/db',
            instance(mongoClient),
            logger as any,
            instance(listService)
        );
    });

    describe('getRandomExtracts', () => {
        test('should connect to the database');
        test('should return a specified number of extracts');
        test('should close the database connection');
    });

    describe('updateExtractSuggestions', () => {
        test('should connect to the database');
        test('should update an extract');
        test('should close the database connection');
    });

    describe('getNextExtract', () => {
        test('should connect to the database');
        test('should return the first unique extract from the sample');
        test('should return the first extract from the sample if there are no unique extracts');
        test('should close the database connection');
    });

    describe('connect', () => {
        test('should connect to the database');
    });

    describe('close', () => {
        test('should close the database connection');
    });
});
