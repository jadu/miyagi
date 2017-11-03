export interface SentimentExtract {
    text: string;
    _id?: string;
    suggestions: Suggestion[];
}

export interface Option {
    id: string;
    value: boolean;
}

export interface Suggestion {
    name?: string;
    user_id: string;
    value: string;
    options?: Option[];
}
