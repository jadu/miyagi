export interface Channel {
    members?: any[];
    name: string;
    id: string;
}

export interface Profile {
    display_name_normalized: string;
}

export interface User {
    name: string;
    id: string;
    is_bot?: boolean;
    real_name?: string;
    profile?: Profile;
}

export interface UserResponse {
    user: User;
}

export interface Action {
    name: string;
    text: string;
    type: string;
    value?: string;
    style?: string;
}

export interface Attachment {
    text: string;
    callback_id: string;
    color?: string;
    actions?: Action[];
}

export interface Message {
    replace_original?: boolean;
    text: string;
    username?: string;
    bot_id?: string;
    type?: string;
    subtype?: string;
    ts?: string;
    attachments?: Attachment[];
}

export interface ImOpenResponse {
    channel: Channel;
}

export interface Team {
    id: string;
    domain: string;
}

export interface InteractiveComponentPayload {
    actions?: Action[];
    callback_id: string;
    team: Team;
    channel: Channel;
    user: User;
    action_ts: string;
    message_ts: string;
    attachment_id: string;
    token: string;
    is_app_unfurl: boolean;
    type: string;
    original_message: Message;
    respose_url: string;
    trigger_id: string;
}
