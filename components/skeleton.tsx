import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View } from 'react-native';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: number;
    style?: any;
}

export function Skeleton({ 
    width = '100%', 
    height = 20, 
    borderRadius = 8,
    style 
}: SkeletonProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
        <View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: isDark ? '#2a2a2a' : '#e5e5e5',
                },
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    skeleton: {
        overflow: 'hidden',
    },
});
