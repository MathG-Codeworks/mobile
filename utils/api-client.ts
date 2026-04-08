import { ACCESS_TOKEN_KEY, API_ENDPOINTS, REFRESH_TOKEN_KEY } from '@/config/api';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface FetchOptions extends RequestInit {
    skipRefreshRetry?: boolean;
}

/**
 * Fetch wrapper que maneja automáticamente 401 y refresh token
 * Si una solicitud retorna 401, intenta refrescar el token y reintentar
 */
export async function authenticatedFetch(
    url: string,
    options: FetchOptions = {},
): Promise<Response> {
    const { skipRefreshRetry = false, ...fetchOptions } = options;
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    
    if (accessToken) {
        fetchOptions.headers = {
            ...fetchOptions.headers,
            Authorization: `Bearer ${accessToken}`,
        };
    }

    let response = await fetch(url, fetchOptions);

    // Si recibe 401 e intento de refresh no está deshabilitado
    if (response.status === 401 && !skipRefreshRetry) {
        try {
            const refreshed = await refreshAccessTokens();

            if (refreshed) {
                const newAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
                
                if (newAccessToken) {
                    fetchOptions.headers = {
                        ...fetchOptions.headers,
                        Authorization: `Bearer ${newAccessToken}`,
                    };
                    response = await fetch(url, fetchOptions);
                }
            } else {
                await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
                await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
                router.push('/login');
            }
        } catch (error) {
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            router.push('/login');
        }
    }

    return response;
}

/**
 * Refresca los tokens usando el refreshToken
 */
async function refreshAccessTokens(): Promise<boolean> {
    try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        
        if (!refreshToken) {
            return false;
        }

        const response = await fetch(API_ENDPOINTS.refresh, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "refreshToken": refreshToken,
                "accessToken": accessToken,
            }),
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();

        if (data.accessToken && data.refreshToken) {
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.accessToken);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refreshToken);
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
}
