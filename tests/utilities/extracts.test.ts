import { SentimentExtract } from "../../src/interfaces/SentimentExtract";
import { createRemoveRedactedCharacters, normalizeSpaces, createTagExtractWithWeight, filterExtractsWithoutSuggestions } from "../../src/utilities/extracts";

describe('filterExtractsWithoutSuggestions', () => {
    it('should filter extracts that do not have suggestions', () => {
        const extract: SentimentExtract = {
            text: 'extract',
            suggestions: []
        };

        expect(filterExtractsWithoutSuggestions(extract)).toBe(false);
    });

    it('should filter extracts that have suggestions', () => {
        const extract: SentimentExtract = {
            text: 'extract',
            suggestions: [
                {
                    user_id: 'user',
                    value: 'positive'
                }
            ]
        };

        expect(filterExtractsWithoutSuggestions(extract)).toBe(true);
    });
});

describe('createRemoveRedactedCharacters', () => {
    test('should remove redacted characters from a string', () => {
        const extract: SentimentExtract = {
            text: 'This is a redacted ********** extract',
            suggestions: []
        };
        const removeRedactedChars = createRemoveRedactedCharacters();

        expect(removeRedactedChars(extract).text).toEqual('This is a redacted  extract');
    });

    test('should support a custom redaction character', () => {
        const extract: SentimentExtract = {
            text: 'This is a redacted $$$$$$$$ extract',
            suggestions: []
        };
        const removeRedactedChars = createRemoveRedactedCharacters('$');

        expect(removeRedactedChars(extract).text).toEqual('This is a redacted  extract');
    });
});

describe('normalizeSpaces', () => {
    test('should remove any instances of weird spaces', () => {
        const extract: SentimentExtract = {
            text: 'This      is        a    redacted        extract',
            suggestions: []
        };

        expect(normalizeSpaces(extract).text).toEqual('This is a redacted extract');
    });
});

describe('createSortExtractSuggestions', () => {
    test('should sort suggestions based on quantity and weight where there is 1 suggestion', () => {
        const tag = createTagExtractWithWeight({
            'positive': 3,
            'neutral': 1,
            'negative': 2,
            'not_sure': 0,
            'impossible': 0
        });
        const extract: SentimentExtract = {
            text: 'extract',
            suggestions: [
                {
                    user_id: 'user',
                    value: 'positive'
                }
            ]
        };

        expect(tag(extract)).toEqual({
            text: 'extract',
            tag: 'positive'
        });
    });

    test('should sort suggestions based on weight and quantity where there are multiple suggestions of the same value', () => {
        const tag = createTagExtractWithWeight({
            'positive': 3,
            'neutral': 1,
            'negative': 2,
            'not_sure': 0,
            'impossible': 0
        });
        const extract: SentimentExtract = {
            text: 'extract',
            suggestions: [
                {
                    user_id: 'user',
                    value: 'positive'
                },
                {
                    user_id: 'user',
                    value: 'negative'
                },
                {
                    user_id: 'user',
                    value: 'negative'
                }
            ]
        };

        expect(tag(extract)).toEqual({
            text: 'extract',
            tag: 'negative'
        });
    });

    test('should sort suggestions based on weight and quantity where there are multiple suggestions of different values', () => {
        const tag = createTagExtractWithWeight({
            'positive': 0,
            'neutral': 1,
            'negative': 2,
            'not_sure': 3,
            'impossible': 0
        });
        const extract: SentimentExtract = {
            text: 'extract',
            suggestions: [
                {
                    user_id: 'user',
                    value: 'positive'
                },
                {
                    user_id: 'user',
                    value: 'neutral'
                },
                {
                    user_id: 'user',
                    value: 'negative'
                },
                {
                    user_id: 'user',
                    value: 'not_sure'
                }
            ]
        };

        expect(tag(extract)).toEqual({
            text: 'extract',
            tag: 'not_sure'
        });
    });
});
