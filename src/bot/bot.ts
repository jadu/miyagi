import { WebClient, RtmClient } from '@slack/client';
import { Logger, transports, LoggerInstance } from 'winston';
import { Channel, Member, SentimentExtract } from '../types';
import { getHumansFromChannel, getGeneralChannel, sendDirectMessage } from './botUtils';
import { MongoClient, Db, MongoError } from 'mongodb';
import { getRandomExtracts } from '../server/serverUtils';
import { DB_URL } from '../server/server';

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

// APPLICATION
(async function () {
    let humans: Member[] = [];
    let extracts: SentimentExtract[] = [];
    let database: Db;

    // Get list of humans
    try {
        const general: Channel = await getGeneralChannel(api, logger);
       
        humans = await getHumansFromChannel(api, logger, general); 
        logger.info(`Got ${humans.length} human${humans.length === 1 ? '' : 's'} from #general`);
        logger.debug(humans.map(human => human.real_name).join(', '));
    } catch (error) {
        logger.error(error);
    }

    // Connect to database
    try {
        database = await MongoClient.connect(DB_URL);
    } catch (error) {
        logger.error(error);
    }

    // Get extracts
    // MongoClient.connect(DB_URL, async (error: MongoError, db: Db) => {
    //     if (error) {
    //         logger.error(error.message);
    //     } else {
    //         logger.info(`Conntected to "${DB_URL}"`);
    //         extracts = await getRandomExtracts(db, logger, humans.length);
    //     }
    // });

    console.log(extracts);

    extracts.forEach((extract: SentimentExtract) => {
        console.log(extract);
    });
})();


