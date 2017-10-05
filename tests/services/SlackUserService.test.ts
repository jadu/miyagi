import SlackUserService from '../../src/services/SlackUserService';
import SlackChannelService from '../../src/services/SlackChannelService';
import { mock, instance, when, verify } from 'ts-mockito';
import { Channel } from '../../src/interfaces/Channel';
import { Logger } from 'winston';
import { UserResponse, User } from '../../src/interfaces/User';

describe('SlackUserService', () => {
    const client = { users: { info: jest.fn() } };
    const logger = new Logger();
    let slackUserService: SlackUserService;
    let slackChannelService: SlackChannelService;

    beforeEach(() => {
        slackChannelService = mock(SlackChannelService);
        slackUserService = new SlackUserService(client, logger, instance(slackChannelService));
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
});
