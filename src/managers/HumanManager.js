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
var HumanManager = /** @class */ (function () {
    function HumanManager(slackUserService, logger, listService, interactionTimeout) {
        this.slackUserService = slackUserService;
        this.logger = logger;
        this.listService = listService;
        this.interactionTimeout = interactionTimeout;
        this.suggestions = [];
        this.activeHumans = [];
    }
    HumanManager.prototype.getHumans = function () {
        return this.humans;
    };
    HumanManager.prototype.getActiveHumans = function () {
        return this.activeHumans;
    };
    HumanManager.prototype.addSessionSuggestion = function (userId, name, value) {
        this.suggestions.push({
            user_id: userId,
            name: name,
            value: value
        });
    };
    HumanManager.prototype.getSessionSuggestions = function () {
        return this.suggestions;
    };
    HumanManager.prototype.resetSessionSuggestions = function () {
        this.suggestions.length = 0;
    };
    HumanManager.prototype.fetch = function (channel, debug) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.slackUserService.getHumansFromChannel(channel)];
                    case 1:
                        _a.humans = _b.sent();
                        this.admin = Object.assign({}, this.humans.find(function (human) { return human.is_admin; }));
                        if (debug) {
                            this.humans = [
                                Object.assign({}, this.admin, { name: 'foo', real_name: 'foo' }),
                                Object.assign({}, this.admin, { name: 'bar', real_name: 'bar' }),
                                Object.assign({}, this.admin, { name: 'baz', real_name: 'baz' })
                            ];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        this.logger.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HumanManager.prototype.getNextHuman = function () {
        return __awaiter(this, void 0, void 0, function () {
            var onlineHumans, _i, _a, human, active, error_2, nextHuman;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onlineHumans = [];
                        _i = 0, _a = this.humans;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        human = _a[_i];
                        active = void 0;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.slackUserService.userActive(human)];
                    case 3:
                        active = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        this.logger.error("Could not determine if a user is active \"" + human.name + "\"");
                        return [3 /*break*/, 5];
                    case 5:
                        if (active) {
                            onlineHumans.push(human);
                        }
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7:
                        nextHuman = this.listService.getRandomItem(onlineHumans);
                        if (nextHuman) {
                            this.humans.splice(this.humans.indexOf(nextHuman), 1);
                            this.logger.debug("Randomly selected next human \"" + nextHuman.name + "\"");
                            if (!this.activeHumans.find(function (u) { return u.id === nextHuman.id; })) {
                                this.activeHumans.push(nextHuman);
                            }
                        }
                        return [2 /*return*/, nextHuman];
                }
            });
        });
    };
    HumanManager.prototype.startInteractionTimeout = function (next) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.logger.debug("Waiting " + this.interactionTimeout + "ms for a response");
        this.timeout = setTimeout(next, this.interactionTimeout);
    };
    HumanManager.prototype.clearInteractionTimeout = function () {
        this.logger.debug('Clearing interaction timeout');
        clearTimeout(this.timeout);
        this.timeout = null;
    };
    return HumanManager;
}());
exports["default"] = HumanManager;
