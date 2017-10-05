import { Channel } from './Channel';

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

export interface ImOpenResponse {
    channel: Channel;
}
