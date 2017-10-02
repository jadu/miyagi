import { WebClient } from '@slack/client';
import { Logger, transports, LoggerInstance } from 'winston';
import { Channel, Member } from './types';
import { getHumansFromChannel, getGeneralChannel, sendDirectMessage } from './actions';

const logger: LoggerInstance = new Logger({
    level: 'debug',
    transports: [new transports.Console()]
});

const token: string|undefined = process.env.SLACK_API_TOKEN;

if (!token) {
    logger.error('You need to export a value for the "SLACK_API_TOKEN" variable');
}

const web: WebClient = new WebClient(token);

// APPLICATION
(async function () {
    let humans: Member[] = [];

    // Get list of humans
    try {
        const general: Channel = await getGeneralChannel(web, logger);
       
        humans = await getHumansFromChannel(web, logger, general); 
        logger.info(`Got ${humans.length} human${humans.length === 1 ? '' : 's'} from #general`);
        logger.debug(humans.map(human => human.real_name).join(', '));
    } catch (error) {
        logger.error(error);
    }
})();
