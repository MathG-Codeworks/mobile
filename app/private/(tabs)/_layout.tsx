import { Tabs } from 'expo-router';
import { BarChart3, Settings, User } from 'lucide-react-native';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Inicio',
					tabBarIcon: ({ color }) => <BarChart3 size={28} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Perfil',
					tabBarIcon: ({ color }) => <User size={28} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="logout"
				options={{
					title: 'Configuración',
					tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
				}}
			/>
		</Tabs>
	);
}
