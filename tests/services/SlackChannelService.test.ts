import SlackChannelService from '../../src/services/SlackChannelService';
import { SentimentExtract } from '../../src/interfaces/SentimentExtract';
import { mock, instance, when, verify } from 'ts-mockito';
import MessageService from '../../src/services/MessageService';
import { Channel, User, ImOpenResponse, Message } from '../../src/interfaces/Slack';
import LoggerMock from '../mocks/Logger';

describe('SlackChannelService', () => {
    let client;
    let slackChannelService: SlackChannelService;
    let logger: LoggerMock;
    let messageService: MessageService;

    beforeEach(() => {
        client = {
            channels: { list: jest.fn() }, im: { open: jest.fn() }, chat: { postMessage: jest.fn() }
        };
        messageService = mock(MessageService);
        logger = new LoggerMock();
        slackChannelService = new SlackChannelService(
            client,
            logger as any
        );
    });

    describe('getChannel', () => {
        beforeEach(() => {
            client.channels.list.mockReturnValue(
                Promise.resolve({
                    channels: [
                        { name: 'foo' },
                        { name: 'bar' }
                    ]
                })
            );
        });

        test('should get the requested channel from the client', () => {
            expect.assertions(1);

            return slackChannelService.getChannel('foo').then((channel: Channel) => {
                expect(channel).toEqual({ name: 'foo' });
            });
        });

        test('should throw if the client fails to get channels', () => {
            expect.assertions(1);

            client.channels.list.mockReturnValue(Promise.reject('channel list error'));

            return slackChannelService.getChannel('non-existent').catch((error: string) => {
                expect(error).toEqual('channel list error');
            });
        });

        test('should throw if we cannot get the channel', () => {
            expect.assertions(1);

            client.channels.list.mockReturnValue(Promise.resolve({ channels: ['general'] }));

            return slackChannelService.getChannel('non-existent').catch((error: string) => {
                expect(error).toBeTruthy();
            });
        });
    });

    describe('sendDirectMessage', () => {
        let user: User;
        let extract: SentimentExtract;
        let channel: Channel;
        let message: Message;
        let imOpenResponse: ImOpenResponse;

        beforeEach(() => {
            user = {
                id: '1234',
                name: 'mike',
                real_name: 'mike',
                is_bot: false
            };
            extract = {
                text: 'test extract',
                suggestions: []
            };
            channel = {
                members: [],
                name: 'test channel',
                id: '5678'
            };
            imOpenResponse = { channel };
            message = {
                text: 'foo',
                attachments: [
                    {
                        text: 'test extract',
                        callback_id: '1234',
                        color: 'red',
                        actions: [
                            {
                                name: 'test action',
                                text: 'test text',
                                type: 'button',
                                value: 'test value'
                            }
                        ]
                    }
                ]
            };

            client.im.open.mockReturnValue(Promise.resolve(imOpenResponse));
        });

        test('should invoke the client and open a direct message channel', () => {
            expect.assertions(2);

            return slackChannelService.sendDirectMessage(user, message).then(() => {
                expect(client.im.open).toHaveBeenCalledTimes(1);
                expect(client.im.open).toHaveBeenCalledWith('1234');
            });
        });

        test('should handle the client throwing when openning a directo message channel', () => {
            expect.assertions(1);

            client.im.open.mockReturnValue(Promise.reject('could not open direct message channel'));

            return slackChannelService.sendDirectMessage(user, message).catch((error: string) => {
                expect(error).toEqual('could not open direct message channel');
            });
        });

        test('should invoke the client and send a message to the channel', () => {
            expect.assertions(2);

            return slackChannelService.sendDirectMessage(user, message).then(() => {
                expect(client.chat.postMessage).toHaveBeenCalledTimes(1);
                expect(client.chat.postMessage).toHaveBeenCalledWith(
                    channel.id, message.text, { attachments: message.attachments }
                );
            });
        });

        test('should hand the client throwing when sending a direct message', () => {
            expect.assertions(1);

            client.chat.postMessage.mockReturnValue(Promise.reject('could not send direct message'));

            return slackChannelService.sendDirectMessage(user, extract).catch((error: string) => {
                expect(error).toEqual('could not send direct message');
            });
        });
    });
});
