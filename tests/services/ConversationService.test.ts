import HumanManager from '../../src/managers/HumanManager';
import { LoggerInstance } from 'winston';
import SlackChannelService from '../../src/services/SlackChannelService';
import MessageService from '../../src/services/MessageService';
import ConversationService from '../../src/services/ConversationService';
import { mock, instance, verify, when, deepEqual } from 'ts-mockito/lib/ts-mockito';
import { Message } from '../../src/interfaces/Slack';
import LoggerMock from '../mocks/Logger';

describe('ConversationService', () => {
    let conversationService: ConversationService;
    let humanManager: HumanManager;
    let slackChannelService: SlackChannelService;
    let messgeService: MessageService;
    let logger: LoggerMock;

    beforeEach(() => {
        humanManager = mock(HumanManager);
        slackChannelService = mock(SlackChannelService);
        messgeService = mock(MessageService);
        logger = new LoggerMock();
        conversationService = new ConversationService(
            instance(humanManager),
            logger as any,
            instance(slackChannelService),
            instance(messgeService)
        );
    });

    describe('goodbye', () => {
        test('should clear the interaction timeout', () => {
            const message: Message = { text: 'test', ts: 'timestamp' };

            conversationService.goodbye('test_user', 'channel_id', message);

            verify(humanManager.clearInteractionTimeout()).called();
        });

        test('should send the goodbye message', () => {
            const message: Message = { text: 'test', ts: 'timestamp' };

            when(messgeService.endConversation(deepEqual(message))).thenReturn(message);
            conversationService.goodbye('test_user', 'channel_id', message);

            verify(slackChannelService.updateMessage('timestamp', 'channel_id', deepEqual(message))).called();
        });

        test('should handle errors when saying goodbye', () => {
            expect.assertions(2);

            const message: Message = { text: 'test', ts: 'timestamp' };

            when(messgeService.endConversation(deepEqual(message))).thenReturn(message);
            when(slackChannelService.updateMessage('timestamp', 'channel_id', deepEqual(message)))
                .thenReturn(Promise.reject('Error updating message'));

            return conversationService.goodbye('test_user', 'channel_id', message).then(() => {
                expect(logger.error).toHaveBeenCalledTimes(1);
                expect(logger.info).toHaveBeenCalledTimes(1);
            });
        });
    });
});
