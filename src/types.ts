export interface Channel {
    members: any[];
    name: string;
    id: StringConstructor;
}

export interface UserResponse {
    user: Member;
}

export interface ImOpenResponse {
    channel: Channel;
}

export interface Member {
    is_bot: boolean;
    name: string;
    id: string;
    real_name: string;
}

export interface Suggestion {
    user_id: string;
    value: string;
}

export interface SentimentExtract {
    text: string;
    _id?: string;
    suggestions: Suggestion[];
}

export interface Action {
    name: string;
    text: string;
    type: string;
    value: string;
}

export interface Attachment {
    text: string;
    callback_id: string;
    color?: string;
    actions?: Action[];
}

export interface Question {
    text: string;
    attachments: Attachment[];
}

export interface WebClient {

}
