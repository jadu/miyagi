import HumanManager from '../../src/managers/HumanManager';
import { LoggerInstance, Logger } from 'winston';
import SlackChannelService from '../../src/services/SlackChannelService';
import MessageService from '../../src/services/MessageService';
import ConversationService from '../../src/services/ConversationService';
import { mock, instance, verify, when, deepEqual } from 'ts-mockito/lib/ts-mockito';
import { Message } from '../../src/interfaces/Slack';

describe('ConversationService', () => {
    let conversationService: ConversationService;
    let humanManager: HumanManager;
    let logger: LoggerInstance;
    let slackChannelService: SlackChannelService;
    let messgeService: MessageService;

    beforeEach(() => {
        humanManager = mock(HumanManager);
        logger = new Logger();
        slackChannelService = mock(SlackChannelService);
        messgeService = mock(MessageService);
        conversationService = new ConversationService(
            instance(humanManager),
            logger,
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
    });
});
