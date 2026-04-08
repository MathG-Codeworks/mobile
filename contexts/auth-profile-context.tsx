import { API_ENDPOINTS } from '@/config/api';
import { useAuthToken } from '@/hooks/use-auth-token';
import { UserProfile } from '@/types';
import { authenticatedFetch } from '@/utils/api-client';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface AuthProfileContextType {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<UserProfile | null>;
    patchProfile: (username?: string, email?: string) => Promise<UserProfile | null>;
    clearProfile: () => void;
    clearError: () => void;
}

const AuthProfileContext = createContext<AuthProfileContextType | undefined>(undefined);

export function AuthProfileProvider({ children }: { children: ReactNode }) {
    const { accessToken } = useAuthToken();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
        if (!accessToken) {
            return null;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await authenticatedFetch(API_ENDPOINTS.profile, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = Array.isArray(errorData.message)
                    ? errorData.message[0]
                    : errorData.message || `Error: ${response.status}`;
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            const data = await response.json();

            setProfile(data);
            return data;
        } catch (error) {
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    const patchProfile = useCallback(async (username?: string, email?: string): Promise<UserProfile | null> => {
        if (!accessToken) {
            return null;
        }

        setIsLoading(true);
        setError(null);
        try {
            const body: Partial<UserProfile> = {};

            if (username !== undefined && username.trim() !== '') body.username = username;
            if (email !== undefined && email.trim() !== '') body.email = email;

            const response = await authenticatedFetch(API_ENDPOINTS.patchProfile, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = Array.isArray(errorData.message)
                    ? errorData.message[0]
                    : errorData.message || `Error: ${response.status}`;
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setProfile(data);
            return data;
        } catch (error) {
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    const clearProfile = useCallback(() => {
        setProfile(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthProfileContextType = {
        profile,
        isLoading,
        error,
        fetchProfile,
        patchProfile,
        clearProfile,
        clearError,
    };

    return (
        <AuthProfileContext.Provider value={value}>
            {children}
        </AuthProfileContext.Provider>
    );
}

export function useAuthProfile(): AuthProfileContextType {
    const context = useContext(AuthProfileContext);
    if (!context) {
        throw new Error('useAuthProfile must be used within AuthProfileProvider');
    }
    return context;
}
