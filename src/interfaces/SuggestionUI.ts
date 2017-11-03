export interface SuggestionUI {
    handler: (key: string) => void;
    icon: string;
    value: string;
    shortcut: number;
    keypress: string;
}

export interface SuggestionsUI {
    [index: string]: SuggestionUI;
}
