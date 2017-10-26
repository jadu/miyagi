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
import ResponseHandlerFactory from '../factories/ResponseHandlerFactory';
import ResponseHandler from '../handlers/ResponseHandler';

/**
 * Logging
 */
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
const databaseService: DatabaseService = (new DatabaseServiceFactory()).create(
    DATABASE_URL,
    logger
);

const slackAuthenticationService: SlackAuthenticationService = new SlackAuthenticationService(
    SLACK_API_TOKEN, logger
);

try {
    slackAuthenticationService.connect();
} catch (error) {
    logger.error(error);
}

/**
 * Miyagi
 */
const miyagi: Miyagi = (new MiyagiFactory()).create(
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
 * Handlers
 */
const responseHandler: ResponseHandler = (new ResponseHandlerFactory()).create(
    databaseService,
    miyagi,
    logger,
    1000
);

/**
 * Server
 */
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Setup http server to receive slack POST requests
app.post('/', responseHandler.respond.bind(responseHandler));

app.get('/cli/send_questions', async (req, res) => {
    try {
        miyagi.setDebug(req.query.debug);
        await miyagi.refresh();
        miyagi.nextThread();
        res.sendStatus(200);
    } catch (error) {
        logger.error(error);
        res.sendStatus(500);
    }
});

// app.get('/slack/auth', (req, res) => {
//     console.log(req.params.code);
//     res.redirect('/');
// });

app.get('/', (req, res) => {
    res.send('Listening for Slack interactions');
});

app.listen(PORT, () => {
    logger.info(`Server listening on ${PORT}`);
});
