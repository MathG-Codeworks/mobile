import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/config/api';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

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
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    saveToken: (accessToken: string, refreshToken: string) => Promise<void>;
    getTokens: () => Promise<{ accessToken: string | null; refreshToken: string | null }>;
    deleteTokens: () => Promise<void>;
    isTokenValid: (token?: string | null) => boolean;
    hasToken: boolean;
}

export function useAuthToken(): UseAuthTokenReturn {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTokens = async () => {
            try {
                const storedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
                const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
                setAccessToken(storedAccessToken || null);
                setRefreshToken(storedRefreshToken || null);
            } catch (error) {
                console.error('Error loading tokens:', error);
                setAccessToken(null);
                setRefreshToken(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadTokens();
    }, []);

    const saveToken = useCallback(async (newAccessToken: string, newRefreshToken: string) => {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
    }, []);

    const getTokens = useCallback(async (): Promise<{ accessToken: string | null; refreshToken: string | null }> => {
        try {
            const storedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            return {
                accessToken: storedAccessToken || null,
                refreshToken: storedRefreshToken || null,
            };
        } catch (error) {
            console.error('Error getting tokens:', error);
            return { accessToken: null, refreshToken: null };
        }
    }, []);

    const deleteTokens = useCallback(async () => {
        try {
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            setAccessToken(null);
            setRefreshToken(null);
        } catch (error) {
            console.error('Error deleting tokens:', error);
            throw error;
        }
    }, []);

    const isTokenValid = useCallback((tokenInput?: string | null): boolean => {
        const tokenToValidate = tokenInput || accessToken;

        if (!tokenToValidate) return false;

        try {
            // Verificar que es un JWT válido (3 partes separadas por puntos)
            const parts = tokenToValidate.split('.');
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
    }, [accessToken]);

    return {
        accessToken,
        refreshToken,
        isLoading,
        saveToken,
        getTokens,
        deleteTokens,
        isTokenValid,
        hasToken: accessToken !== null,
    };
}