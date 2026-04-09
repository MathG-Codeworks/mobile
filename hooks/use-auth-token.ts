import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/config/api';
import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';

// Función helper para decodificar base64 en React Native
const decodeBase64 = (str: string): string => {
    try {
        return decodeURIComponent(atob(str).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch {
        return '';
    }
};

interface UseAuthTokenReturn {
    getAccessToken: () => Promise<string | null>;
    getRefreshToken: () => Promise<string | null>;
    saveToken: (accessToken: string, refreshToken: string) => Promise<boolean>;
    deleteTokens: () => Promise<void>;
    isTokenValid: (token?: string | null) => boolean;
    hasToken: () => Promise<boolean>;
}

export function useAuthToken(): UseAuthTokenReturn {
    const getAccessToken = useCallback(async (): Promise<string | null> => {
        try {
            const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            return token || null;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    }, []);

    const getRefreshToken = useCallback(async (): Promise<string | null> => {
        try {
            const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            return token || null;
        } catch (error) {
            console.error('Error getting refresh token:', error);
            return null;
        }
    }, []);

    const saveToken = useCallback(async (newAccessToken: string, newRefreshToken: string): Promise<boolean> => {
        try {
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
            return true;
        } catch (error) {
            console.error('Error saving tokens:', error);
            return false;
        }
    }, []);

    const deleteTokens = useCallback(async () => {
        try {
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Error deleting tokens:', error);
            throw error;
        }
    }, []);

    const isTokenValid = useCallback((tokenInput?: string | null): boolean => {
        if (!tokenInput) return false;

        try {
            // Verificar que es un JWT válido (3 partes separadas por puntos)
            const parts = tokenInput.split('.');
            if (parts.length !== 3) return false;

            // Decodificar el payload (segunda parte)
            const payload = JSON.parse(decodeBase64(parts[1]));

            // Verificar si el token ha expirado
            if (payload.exp) {
                const expirationTime = payload.exp * 1000;
                return Date.now() < expirationTime;
            }

            return true;
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    }, []);

    const hasToken = useCallback(async (): Promise<boolean> => {
        const token = await getAccessToken();
        return token !== null;
    }, []);

    return {
        getAccessToken,
        getRefreshToken,
        saveToken,
        deleteTokens,
        isTokenValid,
        hasToken,
    };
}