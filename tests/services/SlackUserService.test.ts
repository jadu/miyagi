import SlackUserService from '../../src/services/SlackUserService';
import SlackChannelService from '../../src/services/SlackChannelService';
import { mock, instance, when, verify } from 'ts-mockito';
import { Channel, UserResponse, User } from '../../src/interfaces/Slack';
import LoggerMock from '../mocks/Logger';

describe('SlackUserService', () => {
    const client = {
        users: {
            info: jest.fn(),
            getPresence: jest.fn()
        }
    };
    const logger = new LoggerMock();
    let slackUserService: SlackUserService;
    let slackChannelService: SlackChannelService;

    beforeEach(() => {
        slackChannelService = mock(SlackChannelService);
        slackUserService = new SlackUserService(
            client,
            logger as any,
            instance(slackChannelService)
        );
    });

    describe('getHumansFromChannel', () => {
        test('should invoke the channel service', () => {
            const channel: Channel = {
                name: 'test',
                members: [],
                id: '12345'
            };

            when(slackChannelService.getChannel('test')).thenReturn(Promise.resolve(channel));

            slackUserService.getHumansFromChannel('test');

            verify(slackChannelService.getChannel('test')).called();
        });

        test('shold hande the channel service throwing an error when fetching channels', () => {
            expect.assertions(1);

            when(slackChannelService.getChannel('test')).thenReturn(Promise.reject('could not get channel'));

            return slackUserService.getHumansFromChannel('test').catch((error: string) => {
                expect(error).toEqual('could not get channel');
            });
        });

        test('should invoke the client to retreive user info', () => {
            expect.assertions(1);

            const channel: Channel = {
                name: 'test',
                members: [
                    { userId: '1234' },
                    { userId: '5678' },
                    { userId: '9010' }
                ],
                id: '12345'
            };

            const userResponses: UserResponse[] = [
                {
                    user: {
                        id: '1234',
                        is_bot: true,
                        name: 'bot',
                        real_name: 'bot'
                    }
                },
                {
                    user: {
                        id: '5678',
                        is_bot: false,
                        name: 'slackbot',
                        real_name: 'slackbot'
                    }
                },
                {
                    user: {
                        id: '9010',
                        is_bot: false,
                        name: 'mike',
                        real_name: 'mike'
                    }
                }
            ];

            when(slackChannelService.getChannel('test')).thenReturn(Promise.resolve(channel));
            client.users.info
                .mockReturnValue(userResponses[0])
                .mockReturnValueOnce(userResponses[1])
                .mockReturnValueOnce(userResponses[2]);

            return slackUserService.getHumansFromChannel('test').then(() => {
                expect(client.users.info).toHaveBeenCalledTimes(3);
            });
        });

        test('should handle the client throwing an error when fetching user info', () => {
            expect.assertions(1);

            const channel: Channel = {
                name: 'test',
                members: [
                    { userId: '1234' }
                ],
                id: '12345'
            };

            when(slackChannelService.getChannel('test')).thenReturn(Promise.resolve(channel));
            client.users.info.mockReturnValue(Promise.reject('could not get user'));

            return slackUserService.getHumansFromChannel('test').catch((error: string) => {
                expect(error).toEqual('could not get user');
            });
        });

        test('should return humans', () => {
            expect.assertions(1);

            const channel: Channel = {
                name: 'test',
                members: [
                    { userId: '1234' },
                    { userId: '5678' },
                    { userId: '9010' }
                ],
                id: '12345'
            };

            const userResponses: UserResponse[] = [
                {
                    user: {
                        id: '1234',
                        is_bot: true,
                        name: 'bot',
                        real_name: 'bot'
                    }
                },
                {
                    user: {
                        id: '5678',
                        is_bot: false,
                        name: 'slackbot',
                        real_name: 'slackbot'
                    }
                },
                {
                    user: {
                        id: '9010',
                        is_bot: false,
                        name: 'mike',
                        real_name: 'mike'
                    }
                }
            ];

            when(slackChannelService.getChannel('test')).thenReturn(Promise.resolve(channel));
            client.users.info
                .mockReturnValue(userResponses[0])
                .mockReturnValueOnce(userResponses[1])
                .mockReturnValueOnce(userResponses[2]);

            return slackUserService.getHumansFromChannel('test').then((humans: User[]) => {
                expect(humans).toEqual([
                    { id: '9010', is_bot: false, name: 'mike', real_name: 'mike' }
                ]);
            });
        });
    });

    describe('userActive', () => {
        const user: User = {
            name: 'test_name',
            id: 'test_id'
        };

        test('should return true if the user is present', (done) => {
            client.users.getPresence.mockReturnValue(Promise.resolve({ presence: 'test' }));

            slackUserService.userActive(user).then((active) => {
                expect(active).toEqual(true);
                done();
            });
        });

        test('should return false if the user is away', (done) => {
            client.users.getPresence.mockReturnValue(Promise.resolve({ presence: 'away' }));

            slackUserService.userActive(user).then((active) => {
                expect(active).toEqual(false);
                done();
            });
        });

        test('should return false if the user\'s presence can not be found', (done) => {
            client.users.getPresence.mockReturnValue(Promise.resolve(undefined));

            slackUserService.userActive(user).then((active) => {
                expect(active).toEqual(false);
                done();
            });
        });
    });
});
