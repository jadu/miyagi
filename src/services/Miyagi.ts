import { RtmClient, WebClient } from '@slack/client';
import { Logger, LoggerInstance } from 'winston';
import { SentimentExtract } from '../interfaces/SentimentExtract';
import SlackUserService from '../services/SlackUserService';
import DatabaseService from '../services/DatabaseService';
import { User, Message, Channel, InteractiveComponentPayload, MessageResponse } from '../interfaces/Slack';
import HumanManager from '../managers/HumanManager';
import Thread from '../interfaces/Thread';
import ThreadService from './ThreadService';
import IdleService from './IdleService';

export default class Miyagi {
    private debug: boolean;
    private rtmClient: WebClient;
    private webClient: RtmClient;
    private token: string;
    private thread: Thread;

    constructor (
        private humanManager: HumanManager,
        private databaseService: DatabaseService,
        private logger: LoggerInstance,
        private threadService: ThreadService,
        private idleService: IdleService
    ) {
        this.debug = false;
    }

    public setDebug (debug: boolean): void {
        this.debug = debug;
    }

    public async refresh (channel: string = 'general'): Promise<void> {
        this.logger.debug(`Refreshing Miyagi${this.debug ? ' in debug mode' : ''}`);
        this.humanManager.resetSessionSuggestions();

        try {
            await this.humanManager.fetch(channel, this.debug);
        } catch (error) {
            this.logger.error('Unable to fetch humans');
        }
    }

    public async resumeThread (): Promise<void> {
        this.idleService.clear();
        this.logger.debug(`Resuming thread with "${this.thread.human.name}"`);
        this.idleService.start(this.nextThread.bind(this));

        try {
            this.thread = await this.threadService.next(this.thread);
        } catch (error) {
            this.logger.error('Error progressing thread', error);
        }
    }

    public async nextThread (): Promise<void> {
        let human: User;

        // clear the current timer
        this.idleService.clear();

        // get our next contestant
        try {
            human = await this.humanManager.getNextHuman();
        } catch (error) {
            this.logger.error('Error getting next human', error);
        }

        // close the current thread if it is defined
        if (this.thread !== undefined) {
            try {
                await this.threadService.close(this.thread);
                this.logger.debug(`Said goodbye to "${this.thread.human.name}"`);
            } catch (error) {
                this.logger.error(`Error saying goodbye to "${this.thread.human.name}"`, error);
            }
        }

        if (human === undefined) {
            this.logger.info('Done!');
            return;
        }

        // create a new thread
        this.thread = this.threadService.create(human);

        // start idle timer
        this.idleService.start(this.nextThread.bind(this));
        // start thread
        try {
            this.thread = await this.threadService.next(this.thread);
        } catch (error) {
            this.logger.error('Error progressing thread', error);
        }
    }
}
