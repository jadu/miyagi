import { WebClient } from '@slack/client';
import { LoggerInstance } from 'winston';
import { Channel } from '../interfaces/Channel';
import { User } from '../interfaces/User';
import { SentimentExtract } from '../interfaces/SentimentExtract';
import { ImOpenResponse, Question } from '../interfaces/Slack';
import QuestionProvider from '../providers/QuestionProvider';

export default class SlackChannelService {
    constructor (
        private client: WebClient,
        private logger: LoggerInstance,
        private questionProvider: QuestionProvider
    ) {}

    public getChannel (channelName: string): Promise<Channel> {
        return new Promise(async (
            resolve: (value: Channel) => void,
            reject: (value: string) => void
        ) => {
            let channels: Channel[];

            // Get all channels
            try {
                channels = (await this.client.channels.list()).channels;
            } catch (error) {
                return reject(error);
            }

            this.logger.log('debug', `Got ${channels.length} channels`);

            // Get channel by name
            const channel: Channel|undefined = channels.find((c: Channel) => c.name === channelName);

            if (channel !== undefined) {
                this.logger.log('debug', `Found the #${channelName} channel`);
                return resolve(channel);
            } else {
                return reject(`Could not get the #${channelName} channel`);
            }
        });
    }

    public sendDirectMessage (user: User, sentimentExtract: SentimentExtract): Promise<any> {
        return new Promise(async (
            resolve: (value: any) => void,
            reject: (value: string) => void
        ) => {
            try {
                const { channel }: ImOpenResponse = await this.client.im.open(user.id);
                const { text, attachments }: Question = this.questionProvider.build(sentimentExtract, user.id);
                const directMessage = await this.client.chat.postMessage(channel.id, text, { attachments });

                return resolve(directMessage);
            } catch (error) {
                return reject(error);
            }
        });
    }
}
