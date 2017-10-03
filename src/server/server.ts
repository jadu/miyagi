import express = require('express');
import bodyParser = require('body-parser');
import { Logger, transports } from 'winston';
import request = require('request-promise-native');
import fs = require('fs');
import { MongoClient } from 'mongodb';
import { getRandomExtracts } from './serverUtils';

const logger = new Logger({
    level: 'debug',
    transports: [new transports.Console()]
});

// Database setup
const DB_URL = 'mongodb://localhost:27017/sentiment';

// MongoClient.connect(DB_URL, async (error, db) => {
//     if (error) {
//         logger.error(error.message);
//     } else {
//         logger.info(`Connected to database "${DB_URL}"`);

//         const randomExtracts = await getRandomExtracts(db, logger, 10);


//         db.close();
//     }
// });

// Server setup
const PORT = process.env.PORT || 4567;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Setup http server to receive slack POST requests
app.post('/', (req, res) => {
    res.sendStatus(200);
    logger.debug('Got a POST request');
    console.log(JSON.parse(req.body.payload));
});

app.get('/', (req, res) => {
    res.send('Listening for Slack interactions');
});

app.listen(PORT, () => {
    logger.info(`Server listening on ${PORT}`);
});

// Setup cron service to deliver messages to Slack users

// Setup database for retrieval and storage of extracts

