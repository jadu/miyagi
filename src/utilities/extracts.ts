import { SentimentExtract, PreparedSentimentExtract, SuggestionWeightMap, Suggestion, suggestions } from '../interfaces/SentimentExtract';

/**
 * Filter extracts with no suggestions
 * @param extract
 */
export function filterExtractsWithoutSuggestions (
    extract: SentimentExtract
): boolean {
    return extract.suggestions.length > 0;
}

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

/**
 * Create function to sort suggestions based on a weighted map
 * @param suggestionWeightMap
 */
export function createTagExtractWithWeight (
    suggestionWeightMap: SuggestionWeightMap
) {
    return (extract: SentimentExtract): PreparedSentimentExtract => {
        // Create sortable suggestions array from weight map
        const sortableSuggestions: [suggestions, number][] = Object.keys(suggestionWeightMap).map((suggestion: string) => {
            return [ suggestion, 0 ] as [ suggestions, number ];
        });

        // Increase sortable suggestions count based on weight
        extract.suggestions.forEach((suggestion: Suggestion) => {
            const sortableSuggestion: [suggestions, number] = sortableSuggestions.find((s: [suggestions, number]) =>
                s[0] === suggestion.value);

            sortableSuggestion[1] += suggestionWeightMap[suggestion.value];
        });

        // Sort suggestions based on count
        const sortedSuggestions: [suggestions, number][] = sortableSuggestions.sort((a, b) => a[1] - b[1]);

        // Return suggestion with highest count
        return {
            text: extract.text,
            tag: sortedSuggestions.pop()[0]
        }
    }
}
