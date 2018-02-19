export interface SentimentExtract {
    text: string;
    _id?: string;
    has_suggestion?: boolean;
    suggestions: Suggestion[];
}

export interface Option {
    id: string;
    value: boolean;
}

export interface Suggestion {
    name?: string;
    user_id: string;
    value: suggestions;
    options?: Option[];
}

export interface PreparedSentimentExtract {
    text: string;
    tag: string;
}

export interface SuggestionWeightMap {
    'positive': number;
    'neutral': number;
    'negative': number;
    'not_sure': number;
    'impossible': number;
}

export type suggestions = 'positive'|'neutral'|'negative'|'not_sure'|'impossible';
