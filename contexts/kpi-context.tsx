import { API_ENDPOINTS } from '@/config/api';
import { useAuthToken } from '@/hooks/use-auth-token';
import { UserPerformanceResponse, UserPresitionResponse, UserPresitionResponseByDay } from '@/types';
import { authenticatedFetch } from '@/utils/api-client';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface KPIContextType {
    isLoading: boolean;
    error: string | null;
    userTotalTime: number;
    userPresition: any;
    userPresitionByDay: any;
    userPerformance: any;
    clearError: () => void;
    fetchUserTotalTime: () => Promise<any>;
    fetchUserPresition: () => Promise<any>;
    fetchUserPresitionByDay: () => Promise<any>;
    fetchUserPerformance: () => Promise<any>;
}

const KPIContext = createContext<KPIContextType | undefined>(undefined);

export function KPIProvider({ children }: { children: ReactNode }) {
    const { getAccessToken } = useAuthToken();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userTotalTime, setUserTotalTime] = useState<number>(0);
    const [userPresition, setUserPresition] = useState<UserPresitionResponse | null>(null);
    const [userPresitionByDay, setUserPresitionByDay] = useState<UserPresitionResponseByDay[] | null>(null);
    const [userPerformance, setUserPerformance] = useState<UserPerformanceResponse[] | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const fetchUserTotalTime = useCallback(async (): Promise<any> => {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            setError('No access token available');
            return null;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await authenticatedFetch(API_ENDPOINTS.getUserTotalTime, {
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
            setUserTotalTime(typeof data === 'number' ? Number(data) : 0);
            return data;
        } catch (error) {
            console.error('Error fetching user total time:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [getAccessToken]);

    const fetchUserPresition = useCallback(async (): Promise<any> => {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            setError('No access token available');
            return null;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await authenticatedFetch(API_ENDPOINTS.getUserPresition, {
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

            const data: UserPresitionResponse = await response.json();
            setUserPresition(data);
            return data;
        } catch (error) {
            console.error('Error fetching user presition:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [getAccessToken]);

    const fetchUserPresitionByDay = useCallback(async (): Promise<any> => {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            setError('No tienes acceso a este recurso');
            return null;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await authenticatedFetch(API_ENDPOINTS.getUserPresitionByDay, {
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

            const data: UserPresitionResponseByDay[] = await response.json();
            setUserPresitionByDay(data);
            return data;
        } catch (error) {
            console.error('Error fetching user presition by day:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [getAccessToken]);

    const fetchUserPerformance = useCallback(async (): Promise<any> => {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            setError('No access token available');
            return null;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await authenticatedFetch(API_ENDPOINTS.getUserPerformance, {
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

            const data: UserPerformanceResponse[] = await response.json();
            setUserPerformance(data);
            return data;
        } catch (error) {
            console.error('Error fetching user performance:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [getAccessToken]);

    const contextValue: KPIContextType = {
        isLoading,
        error,
        userTotalTime,
        userPresition,
        userPresitionByDay,
        userPerformance,
        clearError,
        fetchUserTotalTime,
        fetchUserPresition,
        fetchUserPresitionByDay,
        fetchUserPerformance
    };

    return (
        <KPIContext.Provider value={contextValue}>
            {children}
        </KPIContext.Provider>
    );
}

export function useKPI(): KPIContextType {
    const context = useContext(KPIContext);
    if (!context) {
        throw new Error('useKPI must be used within a KPIProvider');
    }
    return context;
}
