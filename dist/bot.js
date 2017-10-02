"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@slack/client");
const winston_1 = require("winston");
const actions_1 = require("./actions");
const logger = new winston_1.Logger({
    level: 'debug',
    transports: [new winston_1.transports.Console()]
});
const token = process.env.SLACK_API_TOKEN;
if (!token) {
    logger.error('You need to export a value for the "SLACK_API_TOKEN" variable');
}
const web = new client_1.WebClient(token);
// APPLICATION
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let humans = [];
        // Get list of humans
        try {
            const general = yield actions_1.getGeneralChannel(web, logger);
            humans = yield actions_1.getHumansFromChannel(web, logger, general);
            logger.info(`Got ${humans.length} human${humans.length === 1 ? '' : 's'} from #general`);
            logger.debug(humans.map(human => human.real_name).join(', '));
        }
        catch (error) {
            logger.error(error);
        }
    });
})();
//# sourceMappingURL=bot.js.map