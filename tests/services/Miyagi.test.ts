import Miyagi from '../../src/services/Miyagi';
import HumanManager from '../../src/managers/HumanManager';
import MessageService from '../../src/services/MessageService';
import DatabaseService from '../../src/services/DatabaseService';
import { mock, instance, verify, when, deepEqual, anyFunction } from 'ts-mockito';
import LoggerMock from '../mocks/Logger';
import IdleService from '../../src/services/IdleService';
import ThreadService from '../../src/services/ThreadService';
import { User } from '../../src/interfaces/Slack';
import Thread from '../../src/interfaces/Thread';

describe('Miyagi', () => {
    let miyagi: Miyagi;
    let humanManager: HumanManager;
    let logger: LoggerMock;
    let databaseService: DatabaseService;
    let idleService: IdleService;
    let threadService: ThreadService;

    beforeEach(() => {
        humanManager = mock(HumanManager);
        logger = new LoggerMock();
        databaseService = mock(DatabaseService);
        idleService = mock(IdleService);
        threadService = mock(ThreadService);
        miyagi = new Miyagi(
            instance(humanManager),
            instance(databaseService),
            logger as any,
            instance(threadService),
            instance(idleService)
        );
    });

    describe('refresh', () => {
        test('should reset session suggestions', (done) => {
            miyagi.refresh('test').then(() => {
                verify(humanManager.resetSessionSuggestions()).called();
                done();
            });
        });

        test('should fetch humans from channel', (done) => {
            miyagi.refresh('test').then(() => {
                verify(humanManager.fetch('test', false)).called();
                done();
            });
        });

        test('should handle an error from fetching humans', (done) => {
            when(humanManager.fetch('test', false)).thenReturn(Promise.reject('error'));

            miyagi.refresh('test').then(() => {
                expect(logger.error).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('resumeThread', () => {
        const human: User = {
            name: 'test_name',
            id: 'test_id'
        };
        const thread: Thread = {
            suggestions: 0,
            active: false,
            timestamp: null,
            activeMessage: null,
            human: human,
            channelId: null
        };

        beforeEach(async (done) => {
            when(humanManager.getNextHuman()).thenReturn(Promise.resolve(human));
            when(threadService.create(human)).thenReturn(thread);
            when(threadService.next(thread)).thenReturn(Promise.resolve(thread));
            await miyagi.nextThread();
            done();
        });

        test('should clear the idle timer', (done) => {
            miyagi.resumeThread().then(() => {
                verify(idleService.clear()).called();
                done();
            });
        });

        test('should start a new idle timer', (done) => {
            miyagi.resumeThread().then(() => {
                verify(idleService.start(anyFunction())).called();
                done();
            });
        });

        test('should progress the thread', (done) => {
            miyagi.resumeThread().then(() => {
                verify(threadService.next(deepEqual(thread))).called();
                done();
            });
        });

        test('should catch errors progressing the thread', (done) => {
            when(threadService.next(deepEqual(thread))).thenReturn(Promise.reject('error'));

            miyagi.resumeThread().then(() => {
                expect(logger.error).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('nextThread', () => {
        const human: User = {
            name: 'test_name',
            id: 'test_id'
        };
        const thread: Thread = {
            suggestions: 0,
            active: false,
            timestamp: null,
            activeMessage: null,
            human: human,
            channelId: null
        };

        beforeEach(() => {
            when(humanManager.getNextHuman()).thenReturn(Promise.resolve(human));
            when(threadService.create(human)).thenReturn(thread);
            when(threadService.next(thread)).thenReturn(Promise.resolve(thread));
        });

        test('should clear the idle timer', (done) => {
            miyagi.nextThread().then(() => {
                verify(idleService.clear()).called();
                done();
            });
        });

        test('should get next human', (done) => {
            miyagi.nextThread().then(() => {
                verify(humanManager.getNextHuman()).called();
                done();
            });
        });

        test('should catch errors getting next human', (done) => {
            when(humanManager.getNextHuman()).thenReturn(Promise.reject('error'));

            miyagi.nextThread().then(() => {
                expect(logger.error).toBeCalled();
                done();
            });
        });

        test('should close the current thread if it is defined', (done) => {
            miyagi.nextThread().then(() => {
                miyagi.nextThread().then(() => {
                    verify(threadService.close(deepEqual(thread))).called();
                    done();
                });
            });
        });

        test('should catch errors closing the current thread', (done) => {
            miyagi.nextThread().then(() => {
                when(threadService.close(deepEqual(thread))).thenReturn(Promise.reject('error'));

                miyagi.nextThread().then(() => {
                    expect(logger.error).toBeCalled();
                    done();
                });
            });
        });

        test('should handle no more humans available', (done) => {
            when(humanManager.getNextHuman()).thenReturn(undefined);

            miyagi.nextThread().then(() => {
                verify(threadService.create(deepEqual(human))).never();
                verify(threadService.next(deepEqual(thread))).never();
                verify(idleService.start(anyFunction())).never();
                done();
            });
        });

        test('should create a new thread', (done) => {
            miyagi.nextThread().then(() => {
                verify(threadService.create(deepEqual(human))).called();
                done();
            });
        });

        test('should start an idle timer', (done) => {
            miyagi.nextThread().then(() => {
                verify(idleService.start(anyFunction())).called();
                done();
            });
        });

        test('should progress the thread', (done) => {
            miyagi.nextThread().then(() => {
                verify(threadService.next(deepEqual(thread))).called();
                done();
            });
        });

        test('should catch errors progressing the thread', (done) => {
            when(threadService.next(deepEqual(deepEqual(thread)))).thenReturn(Promise.reject('error'));

            miyagi.nextThread().then(() => {
                expect(logger.error).toBeCalled();
                done();
            });
        });
    });
});
