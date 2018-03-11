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
import { createUserObject, createSortableUserObject, countSortableObjectValues } from '../utilities/statistics';
import { UserMap, SortableUserMap } from '../interfaces/Users';
import fs = require('fs');

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
const ACADEMY = process.env.ACADEMY || null;

/**
 * Services
 */
const collection: string = process.env.COLLECTION || 'extracts';
const databaseService: DatabaseService = (new DatabaseServiceFactory()).create(
    DATABASE_URL,
    logger,
    collection
);

/**
 * Server
 */
const app = express();

app.use(favicon(path.join(process.cwd(), 'assets/favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(process.cwd(), 'dist/www/')));
app.use(cors());

let extractIndex = 0;

function getExtract () {
    const extracts = JSON.parse(
        fs.readFileSync('fixtures/academy_extracts.json', 'utf-8')
    );
    const extract = extracts[extractIndex];

    extractIndex = extractIndex + 1 === extracts.length ? 0 : extractIndex + 1;

    return { _id: 'ACADEMY', text: extract } as SentimentExtract;;
}

app.get('/miyapi/extract', async (req, res) => {
    let extract: SentimentExtract;

    function error (msg: string) {
        res.status(500);
        res.send(JSON.stringify({
            extract: {
                text: `Unable to get extract ¯\\_(ツ)_/¯\n"${msg}"`,
                _id: "null"
            }
        }));
    }

    if (!ACADEMY) {
        try {
            extract = await databaseService.getUniqueExtract();
        } catch (error) {
            return error(error.message);
        }

        if (extract === undefined) {
            return error("Extract is undefined");
        }
    } else {
        extract = getExtract();
    }

    res.status(200);
    res.send(JSON.stringify({
        extract: {
            _id: extract._id,
            text: extract.text
        },
        error: false
    }));
});

app.post('/miyapi/extract', async (req, res) => {
    try {
        const { _id, value, user_id, options } = req.body;
        let extract;

        if (!ACADEMY) {
            extract = await databaseService.getUniqueExtract();
            databaseService.updateExtractSuggestions(_id, user_id, value, options);
        } else {
            extract = getExtract();
        }

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
            text: 'Could not get extract',
            error: error
        }));
    }
});

app.post('/miyapi/suggestion', (req, res) => {
    res.sendStatus(200);
});

app.get('/miyapi/statistics', async (req, res) => {
    try {
        const extracts: SentimentExtract[] = await databaseService.getAllExtracts();
        const userMap: SortableUserMap = createSortableUserObject(createUserObject(extracts));
        const suggestionsSubmitted: number = countSortableObjectValues(userMap);
        const extractsWithSuggestions: number = extracts.filter((e: SentimentExtract) => e.has_suggestion).length;
        const totalExtracts: number = extracts.length;
        const percentageComplete: number = Math.floor((suggestionsSubmitted / totalExtracts) * 100);

        res.status(200);
        res.send(JSON.stringify({
            percentageComplete: percentageComplete < 100 ? percentageComplete : 100,
            extractsWithSuggestions,
            suggestionsSubmitted,
            totalExtracts,
        }));
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(JSON.stringify({
            text: 'Could not get extract statistics',
            error: error
        }));
    }
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
