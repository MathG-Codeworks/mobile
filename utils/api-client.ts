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
    console.log('[authenticatedFetch] Iniciando solicitud a:', url);
    const { skipRefreshRetry = false, ...fetchOptions } = options;

    // Agregar token de autenticación
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    console.log('[authenticatedFetch] accessToken disponible:', !!accessToken);
    
    if (accessToken) {
        fetchOptions.headers = {
            ...fetchOptions.headers,
            Authorization: `Bearer ${accessToken}`,
        };
        console.log('[authenticatedFetch] Header Authorization agregado');
    }

    let response = await fetch(url, fetchOptions);
    console.log('[authenticatedFetch] Respuesta inicial - Status:', response.status);

    // Si recibe 401 e intento de refresh no está deshabilitado
    if (response.status === 401 && !skipRefreshRetry) {
        console.warn('[authenticatedFetch] Recibió 401 - Intentando refrescar tokens');
        try {
            const refreshed = await refreshAccessTokens();
            console.log('[authenticatedFetch] Refresh tokens resultado:', refreshed);

            if (refreshed) {
                // Reintentar con nuevo token
                const newAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
                console.log('[authenticatedFetch] Nuevo accessToken obtenido:', !!newAccessToken);
                
                if (newAccessToken) {
                    fetchOptions.headers = {
                        ...fetchOptions.headers,
                        Authorization: `Bearer ${newAccessToken}`,
                    };
                    console.log('[authenticatedFetch] Reintentando solicitud con nuevo token');
                    response = await fetch(url, fetchOptions);
                    console.log('[authenticatedFetch] Respuesta del reintento - Status:', response.status);
                }
            } else {
                console.error('[authenticatedFetch] Refresh fallido - Limpiando tokens y redirigiendo a login');
                await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
                await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
                router.push('/login');
            }
        } catch (error) {
            console.error('[authenticatedFetch] Error durante refresh:', error);
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            router.push('/login');
        }
    }

    console.log('[authenticatedFetch] Retornando respuesta final - Status:', response.status);
    return response;
}

/**
 * Refresca los tokens usando el refreshToken
 */
async function refreshAccessTokens(): Promise<boolean> {
    console.log('[refreshAccessTokens] Iniciando refresh de tokens');
    try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

        console.log('[refreshAccessTokens] refreshToken disponible:', !!refreshToken);
        console.log('[refreshAccessTokens] accessToken actual disponible:', !!accessToken);
        
        if (!refreshToken) {
            console.warn('[refreshAccessTokens] No hay refreshToken disponible');
            return false;
        }

        console.log('[refreshAccessTokens] Enviando solicitud a:', API_ENDPOINTS.refresh);
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

        console.log('[refreshAccessTokens] Respuesta status:', response.status);
        console.log('[refreshAccessTokens] Respuesta ok:', response.ok);

        if (!response.ok) {
            console.error('[refreshAccessTokens] Error en respuesta:', response.status);
            return false;
        }

        const data = await response.json();
        console.log('[refreshAccessTokens] Datos recibidos:', { 
            hasAccessToken: !!data.accessToken, 
            hasRefreshToken: !!data.refreshToken 
        });

        if (data.accessToken && data.refreshToken) {
            console.log('[refreshAccessTokens] Guardando nuevos tokens');
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.accessToken);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refreshToken);
            console.log('[refreshAccessTokens] Tokens guardados exitosamente');
            return true;
        }

        console.warn('[refreshAccessTokens] Respuesta no contiene ambos tokens');
        return false;
    } catch (error) {
        console.error('[refreshAccessTokens] Error:', error);
        console.error('[refreshAccessTokens] Error message:', error instanceof Error ? error.message : 'Unknown error');
        return false;
    }
}
