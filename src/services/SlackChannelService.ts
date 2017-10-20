import { WebClient } from '@slack/client';
import { LoggerInstance } from 'winston';
import { ImOpenResponse, Channel, User, Message, MessageResponse } from '../interfaces/Slack';

export default class SlackChannelService {
    constructor (
        private client: WebClient,
        private logger: LoggerInstance
    ) {}

    public async getChannel (channelName: string): Promise<Channel> {
        let channels: Channel[];

        // Get all channels
        try {
            channels = (await this.client.channels.list()).channels;
            this.logger.log('debug', `Got ${channels.length} channels`);
        } catch (error) {
            this.logger.error(`Could not get channels from Slack`);
        }

        if (channels) {
            // Get channel by name
            const channel: Channel = channels.find((c: Channel) => c.name === channelName);

            if (channel !== undefined) {
                this.logger.log('info', `Found the #${channelName} channel`);
                return channel;
            } else {
                this.logger.error(`Could not get the #${channelName} channel`);
            }
        }
    }

    public sendDirectMessage (user: User, message: Message): Promise<any> {
        return new Promise(async (
            resolve: (value: any) => void,
            reject: (value: string) => void
        ) => {
            try {
                const { channel }: ImOpenResponse = await this.client.im.open(user.id);
                const directMessage = await this.client.chat.postMessage(
                    channel.id, message.text, { attachments: message.attachments }
                );

                return resolve(directMessage);
            } catch (error) {
                return reject(error);
            }
        });
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

