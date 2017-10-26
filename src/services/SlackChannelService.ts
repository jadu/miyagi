import { WebClient } from '@slack/client';
import { LoggerInstance } from 'winston';
import { ImOpenResponse, Channel, User, Message, MessageResponse } from '../interfaces/Slack';

export default class SlackChannelService {
    constructor (
        private client: WebClient,
        private logger: LoggerInstance
    ) {}

    public async getChannel (channelName: string): Promise<Channel|undefined> {
        // Get all channels
        const channels: Channel[] = (await this.client.channels.list()).channels;

        this.logger.debug(`Got ${channels.length} channels`);

        if (channels) {
            // Get channel by name
            const channel: Channel = channels.find((c: Channel) => c.name === channelName);

            this.logger.debug(`Found the #${channelName} channel`);
            return channel;
        }
    }

    public async sendDirectMessage (user: User, message: Message): Promise<MessageResponse> {
        const { channel }: ImOpenResponse = await this.client.im.open(user.id);

        return await this.client.chat.postMessage(
            channel.id, message.text, { attachments: message.attachments }
        );
    }

    public async updateMessage (
        messageTimestamp: string,
        channeId: string,
        newMessage: Message
    ): Promise<MessageResponse> {
        return await this.client.chat.update(
            messageTimestamp,
            channeId,
            newMessage.text,
            { attachments: newMessage.attachments }
        );
    }
}
