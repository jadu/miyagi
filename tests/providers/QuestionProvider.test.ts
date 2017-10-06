import { SentimentExtract } from '../../src/interfaces/SentimentExtract';
import MessageService from '../../src/services/MessageService';
import ListService from '../../src/services/ListService';
import { mock, instance, when, verify, deepEqual } from 'ts-mockito';

describe('MessageService', () => {
    let messageService: MessageService;
    let listService: ListService;

    beforeEach(() => {
        listService = mock(ListService);
        messageService = new MessageService(
            instance(listService),
            ['test openner'],
            ['test closer']
        );
    });

    describe('build', () => {
        test('should return a question', () => {
            const extract: SentimentExtract = {
                _id: 'sentiment_id',
                text: 'test extract',
                suggestions: []
            };

            when(listService.getRandomItem(deepEqual(['test openner']))).thenReturn('test openner');

            expect(MessageService.build(extract, 'user_id')).toEqual({
                text: 'test openner',
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
