import { Modal, Pressable, View } from "react-native";
import { StyledText } from "./styled-text";

interface ErrorsModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    messages: string[];
}

export default function ErrorsModal({ show, setShow, messages }: ErrorsModalProps) {
    return (
        <Modal
            visible={show}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShow(false)}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <View className="bg-red-900/90 border border-red-500/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                    <StyledText className="text-red-100 text-lg font-bold mb-4 text-center">
                        Error en el registro
                    </StyledText>
                    <View className="mb-6">
                        {messages.slice(0, 2).map((message, index) => (
                            <View key={index} className="flex-row items-start mb-2">
                                <StyledText className="text-red-300 mr-2">•</StyledText>
                                <StyledText className="text-red-200 flex-1 text-sm">
                                    {message}
                                </StyledText>
                            </View>
                        ))}
                    </View>
                    <Pressable
                        onPress={() => setShow(false)}
                        className="bg-red-600 hover:bg-red-700 rounded-xl py-3 active:scale-95 transition-all"
                    >
                        <StyledText className="text-white font-semibold text-center">
                            Intentar de nuevo
                        </StyledText>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}