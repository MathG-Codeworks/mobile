import { API_ENDPOINTS } from '@/config/api';
import { UserProfile } from '@/types';
import { authenticatedFetch } from '@/utils/api-client';
import { useCallback, useState } from 'react';
import { useAuthToken } from './use-auth-token';

interface UseAuthProfileReturn {
    profile: UserProfile | null;
    isLoading: boolean;
    fetchProfile: () => Promise<UserProfile | null>;
    clearProfile: () => void;
}

export function useAuthProfile(): UseAuthProfileReturn {
    const { accessToken } = useAuthToken();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
        console.log('[fetchProfile] Iniciando fetch de perfil');
        console.log('[fetchProfile] accessToken existe:', !!accessToken);
        
        if (!accessToken) {
            console.warn('[fetchProfile] No hay accessToken disponible');
            return null;
        }

        setIsLoading(true);
        try {
            console.log('[fetchProfile] Enviando solicitud a:', API_ENDPOINTS.profile);
            const response = await authenticatedFetch(API_ENDPOINTS.profile, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('[fetchProfile] Respuesta status:', response.status);
            console.log('[fetchProfile] Respuesta ok:', response.ok);

            if (!response.ok) {
                console.error('[fetchProfile] Error en respuesta - Status:', response.status);
                throw new Error(`Error fetching profile: ${response.status}`);
            }

            const data = await response.json();
            console.log('[fetchProfile] Datos recibidos:', data);
            
            setProfile(data);
            console.log('[fetchProfile] Perfil guardado en estado');
            return data;
        } catch (error) {
            console.error('[fetchProfile] Error:', error);
            console.error('[fetchProfile] Error message:', error instanceof Error ? error.message : 'Unknown error');
            return null;
        } finally {
            setIsLoading(false);
            console.log('[fetchProfile] Finalizando fetch');
        }
    }, [accessToken]);

    const clearProfile = useCallback(() => {
        setProfile(null);
    }, []);

    return {
        profile,
        isLoading,
        fetchProfile,
        clearProfile,
    };
}
