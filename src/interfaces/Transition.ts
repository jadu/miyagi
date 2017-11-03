export interface Transition {
    className: string;
    next: string;
    end?: boolean;
    state?: { [index: string]: any; };
}

export interface TransitionMap {
    [index: string]: Transition;
}

export interface TransitionState {
    state: { [index: string]: any; };
    proceed: boolean;
}
