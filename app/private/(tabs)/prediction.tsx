import { StyledText } from '@/components/styled-text';
import { ThemedView } from '@/components/themed-view';
import { API_ENDPOINTS } from '@/config/api';
import { useAuthProfile } from '@/contexts/auth-profile-context';
import { PredictionPayload, PredictionResponse } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Gamepad2,
    Hash,
    Loader2,
    Send,
    Sparkles,
    Target,
    TrendingUpDown,
    XCircle,
} from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';

type PredictionForm = {
	match_id: string;
	user_id: string;
	minigame_id: string;
	avg_accuracy: string;
	failed_options_ratio: string;
	consecutive_streak: string;
	session_duration: string;
	relative_score_diff: string;
};

const initialFormState: PredictionForm = {
	match_id: 'certain_loss_002',
	user_id: '',
	minigame_id: '3',
	avg_accuracy: '0.05',
	failed_options_ratio: '0.95',
	consecutive_streak: '0',
	session_duration: '400',
	relative_score_diff: '-60',
};

const numberFields = [
	{ key: 'user_id', label: 'ID de usuario', icon: Hash, placeholder: '1001' },
	{ key: 'minigame_id', label: 'ID del minijuego', icon: Gamepad2, placeholder: '3' },
	{ key: 'avg_accuracy', label: 'Precisión promedio', icon: Target, placeholder: '0.05' },
	{ key: 'failed_options_ratio', label: 'Ratio de fallos', icon: AlertCircle, placeholder: '0.95' },
	{ key: 'consecutive_streak', label: 'Racha consecutiva', icon: Sparkles, placeholder: '0' },
	{ key: 'session_duration', label: 'Duración de sesión', icon: Clock3, placeholder: '400' },
	{ key: 'relative_score_diff', label: 'Diferencia relativa', icon: TrendingUpDown, placeholder: '-60' },
] as const;

function toNumber(value: string): number {
	return Number(value.trim());
}

export default function PredictionScreen() {
	const { profile, fetchProfile } = useAuthProfile();
	const [form, setForm] = useState<PredictionForm>(initialFormState);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const defaultUserId = useMemo(() => {
		const numericId = Number(profile?.id);
		return Number.isFinite(numericId) ? String(numericId) : '';
	}, [profile?.id]);

	useFocusEffect(
		useCallback(() => {
			fetchProfile();
		}, [fetchProfile]),
	);

	useEffect(() => {
		if (!form.user_id && defaultUserId) {
			setForm((current) => ({ ...current, user_id: defaultUserId }));
		}
	}, [defaultUserId, form.user_id]);

	const updateField = (key: keyof PredictionForm, value: string) => {
		setForm((current) => ({ ...current, [key]: value }));
	};

	const submitPrediction = async () => {
		setIsSubmitting(true);
		setErrorMessage(null);
		setPrediction(null);

		const payload: PredictionPayload = {
			match_id: form.match_id.trim(),
			user_id: toNumber(form.user_id),
			minigame_id: toNumber(form.minigame_id),
			avg_accuracy: toNumber(form.avg_accuracy),
			failed_options_ratio: toNumber(form.failed_options_ratio),
			consecutive_streak: toNumber(form.consecutive_streak),
			session_duration: toNumber(form.session_duration),
			relative_score_diff: toNumber(form.relative_score_diff),
		};

		if (!payload.match_id) {
			setErrorMessage('Ingresa un match_id válido.');
			setIsSubmitting(false);
			return;
		}

		const hasInvalidNumber = Object.entries(payload)
			.filter(([key]) => key !== 'match_id')
			.some(([, value]) => Number.isNaN(value as number));

		if (hasInvalidNumber) {
			setErrorMessage('Completa todos los campos numéricos con valores válidos.');
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await fetch(API_ENDPOINTS.prediction, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			const responseData = await response.json();

			if (!response.ok) {
				const message = Array.isArray(responseData?.message)
					? responseData.message[0]
					: responseData?.detail || responseData?.message || `Error ${response.status}`;
				throw new Error(message);
			}

			setPrediction(responseData as PredictionResponse);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : 'No se pudo ejecutar la predicción.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ThemedView className="min-h-screen bg-white relative overflow-hidden flex-1">
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				className="relative z-10"
				showsVerticalScrollIndicator={false}
			>
				<View className="absolute inset-0 overflow-hidden pointer-events-none">
					<View className="absolute top-20 right-8 opacity-10">
						<TrendingUpDown size={120} color="#7c3aed" />
					</View>
					<View className="absolute top-1/3 left-4 opacity-10 rotate-12">
						<Sparkles size={100} color="#818cf8" />
					</View>
					<View className="absolute bottom-24 right-8 opacity-10 -rotate-12">
						<Target size={96} color="#7c3aed" />
					</View>
				</View>

				<View className="absolute top-0 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: 160 }, { translateY: -160 }] }} />
				<View className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: -192 }, { translateY: 192 }] }} />

				<View className="px-4 pt-10 pb-20">
					<View className="mb-8">
						<StyledText className="text-4xl font-bold text-purple-900 mb-2">
							Predicción
						</StyledText>
						<StyledText className="text-gray-600 tracking-wide">
							Envía métricas al modelo de Python y revisa el resultado al instante
						</StyledText>
					</View>

					<View className="bg-linear-to-br from-purple-50 to-indigo-50 border border-purple-200/40 rounded-3xl p-5 shadow-sm mb-6">
						<View className="flex-row items-center justify-between mb-3">
							<View>
								<StyledText className="text-lg font-bold text-purple-900">
									Datos para predecir
								</StyledText>
								<StyledText className="text-sm text-purple-700 mt-1">
									El usuario actual se toma desde tu perfil autenticado
								</StyledText>
							</View>
							<View className="w-12 h-12 rounded-2xl bg-white/80 items-center justify-center">
								<Send size={22} color="#7c3aed" />
							</View>
						</View>

						<View className="space-y-4">
							<View className="mb-4">
								<StyledText className="text-sm font-semibold text-purple-700 mb-2 tracking-widest">
									MATCH ID
								</StyledText>
								<TextInput
									value={form.match_id}
									onChangeText={(value) => updateField('match_id', value)}
									placeholder="certain_loss_002"
									placeholderTextColor="#a78bfa"
									className="bg-white border border-purple-200 rounded-2xl h-12 px-4 text-gray-900"
								/>
							</View>

							{numberFields.map(({ key, label, icon: Icon, placeholder }) => (
								<View key={key} className="mb-4">
									<View className="flex-row items-center justify-between mb-2">
										<StyledText className="text-sm font-semibold text-purple-700 tracking-widest">
											{label.toUpperCase()}
										</StyledText>
										<View className="w-8 h-8 rounded-full bg-white items-center justify-center border border-purple-100">
											<Icon size={16} color="#7c3aed" />
										</View>
									</View>
									<TextInput
										value={form[key]}
										onChangeText={(value) => updateField(key, value)}
										placeholder={placeholder}
										placeholderTextColor="#a78bfa"
										keyboardType="default"
										className="bg-white border border-purple-200 rounded-2xl h-12 px-4 text-gray-900"
									/>
								</View>
							))}

							<Pressable
								onPress={submitPrediction}
								disabled={isSubmitting}
								className="mt-2 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl h-14 flex-row items-center justify-center gap-2 active:opacity-90"
							>
								{isSubmitting ? <Loader2 size={20} color="white" /> : <Send size={20} color="white" />}
								<StyledText className="text-white text-lg font-semibold tracking-wider">
									{isSubmitting ? 'Prediciendo...' : 'Ejecutar predicción'}
								</StyledText>
							</Pressable>
						</View>
					</View>

					{errorMessage ? (
						<View className="bg-red-50 border border-red-200 rounded-3xl p-5 mb-6 flex-row items-start gap-3">
							<XCircle size={22} color="#dc2626" />
							<View className="flex-1">
								<StyledText className="text-base font-semibold text-red-800 mb-1">
									No se pudo predecir
								</StyledText>
								<StyledText className="text-sm text-red-700">
									{errorMessage}
								</StyledText>
							</View>
						</View>
					) : null}

					<View className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm mb-6">
						<View className="flex-row items-center gap-3 mb-4">
							<View className="w-11 h-11 rounded-2xl bg-emerald-50 items-center justify-center">
								<CheckCircle2 size={22} color="#059669" />
							</View>
							<View>
								<StyledText className="text-lg font-bold text-gray-900">
									Resultado
								</StyledText>
								<StyledText className="text-sm text-gray-600">
									La respuesta de la API se muestra aquí
								</StyledText>
							</View>
						</View>

						{prediction ? (
							<View className="space-y-3 grid grid-cols-1 gap-3">
                                <View className={`rounded-2xl p-4 border ${prediction.va_a_ganar ? 'bg-blue-50 border-blue-100' : 'bg-red-100 border-red-200'}`}>
									<StyledText className={`text-sm font-semibold tracking-widest mb-1 ${prediction.va_a_ganar ? 'text-blue-700' : 'text-red-700'}`}>
										DECISIÓN
									</StyledText>
									<StyledText className={`text-2xl font-bold ${prediction.va_a_ganar ? 'text-blue-900' : 'text-red-900'}`}>
										{prediction.va_a_ganar ? 'Va a ganar' : 'No va a ganar'}
									</StyledText>
								</View>

								<View className={`border ${prediction.va_a_ganar ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'} rounded-2xl p-4`}>
									<StyledText className={`text-sm font-semibold tracking-widest mb-1 ${prediction.va_a_ganar ? 'text-emerald-700' : 'text-orange-700'}`}>
										PROBABILIDAD DE GANAR
									</StyledText>
									<StyledText className={`text-2xl font-bold ${prediction.va_a_ganar ? 'text-emerald-900' : 'text-orange-900'}`}>
										{(prediction.probabilidad_ganar * 100).toFixed(2)}%
									</StyledText>
								</View>

							</View>
						) : (
							<View className="items-center justify-center py-8">
								<ActivityIndicator size="small" color="#7c3aed" />
								<StyledText className="text-sm text-gray-500 mt-3 text-center">
									Aún no has ejecutado una predicción
								</StyledText>
							</View>
						)}
					</View>

					<View className="bg-purple-50 border border-purple-100 rounded-3xl p-5">
						<StyledText className="text-sm font-semibold text-purple-700 tracking-widest mb-2">
							CUENTA ACTUAL
						</StyledText>
						<StyledText className="text-lg font-bold text-purple-900">
							{profile?.username || 'Usuario autenticado'}
						</StyledText>
						<StyledText className="text-sm text-purple-700 mt-1">
							ID: {defaultUserId || 'No disponible'}
						</StyledText>
					</View>
				</View>
			</ScrollView>
		</ThemedView>
	);
}