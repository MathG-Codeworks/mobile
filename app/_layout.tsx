import '@/global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Href, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProfileProvider } from '@/contexts/auth-profile-context';
import { useAuthToken } from '@/hooks/use-auth-token';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const router = useRouter();
	const { isLoading, hasToken } = useAuthToken();

	useEffect(() => {
		if (isLoading) return;

		if (!hasToken) {
			router.replace('/login' as Href);
		} else {
			router.replace('/private/(tabs)');
		}
	}, [isLoading, hasToken, router]);

	if (isLoading) {
		return (
			<View className="flex-1 bg-linear-to-br from-indigo-900 via-purple-800 to-purple-900 justify-center items-center">
				<ActivityIndicator size="large" color="#d8b4fe" />
			</View>
		);
	}

	return (
		<AuthProfileProvider>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Stack>
					{/* Rutas de autenticación (sin header) */}
					<Stack.Screen
						name="login"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="register"
						options={{
							headerShown: false,
						}}
					/>

					{/* Rutas protegidas (con autenticación) */}
					<Stack.Screen
						name="private"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
				<StatusBar style="auto" />
			</ThemeProvider>
		</AuthProfileProvider>
	);
}
