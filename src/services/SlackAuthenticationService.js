"use strict";
exports.__esModule = true;
var client_1 = require("@slack/client");
var SlackAuthenticationService = /** @class */ (function () {
    function SlackAuthenticationService(token, logger) {
        this.token = token;
        this.logger = logger;
    }
    SlackAuthenticationService.prototype.connect = function () {
        if (!this.token) {
            this.logger.error('You need to export a value for the "SLACK_API_TOKEN" variable');
            process.exit(1);
        }
        try {
            // Using this to indicate whether Miyagi is online and typing
            this.rtmClient = new client_1.RtmClient(this.token);
            this.rtmClient.start();
            // Establish WebAPI client
            this.webClient = new client_1.WebClient(this.token);
        }
        catch (error) {
            this.logger.error('Unable to connect to slack', error);
            process.exit(1);
        }
    };
    SlackAuthenticationService.prototype.getWebClient = function () {
        return this.webClient;
    };
    SlackAuthenticationService.prototype.getRtmClient = function () {
        return this.rtmClient;
    };
    return SlackAuthenticationService;
}());
exports["default"] = SlackAuthenticationService;
