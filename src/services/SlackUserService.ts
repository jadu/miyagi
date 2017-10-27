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

    public async getHumansFromChannel (channelName: string): Promise<User[]> {
        const channel: Channel = await this.slackChannelService.getChannel(channelName);
        const users: Array<Promise<UserResponse>> = [];

        this.logger.debug(`There are ${channel.members.length} users in #general`);

        // Make client request for user info for each user found
        for (const userId of channel.members) {
            users.push(this.client.users.info(userId));
        }

        // Filter humans and return user objects
        return await Promise.all(users).then((response: UserResponse[]) => {
            const humans: User[] = response
                .filter((res: UserResponse) => !res.user.is_bot && res.user.name !== 'slackbot')
                .map((res: UserResponse) => res.user);

            this.logger.info(`Got ${humans.length} human${humans.length === 1 ? '' : 's'} from #${channel.name}`);
            this.logger.debug(humans.map((human: User) => human.real_name).join(', '));
            return humans;
        });
    }

    public async userActive (user: User): Promise<boolean> {
        const response = await this.client.users.getPresence(user.id);

        if (response && response.presence && typeof response.presence === 'string') {
            return response.presence.toLowerCase() !== 'away';
        } else {
            return false;
        }
    }
}
