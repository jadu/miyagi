import { LoggerInstance } from 'winston';
import { RtmClient, WebClient } from '@slack/client';

export default class SlackAuthenticationService {
    private rtmClient: RtmClient;
    private webClient: WebClient;

    constructor (
        private token: string,
        private logger: LoggerInstance
    ) {}

    public connect (): void {
        if (!this.token) {
            this.logger.error('You need to export a value for the "SLACK_API_TOKEN" variable');
            process.exit(1);
        }

        try {
            // Using this to indicate whether Miyagi is online
            this.rtmClient = new RtmClient(this.token);
            this.rtmClient.start();
            // Establish WebAPI client
            this.webClient = new WebClient(this.token);
            this.logger.info('Connected to Slack');
        } catch (error) {
            this.logger.error('Unable to connect to slack', error);
            process.exit(1);
        }
    }

    public getWebClient (): WebClient {
        return this.webClient;
    }

    public getRtmClient (): RtmClient {
        return this.rtmClient;
    }
}
