import { Skeleton } from '@/components/skeleton';
import { StyledText } from '@/components/styled-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthProfile } from '@/contexts/auth-profile-context';
import { useKPI } from '@/contexts/kpi-context';
import { UserPresitionResponseByDay } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { AlertCircle, ArrowDown, ArrowUp, Award, BarChart3, Clock, Sparkles, TrendingUp, Zap } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const formatPlayTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    
    const remainingDays = days % 30;
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    
    if (months > 0) {
        if (remainingDays > 0) {
            return `${months} ${months === 1 ? 'mes' : 'meses'} y ${remainingDays} ${remainingDays === 1 ? 'día' : 'días'}`;
        }
        return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    if (days > 0) {
        if (remainingHours > 0) {
            return `${days} ${days === 1 ? 'día' : 'días'} y ${remainingHours} ${remainingHours === 1 ? 'hora' : 'horas'}`;
        }
        return `${days} ${days === 1 ? 'día' : 'días'}`;
    }
    if (hours > 0) {
        if (remainingMinutes > 0) {
            return `${hours} ${hours === 1 ? 'hora' : 'horas'} y ${remainingMinutes} ${remainingMinutes === 1 ? 'minuto' : 'minutos'}`;
        }
        return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    if (minutes > 0) {
        const remainingSeconds = seconds % 60;
        if (remainingSeconds > 0) {
            return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} y ${remainingSeconds} ${remainingSeconds === 1 ? 'segundo' : 'segundos'}`;
        }
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    return `${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
};

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const getLineDataByYear = (year: string, data: UserPresitionResponseByDay[] | null) => {
    if (!data) return [];
    return data.filter((item) => item.date.startsWith(year)).map((item) => {
        const [_, month, day] = item.date.split('-');
        const monthName = months[parseInt(month) - 1];
        return {
            value: item.correct,
            label: `${day} ${monthName}`,
            dataPointText: item.correct.toString(),
        };
    });
};

const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return '#10b981'; // Verde
    if (accuracy >= 80) return '#3b82f6'; // Azul
    if (accuracy >= 70) return '#f59e0b'; // Naranja
    return '#ef4444'; // Rojo
};

const truncateName = (name: string, maxLength: number = 15) => {
    return name.length > maxLength ? name.substring(0, maxLength - 1) + '…' : name;
};

export default function HomeScreen() {
    const { profile, isLoading, fetchProfile } = useAuthProfile();
    const { 
        fetchUserTotalTime, userTotalTime, isLoadingTotalTime,
        fetchUserPresition, userPresition, isLoadingPresition,
        fetchUserPresitionByDay, userPresitionByDay, isLoadingPresitionByDay,
        fetchUserPerformance, userPerformance, isLoadingPerformance
    } = useKPI();

    const [selectedYear, setSelectedYear] = useState<string>('');
    const [isLoadingChart, setIsLoadingChart] = useState(false);
    const uniqueYears = useMemo(() => {
        if (!userPresitionByDay) return [];
        return [...new Set(userPresitionByDay.map((item) => item.date.split('-')[0]))].sort();
    }, [userPresitionByDay]);
    
    const learningCurveLineData = useMemo(() => {
        return getLineDataByYear(selectedYear, userPresitionByDay);
    }, [selectedYear, userPresitionByDay]);

    const handleYearChange = (year: string) => {
        setIsLoadingChart(true);
        setTimeout(() => {
            setSelectedYear(year);
            setIsLoadingChart(false);
        }, 400);
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [fetchProfile])
    );

    useFocusEffect(
        useCallback(() => {
            fetchUserTotalTime();
        }, [fetchUserTotalTime])
    );

    useFocusEffect(
        useCallback(() => {
            fetchUserPresition();
        }, [fetchUserPresition])
    );

    useFocusEffect(
        useCallback(() => {
            fetchUserPresitionByDay();
        }, [fetchUserPresitionByDay])
    );

    useFocusEffect(
        useCallback(() => {
            fetchUserPerformance();
        }, [fetchUserPerformance])
    );

    useEffect(() => {
        if (uniqueYears.length > 0 && !selectedYear) {
            setSelectedYear(uniqueYears[uniqueYears.length - 1]);
        }
    }, [uniqueYears, selectedYear]);

    return (
        <ThemedView className="min-h-screen bg-white relative overflow-hidden flex-1">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className="relative z-10"
                showsVerticalScrollIndicator={false}
            >
                {/* Background decorative elements */}
                <View className="absolute inset-0 overflow-hidden pointer-events-none">
                    <View className="absolute top-20 right-10 opacity-10">
                        <Award size={120} color="#a78bfa" />
                    </View>
                    <View className="absolute top-1/3 left-5 opacity-15 -rotate-45">
                        <BarChart3 size={100} color="#818cf8" />
                    </View>
                    <View className="absolute bottom-32 right-5 opacity-10">
                        <TrendingUp size={110} color="#a78bfa" />
                    </View>
                    <View className="absolute bottom-40 left-20 opacity-15">
                        <Zap size={90} color="#818cf8" />
                    </View>
                    <View className="absolute top-1/4 left-1/3 opacity-20">
                        <Sparkles size={16} color="#c084fc" />
                    </View>
                    <View className="absolute top-2/3 right-1/4 opacity-20">
                        <Sparkles size={12} color="#a78bfa" />
                    </View>
                    <View className="absolute bottom-1/4 left-1/4 opacity-20">
                        <Sparkles size={20} color="#818cf8" />
                    </View>
                    <View className="absolute bottom-1/3 right-1/3 opacity-20">
                        <Sparkles size={14} color="#d8b4fe" />
                    </View>
                </View>

                {/* Background blur effects */}
                <View className="absolute top-0 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: 160 }, { translateY: -160 }] }} />
                <View className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl pointer-events-none" style={{ transform: [{ translateX: -192 }, { translateY: 192 }] }} />

                {/* Main content */}
                <View className="px-4 pt-10 pb-20">
                    {/* Header con bienvenida */}
                    <View className="mb-8">
                        <View className="bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-200/40 rounded-3xl p-6 shadow-sm">
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1">
                                    <StyledText className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">
                                        ¡Bienvenido!
                                    </StyledText>
                                    {isLoading ? (
                                        <Skeleton width={180} height={28} borderRadius={6} />
                                    ) : (
                                        <>
                                            <StyledText className="text-xl text-purple-700 font-semibold tracking-wide">
                                                {profile?.username || ''}
                                            </StyledText>
                                        </>
                                    )}
                                </View>
                                <View className="opacity-30">
                                    <Award size={48} color="#a78bfa" />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Resumen Section */}
                    <View className="mb-8">
                        <StyledText className="text-2xl font-bold text-gray-900 mb-4 px-2">
                            Resumen
                        </StyledText>

                        {/* Card - Tiempo Total Jugado */}
                        <View className="mb-4 bg-linear-to-br from-purple-100 to-purple-50 border border-purple-200/50 rounded-2xl overflow-hidden shadow-sm">
                            <View className="flex-row items-center justify-between p-5">
                                <View className="flex-1">
                                    <StyledText className="text-sm font-semibold text-purple-700 mb-2">
                                        Tiempo Total Jugado
                                    </StyledText>
                                    { isLoadingTotalTime ? (
                                        <Skeleton width={140} height={28} borderRadius={6} />
                                    ) : (
                                        <StyledText className="text-2xl font-bold text-purple-900">
                                            {formatPlayTime(userTotalTime)}
                                        </StyledText>
                                    )}
                                </View>
                                <View className="opacity-20 ml-4">
                                    <Clock size={64} color="#a78bfa" />
                                </View>
                            </View>
                        </View>

                        {/* Win Rate Card */}
                        <View className="mb-4 bg-linear-to-br from-blue-100 to-blue-50 border border-blue-200/50 rounded-2xl overflow-hidden shadow-sm">
                            <View className="flex-row items-center justify-between p-5">
                                <View className="flex-1">
                                    <StyledText className="text-sm font-semibold text-blue-700 mb-2">
                                        Win Rate
                                    </StyledText>
                                    { isLoadingPresition ? (
                                        <Skeleton width={100} height={28} borderRadius={6} />
                                    ) : (
                                        <StyledText className="text-3xl font-bold text-blue-900">
                                            {userPresition?.presition ?? 0}%
                                        </StyledText>
                                    ) }
                                </View>
                                <View className="opacity-20 ml-4">
                                    <Zap size={64} color="#0369a1" />
                                </View>
                            </View>
                        </View>

                        {/* Precision Cards - Row */}
                        <View className="flex-row gap-4">
                            {/* Green Card - Correct */}
                            <View className="flex-1 bg-linear-to-br from-green-100 to-green-50 border border-green-200/50 rounded-2xl overflow-hidden shadow-sm">
                                <View className="grid grid-cols-1 items-start justify-start p-5">
                                    <StyledText className="text-sm text-start font-semibold text-green-700 mb-2">
                                        Res. Correctas
                                    </StyledText>
                                    <View className="flex-row items-center justify-between w-full">
                                        { isLoadingPresition ? (
                                            <Skeleton width={60} height={28} borderRadius={6} />
                                        ) : (
                                            <StyledText className="text-3xl font-bold text-green-900">
                                                {userPresition?.correct ?? 0}
                                            </StyledText>
                                        ) }
                                        <View className="opacity-20 ml-2">
                                            <ArrowUp size={56} color="#16a34a" />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Red Card - Incorrect */}
                            <View className="flex-1 bg-linear-to-br from-red-100 to-red-50 border border-red-200/50 rounded-2xl overflow-hidden shadow-sm">
                                <View className="grid grid-cols-1 items-start justify-start p-5">
                                    <StyledText className="text-sm font-semibold text-red-700 mb-2">
                                        Res. Incorrectas
                                    </StyledText>
                                    <View className="flex-row items-center justify-between w-full">
                                        { isLoadingPresition ? (
                                            <Skeleton width={60} height={28} borderRadius={6} />
                                        ) : (
                                            <StyledText className="text-3xl font-bold text-red-900">
                                                {userPresition?.incorrect ?? 0}
                                            </StyledText>
                                        ) }
                                        <View className="opacity-20 ml-2">
                                            <ArrowDown size={56} color="#dc2626" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Quick Stats Section */}
                    <View className="mb-14">
                        <StyledText className="text-2xl font-bold text-gray-900 px-2">
                            Curva de Aprendizaje
                        </StyledText>
                        <StyledText className="text-sm text-gray-600 mb-4 px-2">
                            Evolución de tus respuestas correctas día a día
                        </StyledText>

                        { isLoadingPresitionByDay ? (
                            <View className="items-center justify-center -mx-8 min-h-64">
                                <ActivityIndicator size="large" color="#a78bfa" />
                            </View>
                        ) : learningCurveLineData.length > 0 ? (
                            <>
                                {/* Year Selector */}
                                <View className="flex-row mb-4 px-2">
                                    {uniqueYears.map((year) => (
                                        <TouchableOpacity
                                            key={year}
                                            style={{
                                                padding: 8,
                                                paddingHorizontal: 16,
                                                marginRight: 6,
                                                backgroundColor: selectedYear === year ? '#a78bfa' : 'transparent',
                                                borderRadius: 999,
                                                borderWidth: 1,
                                                borderColor: selectedYear === year ? '#a78bfa' : '#d1d5db',
                                            }}
                                            onPress={() => handleYearChange(year)}>
                                            <Text style={{ color: selectedYear === year ? '#fff' : '#000', fontWeight: 'bold' }}>
                                                {year}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View className="items-center justify-center -mx-8 min-h-64">
                                    {isLoadingChart ? (
                                        <ActivityIndicator size="large" color="#a78bfa" />
                                    ) : (
                                        <LineChart
                                            data={learningCurveLineData}
                                            height={250}
                                            verticalLinesColor="#e5e7eb"
                                            color="#a78bfa"
                                            thickness={2.5}
                                            dataPointsColor="#7e22ce"
                                            startFillColor="#a78bfa"
                                            startOpacity={0.3}
                                            endOpacity={0}
                                            xAxisColor="#d1d5db"
                                            yAxisColor="transparent"
                                            isAnimated={true}
                                            hideYAxisText={true}
                                            textShiftY={-8}
                                            textShiftX={-1}
                                            textFontSize={13}
                                            areaChart={true}
                                            curved
                                            scrollToEnd={true}
                                            rotateLabel
                                            width={Dimensions.get('window').width}
                                            xAxisLabelTextStyle={{ color: '#6b7280', fontSize: 12 }}
                                        />
                                    )}
                                </View>
                            </>
                        ) : (
                            <View className="items-center justify-center -mx-8 min-h-64">
                                <View className="items-center gap-3">
                                    <AlertCircle size={48} color="#d1d5db" />
                                    <StyledText className="text-gray-400 text-center">
                                        Sin datos aún
                                    </StyledText>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Performance by Game Section */}
                    <View className="mb-14">
                        <StyledText className="text-2xl font-bold text-gray-900 px-2">
                            Precisión
                        </StyledText>
                        <StyledText className="text-sm text-gray-600 mb-4 px-2">
                            Desempeño en cada minijuego/categoría
                        </StyledText>

                        <View className="gap-4">
                            { isLoadingPerformance ? (
                                <View className="items-center justify-center -mx-8 min-h-64">
                                    <ActivityIndicator size="large" color="#a78bfa" />
                                </View>
                            ) : userPerformance && userPerformance.length > 0 ? (
                                userPerformance?.map((game) => {
                                    const accuracyColor = getAccuracyColor(game.accuracy);
                                    const truncatedName = truncateName(game.name);
                                    const truncateCategory = truncateName(game.category, 20);
                                    
                                    return (
                                        <View key={game.id} className="px-2">
                                            {/* Game name and accuracy value */}
                                            <View className="flex-row items-center justify-between mb-2">
                                                <StyledText className="text-sm font-semibold text-gray-700 flex-1">
                                                    {truncatedName} / {truncateCategory}
                                                </StyledText>
                                                <StyledText className="text-sm font-bold" style={{ color: accuracyColor }}>
                                                    {game.accuracy.toFixed(2)}%
                                                </StyledText>
                                            </View>
                                            
                                            {/* Horizontal progress bar */}
                                            <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <View
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${game.accuracy}%`,
                                                        backgroundColor: accuracyColor,
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    );
                                })
                            ) : (
                                <View className="items-center justify-center -mx-8 min-h-64">
                                    <View className="items-center gap-3">
                                        <AlertCircle size={48} color="#d1d5db" />
                                        <StyledText className="text-gray-400 text-center">
                                            Sin datos aún
                                        </StyledText>
                                    </View>
                                </View>
                            ) }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}
