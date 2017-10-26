import { User, Message } from '../interfaces/Slack';
import Thread from '../interfaces/Thread';
import MessageService from './MessageService';
import DatabaseService from './DatabaseService';
import SlackChannelService from './SlackChannelService';

export default class ThreadService {
    private human: User;

    constructor (
        private messageService: MessageService,
        private databaseService: DatabaseService,
        private slackChannelService: SlackChannelService
    ) {}

    public create (human: User): Thread {
        return {
            human: human,
            suggestions: 0,
            active: false,
            activeMessage: null,
            timestamp: null,
            channelId: null
        };
    }

    public async next (thread: Thread): Promise<Thread> {
        const newThread = {} as Thread;
        const nextMessage = this.messageService.buildQuestion(
            await this.databaseService.getNextExtract(thread.human.id),
            thread.human.id
        );

        newThread.activeMessage = nextMessage;

        // Send a new direct message if the thread is not active
        if (!thread.active) {
            const { ts, channel } = await this.slackChannelService.sendDirectMessage(thread.human, nextMessage);

            newThread.timestamp = ts;
            newThread.channelId = channel;
            newThread.active = true;
        // Update the existing thread if it is active
        } else {
            await this.slackChannelService.updateMessage(
                thread.timestamp,
                thread.channelId,
                nextMessage
            );

            newThread.suggestions = thread.suggestions + 1;
        }

        return Object.assign({}, thread, newThread);
    }

    public async close (thread: Thread): Promise<void> {
        // Say goodbye to the current user
        await this.slackChannelService.updateMessage(
            thread.timestamp,
            thread.channelId,
            this.messageService.endConversation(thread.activeMessage)
        );
    }
}
