export interface Channel {
    members: any[],
    name: string,
    id: StringConstructor
};

export interface UserResponse {
    user: Member
};

export interface ImOpenResponse {
    channel: Channel
};

export interface Member {
    is_bot: boolean,
    name: string,
    id: string,
    real_name: string
};

export interface SentimentExtract {
    text: string,
    id: string
}