import QuestionProvider from '../../src/providers/QuestionProvider';
import ListService from '../../src/services/ListService';
import { SentimentExtract } from '../../src/types';

jest.mock('../../src/services/ListService');

describe('QuestionProvider', () => {
    let questionProvider: QuestionProvider;
    let listService: jest.Mocked<ListService>;

    beforeEach(() => {
        listService = new ListService() as any;
        questionProvider = new QuestionProvider(
            listService
        );
    });

    describe('build', () => {
        test('should return a question', () => {
            const extract: SentimentExtract = {
                _id: 'sentiment_id',
                text: 'test extract',
                suggestions: []
            };

            listService.getRandomItem.mockReturnValue('test question');

            expect(questionProvider.build(extract, 'user_id')).toEqual({
                text: 'test question',
                attachments: [
                    {
                        text: '"test extract"',
                        callback_id: 'sentiment_id:user_id',
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
            });
        });
    });
});
