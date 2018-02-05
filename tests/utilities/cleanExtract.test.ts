import { SentimentExtract } from "../../src/interfaces/SentimentExtract";
import { removeRedactedChars, normalizeSpaces } from "../../src/utilities/extracts";

describe('removeRedactedChars', () => {
    test('should remove redacted characters from a string', () => {
        const extract: SentimentExtract = {
            text: 'This is a redacted ********** extract',
            suggestions: []
        };

        expect(removeRedactedChars(extract).text).toEqual('This is a redacted  extract');
    });

    test('should support a custom redaction character', () => {
        const extract: SentimentExtract = {
            text: 'This is a redacted $$$$$$$$ extract',
            suggestions: []
        };

        expect(removeRedactedChars(extract, '$').text).toEqual('This is a redacted  extract');
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
