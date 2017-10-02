"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const winston_1 = require("winston");
const logger = new winston_1.Logger({
    level: 'debug',
    transports: [new winston_1.transports.Console()]
});
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
//# sourceMappingURL=index.js.map