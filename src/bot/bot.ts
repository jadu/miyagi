import { RtmClient, WebClient } from '@slack/client';
import { Logger, LoggerInstance } from 'winston';
import { SentimentExtract } from '../interfaces/SentimentExtract';
import SlackChannelService from '../services/SlackChannelService';
import MessageService from '../services/MessageService';
import SlackUserService from '../services/SlackUserService';
import DatabaseService from '../services/DatabaseService';
import { User, Message, Channel } from '../interfaces/Slack';

export default class Miyagi {
    private rtmClient: WebClient;
    private webClient: RtmClient;
    private token: string;

    constructor (
        private slackUserService: SlackUserService,
        private slackChannelService: SlackChannelService,
        private messageService: MessageService,
        private databaseService: DatabaseService,
        private logger: LoggerInstance
    ) {}

    public async sendQuestionsToAllUsers (debug: boolean = false): Promise<any>  {
        let humans: User[];
        let extracts: SentimentExtract[];

        // Get list of humans
        try {
            humans = await this.slackUserService.getHumansFromChannel('general');
        } catch (error) {
            this.logger.error(error);
        }

        // Get extracts
        try {
            extracts = await this.databaseService.getRandomExtracts(humans.length);
        } catch (error) {
            this.logger.error(error);
        }

        const successfulDirectMessages: User[] = [];
        const unsuccessfulDirectMessages: User[] = [];

        // Send extracts to humans
        for (const human of humans) {
            if (debug) {
                const username: string = human.profile.display_name_normalized.toLowerCase();

                if (username !== 'mike' && username !== 'mike (jadu)') {
                    continue;
                }
            }

            try {
                await this.slackChannelService.sendDirectMessage(
                    human,
                    this.messageService.buildQuestion(extracts[humans.indexOf(human)], human.id)
                );
                successfulDirectMessages.push(human);
            } catch (error) {
                this.logger.error(`Unable to send direct message to "${human.real_name}"`);
                unsuccessfulDirectMessages.push(human);
            }
        }

        this.logger.info(`Sent ${successfulDirectMessages.length}/${humans.length} messages successfully`);
    }

    public async sendQuestionToUser (user: User): Promise<any> {
        let extract: SentimentExtract;

        // Get extract
        try {
            [ extract ] = await this.databaseService.getRandomExtracts(1);
        } catch (error) {
            this.logger.error(error);
        }

        try {
            await this.slackChannelService.sendDirectMessage(user, this.messageService.buildQuestion(extract, user.id));
            this.logger.info(`Sent message to ${user.name} successfully`);
        } catch (error) {
            this.logger.debug(`Unable to send direct message to "${user.name}"`);
        }
    }

    public updateQuestion (message: Message, user: User): Message {
        return this.messageService.updateQuestion(message, user.id);
    }

    public async sendResponse (message: Message, channel: Channel, user: User, value: string, ): Promise<any> {
        let extract: SentimentExtract;

        // Get extract
        try {
            [ extract ] = await this.databaseService.getRandomExtracts(1);
        } catch (error) {
            this.logger.error(error);
        }

        this.logger.debug(`Sending response to "${user.name}"`);

        // Update with next question
        await this.slackChannelService.updateMessage(
            message.ts,
            channel.id,
            this.messageService.buildQuestion(extract, user.id)
        );
    }

    public async goodbye (message: Message, channel: Channel): Promise<void> {
        this.slackChannelService.updateMessage(
            message.ts,
            channel.id,
            this.messageService.endConversation(message)
        );
    }
}
