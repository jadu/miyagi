import { WebClient } from '@slack/client';
import { LoggerInstance } from 'winston';
import SlackChannelService from './SlackChannelService';
import { UserResponse, User, Channel } from '../interfaces/Slack';

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

            const users: Array<Promise<UserResponse>> = [];

            this.logger.log('info', `There are ${channel.members.length} users in #general`);

            // Make client request for user info for each user found
            for (const userId of channel.members) {
                users.push(this.client.users.info(userId));
            }

            // Filter humans and return user objects
            Promise.all(users).then((response: UserResponse[]) => {
                const humans: User[] = response
                    .filter((res: UserResponse) => !res.user.is_bot && res.user.name !== 'slackbot')
                    .map((res: UserResponse) => res.user);

                this.logger.log(
                    'info', `Got ${humans.length} human${humans.length === 1 ? '' : 's'} from #${channel.name}`
                );
                this.logger.debug(humans.map((human: User) => human.real_name).join(', '));
                resolve(humans);
            }).catch((error: string) => {
                return reject(error);
            });
        });
    }
}
