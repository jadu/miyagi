import { SentimentExtract } from '../types';

export const fixtures: SentimentExtract[] = [
    {
        text: 'This is some great happy text',
        suggestions: [
            { user_id: 'QWERTY', value: 'positive' }
        ]
    },
    {
        text: 'This is some sad negative text',
        suggestions: [
            { user_id: 'QWERTY', value: 'negative' },
            { user_id: 'ASDFGH', value: 'neutral' }
        ]
    },
    {
        text: 'This is some neutral text',
        suggestions: [
            { user_id: 'QWERTY', value: 'neutral' },
            { user_id: 'ASDFGH', value: 'neutral' }
        ]
    }
];