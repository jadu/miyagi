import SlackUserService from '../services/SlackUserService';
import { User } from '../interfaces/Slack';
import { LoggerInstance } from 'winston';
import { Suggestion } from '../interfaces/SentimentExtract';
import ListService from '../services/ListService';

export default class HumanManager {
    private humanCache: number;
    private suggestions: Suggestion[];
    private timeout: NodeJS.Timer|null;
    private humans: User[];
    private admin: User;

    constructor (
        private slackUserService: SlackUserService,
        private logger: LoggerInstance,
        private listService: ListService,
        private interactionTimeout: number
    ) {
        this.suggestions = [];
    }

    public getHumans (): User[] {
        return this.humans;
    }

    public getNumberOfCachedHumans (): number {
        return this.humanCache;
    }

    public addSessionSuggestion (userId: string, name: string, value: string): void {
        this.suggestions.push({
            user_id: userId,
            name: name,
            value: value
        });
    }

    public getSessionSuggestions (): Suggestion[] {
        return this.suggestions;
    }

    public resetSessionSuggestions (): void {
        this.suggestions.length = 0;
    }

    public async fetch (channel: string, debug: boolean): Promise<void> {
        try {
            this.humans = await this.slackUserService.getHumansFromChannel(channel);
            this.admin = Object.assign({}, this.humans.find((human: User) => human.is_admin));

            if (debug) {
                this.humans = [
                    Object.assign({}, this.admin, { name: 'foo' }),
                    Object.assign({}, this.admin, { name: 'bar' }),
                    Object.assign({}, this.admin, { name: 'baz' })
                ];
            }

            this.humanCache = this.humans.length;
        } catch (error) {
            this.logger.error(error);
        }
    }

    public getNextHuman (): User|undefined {
        const human: User = this.listService.getRandomItem(this.humans);

        if (human) {
            this.humans.splice(this.humans.indexOf(human), 1);
            this.logger.debug(`Randomly selected next human "${human.name}"`);
        }

        return human;
    }

    public startInteractionTimeout (
        next: () => Promise<void>
    ): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.logger.debug(`Waiting ${this.interactionTimeout}ms for a response`);
        this.timeout = setTimeout(next, this.interactionTimeout);
    }

    public clearInteractionTimeout (): void {
        this.logger.debug('Clearing interaction timeout');
        clearTimeout(this.timeout);
        this.timeout = null;
    }
}
