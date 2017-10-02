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
/**
 * Get #general channel
 * @param client
 * @param logger
 */
function getGeneralChannel(client, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let channels;
            try {
                channels = (yield client.channels.list()).channels;
            }
            catch (error) {
                logger.error(error);
            }
            logger.debug(`Got ${channels.length} channels`);
            const general = channels.find(channel => channel.name === 'general');
            if (general !== undefined) {
                logger.debug('Found #general!');
                resolve(general);
            }
            else {
                reject('Could not get the #general channel');
            }
        }));
    });
}
exports.getGeneralChannel = getGeneralChannel;
/**
 * Get all Humans invited to #general
 * @param client
 * @param logger
 */
function getHumansFromChannel(client, logger, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const general = yield getGeneralChannel(client, logger);
            const humans = [];
            const members = [];
            logger.info(`There are ${channel.members.length} members in #general`);
            for (let userId of channel.members) {
                members.push(client.users.info(userId));
            }
            Promise.all(members).then((response) => {
                response.forEach(({ user }) => {
                    if (!user.is_bot && user.name !== 'slackbot') {
                        humans.push(user);
                    }
                });
                resolve(humans);
            });
        }));
    });
}
exports.getHumansFromChannel = getHumansFromChannel;
function sendDirectMessage(client, logger, userId, sentimentExtract) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { channel } = yield client.im.open(userId);
                const { text, attachments } = buildSentimentQuestion(sentimentExtract);
                const directMessage = yield client.chat.postMessage(channel.id, text, { attachments });
                resolve(directMessage);
            }
            catch (error) {
                logger.error(error);
                reject(error);
            }
        }));
    });
}
exports.sendDirectMessage = sendDirectMessage;
/**
 * Build the sentiment question object
 * @param sentimentExtract
 */
function buildSentimentQuestion(sentimentExtract) {
    const text = "Have you got 5 minutes to help us train our Machine Learning platform? Read the extract below and let me know if you think it is *Positive*, *Negative* or *Neutral*";
    const attachments = [
        {
            text: `"${sentimentExtract.text}"`,
            callback_id: sentimentExtract.text,
            color: '#3AA3E3',
            actions: [
                {
                    name: "sentiment",
                    text: ":smile:  Positive",
                    type: "button",
                    value: "positive"
                },
                {
                    name: "sentiment",
                    text: ":neutral_face:  Neutral",
                    type: "button",
                    value: "neutral"
                },
                {
                    name: "sentiment",
                    text: ":angry:  Negative",
                    type: "button",
                    value: "negative"
                }
            ]
        }
    ];
    return { text, attachments };
}
exports.buildSentimentQuestion = buildSentimentQuestion;
//# sourceMappingURL=actions.js.map