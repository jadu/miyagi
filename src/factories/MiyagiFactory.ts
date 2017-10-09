import Miyagi from '../services/Miyagi';
import SlackUserService from '../services/SlackUserService';
import { LoggerInstance } from 'winston';
import { WebClient } from '@slack/client';
import SlackChannelService from '../services/SlackChannelService';
import MessageService from '../services/MessageService';
import ListService from '../services/ListService';
import DatabaseService from '../services/DatabaseService';
import HumanManager from '../managers/HumanManager';
import ConversationService from '../services/ConversationService';

export default class MiyagiFactory {
    public static create (
        webClient: WebClient,
        databaseService: DatabaseService,
        logger: LoggerInstance,
        openers: string[],
        closers: string[],
        enders: string[],
        interactionTimeout: number = 10000
    ): Miyagi {
        const listService: ListService = new ListService();
        const messageService: MessageService = new MessageService(
            listService,
            openers,
            closers,
            enders
        );
        const channelService: SlackChannelService = new SlackChannelService(
            webClient,
            logger
        );
        const userService: SlackUserService = new SlackUserService(
            webClient,
            logger,
            channelService
        );
        const humanManager: HumanManager = new HumanManager(
            userService,
            logger,
            listService,
            interactionTimeout
        );
        const conversationService: ConversationService = new ConversationService(
            humanManager,
            logger,
            channelService,
            messageService
        );

        return new Miyagi(
            humanManager,
            channelService,
            messageService,
            databaseService,
            logger,
            conversationService
        );
    }
}
