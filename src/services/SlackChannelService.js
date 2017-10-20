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
var SlackChannelService = /** @class */ (function () {
    function SlackChannelService(client, logger) {
        this.client = client;
        this.logger = logger;
    }
    SlackChannelService.prototype.getChannel = function (channelName) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var channels, error_1, channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.channels.list()];
                    case 1:
                        channels = (_a.sent()).channels;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, reject(error_1)];
                    case 3:
                        this.logger.log('debug', "Got " + channels.length + " channels");
                        channel = channels.find(function (c) { return c.name === channelName; });
                        if (channel !== undefined) {
                            this.logger.log('info', "Found the #" + channelName + " channel");
                            return [2 /*return*/, resolve(channel)];
                        }
                        else {
                            return [2 /*return*/, reject("Could not get the #" + channelName + " channel")];
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    SlackChannelService.prototype.sendDirectMessage = function (user, message) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var channel, directMessage, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.client.im.open(user.id)];
                    case 1:
                        channel = (_a.sent()).channel;
                        return [4 /*yield*/, this.client.chat.postMessage(channel.id, message.text, { attachments: message.attachments })];
                    case 2:
                        directMessage = _a.sent();
                        return [2 /*return*/, resolve(directMessage)];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, reject(error_2)];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    SlackChannelService.prototype.updateMessage = function (messageTimestamp, channeId, newMessage) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.chat.update(messageTimestamp, channeId, newMessage.text, { attachments: newMessage.attachments })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return SlackChannelService;
}());
exports["default"] = SlackChannelService;
