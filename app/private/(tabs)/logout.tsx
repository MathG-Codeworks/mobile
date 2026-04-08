import { useAuthToken } from '@/hooks/use-auth-token';
import { useRouter } from 'expo-router';
import { LogOut, Settings, Shield, Sparkles, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import ChangePasswordModal from '@/components/change-password-modal';
import { StyledText } from '@/components/styled-text';
import { ThemedView } from '@/components/themed-view';

export default function LogoutScreen() {
    const router = useRouter();
    const { deleteTokens } = useAuthToken();
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleLogout = async () => {
        await deleteTokens();
        router.push('/login');
    };

    const handleChangePassword = async (currentPassword: string, newPassword: string) => {
        // TODO: Implementar llamada API para cambiar contraseña
        console.log('Cambiar contraseña:', { currentPassword, newPassword });
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
                        <Settings size={120} color="#a78bfa" />
                    </View>
                    <View className="absolute top-1/3 left-5 opacity-15 -rotate-45">
                        <Shield size={100} color="#818cf8" />
                    </View>
                    <View className="absolute bottom-32 right-5 opacity-10">
                        <LogOut size={110} color="#a78bfa" />
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
                <View className="px-4 pt-10 pb-20">
                    {/* Header */}
                    <View className="mb-8">
                        <StyledText className="text-4xl font-bold text-purple-900 mb-1">
                            Configuración
                        </StyledText>
                        <StyledText className="text-gray-600 tracking-wide">
                            Gestiona tu sesión
                        </StyledText>
                    </View>

                    {/* Quick Actions */}
                    <View className="mb-8">
                        <StyledText className="text-xl font-bold text-gray-900 mb-4 px-2">
                            Opciones Rápidas
                        </StyledText>

                        {/* Close All Sessions Option */}
                        <Pressable className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/40 rounded-2xl p-5 mb-3 flex-row items-center justify-between active:scale-95 transition-all">
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 bg-blue-200 rounded-full items-center justify-center mr-4">
                                    <Shield size={24} color="#0284c7" />
                                </View>
                                <View>
                                    <StyledText className="text-lg font-semibold text-gray-900">
                                        Cerrar todas las sesiones
                                    </StyledText>
                                    <StyledText className="text-xs text-gray-600 mt-1">
                                        Desconecta todos tus dispositivos
                                    </StyledText>
                                </View>
                            </View>
                        </Pressable>

                        {/* Change Password Option */}
                        <Pressable
                            onPress={() => setShowChangePassword(true)}
                            className="bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/40 rounded-2xl p-5 mb-3 flex-row items-center justify-between active:scale-95 transition-all"
                        >
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 bg-purple-200 rounded-full items-center justify-center mr-4">
                                    <Settings size={24} color="#a78bfa" />
                                </View>
                                <View>
                                    <StyledText className="text-lg font-semibold text-gray-900">
                                        Cambiar contraseña
                                    </StyledText>
                                    <StyledText className="text-xs text-gray-600 mt-1">
                                        Actualiza tu contraseña
                                    </StyledText>
                                </View>
                            </View>
                        </Pressable>
                    </View>

                    {/* Session Management */}
                    <View className="mb-8">
                        <StyledText className="text-xl font-bold text-gray-900 mb-4 px-2">
                            Sesión
                        </StyledText>

                        {/* Logout Button */}
                        <Pressable
                            onPress={handleLogout}
                            className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl h-14 flex-row items-center justify-center gap-2 active:scale-95 transition-all duration-300 shadow-lg shadow-red-500/25 mb-2"
                        >
                            <LogOut size={20} color="white" />
                            <StyledText className="text-white text-lg font-semibold tracking-wider">
                                Cerrar Sesión
                            </StyledText>
                        </Pressable>

                        {/* Info Footer */}
                        <View className="bg-gray-50 border border-gray-200/30 rounded-2xl p-4 flex flex-col items-center mt-6">
                            <StyledText className="text-xs text-gray-600 text-center">
                                ¿Necesitas ayuda?
                            </StyledText>
                            <StyledText className="text-xs text-gray-600 text-center">
                                Contacta con nuestro equipo de soporte
                            </StyledText>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <ChangePasswordModal
                show={showChangePassword}
                setShow={setShowChangePassword}
                onSave={handleChangePassword}
            />
        </ThemedView>
    );
}
