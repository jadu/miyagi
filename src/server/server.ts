import express = require('express');
import bodyParser = require('body-parser');
import { Logger, transports } from 'winston';
import request = require('request-promise-native');
import { MongoClient } from 'mongodb';
import { InteractiveComponentPayload } from '../interfaces/Slack';
import DatabaseService from '../services/DatabaseService';
import SlackAuthenticationService from '../services/SlackAuthenticationService';
import { WebClient } from '@slack/client';
import MiyagiFactory from '../factories/MiyagiFactory';
import Miyagi from '../services/Miyagi';
import DatabaseServiceFactory from '../factories/DatabaseServiceFactory';

const logger = new Logger({
    level: 'debug',
    transports: [new transports.Console()]
});

/**
 * Globals
 */
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/sentiment';
const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN || null;
const PORT = process.env.PORT || 4567;

/**
 * Services
 */

// Database service
const databaseService: DatabaseService = DatabaseServiceFactory.create(
    DATABASE_URL,
    logger
);
// Slack Web API client
const slackAuthenticationService: SlackAuthenticationService = new SlackAuthenticationService(
    SLACK_API_TOKEN, logger
);

try {
    slackAuthenticationService.connect();
} catch (error) {
    logger.error(error);
}

// Miyagi instance
export const miyagi: Miyagi = MiyagiFactory.create(
    slackAuthenticationService.getWebClient(),
    databaseService,
    logger,
    ['Have you got 5 minutes to help us train our Machine Learning platform? ' +
        'Read the extract below and let me know if you think it is *Positive*, *Negative* or *Neutral*'],
    ['Thank you, would you like to play again?'],
    ['Thank you for your help today, see you next time :wave:'],
    300000
);

/**
 * Server
 */

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Start of day tasks
(async function () {
    miyagi.refresh();
})();

// Setup http server to receive slack POST requests
app.post('/', async (req, res) => {
    // @todo validate slack app token !important
    const payload: InteractiveComponentPayload = JSON.parse(req.body.payload);
    const [ type, extractId, userId ]: string[] = payload.callback_id.split(':');
    const value = payload.actions[0].value;

    logger.debug(`Got a "${value ? value : 'I\'ve had enough'}" response from "${payload.user.name}"`);

    // limit those rates
    // @todo - factor this into a response service
    setTimeout(async () => {
        res.status(200);
        res.send();

        if (value) {
            // Update database with suggestion
            databaseService.handleExtractSuggestion(extractId, userId, value);
            // Send a new question to the current user
            miyagi.trackSessionSuggestion(payload.user, value);
            // TODO don't pass the full payload in here
            miyagi.sendQuestion(payload.channel.id, payload.original_message.ts, payload.user);
        } else {
            // Say goodbye to the current user
            await miyagi.sayGoodbye(payload.original_message, payload.channel, payload.user);
            // Send a question to the new user
            miyagi.sendQuestion();
        }
    }, 1000);
});

app.get('/cli/send_questions', async (req, res) => {
    try {
        miyagi.setDebug(req.query.debug);
        await miyagi.refresh();
        miyagi.sendQuestion();
        res.sendStatus(200);
    } catch (error) {
        logger.error(error);
        res.sendStatus(500);
    }
});

app.get('/', (req, res) => {
    res.send('Listening for Slack interactions');
});

app.listen(PORT, () => {
    logger.info(`Server listening on ${PORT}`);
});
