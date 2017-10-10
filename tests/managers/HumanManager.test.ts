import HumanManager from '../../src/managers/HumanManager';
import SlackUserService from '../../src/services/SlackUserService';
import { mock, instance, when, deepEqual, verify } from 'ts-mockito';
import { LoggerInstance, Logger } from 'winston';
import { User } from '../../src/interfaces/Slack';
import { Suggestion } from '../../src/interfaces/SentimentExtract';
import ListService from '../../src/services/ListService';

describe('HumanManager', () => {
    let humanManager: HumanManager;
    let slackUserService: SlackUserService;
    let logger: LoggerInstance;
    let users: User[];
    let listService: ListService;

    beforeEach(() => {
        slackUserService = mock(SlackUserService);
        listService = mock(ListService);
        logger = new Logger();
        users = [
            { name: 'test_user_1', id: 'test_id_1' },
            { name: 'test_user_2', id: 'test_id_2' }
        ];
        humanManager = new HumanManager(
            instance(slackUserService),
            logger,
            instance(listService),
            100
        );

        when(slackUserService.getHumansFromChannel('test')).thenReturn(Promise.resolve(users));
    });

    describe('get number of cached humans', () => {
        test('should return cached human length', () => {
            expect.assertions(1);

            return humanManager.fetch('test', false).then(() => {
                expect(humanManager.getNumberOfCachedHumans()).toEqual(2);
            });
        });
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

    describe('fetch, getHumans',  () => {
        test('should fetch humans from channel', () => {
            expect.assertions(1);

            return humanManager.fetch('test', false).then(() => {
                expect(humanManager.getHumans()).toEqual(users);
            });
        });

        test('should handle an error fetching humans');
    });

    describe('getNextHuman', () => {
        test('should get next human if we have one and they are online', () => {
            const usersClone = [...users];

            expect.assertions(2);

            when(slackUserService.userActive(deepEqual(usersClone[0]))).thenReturn(Promise.resolve(true));
            when(slackUserService.userActive(deepEqual(usersClone[1]))).thenReturn(Promise.resolve(true));
            when(listService.getRandomItem(deepEqual(usersClone))).thenReturn(usersClone[0]);

            return humanManager.fetch('test', false).then(() => {
                return humanManager.getNextHuman().then((human: User) => {
                    expect(human).toEqual({ name: 'test_user_1', id: 'test_id_1' });
                    expect(humanManager.getHumans()).toHaveLength(1);
                });
            });
        });

        test('should only get online humans', () => {
            const usersClone = [...users];

            when(slackUserService.userActive(deepEqual(usersClone[0]))).thenReturn(Promise.resolve(false));
            when(slackUserService.userActive(deepEqual(usersClone[1]))).thenReturn(Promise.resolve(true));
            when(listService.getRandomItem(deepEqual([usersClone[1]]))).thenReturn(usersClone[1]);

            return humanManager.fetch('test', false).then(() => {
                return humanManager.getNextHuman().then((human: User) => {
                    verify(listService.getRandomItem(deepEqual([usersClone[1]]))).called();
                });
            });
        });

        test('should return undefined if we have ran out of humans', () => {
            const usersClone = [...users];

            expect.assertions(1);
            when(slackUserService.userActive(deepEqual(usersClone[0]))).thenReturn(Promise.resolve(false));
            when(slackUserService.userActive(deepEqual(usersClone[1]))).thenReturn(Promise.resolve(false));
            when(listService.getRandomItem(deepEqual([]))).thenReturn(undefined);

            return humanManager.fetch('test', false).then(() => {
                return humanManager.getNextHuman().then((human: User) => {
                    expect(human).toBeUndefined();
                });
            });
        });
    });

    describe('startInteractionTimeout', () => {
        let next: () => Promise<void>;

        beforeEach(() => {
            next = jest.fn();
            window.setTimeout = jest.fn(() => '1234');
            window.clearTimeout = jest.fn();
        });

        test('should clear the current timeout if we have one', () => {
            humanManager.startInteractionTimeout(next);
            humanManager.startInteractionTimeout(next);

            expect(window.clearTimeout).toHaveBeenCalledTimes(1);
            expect(window.clearTimeout).toHaveBeenCalledWith('1234');
        });

        test('should set a timeout', () => {
            humanManager.startInteractionTimeout(next);

            expect(window.setTimeout).toHaveBeenCalledTimes(1);
            expect(window.setTimeout).toHaveBeenCalledWith(next, 100);
        });
    });

    describe('clearInteractionTimeout', () => {
        beforeEach(() => {
            window.clearTimeout = jest.fn();
        });

        test('should clear interaction timeout', () => {
            humanManager.clearInteractionTimeout();

            expect(window.clearTimeout).toHaveBeenCalledTimes(1);
        });
    });
});
