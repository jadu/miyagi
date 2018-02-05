import { SentimentExtract } from "../../src/interfaces/SentimentExtract";
import { createRemoveRedactedCharacters, normalizeSpaces } from "../../src/utilities/extracts";

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
