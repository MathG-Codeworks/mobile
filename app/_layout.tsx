import '@/global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProfileProvider } from '@/contexts/auth-profile-context';
import { KPIProvider } from '@/contexts/kpi-context';
import { useAuthToken } from '@/hooks/use-auth-token';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const router = useRouter();
	const { hasToken } = useAuthToken();
	const segments = useSegments();
	const navigationState = useRootNavigationState();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				if (!navigationState?.key) return;

				const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
				const userHasToken = await hasToken();
				
				if (userHasToken) {
					if (inAuthGroup || !segments[0]) {
						router.replace('/private/(tabs)');
					}
				} else {
					if (!inAuthGroup && segments[0]) {
						router.replace('/login');
					}
				}
			} catch (error) {
				console.error('Error checking auth:', error);
				router.replace('/login');
			}
		};

		checkAuth();
	}, [segments, navigationState]);

	return (
		<AuthProfileProvider>
			<KPIProvider>
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
			</KPIProvider>
		</AuthProfileProvider>
	);
}
