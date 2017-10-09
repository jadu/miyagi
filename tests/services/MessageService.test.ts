import MessageService from '../../src/services/MessageService';
import ListService from '../../src/services/ListService';
import { mock, instance, when, verify, deepEqual } from 'ts-mockito/lib/ts-mockito';
import { Message } from '../../src/interfaces/Slack';
import { SentimentExtract } from '../../src/interfaces/SentimentExtract';

describe('MessageService', () => {
    let messageService: MessageService;
    let listService: ListService;
    const openers: string[] = ['test opener'];
    const closers: string[] = ['test closer'];
    const enders: string[] = ['test ender'];
    const sentimentExtract: SentimentExtract = { _id: 'extract_id', text: 'test extract', suggestions: [] };

    beforeEach(() => {
        listService = mock(ListService);

        when(listService.getRandomItem(deepEqual(['test opener']))).thenReturn('test opener');
        when(listService.getRandomItem(deepEqual(['test closer']))).thenReturn('test closer');
        when(listService.getRandomItem(deepEqual(['test ender']))).thenReturn('test ender');

        messageService = new MessageService(
            instance(listService),
            openers,
            closers,
            enders
        );
    });

    describe('buildQuestion', () => {
        test('should build a message object using default config', () => {
            const message: Message = messageService.buildQuestion(sentimentExtract, 'user_id');

            expect(message).toEqual({
                replace_original: false,
                text: 'test opener',
                attachments: [
                    {
                        text: '"test extract"',
                        callback_id: 'question:extract_id:user_id',
                        color: '#3AA3E3',
                        actions: [
                            {
                                name: 'sentiment',
                                text: ':smile: Positive',
                                type: 'button',
                                value: 'positive'
                            },
                            {
                                name: 'sentiment',
                                text: ':neutral_face: Neutral',
                                type: 'button',
                                value: 'neutral'
                            },
                            {
                                name: 'sentiment',
                                text: ':angry: Negative',
                                type: 'button',
                                value: 'negative'
                            },
                            {
                                name: 'sentiment',
                                text: ':unicorn_face: Not Sure',
                                type: 'button',
                                value: 'not_sure'
                            },
                            {
                                name: 'sentiment',
                                text: ':no_entry_sign: I\'ve had enough',
                                type: 'button'
                            }
                        ]
                    }
                ]
            });
        });

        test('should build a message object using custom config', () => {
            const message: Message = messageService.buildQuestion(
                sentimentExtract,
                'user_id',
                {
                    color: '#bada55',
                    text: 'custom text',
                    replace: true
                }
            );

            expect(message).toEqual({
                replace_original: true,
                text: 'custom text',
                attachments: [
                    {
                        text: '"test extract"',
                        callback_id: 'question:extract_id:user_id',
                        color: '#bada55',
                        actions: [
                            {
                                name: 'sentiment',
                                text: ':smile: Positive',
                                type: 'button',
                                value: 'positive'
                            },
                            {
                                name: 'sentiment',
                                text: ':neutral_face: Neutral',
                                type: 'button',
                                value: 'neutral'
                            },
                            {
                                name: 'sentiment',
                                text: ':angry: Negative',
                                type: 'button',
                                value: 'negative'
                            },
                            {
                                name: 'sentiment',
                                text: ':unicorn_face: Not Sure',
                                type: 'button',
                                value: 'not_sure'
                            },
                            {
                                name: 'sentiment',
                                text: ':no_entry_sign: I\'ve had enough',
                                type: 'button'
                            }
                        ]
                    }
                ]
            });
        });
    });

    describe('endConversation', () => {
        test('should merge with the current question and return the conversation ender', () => {
            const message: Message = {
                replace_original: false,
                text: 'test opener',
                attachments: [
                    {
                        text: '"test extract"',
                        callback_id: 'question:extract_id:user_id',
                        color: '#3AA3E3',
                        actions: [
                            {
                                name: 'sentiment',
                                text: ':smile: Positive',
                                type: 'button',
                                value: 'positive'
                            },
                            {
                                name: 'sentiment',
                                text: ':neutral_face: Neutral',
                                type: 'button',
                                value: 'neutral'
                            },
                            {
                                name: 'sentiment',
                                text: ':angry: Negative',
                                type: 'button',
                                value: 'negative'
                            },
                            {
                                name: 'sentiment',
                                text: ':unicorn_face: Not Sure',
                                type: 'button',
                                value: 'not_sure'
                            },
                            {
                                name: 'sentiment',
                                text: ':no_entry_sign: I\'ve had enough',
                                type: 'button'
                            }
                        ]
                    }
                ]
            };

            expect(messageService.endConversation(message)).toEqual({
                replace_original: true,
                text: 'test opener',
                attachments: [
                    {
                        text: 'test ender',
                        color: '#3AA3E3'
                    }
                ]
            });
        });
    });
});
