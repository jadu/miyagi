import express = require('express');
import favicon = require('serve-favicon');
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
import { SentimentExtract } from '../interfaces/SentimentExtract';
import cors = require('cors');
import path = require('path');

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
    logger,
    process.env.NODE_ENV !== 'production'
);

/**
 * Server
 */
const app = express();

app.use(favicon(path.join(process.cwd(), 'assets/favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(process.cwd(), 'dist/www/')));
app.use(cors());

/**
 * Slack
 */
if (SLACK_API_TOKEN !== null) {
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
}

app.get('/miyapi/extract', async (req, res) => {
    try {
        const extract: SentimentExtract = (await databaseService.getRandomExtracts(1))[0];

        res.status(200);
        res.send(JSON.stringify({
            extract: {
                _id: extract._id,
                text: extract.text
            },
            error: false
        }));
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({
            error: 'Could not get extract'
        }));
    }
});

app.post('/miyapi/extract', async (req, res) => {
    try {
        const { _id, value, user_id, options } = req.body;
        const extract: SentimentExtract = (await databaseService.getRandomExtracts(1))[0];

        console.log(req.body)

        databaseService.updateExtractSuggestions(_id, user_id, value);

        res.status(200);
        res.send(JSON.stringify({
            extract: {
                _id: extract._id,
                text: extract.text
            },
            error: false
        }));
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({
            error: 'Could not get extract'
        }));
    }
});

app.post('/miyapi/suggestion', (req, res) => {
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    logger.info(`Server listening on ${PORT}`);
});
