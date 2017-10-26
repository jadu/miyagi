import { LoggerInstance } from 'winston';

export default class IdleService {
    private idleTimeout: NodeJS.Timer;

    constructor (
        private idleDuration: number,
        private logger: LoggerInstance
    ) {}

    public start (action: () => void): void {
        // invoke action after timeout
        this.idleTimeout = setTimeout(() => {
            this.logger.debug(`Idle timer elapsed ${this.idleDuration}ms`);
            action();
        }, this.idleDuration);

        this.logger.debug(`Started idle timer ${this.idleDuration}ms`);
    }

    public clear (): void {
        if (this.idleTimeout !== undefined) {
            this.logger.debug('Idle timer cleared');
            clearTimeout(this.idleTimeout);
        }
    }
}
