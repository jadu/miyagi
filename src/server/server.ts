import * as express from 'express';
import { Application } from 'express';
import { Logger, transports } from 'winston';
import request = require('request-promise-native');
import path = require('path');
import { User } from '../interfaces/Slack';

const logger = new Logger({
    level: 'debug',
    transports: [new transports.Console()]
});

const app: Application = express();
const PORT = process.env.PORT || 4567;
const www = path.resolve('dist/www');

app.use(express.static(www));

app.get('/slack/auth', async (req, res) => {
    // Get auth token & user from Slack
    const auth = await request.post({
        url: 'https://slack.com/api/oauth.access',
        form: {
            client_id: '105999935111.249047229058',
            client_secret: '43f363521af48f8fe091a7d573dea424',
            code: req.query.code,
            redirect_url: 'http://221713ba.ngrok.io/slack/auth'
        }
    });

    res.redirect('/');
});

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: www });
});

app.listen(PORT, () => {
    logger.info(`Client server listening on port ${PORT}`);
});
