import { Link, router } from 'expo-router';
import { Crown, Eye, EyeOff, LogIn, Shield, Sparkles, Sword, User } from 'lucide-react-native';
import { FormEventHandler, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';

import ErrorsModal from '@/components/errors-modal';
import { StyledText } from '@/components/styled-text';
import { ThemedView } from '@/components/themed-view';
import { API_ENDPOINTS } from '@/config/api';
import { useAuthToken } from '@/hooks/use-auth-token';

type LoginForm = {
    username: string;
    password: string;
    remember: boolean;
};

export default function LoginScreen() {
    const { saveToken, isTokenValid: checkTokenValid } = useAuthToken();
    
    const [data, setData] = useState<LoginForm>({
        username: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleInputChange = (field: keyof LoginForm, value: any) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);

        fetch(API_ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usernameOrEmail: data.username,
                    password: data.password
                })
            })
                .then(async (response) => {
                    const responseData = await response.json();
                    if (response.ok) {
                        if (responseData.access_token && checkTokenValid(responseData.access_token)) {
                            try {
                                await saveToken(responseData.access_token);
                                router.push('/private/(tabs)');
                            } catch (error) {
                                setErrorMessages(['Error en el sevidor. Por favor intenta de nuevo.']);
                                setShowErrorModal(true);
                            }
                        } else {
                            setErrorMessages(['Error en el sevidor. Por favor intenta de nuevo.']);
                            setShowErrorModal(true);
                        }
                    } else {
                        if (responseData.message && Array.isArray(responseData.message)) {
                            setErrorMessages(responseData.message);
                        } else if (responseData.message) {
                            setErrorMessages([responseData.message]);
                        } else {
                            setErrorMessages(['Error en el registro. Por favor intenta de nuevo.']);
                        }
                        setShowErrorModal(true);
                    }
                })
                .catch((error) => {
                    setErrorMessages(['Error de conexión. Por favor intenta de nuevo.']);
                    setShowErrorModal(true);
                })
                .finally(() => {
                    setProcessing(false);
                });
    };

    return (
        <ThemedView className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden flex-1">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className="relative z-10"
                showsVerticalScrollIndicator={false}
            >
                {/* Background decorative elements */}
                <View className="absolute inset-0 overflow-hidden pointer-events-none">
                    <View className="absolute top-10 left-10 opacity-20">
                        <Crown size={128} color="#d8b4fe" />
                    </View>
                    <View className="absolute top-20 right-20 opacity-20 rotate-45">
                        <Sword size={96} color="#a78bfa" />
                    </View>
                    <View className="absolute bottom-20 left-20 opacity-20">
                        <Shield size={112} color="#d8b4fe" />
                    </View>
                    <View className="absolute bottom-10 right-10 opacity-20">
                        <Sparkles size={80} color="#a78bfa" />
                    </View>
                    <View className="absolute top-1/4 left-1/3 opacity-40">
                        <Sparkles size={16} color="#a78bfa" />
                    </View>
                    <View className="absolute top-1/3 right-1/4 opacity-40">
                        <Sparkles size={12} color="#d8b4fe" />
                    </View>
                    <View className="absolute bottom-1/3 left-1/4 opacity-40">
                        <Sparkles size={20} color="#c084fc" />
                    </View>
                </View>

                {/* Background blur effects */}
                <View className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: -192 }, { translateY: -192 }] }} />
                <View className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: 192 }, { translateY: 192 }] }} />

                {/* Main content */}
                <View className="flex-1 justify-center items-center px-3 md:px-6 py-8">
                    <View className="w-full max-w-md">
                        {/* Header section */}
                        <View className="text-center mb-8">
                            <StyledText className="text-5xl font-bold text-white text-center">
                                MathG
                            </StyledText>
                            <StyledText className="text-2xl text-purple-200 mb-2 tracking-wider font-semibold text-center">
                                Bienvenido, Héroe as
                            </StyledText>
                        </View>

                        {/* Form container */}
                        <View className="bg-white/10 backdrop-blur-lg border border-purple-300/30 rounded-3xl py-8 px-4 md:p-8 shadow-2xl">
                            <View className="space-y-6">
                                {/* Username field */}
                                <View className="mb-4">
                                    <StyledText className="text-xl leading-4 tracking-wider text-purple-100 font-semibold mb-2">
                                        Nombre de Usuario
                                    </StyledText>
                                    <View className="relative">
                                        <TextInput
                                            placeholder="Tu nombre de héroe"
                                            value={data.username}
                                            onChangeText={(value) => handleInputChange('username', value)}
                                            editable={!processing}
                                            placeholderTextColor="#d8b4fe"
                                            autoComplete="username"
                                            className="bg-white/20 focus:bg-white/30 border border-purple-300/50 text-white rounded-2xl h-12 px-4 pr-12"
                                            style={{
                                                fontSize: 16,
                                                letterSpacing: 0.5,
                                            }}
                                        />
                                        <View className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <User size={20} color="#d8b4fe" />
                                        </View>
                                    </View>
                                </View>

                                {/* Password field */}
                                <View className="mb-6">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <StyledText className="text-xl leading-4 tracking-wider text-purple-100 font-semibold">
                                            Contraseña
                                        </StyledText>
                                    </View>
                                    <View className="relative">
                                        <TextInput
                                            placeholder="Tu contraseña secreta"
                                            value={data.password}
                                            onChangeText={(value) => handleInputChange('password', value)}
                                            editable={!processing}
                                            secureTextEntry={!showPassword}
                                            placeholderTextColor="#d8b4fe"
                                            autoComplete="password"
                                            className="bg-white/20 focus:bg-white/30 border border-purple-300/50 text-white rounded-2xl h-12 px-4 pr-12"
                                            style={{
                                                fontSize: 16,
                                                letterSpacing: 0.5,
                                            }}
                                        />
                                        <Pressable
                                            onPress={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 active:opacity-70"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} color="#d8b4fe" />
                                            ) : (
                                                <Eye size={20} color="#d8b4fe" />
                                            )}
                                        </Pressable>
                                    </View>
                                </View>

                                {/* Remember me checkbox */}
                                <Pressable
                                    className="flex-row items-center mb-6 active:opacity-70"
                                    onPress={() => handleInputChange('remember', !data.remember)}
                                >
                                    <View
                                        className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${data.remember
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'border-purple-300/50'
                                            }`}
                                    >
                                        {data.remember && (
                                            <StyledText className="text-white text-sm font-bold">✓</StyledText>
                                        )}
                                    </View>
                                    <StyledText className="text-purple-100 tracking-wider font-semibold">
                                        Recuérdame
                                    </StyledText>
                                </Pressable>

                                {/* Submit button */}
                                <Pressable
                                    onPress={submit as any}
                                    disabled={processing}
                                    className="w-full bg-linear-to-r from-purple-600 to-purple-700 rounded-2xl h-12 flex-row items-center justify-center gap-2 space-x-2 active:scale-95 transition-all duration-300"
                                    style={{
                                        opacity: processing ? 0.7 : 1,
                                    }}
                                >
                                    {processing ? (
                                        <>
                                            <StyledText className="text-white text-lg md:text-xl font-semibold tracking-wider">
                                                Accediendo...
                                            </StyledText>
                                            <ActivityIndicator color="white" size="small" />
                                        </>
                                    ) : (
                                        <>
                                            <StyledText className="text-white text-lg md:text-xl font-semibold tracking-wider">
                                                Iniciar Aventura
                                            </StyledText>
                                            <LogIn size={20} color="white" />
                                        </>
                                    )}
                                </Pressable>

                                {/* Register link */}
                                <View className="text-center mt-6 flex-col items-center">
                                    <StyledText className="text-purple-300 tracking-widest mb-2">
                                        ¿No tienes una cuenta?
                                    </StyledText>
                                    <Link href="/register" asChild>
                                        <Pressable className="active:opacity-70">
                                            <StyledText className="text-purple-100 font-semibold tracking-widest text-lg">
                                                Únete a la aventura aquí
                                            </StyledText>
                                        </Pressable>
                                    </Link>
                                </View>
                            </View>
                        </View>

                        {/* Footer message */}
                        <View className="text-center mt-8">
                            <StyledText className="text-purple-300 tracking-wider font-light text-lg text-center">
                                Prepárate para una experiencia épica
                            </StyledText>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <ErrorsModal
                show={showErrorModal} 
                setShow={(show) => setShowErrorModal(show)} 
                messages={errorMessages}
            />
        </ThemedView>
    );
}