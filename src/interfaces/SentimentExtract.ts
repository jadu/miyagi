export interface SentimentExtract {
    text: string;
    _id?: string;
    suggestions: Suggestion[];
}

export interface Suggestion {
    user_id: string;
    value: string;
}
