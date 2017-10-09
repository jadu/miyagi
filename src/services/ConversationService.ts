import { LoggerInstance } from 'winston';
import HumanManager from '../managers/HumanManager';
import SlackChannelService from '../services/SlackChannelService';
import { MessageResponse, Message } from '../interfaces/Slack';
import MessageService from '../services/MessageService';

export default class ConversationService {
    constructor (
        private humanManager: HumanManager,
        private logger: LoggerInstance,
        private slackChannelService: SlackChannelService,
        private messageService: MessageService
    ) {}

    public async goodbye (
        userName: string,
        channelId: string,
        message: Message
    ): Promise<MessageResponse> {
        // Clear the current interaction timer
        this.humanManager.clearInteractionTimeout();

        try {
            // Say goodbye to current user
            return await this.slackChannelService.updateMessage(
                message.ts,
                channelId,
                this.messageService.endConversation(message)
            );
        } catch (error) {
            this.logger.error(`Unable to say goodby to "${userName}"`);
        } finally {
            this.logger.info(`Said goodby to "${userName}"`);
        }
    }
}
