import { SentimentExtract } from '../interfaces/SentimentExtract';
import ListService from '../services/ListService';
import { Message } from '../interfaces/Slack';

export default class MessageService {
    /**
     * MessageService
     */
    constructor (
        private listService: ListService,
        private openers: string[],
        private closers: string[],
        private enders: string[]
    ) {}

    /**
     * Build Message
     * @param sentimentExtract
     * @param userId
     */
    public buildQuestion (
        sentimentExtract: SentimentExtract,
        userId: string,
        color: string = '#3AA3E3',
        text: string = this.listService.getRandomItem(this.openers),
        replace: boolean = false
    ): Message {
        return {
            replace_original: replace,
            text: text,
            attachments: [
                {
                    text: `"${sentimentExtract.text}"`,
                    callback_id: `question:${sentimentExtract._id}:${userId}`,
                    color: color,
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
    }

    public endConversation (message: Message): Message {
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
    }
}
