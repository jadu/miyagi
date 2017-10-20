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
exports.__esModule = true;
var Miyagi = /** @class */ (function () {
    function Miyagi(humanManager, slackChannelService, messageService, databaseService, logger, conversationService) {
        this.humanManager = humanManager;
        this.slackChannelService = slackChannelService;
        this.messageService = messageService;
        this.databaseService = databaseService;
        this.logger = logger;
        this.conversationService = conversationService;
        this.debug = false;
    }
    Miyagi.prototype.setDebug = function (debug) {
        this.debug = debug;
    };
    Miyagi.prototype.refresh = function (channel) {
        if (channel === void 0) { channel = 'general'; }
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Refreshing Miyagi" + (this.debug ? ' in debug mode' : ''));
                        this.humanManager.resetSessionSuggestions();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.humanManager.fetch(channel, this.debug)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error('Unable to fetch humans');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Miyagi.prototype.sendQuestion = function (channelId, messageTimestamp, user) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var human, _a, error_2, question, _b, _c, error_3, nextMessage, error_4;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        if (!user) return [3 /*break*/, 1];
                        _a = user;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.humanManager.getNextHuman()];
                    case 2:
                        _a = _d.sent();
                        _d.label = 3;
                    case 3:
                        human = _a;
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _d.sent();
                        this.logger.error('Could not get next human', error_2);
                        return [3 /*break*/, 5];
                    case 5:
                        if (!human) {
                            // If we have ran out of humans, log the session statistics and end the process
                            this.logger.info("Got " + this.humanManager.getSessionSuggestions().length + " " +
                                ("suggestions from " + this.humanManager.getActiveHumans().length + " humans in this session"));
                            process.exit(0);
                            return [2 /*return*/];
                        }
                        _d.label = 6;
                    case 6:
                        _d.trys.push([6, 8, , 9]);
                        _c = (_b = this.messageService).buildQuestion;
                        return [4 /*yield*/, this.databaseService.getNextExtract(human.id)];
                    case 7:
                        question = _c.apply(_b, [_d.sent(),
                            human.id,
                            { replace: !!user }]);
                        return [3 /*break*/, 9];
                    case 8:
                        error_3 = _d.sent();
                        this.logger.error('Could not build question', error_3);
                        return [3 /*break*/, 9];
                    case 9:
                        _d.trys.push([9, 14, , 15]);
                        if (!user) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.slackChannelService.updateMessage(messageTimestamp, channelId, question)];
                    case 10:
                        // If we have a payload update the previous message with a new question
                        nextMessage = _d.sent();
                        this.logger.info("Sent another question to \"" + human.name + "\"");
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, this.slackChannelService.sendDirectMessage(human, question)];
                    case 12:
                        // Send a new message to new user
                        nextMessage = _d.sent();
                        this.logger.info("Sent a new question to \"" + human.name + "\"");
                        _d.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_4 = _d.sent();
                        this.logger.error(error_4);
                        return [3 /*break*/, 15];
                    case 15:
                        // Start interaction timer, first argument will be invoked once the timer is complete
                        this.humanManager.startInteractionTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Say Goodbye
                                    return [4 /*yield*/, this.conversationService.goodbye(human.name, nextMessage.channel, nextMessage.message)];
                                    case 1:
                                        // Say Goodbye
                                        _a.sent();
                                        // Recursively invoke this method for the next user
                                        return [2 /*return*/, this.sendQuestion()];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Miyagi.prototype.trackSessionSuggestion = function (user, value) {
        this.humanManager.addSessionSuggestion(user.id, user.name, value);
    };
    Miyagi.prototype.sayGoodbye = function (message, channel, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.conversationService.goodbye(user.name, channel.id, message);
                return [2 /*return*/];
            });
        });
    };
    return Miyagi;
}());
exports["default"] = Miyagi;
