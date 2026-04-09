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
    logout: () => Promise<boolean>;
    logoutAll: () => Promise<boolean>;
    changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
}

const AuthProfileContext = createContext<AuthProfileContextType | undefined>(undefined);

export function AuthProfileProvider({ children }: { children: ReactNode }) {
    const { getAccessToken, getRefreshToken, deleteTokens } = useAuthToken();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
        const accessToken = await getAccessToken();

        if (!accessToken || profile) {
            return null;
        }

        console.log("fetch");

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
    }, [getAccessToken, profile]);

    const patchProfile = useCallback(async (username?: string, email?: string): Promise<UserProfile | null> => {
        const accessToken = await getAccessToken();

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
    }, [getAccessToken]);

    const logout = useCallback(async (): Promise<boolean> => {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        if (!accessToken || !refreshToken) {
            return false;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await authenticatedFetch(API_ENDPOINTS.logout, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: refreshToken,
                    accessToken: accessToken
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = Array.isArray(errorData.message)
                    ? errorData.message[0]
                    : errorData.message || `Error: ${response.status}`;
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            setProfile(null);
            await deleteTokens();

            return true;
        } catch (error) {
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [getAccessToken, getRefreshToken, deleteTokens]);

    const logoutAll = useCallback(async (): Promise<boolean> => {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return false;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await authenticatedFetch(API_ENDPOINTS.logoutAll, {
                method: 'POST',
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

            setProfile(null);
            await deleteTokens();
            
            return true;
        } catch (error) {
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [getAccessToken, deleteTokens]);

    const changePassword = useCallback(
        async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<boolean> => {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                return false;
            }

            if (newPassword !== confirmPassword) {
                setError('Las nuevas contraseñas no coinciden');
                return false;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await authenticatedFetch(API_ENDPOINTS.changePassword, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "currentPassword": currentPassword,
                        "newPassword": newPassword,
                        "confirmNewPassword": confirmPassword,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = Array.isArray(errorData.message)
                        ? errorData.message[0]
                        : errorData.message || `Error: ${response.status}`;
                    setError(errorMessage);
                    throw new Error(errorMessage);
                }

                setProfile(null);
                await deleteTokens();

                return true;
            } catch (error) {
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [getAccessToken, deleteTokens]
    );

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
        logout,
        logoutAll,
        changePassword,
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
