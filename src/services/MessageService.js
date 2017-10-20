"use strict";
exports.__esModule = true;
var MessageService = /** @class */ (function () {
    /**
     * MessageService
     */
    function MessageService(listService, openers, closers, enders) {
        this.listService = listService;
        this.openers = openers;
        this.closers = closers;
        this.enders = enders;
    }
    /**
     * Build Message
     * @param sentimentExtract
     * @param userId
     */
    MessageService.prototype.buildQuestion = function (sentimentExtract, userId, options) {
        if (options === void 0) { options = {}; }
        return {
            replace_original: options.replace || false,
            text: options.text || this.listService.getRandomItem(this.openers),
            attachments: [
                {
                    text: "\"" + sentimentExtract.text + "\"",
                    callback_id: "question:" + sentimentExtract._id + ":" + userId,
                    color: options.color || '#3AA3E3',
                    actions: [
                        {
                            name: 'sentiment',
                            text: ':smile: Positive',
                            type: 'button',
                            value: 'positive'
                        },
                        {
                            name: 'sentiment',
                            text: ':neutral_face: Neutral',
                            type: 'button',
                            value: 'neutral'
                        },
                        {
                            name: 'sentiment',
                            text: ':angry: Negative',
                            type: 'button',
                            value: 'negative'
                        },
                        {
                            name: 'sentiment',
                            text: ':unicorn_face: Not Sure',
                            type: 'button',
                            value: 'not_sure'
                        },
                        {
                            name: 'sentiment',
                            text: ':no_entry_sign: I\'ve had enough',
                            type: 'button'
                        }
                    ]
                }
            ]
        };
    };
    MessageService.prototype.endConversation = function (message) {
        return Object.assign({}, message, {
            replace_original: true,
            text: message.text,
            attachments: [
                {
                    text: this.listService.getRandomItem(this.enders),
                    color: message.attachments[0].color
                }
            ]
        });
    };
    return MessageService;
}());
exports["default"] = MessageService;
