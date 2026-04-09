import { Eye, EyeOff, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, TextInput, View } from 'react-native';
import { StyledText } from './styled-text';

interface ChangePasswordModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    onSave: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

export default function ChangePasswordModal({
    show,
    setShow,
    onSave,
}: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (show) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
        }
    }, [show]);

    const handleSave = async () => {
        // Validaciones
        if (!currentPassword.trim()) {
            setError('Por favor ingresa tu contraseña actual');
            return;
        }

        if (!newPassword.trim()) {
            setError('Por favor ingresa tu nueva contraseña');
            return;
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (currentPassword === newPassword) {
            setError('La nueva contraseña no puede ser igual a la actual');
            return;
        }

        setLoading(true);
        try {
            await onSave(currentPassword, newPassword, confirmPassword);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShow(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setShow(false);
    };

    return (
        <Modal
            visible={show}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <StyledText className="text-2xl font-bold text-gray-900">
                            Cambiar contraseña
                        </StyledText>
                        <Pressable onPress={handleClose} className="p-1" disabled={loading}>
                            <X size={24} color="#6b7280" />
                        </Pressable>
                    </View>

                    {/* Form */}
                    <View>
                        {/* Contraseña Actual */}
                        <View className="mb-4">
                            <StyledText className="text-sm font-bold text-gray-700 mb-2">
                                Contraseña actual
                            </StyledText>
                            <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
                                <TextInput
                                    className="flex-1 py-3 text-base"
                                    placeholder="Ingresa tu contraseña actual"
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    editable={!loading}
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry={!showCurrentPassword}
                                />
                                <Pressable
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    disabled={loading}
                                    className="p-2"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff size={20} color="#9ca3af" />
                                    ) : (
                                        <Eye size={20} color="#9ca3af" />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Nueva Contraseña */}
                        <View className="mb-4">
                            <StyledText className="text-sm font-bold text-gray-700 mb-2">
                                Nueva contraseña
                            </StyledText>
                            <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
                                <TextInput
                                    className="flex-1 py-3 text-base"
                                    placeholder="Ingresa tu nueva contraseña"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    editable={!loading}
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry={!showNewPassword}
                                />
                                <Pressable
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    disabled={loading}
                                    className="p-2"
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={20} color="#9ca3af" />
                                    ) : (
                                        <Eye size={20} color="#9ca3af" />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Confirmar Contraseña */}
                        <View className="mb-4">
                            <StyledText className="text-sm font-bold text-gray-700 mb-2">
                                Confirmar contraseña
                            </StyledText>
                            <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
                                <TextInput
                                    className="flex-1 py-3 text-base"
                                    placeholder="Confirma tu nueva contraseña"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    editable={!loading}
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <Pressable
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                    className="p-2"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} color="#9ca3af" />
                                    ) : (
                                        <Eye size={20} color="#9ca3af" />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Error */}
                        {error && (
                            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <StyledText className="text-sm text-red-600">{error}</StyledText>
                            </View>
                        )}

                        {/* Botones */}
                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={handleClose}
                                disabled={loading}
                                className="flex-1 border border-gray-300 rounded-xl py-3 items-center justify-center"
                            >
                                <StyledText className="text-gray-700 font-semibold">
                                    Cancelar
                                </StyledText>
                            </Pressable>
                            <Pressable
                                onPress={handleSave}
                                disabled={loading}
                                className="flex-1 bg-purple-500 rounded-xl py-3 items-center justify-center active:opacity-80"
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <StyledText className="text-white font-semibold">
                                        Guardar
                                    </StyledText>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
