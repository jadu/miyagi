"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var winston_1 = require("winston");
var SlackAuthenticationService_1 = require("../services/SlackAuthenticationService");
var MiyagiFactory_1 = require("../factories/MiyagiFactory");
var DatabaseServiceFactory_1 = require("../factories/DatabaseServiceFactory");
var logger = new winston_1.Logger({
    level: 'debug',
    transports: [new winston_1.transports.Console()]
});
/**
 * Globals
 */
var DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/sentiment';
var SLACK_API_TOKEN = process.env.SLACK_API_TOKEN || null;
var PORT = process.env.PORT || 4567;
/**
 * Services
 */
// Database service
var databaseService = DatabaseServiceFactory_1["default"].create(DATABASE_URL, logger);
// Slack Web API client
var slackAuthenticationService = new SlackAuthenticationService_1["default"](SLACK_API_TOKEN, logger);
try {
    slackAuthenticationService.connect();
}
catch (error) {
    logger.error(error);
}
// Miyagi instance
exports.miyagi = MiyagiFactory_1["default"].create(slackAuthenticationService.getWebClient(), databaseService, logger, ['Have you got 5 minutes to help us train our Machine Learning platform? ' +
        'Read the extract below and let me know if you think it is *Positive*, *Negative* or *Neutral*'], ['Thank you, would you like to play again?'], ['Thank you for your help today, see you next time :wave:'], 300000);
/**
 * Server
 */
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// Start of day tasks
(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            exports.miyagi.refresh();
            return [2 /*return*/];
        });
    });
})();
// Setup http server to receive slack POST requests
app.post('/', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var payload, _a, type, extractId, userId, value;
    return __generator(this, function (_b) {
        payload = JSON.parse(req.body.payload);
        _a = payload.callback_id.split(':'), type = _a[0], extractId = _a[1], userId = _a[2];
        value = payload.actions[0].value;
        logger.debug("Got a \"" + (value ? value : 'I\'ve had enough') + "\" response from \"" + payload.user.name + "\"");
        // limit those rates
        // @todo - factor this into a response service
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res.status(200);
                        res.send();
                        if (!value) return [3 /*break*/, 1];
                        // Update database with suggestion
                        databaseService.handleExtractSuggestion(extractId, userId, value);
                        // Send a new question to the current user
                        exports.miyagi.trackSessionSuggestion(payload.user, value);
                        // TODO don't pass the full payload in here
                        exports.miyagi.sendQuestion(payload.channel.id, payload.original_message.ts, payload.user);
                        return [3 /*break*/, 3];
                    case 1: 
                    // Say goodbye to the current user
                    return [4 /*yield*/, exports.miyagi.sayGoodbye(payload.original_message, payload.channel, payload.user)];
                    case 2:
                        // Say goodbye to the current user
                        _a.sent();
                        // Send a question to the new user
                        exports.miyagi.sendQuestion();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); }, 1000);
        return [2 /*return*/];
    });
}); });
app.get('/cli/send_questions', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                exports.miyagi.setDebug(req.query.debug);
                return [4 /*yield*/, exports.miyagi.refresh()];
            case 1:
                _a.sent();
                exports.miyagi.sendQuestion();
                res.sendStatus(200);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                logger.error(error_1);
                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/slack/auth', function (req, res) {
    console.log(req.params.code);
    res.redirect('/');
});
app.get('/', function (req, res) {
    res.send('Listening for Slack interactions');
});
app.listen(PORT, function () {
    logger.info("Server listening on " + PORT);
});
