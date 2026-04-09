const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
	register: `${API_URL}/auth/register`,
	login: `${API_URL}/auth/login`,
	refresh: `${API_URL}/auth/refresh`,
	profile: `${API_URL}/auth/profile`,
	patchProfile: `${API_URL}/auth/profile`,
	logout: `${API_URL}/auth/logout`,
	logoutAll: `${API_URL}/auth/logout-all`,
	changePassword: `${API_URL}/auth/change-password`,
	getUserTotalTime: `${API_URL}/session/user/total-time`,
	getUserPresition: `${API_URL}/attemp/user/presition`,
	getUserPresitionByDay: `${API_URL}/attemp/user/by-day`,
	getUserPerformance: `${API_URL}/minigame/user/performance`,
};

export const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || 'accessToken';
export const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY || 'refreshToken';

