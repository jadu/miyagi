import { RtmClient, WebClient } from '@slack/client';
import { Logger, LoggerInstance, transports } from 'winston';
import { SentimentExtract } from '../interfaces/SentimentExtract';
import { User } from '../interfaces/User';
import { Db, MongoClient } from 'mongodb';
import SlackChannelService from '../services/SlackChannelService';
import QuestionProvider from '../providers/QuestionProvider';
import ListService from '../services/ListService';
import SlackUserService from '../services/SlackUserService';
import { Channel } from '../interfaces/Channel';
import DatabaseService from '../services/DatabaseService';

const logger: LoggerInstance = new Logger({
    level: 'debug',
    transports: [new transports.Console()]
});

const token: string|undefined = process.env.SLACK_API_TOKEN;

if (!token) {
    logger.error('You need to export a value for the "SLACK_API_TOKEN" variable');
    process.exit(1);
}

// Slack Web API client
const api: WebClient = new WebClient(token);
// Using this just to indicate whether the Bot is online
const rtm: RtmClient = (new RtmClient(token)).start();

// Services
const listService: ListService = new ListService();
const questionProvider: QuestionProvider = new QuestionProvider(
    listService,
    ['Good day! Help!', 'oi, you, help me with this, now']
);
const slackChannelService: SlackChannelService = new SlackChannelService(api, logger, questionProvider);
const slackUserService: SlackUserService = new SlackUserService(api, logger, slackChannelService);
const databaseService: DatabaseService = new DatabaseService(
    'mongodb://localhost:27017/sentiment', new MongoClient(), logger
);

// APPLICATION
(async function () {
    let humans: User[];
    let extracts: SentimentExtract[];

    // Get list of humans
    try {
        humans = await slackUserService.getHumansFromChannel('general');
    } catch (error) {
        logger.error(error);
    }

    // Get extracts
    try {
        extracts = await databaseService.getRandomExtracts(humans.length);
    } catch (error) {
        logger.error(error);
    }

    const successfulDirectMessages: User[] = [];
    const unsuccessfulDirectMessages: User[] = [];

    // Send extracts
    for (const human of humans) {
        try {
            await slackChannelService.sendDirectMessage(human, extracts[humans.indexOf(human)]);
            successfulDirectMessages.push(human);
        } catch (error) {
            logger.debug(`Unable to send direct message to "${human.real_name}"`);
            unsuccessfulDirectMessages.push(human);
        }
    }

    logger.info(`Sent ${successfulDirectMessages.length}/${humans.length} messages successfully`);
})();
