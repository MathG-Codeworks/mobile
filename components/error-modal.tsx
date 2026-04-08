import { StyledText } from '@/components/styled-text';
import { AlertCircle } from 'lucide-react-native';
import { Modal, Pressable, View } from 'react-native';

interface ErrorModalProps {
    visible: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

export function ErrorModal({
    visible,
    title = 'Error',
    message,
    onClose,
}: ErrorModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <View className="bg-white border border-red-500/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                    {/* Header con icono */}
                    <View className="flex-row items-center mb-4">
                        <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-3">
                            <AlertCircle size={24} color="#dc2626" />
                        </View>
                        <StyledText className="text-lg font-bold text-gray-900 flex-1">
                            {title}
                        </StyledText>
                    </View>

                    {/* Mensaje */}
                    <StyledText className="text-gray-600 mb-6 leading-5">
                        {message}
                    </StyledText>

                    {/* Botón */}
                    <Pressable
                        onPress={onClose}
                        className="bg-red-500 rounded-lg py-3 active:opacity-80"
                    >
                        <StyledText className="text-white font-semibold text-center">
                            Entendido
                        </StyledText>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
