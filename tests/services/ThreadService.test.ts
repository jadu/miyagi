import ThreadService from '../../src/services/ThreadService';
import MessageService from '../../src/services/MessageService';
import DatabaseService from '../../src/services/DatabaseService';
import SlackChannelService from '../../src/services/SlackChannelService';
import { mock, instance, when, deepEqual, verify } from 'ts-mockito';
import { User, Message } from '../../src/interfaces/Slack';
import { SentimentExtract } from '../../src/interfaces/SentimentExtract';
import Thread from '../../src/interfaces/Thread';

describe('ThreadService', () => {
    let threadService: ThreadService;
    let messageService: MessageService;
    let databaseService: DatabaseService;
    let slackChannelService: SlackChannelService;
    let human: User;

    beforeEach(() => {
        messageService = mock(MessageService);
        databaseService = mock(DatabaseService);
        slackChannelService = mock(SlackChannelService);
        threadService = new ThreadService(
            instance(messageService),
            instance(databaseService),
            instance(slackChannelService)
        );
        human = {
            name: 'test_name',
            id: 'test_id'
        };
    });

    describe('create', () => {
        test('should create a thread object', () => {
            expect(threadService.create(human)).toEqual({
                human: human,
                suggestions: 0,
                active: false,
                activeMessage: null,
                timestamp: null,
                channelId: null
            });
        });
    });

    describe('next', () => {
        const extract: SentimentExtract = {
            text: 'test_extract',
            suggestions: []
        };
        const nextMessage: Message = {
            text: 'test_text'
        };

        beforeEach(() => {
            // get next extract stub
            when(databaseService.getNextExtract('test_id')).thenReturn(Promise.resolve(extract));
            // build question stub
            when(messageService.buildQuestion(deepEqual(extract), 'test_id')).thenReturn(nextMessage);
            // direct message stub
            when(slackChannelService.sendDirectMessage(deepEqual(human), nextMessage)).thenReturn(Promise.resolve({
                ts: 'test_timestamp',
                channel: 'test_channel_id'
            }));
        });

        test('should send a new direct message if the thread is not active', (done) => {
            const thread: Thread = {
                human: human,
                suggestions: 0,
                active: false,
                activeMessage: null,
                timestamp: null,
                channelId: null
            };

            threadService.next(thread).then((newThread: Thread) => {
                verify(messageService.buildQuestion(deepEqual(extract), 'test_id')).called();
                verify(slackChannelService.sendDirectMessage(deepEqual(thread.human), deepEqual(nextMessage))).called();
                expect(newThread).toEqual({
                    human: human,
                    suggestions: 0,
                    active: true,
                    activeMessage: nextMessage,
                    channelId: 'test_channel_id',
                    timestamp: 'test_timestamp'
                });
                done();
            });
        });

        test('should update an existing message if the thread is active', (done) => {
            const thread: Thread = {
                human: human,
                suggestions: 0,
                active: true,
                activeMessage: null,
                timestamp: 'test_timestamp',
                channelId: 'test_channel_id'
            };

            threadService.next(thread).then((newThread: Thread) => {
                verify(messageService.buildQuestion(deepEqual(extract), 'test_id')).called();
                verify(slackChannelService.updateMessage(
                    'test_timestamp',
                    'test_channel_id',
                    deepEqual(nextMessage))
                ).called();
                expect(newThread).toEqual({
                    human: human,
                    suggestions: 1,
                    active: true,
                    activeMessage: nextMessage,
                    channelId: 'test_channel_id',
                    timestamp: 'test_timestamp'
                });
                done();
            });
        });
    });

    describe('close', () => {
        const nextMessage: Message = {
            text: 'test_text'
        };

        beforeEach(() => {
            // end convo stub
            when(messageService.endConversation(deepEqual(nextMessage))).thenReturn({ text: 'test_goodbye' });
        });

        test('should close a thread and say goodbye :wave:', (done) => {
            const thread: Thread = {
                human: human,
                suggestions: 0,
                active: true,
                activeMessage: nextMessage,
                timestamp: 'test_timestamp',
                channelId: 'test_channel_id'
            };

            threadService.close(thread).then(() => {
                verify(messageService.endConversation(deepEqual(nextMessage))).called();
                verify(slackChannelService.updateMessage(
                    'test_timestamp',
                    'test_channel_id',
                    deepEqual({ text: 'test_goodbye' })
                )).called();
                done();
            });
        });
    });
});
