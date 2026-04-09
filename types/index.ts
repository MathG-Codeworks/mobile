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

export interface KPI {
    id: string;
    name: string;
    value: number | string;
    target?: number | string;
    unit?: string;
    lastUpdated?: string;
    [key: string]: any;
}

export interface KPIResponse {
    kpis: KPI[];
    total?: number;
    [key: string]: any;
}

export interface UserPresitionResponse {
    total: number;
    correct: number;
    incorrect: number;
    precision: number;
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