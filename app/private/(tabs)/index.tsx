import { Skeleton } from '@/components/skeleton';
import { StyledText } from '@/components/styled-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthProfile } from '@/hooks/use-auth-profile';
import { useAuthToken } from '@/hooks/use-auth-token';
import { useRouter } from 'expo-router';
import { Award, BarChart3, Sparkles, TrendingUp, Zap } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();
    const { deleteTokens } = useAuthToken();
    const { profile, isLoading, fetchProfile } = useAuthProfile();

    useEffect(() => {
        console.log('[HomeScreen] Componente montado - Iniciando fetch del perfil');
        console.log('[HomeScreen] Profile actual:', { profile, isLoading });
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = async () => {
        await deleteTokens();
        router.push('/login');
    };

    return (
        <ThemedView className="min-h-screen bg-white relative overflow-hidden flex-1">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className="relative z-10"
                showsVerticalScrollIndicator={false}
            >
                {/* Background decorative elements */}
                <View className="absolute inset-0 overflow-hidden pointer-events-none">
                    <View className="absolute top-20 right-10 opacity-10">
                        <Award size={120} color="#a78bfa" />
                    </View>
                    <View className="absolute top-1/3 left-5 opacity-15 -rotate-45">
                        <BarChart3 size={100} color="#818cf8" />
                    </View>
                    <View className="absolute bottom-32 right-5 opacity-10">
                        <TrendingUp size={110} color="#a78bfa" />
                    </View>
                    <View className="absolute bottom-40 left-20 opacity-15">
                        <Zap size={90} color="#818cf8" />
                    </View>
                    <View className="absolute top-1/4 left-1/3 opacity-20">
                        <Sparkles size={16} color="#c084fc" />
                    </View>
                    <View className="absolute top-2/3 right-1/4 opacity-20">
                        <Sparkles size={12} color="#a78bfa" />
                    </View>
                    <View className="absolute bottom-1/4 left-1/4 opacity-20">
                        <Sparkles size={20} color="#818cf8" />
                    </View>
                    <View className="absolute bottom-1/3 right-1/3 opacity-20">
                        <Sparkles size={14} color="#d8b4fe" />
                    </View>
                </View>

                {/* Background blur effects */}
                <View className="absolute top-0 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: 160 }, { translateY: -160 }] }} />
                <View className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: -192 }, { translateY: 192 }] }} />

                {/* Main content */}
                <View className="px-4 pt-6 pb-8">
                    {/* Header con bienvenida */}
                    <View className="mb-8">
                        <View className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/40 rounded-3xl p-6 shadow-sm">
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1">
                                    <StyledText className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">
                                        ¡Bienvenido!
                                    </StyledText>
                                    {isLoading ? (
                                        <Skeleton width={180} height={28} borderRadius={6} />
                                    ) : (
                                        <>
                                            {console.log('[HomeScreen] Profile state:', { profile, isLoading })}
                                            <StyledText className="text-xl text-purple-700 font-semibold tracking-wide">
                                                {profile?.username || 'Usuario'}
                                            </StyledText>
                                        </>
                                    )}
                                </View>
                                <View className="opacity-30">
                                    <Award size={48} color="#a78bfa" />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Resumen Section */}
                    <View className="mb-8">
                        <StyledText className="text-2xl font-bold text-gray-900 mb-4 px-2">
                            Resumen
                        </StyledText>

                        {/* Grid de gráficas - Primera fila */}
                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1 bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200/50 rounded-2xl overflow-hidden shadow-sm">
                                <View className="flex-row items-center justify-between p-4">
                                    <View className="flex-1">
                                        <Skeleton width="100%" height={120} borderRadius={12} />
                                    </View>
                                </View>
                            </View>
                            <View className="flex-1 bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-200/50 rounded-2xl overflow-hidden shadow-sm">
                                <View className="flex-row items-center justify-between p-4">
                                    <View className="flex-1">
                                        <Skeleton width="100%" height={120} borderRadius={12} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Grid de gráficas - Segunda fila */}
                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1 bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200/50 rounded-2xl overflow-hidden shadow-sm">
                                <View className="flex-row items-center justify-between p-4">
                                    <View className="flex-1">
                                        <Skeleton width="100%" height={120} borderRadius={12} />
                                    </View>
                                </View>
                            </View>
                            <View className="flex-1 bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200/50 rounded-2xl overflow-hidden shadow-sm">
                                <View className="flex-row items-center justify-between p-4">
                                    <View className="flex-1">
                                        <Skeleton width="100%" height={120} borderRadius={12} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Quick Stats Section */}
                    <View className="mb-8">
                        <StyledText className="text-2xl font-bold text-gray-900 mb-4 px-2">
                            Estadísticas Rápidas
                        </StyledText>
                        <View className="flex-row gap-3">
                            <View className="flex-1 bg-white border border-purple-200/30 rounded-2xl p-4 items-center justify-center">
                                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                                    <TrendingUp size={24} color="#a78bfa" />
                                </View>
                                <Skeleton width={60} height={16} borderRadius={4} />
                                <StyledText className="text-xs text-gray-500 mt-2 text-center">
                                    Progreso
                                </StyledText>
                            </View>
                            <View className="flex-1 bg-white border border-indigo-200/30 rounded-2xl p-4 items-center justify-center">
                                <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mb-2">
                                    <Zap size={24} color="#818cf8" />
                                </View>
                                <Skeleton width={60} height={16} borderRadius={4} />
                                <StyledText className="text-xs text-gray-500 mt-2 text-center">
                                    Racha
                                </StyledText>
                            </View>
                            <View className="flex-1 bg-white border border-pink-200/30 rounded-2xl p-4 items-center justify-center">
                                <View className="w-12 h-12 bg-pink-100 rounded-full items-center justify-center mb-2">
                                    <Award size={24} color="#ec4899" />
                                </View>
                                <Skeleton width={60} height={16} borderRadius={4} />
                                <StyledText className="text-xs text-gray-500 mt-2 text-center">
                                    Logros
                                </StyledText>
                            </View>
                        </View>
                    </View>

                    {/* Logout Button */}
                    <View className="px-2 pb-4">
                        <Pressable
                            onPress={handleLogout}
                            className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl h-14 flex-row items-center justify-center active:scale-95 transition-all duration-300 shadow-lg shadow-red-500/25"
                        >
                            <StyledText className="text-white text-lg font-semibold tracking-wider">
                                Cerrar Sesión
                            </StyledText>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}
