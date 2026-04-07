import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, TextInput, View } from "react-native";
import { StyledText } from "./styled-text";

interface EditProfileModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    editType: "username" | "email" | null;
    currentValue?: string;
    onSave: (username?: string, email?: string) => Promise<void>;
}

export default function EditProfileModal({
    show,
    setShow,
    editType,
    currentValue = "",
    onSave,
}: EditProfileModalProps) {
    const [newValue, setNewValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (show && editType) {
            setNewValue(currentValue);
            setError("");
        }
    }, [show, editType, currentValue]);

    const handleSave = async () => {
        if (!newValue.trim()) {
            setError(`Por favor ingresa un ${editType === "username" ? "usuario" : "email"}`);
            return;
        }

        if (editType === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newValue)) {
                setError("Ingresa un email válido");
                return;
            }
        }

        setLoading(true);
        try {
            const username = editType === "username" ? newValue : undefined;
            const email = editType === "email" ? newValue : undefined;
            await onSave(username, email);
            setNewValue("");
            setShow(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setNewValue("");
        setError("");
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
                            Editar {editType === "username" ? "Usuario" : "Email"}
                        </StyledText>
                        <Pressable onPress={handleClose} className="p-1">
                            <X size={24} color="#6b7280" />
                        </Pressable>
                    </View>

                    {/* Form */}
                    <View>
                        <View className="mb-4">
                            <StyledText className="text-sm font-bold text-gray-700 mb-2">
                                {editType === "username" ? "Nuevo usuario" : "Nuevo email"}
                            </StyledText>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                                placeholder={editType === "username" ? "Ingresa tu nuevo usuario" : "Ingresa tu nuevo email"}
                                value={newValue}
                                onChangeText={setNewValue}
                                editable={!loading}
                                placeholderTextColor="#9ca3af"
                                keyboardType={editType === "email" ? "email-address" : "default"}
                            />
                        </View>

                        {error && (
                            <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                                <StyledText className="text-red-700 text-sm font-semibold">
                                    {error}
                                </StyledText>
                            </View>
                        )}

                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={handleClose}
                                disabled={loading}
                                className="flex-1 bg-gray-200 rounded-xl py-3 active:opacity-70"
                            >
                                <StyledText className="text-gray-700 font-semibold text-center">
                                    Cancelar
                                </StyledText>
                            </Pressable>
                            <Pressable
                                onPress={handleSave}
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl py-3 active:opacity-70 flex-row items-center justify-center"
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <StyledText className="text-white font-semibold text-center">
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
