export interface UserProfile {
    id: string;
    username: string;
    email: string;
    [key: string]: any;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    usernameOrEmail: string;
    password: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}
