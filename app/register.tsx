import ErrorsModal from '@/components/errors-modal';
import { StyledText } from '@/components/styled-text';
import { ThemedView } from '@/components/themed-view';
import { API_ENDPOINTS } from '@/config/api';
import { Link, useRouter } from 'expo-router';
import { fetch } from 'expo/fetch';
import { Crown, Eye, EyeOff, Mail, Shield, Sparkles, Sword, User } from 'lucide-react-native';
import { FormEventHandler, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';

type RegisterForm = {
    username: string;
    email: string;
    password: string;
};

export default function RegisterScreen() {
    const router = useRouter();
    const [data, setData] = useState<RegisterForm>({
        username: '',
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleInputChange = (field: keyof RegisterForm, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);

        fetch(API_ENDPOINTS.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password
            })
        })
            .then(async (response) => {
                const responseData = await response.json();
                if (response.ok) {
                    router.push('/login');
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
        <ThemedView className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-800 to-purple-900 relative overflow-hidden flex-1">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className="relative z-10"
                showsVerticalScrollIndicator={false}
            >
                {/* Background decorative elements */}
                <View className="absolute inset-0 overflow-hidden pointer-events-none">
                    <View className="absolute top-10 right-10 opacity-20">
                        <Crown size={128} color="#c7d2fe" />
                    </View>
                    <View className="absolute top-20 left-20 opacity-20 -rotate-45">
                        <Sword size={96} color="#a78bfa" />
                    </View>
                    <View className="absolute bottom-20 right-20 opacity-20">
                        <Shield size={112} color="#c7d2fe" />
                    </View>
                    <View className="absolute bottom-10 left-10 opacity-20">
                        <Sparkles size={80} color="#a78bfa" />
                    </View>
                    <View className="absolute top-1/3 left-1/4 opacity-40">
                        <Sparkles size={16} color="#818cf8" />
                    </View>
                    <View className="absolute top-1/4 right-1/3 opacity-40">
                        <Sparkles size={12} color="#d8b4fe" />
                    </View>
                    <View className="absolute bottom-1/4 left-1/3 opacity-40">
                        <Sparkles size={20} color="#6366f1" />
                    </View>
                    <View className="absolute bottom-1/3 right-1/4 opacity-40">
                        <Sparkles size={16} color="#a78bfa" />
                    </View>
                </View>

                {/* Background blur effects */}
                <View className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: 192 }, { translateY: -192 }] }} />
                <View className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: -192 }, { translateY: 192 }] }} />

                {/* Main content */}
                <View className="flex-1 justify-center items-center px-3 md:px-6 py-8">
                    <View className="w-full max-w-md">
                        {/* Header section */}
                        <View className="text-center mb-8">
                            <StyledText className="text-5xl md:text-6xl font-bold text-white text-center mx-3">
                                MathG
                            </StyledText>
                            <StyledText className="text-xl md:text-3xl text-purple-200 mb-2 text-center tracking-wider font-semibold mx-4">
                                Crea tu cuenta y únete a la aventura épica
                            </StyledText>
                        </View>

                        {/* Form container */}
                        <View className="bg-white/10 backdrop-blur-lg border border-indigo-300/30 rounded-3xl py-8 px-4 md:p-8 shadow-2xl">
                            <View className="space-y-6">
                                {/* Username field */}
                                <View className="mb-4">
                                    <StyledText className="text-xl leading-4 tracking-wider text-purple-100 font-semibold mb-2">
                                        Usuario
                                    </StyledText>
                                    <View className="relative">
                                        <TextInput
                                            placeholder="¿Cual será tu nombre?"
                                            value={data.username}
                                            onChangeText={(value) => handleInputChange('username', value)}
                                            editable={!processing}
                                            placeholderTextColor="#d8b4fe"
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

                                {/* Email field */}
                                <View className="mb-4">
                                    <StyledText className="text-xl leading-4 tracking-wider text-purple-100 font-semibold mb-2">
                                        Correo Electrónico
                                    </StyledText>
                                    <View className="relative">
                                        <TextInput
                                            placeholder="correo@ejemplo.com"
                                            value={data.email}
                                            onChangeText={(value) => handleInputChange('email', value)}
                                            editable={!processing}
                                            keyboardType="email-address"
                                            placeholderTextColor="#d8b4fe"
                                            className="bg-white/20 focus:bg-white/30 border border-purple-300/50 text-white rounded-2xl h-12 px-4 pr-12"
                                            style={{
                                                fontSize: 16,
                                                letterSpacing: 0.5,
                                            }}
                                        />
                                        <View className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Mail size={20} color="#d8b4fe" />
                                        </View>
                                    </View>
                                </View>

                                {/* Password field */}
                                <View className="mb-4">
                                    <StyledText className="text-xl leading-4 tracking-wider text-purple-100 font-semibold mb-2">
                                        Contraseña
                                    </StyledText>
                                    <View className="relative">
                                        <TextInput
                                            placeholder="Contraseña"
                                            value={data.password}
                                            onChangeText={(value) => handleInputChange('password', value)}
                                            editable={!processing}
                                            secureTextEntry={!showPassword}
                                            placeholderTextColor="#d8b4fe"
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

                                {/* Submit button */}
                                <Pressable
                                    onPress={submit as any}
                                    disabled={processing}
                                    className="w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-2xl h-12 flex-row items-center justify-center gap-2 space-x-2 active:scale-95 active:shadow-lg active:shadow-purple-500/25 transition-all duration-300"
                                    style={{
                                        opacity: processing ? 0.7 : 1,
                                    }}
                                >
                                    {processing ? (
                                        <>
                                            <StyledText className="text-white text-lg md:text-xl font-semibold tracking-wider">
                                                Forjando tu cuenta...
                                            </StyledText>
                                            <ActivityIndicator color="white" size="small" />
                                        </>
                                    ) : (
                                        <>
                                            <StyledText className="text-white text-lg md:text-xl font-semibold tracking-wider">
                                                Crear Cuenta
                                            </StyledText>
                                            <Crown size={20} color="white" />
                                        </>
                                    )}
                                </Pressable>

                                {/* Login link */}
                                <View className="text-center mt-6 flex-row justify-center items-center flex-wrap">
                                    <StyledText className="text-purple-300 tracking-wider mr-2">
                                        ¿Ya tienes una cuenta?
                                    </StyledText>
                                    <Link href="/login" asChild>
                                        <Pressable className="active:opacity-70">
                                        <StyledText className="text-purple-100 font-semibold tracking-wider">
                                            Inicia tu aventura
                                        </StyledText>
                                        </Pressable>
                                    </Link>
                                </View>
                            </View>
                        </View>

                        {/* Footer message */}
                        <View className="text-center mt-8">
                            <StyledText className="text-purple-300 tracking-wider font-light text-lg text-center">
                                Tu aventura épica está a punto de comenzar
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
