import Miyagi from '../services/Miyagi';
import SlackUserService from '../services/SlackUserService';
import { LoggerInstance } from 'winston';
import { WebClient } from '@slack/client';
import SlackChannelService from '../services/SlackChannelService';
import MessageService from '../services/MessageService';
import ListService from '../services/ListService';
import DatabaseService from '../services/DatabaseService';
import HumanManager from '../managers/HumanManager';
import ThreadService from '../services/ThreadService';
import IdleService from '../services/IdleService';

export default class MiyagiFactory {
    public create (
        webClient: WebClient,
        databaseService: DatabaseService,
        logger: LoggerInstance,
        openers: string[],
        closers: string[],
        enders: string[],
        idleTimeout: number
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
            listService
        );
        const threadService: ThreadService = new ThreadService(
            messageService,
            databaseService,
            channelService
        );
        const idleService: IdleService = new IdleService(
            idleTimeout,
            logger
        );

        return new Miyagi(
            humanManager,
            databaseService,
            logger,
            threadService,
            idleService
        );
    }
}
