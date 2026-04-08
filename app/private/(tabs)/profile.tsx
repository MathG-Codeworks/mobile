import EditProfileModal from '@/components/edit-profile-modal';
import { ErrorModal } from '@/components/error-modal';
import { Skeleton } from '@/components/skeleton';
import { StyledText } from '@/components/styled-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthProfile } from '@/contexts/auth-profile-context';
import { Edit3, Mail, Shield, Sparkles, Star, Trophy, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function ProfileScreen() {
    const { profile, isLoading, fetchProfile, patchProfile, error, clearError } = useAuthProfile();
    const [editingType, setEditingType] = useState<"username" | "email" | null>(null);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSaveChanges = async (username?: string, email?: string) => {
        await patchProfile(username, email);
        setEditingType(null);
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
                        <Trophy size={120} color="#a78bfa" />
                    </View>
                    <View className="absolute top-1/3 left-5 opacity-15 -rotate-45">
                        <Shield size={100} color="#818cf8" />
                    </View>
                    <View className="absolute bottom-32 right-5 opacity-10">
                        <Star size={110} color="#a78bfa" />
                    </View>
                    <View className="absolute bottom-40 left-20 opacity-15">
                        <User size={90} color="#818cf8" />
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
                            Mi Perfil
                        </StyledText>
                        <StyledText className="text-gray-600 tracking-wide">
                            Información de tu cuenta
                        </StyledText>
                    </View>

                    {/* Profile Card Principal */}
                    <View className="bg-linear-to-br from-purple-50 to-indigo-50 border border-purple-200/40 rounded-3xl p-6 shadow-sm mb-6">
                        <View className="flex-row items-center">
                            <View className="w-16 h-16 bg-linear-to-br from-purple-400 to-indigo-500 rounded-full items-center justify-center mr-4">
                                <User size={32} color="white" />
                            </View>
                            <View className="flex-1">
                                {isLoading ? (
                                    <>
                                        <Skeleton width={120} height={24} borderRadius={6} />
                                        <Skeleton width={100} height={16} borderRadius={6} style={{ marginTop: 8 }} />
                                    </>
                                ) : (
                                    <>
                                        <StyledText className="text-2xl font-bold text-purple-900">
                                            {profile?.username || 'Usuario'}
                                        </StyledText>
                                        <StyledText className="text-sm text-purple-700 mt-1">
                                            Perfil Activo
                                        </StyledText>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Información Detallada */}
                    <StyledText className="text-xl font-bold text-gray-900 mb-4 px-2">
                        Información
                    </StyledText>

                    {isLoading ? (
                        <>
                            <View className="bg-white border border-purple-200/30 rounded-2xl p-5 mb-3">
                                <Skeleton width="40%" height={14} borderRadius={4} />
                                <Skeleton width="80%" height={18} borderRadius={4} style={{ marginTop: 8 }} />
                            </View>
                            <View className="bg-white border border-indigo-200/30 rounded-2xl p-5 mb-3">
                                <Skeleton width="40%" height={14} borderRadius={4} />
                                <Skeleton width="80%" height={18} borderRadius={4} style={{ marginTop: 8 }} />
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Username Card */}
                            <View className="bg-white border border-purple-200/30 rounded-2xl p-5 mb-3">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1 flex-row items-center">
                                        <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-3">
                                            <User size={24} color="#a78bfa" />
                                        </View>
                                        <View className="flex-1">
                                            <StyledText className="text-sm font-bold text-purple-700 tracking-widest">
                                                USUARIO
                                            </StyledText>
                                            <StyledText className="text-lg font-semibold text-gray-900">
                                                {profile?.username}
                                            </StyledText>
                                        </View>
                                    </View>
                                    <Pressable
                                        onPress={() => setEditingType("username")}
                                        className="p-2 active:scale-95"
                                    >
                                        <Edit3 size={20} color="#a78bfa" />
                                    </Pressable>
                                </View>
                            </View>

                            {/* Email Card */}
                            <View className="bg-white border border-indigo-200/30 rounded-2xl p-5 mb-3">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1 flex-row items-center">
                                        <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mr-3">
                                            <Mail size={24} color="#818cf8" />
                                        </View>
                                        <View className="flex-1">
                                            <StyledText className="text-sm font-bold text-indigo-700 tracking-widest">
                                                EMAIL
                                            </StyledText>
                                            <StyledText className="text-lg font-semibold text-gray-900 wrap-break-word">
                                                {profile?.email}
                                            </StyledText>
                                        </View>
                                    </View>
                                    <Pressable
                                        onPress={() => setEditingType("email")}
                                        className="p-2 active:scale-95"
                                    >
                                        <Edit3 size={20} color="#818cf8" />
                                    </Pressable>
                                </View>
                            </View>
                        </>
                    )}

                    {/* Stats Section */}
                    <View className="mt-8 mb-8">
                        <StyledText className="text-xl font-bold text-gray-900 mb-4 px-2">
                            Estadísticas
                        </StyledText>
                        <View className="flex-row gap-3">
                            <View className="flex-1 bg-linear-to-br from-purple-100 to-purple-50 border border-purple-200/50 rounded-2xl p-4 items-center justify-center">
                                <View className="w-10 h-10 bg-purple-200 rounded-full items-center justify-center mb-2">
                                    <Trophy size={20} color="#a78bfa" />
                                </View>
                                <Skeleton width={40} height={14} borderRadius={4} />
                                <StyledText className="text-xs text-gray-600 mt-2">
                                    Logros
                                </StyledText>
                            </View>
                            <View className="flex-1 bg-linear-to-br from-indigo-100 to-indigo-50 border border-indigo-200/50 rounded-2xl p-4 items-center justify-center">
                                <View className="w-10 h-10 bg-indigo-200 rounded-full items-center justify-center mb-2">
                                    <Star size={20} color="#818cf8" />
                                </View>
                                <Skeleton width={40} height={14} borderRadius={4} />
                                <StyledText className="text-xs text-gray-600 mt-2">
                                    Nivel
                                </StyledText>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <EditProfileModal
                show={editingType !== null}
                setShow={(show) => !show && setEditingType(null)}
                editType={editingType}
                currentValue={editingType === "username" ? profile?.username || "" : profile?.email || ""}
                onSave={handleSaveChanges}
            />

            <ErrorModal
                visible={error !== null}
                title="Error al actualizar perfil"
                message={error || ""}
                onClose={clearError}
            />
        </ThemedView>
    );
}
