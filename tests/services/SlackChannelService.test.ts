import SlackChannelService from '../../src/services/SlackChannelService';
import { SentimentExtract } from '../../src/interfaces/SentimentExtract';
import { mock, instance, when, verify } from 'ts-mockito';
import MessageService from '../../src/services/MessageService';
import { Channel, User, ImOpenResponse, Message, MessageResponse } from '../../src/interfaces/Slack';
import LoggerMock from '../mocks/Logger';

describe('SlackChannelService', () => {
    let client;
    let slackChannelService: SlackChannelService;
    let logger: LoggerMock;
    let messageService: MessageService;

    beforeEach(() => {
        client = {
            channels: {
                list: jest.fn()
            },
            im: {
                open: jest.fn()
            },
            chat: {
                postMessage: jest.fn(),
                update: jest.fn()
            }
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

        test('should get the requested channel from the client', (done) => {
            slackChannelService.getChannel('foo').then((channel: Channel) => {
                expect(channel).toEqual({ name: 'foo' });
                done();
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
            client.chat.postMessage.mockReturnValue(Promise.resolve(message));
        });

        test('should invoke the client and open a direct message channel', (done) => {
            slackChannelService.sendDirectMessage(user, message).then(() => {
                expect(client.im.open).toHaveBeenCalledTimes(1);
                expect(client.im.open).toHaveBeenCalledWith('1234');
                done();
            });
        });

        test('should invoke the client and send a message to the channel', (done) => {
            slackChannelService.sendDirectMessage(user, message).then((messageResponse: MessageResponse) => {
                expect(client.chat.postMessage).toHaveBeenCalledTimes(1);
                expect(client.chat.postMessage).toHaveBeenCalledWith(
                    channel.id, message.text, { attachments: message.attachments }
                );
                expect(messageResponse).toEqual(message);
                done();
            });
        });
    });

    describe('updateMessage', () => {
        const message = {
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

        beforeEach(() => {
            client.chat.update.mockReturnValue(Promise.resolve(message));
        });

        test('should invoke the client update method', (done) => {
            slackChannelService.updateMessage('test_timestamp', 'test_channel_id', message)
                .then((messageResponse: MessageResponse) => {
                    expect(client.chat.update).toBeCalled();
                    expect(client.chat.update).toBeCalledWith(
                        'test_timestamp',
                        'test_channel_id',
                        message.text,
                        { attachments: message.attachments }
                    );
                    expect(messageResponse).toEqual(message);
                    done();
                });
        });
    });
});
