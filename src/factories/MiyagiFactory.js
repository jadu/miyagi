"use strict";
exports.__esModule = true;
var Miyagi_1 = require("../services/Miyagi");
var SlackUserService_1 = require("../services/SlackUserService");
var SlackChannelService_1 = require("../services/SlackChannelService");
var MessageService_1 = require("../services/MessageService");
var ListService_1 = require("../services/ListService");
var HumanManager_1 = require("../managers/HumanManager");
var ConversationService_1 = require("../services/ConversationService");
var MiyagiFactory = /** @class */ (function () {
    function MiyagiFactory() {
    }
    MiyagiFactory.create = function (webClient, databaseService, logger, openers, closers, enders, interactionTimeout) {
        if (interactionTimeout === void 0) { interactionTimeout = 10000; }
        var listService = new ListService_1["default"]();
        var messageService = new MessageService_1["default"](listService, openers, closers, enders);
        var channelService = new SlackChannelService_1["default"](webClient, logger);
        var userService = new SlackUserService_1["default"](webClient, logger, channelService);
        var humanManager = new HumanManager_1["default"](userService, logger, listService, interactionTimeout);
        var conversationService = new ConversationService_1["default"](humanManager, logger, channelService, messageService);
        return new Miyagi_1["default"](humanManager, channelService, messageService, databaseService, logger, conversationService);
    };
    return MiyagiFactory;
}());
exports["default"] = MiyagiFactory;
