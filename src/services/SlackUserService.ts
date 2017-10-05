import { WebClient } from '@slack/client';
import { Channel } from '../interfaces/Channel';
import { User, UserResponse } from '../interfaces/User';
import { LoggerInstance } from 'winston';
import SlackChannelService from './SlackChannelService';

export default class SlackUserService {
    constructor (
        private client: WebClient,
        private logger: LoggerInstance,
        private slackChannelService: SlackChannelService
    ) {}

    public getHumansFromChannel (channelName: string): Promise<User[]> {
        return new Promise(async (
            resolve: (value: User[]) => void,
            reject: (value: string) => void
        ) => {
            let channel: Channel;

            // Get channel
            try {
                channel = await this.slackChannelService.getChannel(channelName);
            } catch (error) {
                return reject(error);
            }

            const members: Array<Promise<UserResponse>> = [];

            this.logger.log('info', `There are ${channel.members.length} members in #general`);

            // Make client request for user info for each user found
            for (const userId of channel.members) {
                members.push(this.client.users.info(userId));
            }

            // Filter humans and return user objects
            Promise.all(members).then((response: UserResponse[]) => {
                resolve(
                    response
                        .filter((res: UserResponse) => !res.user.is_bot && res.user.name !== 'slackbot')
                        .map((res: UserResponse) => res.user)
                );
            }).catch((error: string) => {
                return reject(error);
            });
        });
    }
}
