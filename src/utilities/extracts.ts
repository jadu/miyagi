import { SentimentExtract } from "../interfaces/SentimentExtract";

/**
 * Replace redaction characters
 * @param extract
 * @param redactionChar
 */
export function createRemoveRedactedCharacters (
    redactionCharacter: string = '*'
) {
    return (extract: SentimentExtract) => {
        const test = new RegExp(`\\${redactionCharacter}`, 'g');

        return Object.assign({}, extract, {
            text: extract.text.replace(test, '')
        });
    }
}

/**
 * Normalize extract whitespace
 * @param extract
 */
export function normalizeSpaces (
    extract: SentimentExtract
): SentimentExtract {
    return Object.assign({}, extract, {
        text: extract.text.replace(/[\s]+/g, ' ')
    });
}
