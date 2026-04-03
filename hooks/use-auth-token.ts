import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

const TOKEN_KEY = process.env.TOKEN_KEY || 'authToken';

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
    token: string | null;
    isLoading: boolean;
    saveToken: (token: string) => Promise<void>;
    getToken: () => Promise<string | null>;
    deleteToken: () => Promise<void>;
    isTokenValid: (token?: string | null) => boolean;
    hasToken: boolean;
}

export function useAuthToken(): UseAuthTokenReturn {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                setToken(storedToken || null);
            } catch (error) {
                console.error('Error loading token:', error);
                setToken(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    const saveToken = useCallback(async (newToken: string) => {
        await SecureStore.setItemAsync(TOKEN_KEY, newToken);
        setToken(newToken);
    }, []);

    const getToken = useCallback(async (): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    }, []);

    const deleteToken = useCallback(async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            setToken(null);
        } catch (error) {
            console.error('Error deleting token:', error);
            throw error;
        }
    }, []);

    const isTokenValid = useCallback((tokenInput?: string | null): boolean => {
        const tokenToValidate = tokenInput || token;

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
    }, [token]);

    return {
        token,
        isLoading,
        saveToken,
        getToken,
        deleteToken,
        isTokenValid,
        hasToken: token !== null,
    };
}