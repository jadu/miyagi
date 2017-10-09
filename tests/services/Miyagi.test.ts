import Miyagi from '../../src/services/Miyagi';
import HumanManager from '../../src/managers/HumanManager';
import SlackChannelService from '../../src/services/SlackChannelService';
import { LoggerInstance, Logger } from 'winston';
import MessageService from '../../src/services/MessageService';
import DatabaseService from '../../src/services/DatabaseService';
import ConversationService from '../../src/services/ConversationService';
import { mock, instance, verify } from 'ts-mockito/lib/ts-mockito';

describe('Miyagi', () => {
    let miyagi: Miyagi;
    let humanManager: HumanManager;
    let slackChannelService: SlackChannelService;
    let logger: LoggerInstance;
    let messgeService: MessageService;
    let databaseService: DatabaseService;
    let conversationService: ConversationService;

    beforeEach(() => {
        humanManager = mock(HumanManager);
        slackChannelService = mock(SlackChannelService);
        logger = new Logger();
        messgeService = mock(MessageService);
        databaseService = mock(DatabaseService);
        conversationService = mock(ConversationService);
        miyagi = new Miyagi(
            instance(humanManager),
            instance(slackChannelService),
            instance(messgeService),
            instance(databaseService),
            logger,
            instance(conversationService)
        );
    });

    describe('refresh', () => {
        test('should reset session suggestions', () => {
            return miyagi.refresh('test').then(() => {
                verify(humanManager.resetSessionSuggestions()).called();
            });
        });

        test('should fetch humans from channel', () => {
            return miyagi.refresh('test').then(() => {
                verify(humanManager.fetch('test', false)).called();
            });
        });

        test('should handle an error from fetching humans');
    });
});
