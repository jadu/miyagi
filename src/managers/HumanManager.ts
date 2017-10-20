import SlackUserService from '../services/SlackUserService';
import { User } from '../interfaces/Slack';
import { LoggerInstance } from 'winston';
import { Suggestion } from '../interfaces/SentimentExtract';
import ListService from '../services/ListService';

export default class HumanManager {
    private activeHumans: User[];
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
        this.activeHumans = [];
    }

    public getHumans (): User[] {
        return this.humans;
    }

    public getActiveHumans (): User[] {
        return this.activeHumans;
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
                    Object.assign({}, this.admin, { name: 'foo', real_name: 'foo' }),
                    Object.assign({}, this.admin,  { name: 'bar', real_name: 'bar' }),
                    Object.assign({}, this.admin, { name: 'baz', real_name: 'baz' })
                ];
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    public async getNextHuman (): Promise<User|undefined> {
        const onlineHumans: User[] = [];

        for (const human of this.humans) {
            let active: boolean;

            try {
                active = await this.slackUserService.userActive(human);
            } catch (error) {
                this.logger.error(`Could not determine if a user is active "${human.name}"`);
            }

            if (active) {
                onlineHumans.push(human);
            }
        }

        const nextHuman: User = this.listService.getRandomItem(onlineHumans);

        if (nextHuman) {
            this.humans.splice(this.humans.indexOf(nextHuman), 1);
            this.logger.debug(`Randomly selected next human "${nextHuman.name}"`);

            if (!this.activeHumans.find((u: User) => u.id === nextHuman.id)) {
                this.activeHumans.push(nextHuman);
            }
        }

        return nextHuman;
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
