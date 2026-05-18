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

export interface UserPresitionResponse {
    total: number;
    correct: number;
    incorrect: number;
    presition: number;
}

export interface UserPresitionResponseByDay {
    date: string;
    correct: number;
    incorrect: number;
    total: number;
}

export interface UserPerformanceResponse {
    id: number;
    name: string;
    description: string;
    category: string;
    rounds: number;
    score: number;
    accuracy: number;
    position: number; 
}

export interface PredictionPayload {
    match_id: string;
    user_id: number;
    minigame_id: number;
    avg_accuracy: number;
    failed_options_ratio: number;
    consecutive_streak: number;
    session_duration: number;
    relative_score_diff: number;
}

export interface PredictionResponse {
    id: number;
    probabilidad_ganar: number;
    va_a_ganar: boolean;
}