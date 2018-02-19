import SlackUserService from '../services/SlackUserService';
import { User } from '../interfaces/Slack';
import { LoggerInstance } from 'winston';
import { Suggestion, suggestions } from '../interfaces/SentimentExtract';
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
        private listService: ListService
    ) {
        this.suggestions = [];
        this.activeHumans = [];
    }

    public getActiveHumans (): User[] {
        return this.activeHumans;
    }

    public addSessionSuggestion (userId: string, name: string, value: suggestions): void {
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
                this.humans = [this.admin, this.admin, this.admin];
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    public async getNextHuman (): Promise<User|undefined> {
        const onlineHumans: User[] = [];

        for (const human of this.humans) {
            const active = await this.slackUserService.userActive(human);

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
}
