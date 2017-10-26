import ResponseService from '../../src/services/ResponseService';
import DatabaseService from '../../src/services/DatabaseService';
import Miyagi from '../../src/services/Miyagi';
import { mock, instance, verify } from 'ts-mockito/lib/ts-mockito';

describe('ResponseService', () => {
    let responseService: ResponseService;
    let databaseService: DatabaseService;
    let miyagi: Miyagi;

    beforeEach(() => {
        databaseService = mock(DatabaseService);
        miyagi = mock(Miyagi);
        responseService = new ResponseService(
            instance(databaseService),
            instance(miyagi)
        );
    });

    describe('continue', () => {
        test('should update the extract\'s suggestions in the database and resume the thread', () => {
            responseService.continue('extract_id', 'user_id', 'test_value');

            verify(databaseService.updateExtractSuggestions('extract_id', 'user_id', 'test_value')).called();
            verify(miyagi.resumeThread()).called();
        });
    });

    describe('end', () => {
        test('should close the current thread', () => {
            responseService.end();

            verify(miyagi.nextThread()).called();
        });
    });
});
