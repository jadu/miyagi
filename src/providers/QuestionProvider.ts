import { SentimentExtract } from '../interfaces/SentimentExtract';
import { Question } from '../interfaces/Slack';
import ListService from '../services/ListService';

export default class QuestionProvider {
    private openers: string[];

    /**
     * QuestionService
     */
    constructor (
        private listService: ListService,
        private openners: string[]
    ) {}

    /**
     * Build Question
     * @param sentimentExtract
     * @param userId
     */
    public build (sentimentExtract: SentimentExtract, userId: string): Question {
        return {
            text: this.listService.getRandomItem(this.openners),
            attachments: [
                {
                    text: `"${sentimentExtract.text}"`,
                    callback_id: `${sentimentExtract._id}:${userId}`,
                    color: '#3AA3E3',
                    actions: [
                        {
                            name: 'sentiment',
                            text: ':smile:  Positive',
                            type: 'button',
                            value: 'positive'
                        },
                        {
                            name: 'sentiment',
                            text: ':neutral_face:  Neutral',
                            type: 'button',
                            value: 'neutral'
                        },
                        {
                            name: 'sentiment',
                            text: ':angry:  Negative',
                            type: 'button',
                            value: 'negative'
                        }
                    ]
                }
            ]
        };
    }
}
