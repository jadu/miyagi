import { User, Message } from './Slack';

export default interface Thread {
    suggestions: number;
    active: boolean;
    timestamp: string|null;
    activeMessage: Message|null;
    human: User;
    channelId: string|null;
}
