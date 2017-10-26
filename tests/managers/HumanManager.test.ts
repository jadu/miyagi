import HumanManager from '../../src/managers/HumanManager';
import SlackUserService from '../../src/services/SlackUserService';
import { mock, instance, when, deepEqual, verify } from 'ts-mockito';
import { User } from '../../src/interfaces/Slack';
import { Suggestion } from '../../src/interfaces/SentimentExtract';
import ListService from '../../src/services/ListService';
import LoggerMock from '../mocks/Logger';

describe('HumanManager', () => {
    let humanManager: HumanManager;
    let slackUserService: SlackUserService;
    let logger: LoggerMock;
    let users: User[];
    let listService: ListService;

    beforeEach(() => {
        slackUserService = mock(SlackUserService);
        listService = mock(ListService);
        logger = new LoggerMock();
        users = [
            { name: 'test_user_1', id: 'test_id_1' },
            { name: 'test_user_2', id: 'test_id_2' }
        ];
        humanManager = new HumanManager(
            instance(slackUserService),
            logger as any,
            instance(listService)
        );

        when(slackUserService.getHumansFromChannel('test')).thenReturn(Promise.resolve(users));
    });

    describe('addSessionSuggestion, getSessionSuggestions', () => {
        test('should update and get session suggestions', () => {
            const suggestion: Suggestion = {
                user_id: 'test_id',
                name: 'test_name',
                value: 'test_value'
            };

            humanManager.addSessionSuggestion(suggestion.user_id, suggestion.name, suggestion.value);

            expect(humanManager.getSessionSuggestions()).toEqual([ suggestion ]);
        });
    });

    describe('resetSessionSuggestions', () => {
        test('should clear session suggestions', () => {
            const suggestion: Suggestion = {
                user_id: 'test_id',
                name: 'test_name',
                value: 'test_value'
            };

            humanManager.addSessionSuggestion(suggestion.user_id, suggestion.name, suggestion.value);
            humanManager.resetSessionSuggestions();

            expect(humanManager.getSessionSuggestions()).toHaveLength(0);
        });
    });

    describe('getActiveHumans', () => {
        test('should return active humans', () => {
            expect(humanManager.getActiveHumans()).toEqual([]);
        });
    });

    describe('fetch',  () => {
        test('should invoke slack user service to get humans', (done) => {
            humanManager.fetch('test_channel', false).then(() => {
                verify(slackUserService.getHumansFromChannel('test_channel')).called();
                done();
            });
        });

        test('should catch error fetching humans', (done) => {
            when(slackUserService.getHumansFromChannel('test_channel')).thenReturn(Promise.reject('error'));

            humanManager.fetch('test_channel', false).then(() => {
                expect(logger.error).toBeCalled();
                done();
            });
        });
    });

    describe('getNextHuman', () => {
        test('should get next human if we have one and they are online', (done) => {
            const usersClone = [...users];

            when(slackUserService.userActive(deepEqual(usersClone[0]))).thenReturn(Promise.resolve(true));
            when(slackUserService.userActive(deepEqual(usersClone[1]))).thenReturn(Promise.resolve(true));
            when(listService.getRandomItem(deepEqual(usersClone))).thenReturn(usersClone[0]);

            humanManager.fetch('test', false).then(() => {
                humanManager.getNextHuman().then((human: User) => {
                    expect(human).toEqual({ name: 'test_user_1', id: 'test_id_1' });
                    done();
                });
            });
        });

        test('should only get online humans', (done) => {
            const usersClone = [...users];

            when(slackUserService.userActive(deepEqual(usersClone[0]))).thenReturn(Promise.resolve(false));
            when(slackUserService.userActive(deepEqual(usersClone[1]))).thenReturn(Promise.resolve(true));
            when(listService.getRandomItem(deepEqual([usersClone[1]]))).thenReturn(usersClone[1]);

            humanManager.fetch('test', false).then(() => {
                humanManager.getNextHuman().then((human: User) => {
                    verify(listService.getRandomItem(deepEqual([usersClone[1]]))).called();
                    done();
                });
            });
        });

        test('should return undefined if we have ran out of humans', (done) => {
            const usersClone = [...users];

            when(slackUserService.userActive(deepEqual(usersClone[0]))).thenReturn(Promise.resolve(false));
            when(slackUserService.userActive(deepEqual(usersClone[1]))).thenReturn(Promise.resolve(false));
            when(listService.getRandomItem(deepEqual([]))).thenReturn(undefined);

            humanManager.fetch('test', false).then(() => {
                humanManager.getNextHuman().then((human: User) => {
                    expect(human).toBeUndefined();
                    done();
                });
            });
        });
    });
});
