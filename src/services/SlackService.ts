import { WebClient } from '@slack/client';
import { LoggerInstance } from 'winston';
import { Channel } from '../types';

export default class SlackService {
    constructor (
        private client: WebClient,
        private logger: LoggerInstance
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
                reject(error);
            }

            this.logger.debug(`Got ${channels.length} channels`);

            // Get channel by name
            const channel: Channel|undefined = channels.find((c: Channel) => c.name === channelName);

            if (channel !== undefined) {
                this.logger.debug(`Found the #${channelName} channel`);
                resolve(channel);
            } else {
                reject(`Could not get the #${channelName} channel`);
            }
        });
    }
}
