import ListService from '../services/ListService';
import { Question, SentimentExtract } from '../types';

export default class QuestionProvider {
    private openers: string[];

    /**
     * QuestionService
     */
    constructor (
        private listService: ListService
    ) {
        this.openers = [
            `Have you got 5 minutes to help us train our Machine Learning platform?
            Read the extract below and let me know if you think it is *Positive*, *Negative* or *Neutral*`
        ];
    }

    /**
     * Build Question
     * @param sentimentExtract
     * @param userId
     */
    public build (sentimentExtract: SentimentExtract, userId: string): Question {
        return {
            text: this.listService.getRandomItem(this.openers),
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
