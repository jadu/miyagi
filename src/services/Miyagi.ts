import { RtmClient, WebClient } from '@slack/client';
import { Logger, LoggerInstance } from 'winston';
import { SentimentExtract } from '../interfaces/SentimentExtract';
import SlackChannelService from '../services/SlackChannelService';
import MessageService from '../services/MessageService';
import SlackUserService from '../services/SlackUserService';
import DatabaseService from '../services/DatabaseService';
import { User, Message, Channel, InteractiveComponentPayload, MessageResponse } from '../interfaces/Slack';
import HumanManager from '../managers/HumanManager';
import ConversationService from '../services/ConversationService';

export default class Miyagi {
    private debug: boolean;
    private rtmClient: WebClient;
    private webClient: RtmClient;
    private token: string;

    constructor (
        private humanManager: HumanManager,
        private slackChannelService: SlackChannelService,
        private messageService: MessageService,
        private databaseService: DatabaseService,
        private logger: LoggerInstance,
        private conversationService: ConversationService
    ) {
        this.debug = false;
    }

    public setDebug (debug: boolean): void {
        this.debug = debug;
    }

    public async refresh (channel: string = 'general'): Promise<void> {
        this.logger.debug(`Refreshing Miyagi${this.debug ? ' in debug mode' : ''}`);
        this.humanManager.resetSessionSuggestions();

        try {
            await this.humanManager.fetch(channel, this.debug);
        } catch (error) {
            this.logger.error('Unable to fetch humans');
        }
    }

    public async sendQuestion (
        channelId?: string,
        messageTimestamp?: string,
        user?: User
    ): Promise<any>  {
        // Get a human from args (payload) or fetch a fresh one from the manager
        const human: User = user ? user : await this.humanManager.getNextHuman();

        if (!human) {
            // If we have ran out of humans, log the session statistics and end the process
            this.logger.info(`Got ${this.humanManager.getSessionSuggestions().length} ` +
                `suggestions from ${this.humanManager.getNumberOfCachedHumans()} humans in this session`);
            process.exit(0);
            return;
        }

        // Build next question
        const question: Message = this.messageService.buildQuestion(
            await this.databaseService.getNextExtract(human.id),
            human.id,
            { replace: !!user }
        );

        // Store the next message we will send
        let nextMessage: MessageResponse;

        try {
            if (user) {
                // If we have a payload update the previous message with a new question
                nextMessage = await this.slackChannelService.updateMessage(
                    messageTimestamp,
                    channelId,
                    question
                );
                this.logger.info(`Sent another question to "${human.name}"`);
            } else {
                // Send a new message to new user
                nextMessage = await this.slackChannelService.sendDirectMessage(human, question);
                this.logger.info(`Sent a new question to "${human.name}"`);
            }
        } catch (error) {
            this.logger.error(error);
        }

        // Start interaction timer, first argument will be invoked once the timer is complete
        this.humanManager.startInteractionTimeout(async () => {
            // Say Goodbye
            await this.conversationService.goodbye(
                human.name,
                nextMessage.channel,
                nextMessage.message
            );

            // Recursively invoke this method for the next user
            return this.sendQuestion();
        });
    }

    public trackSessionSuggestion (user: User, value: string): void {
        this.humanManager.addSessionSuggestion(user.id, user.name, value);
    }

    public async sayGoodbye (message: Message, channel: Channel, user: User): Promise<void> {
        this.conversationService.goodbye(user.name, channel.id, message);
    }
}
