export interface User {
    is_bot: boolean;
    name: string;
    id: string;
    real_name: string;
}

export interface UserResponse {
    user: User;
}
