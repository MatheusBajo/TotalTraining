import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import React from 'react';
import { useTheme } from '../theme';
import * as Progress from 'react-native-progress';
import { currentUser, userStats, treinos } from '../data';
import { TrendUp, Fire, Barbell, Timer, Trophy } from 'phosphor-react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePressAnimation, useScreenAnimation } from '../hooks';

const PlaceholderScreen = ({ name }: { name: string }) => {
    const { theme } = useTheme();

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1 items-center justify-center">
            <Text style={{ color: theme.text }} className="text-xl">{name}</Text>
        </View>
    );
};

export const HistoryScreen = () => {
    const { theme } = useTheme();

    const ultimosTreinos = [...treinos]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 8);

    const { getItemStyle } = useScreenAnimation({
        itemCount: ultimosTreinos.length + 2,
        staggerDelay: 60,
        duration: 400,
        bounceHeight: 10,
    });

    return (
        <ScrollView
            style={{ backgroundColor: theme.background }}
            className="flex-1 px-5 pt-16"
            showsVerticalScrollIndicator={false}
        >
            <Animated.View style={getItemStyle(0)}>
                <Text style={{ color: theme.text }} className="text-2xl font-bold mb-6">Histórico</Text>
            </Animated.View>

            <Animated.View style={getItemStyle(1)}>
                <Text style={{ color: theme.text }} className="font-bold text-lg mb-3">Últimos treinos</Text>
            </Animated.View>

            {ultimosTreinos.map((treino, index) => {
                const { onPressIn, onPressOut, animatedStyle: pressStyle } = usePressAnimation();

                return (
                    <Animated.View key={index} style={[getItemStyle(index + 2), pressStyle]}>
                        <TouchableOpacity
                            style={{ backgroundColor: theme.surface }}
                            className="p-4 rounded-xl mb-3"
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                            activeOpacity={1}
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text style={{ color: theme.text }} className="font-bold text-base">
                                        {treino.treino}
                                    </Text>
                                    <Text style={{ color: theme.textSecondary }} className="text-sm">
                                        {format(parseISO(treino.data), "EEEE, d 'de' MMMM", { locale: ptBR })}
                                    </Text>
                                </View>
                                <View style={{ backgroundColor: theme.primary + '20' }} className="px-2 py-1 rounded">
                                    <Text style={{ color: theme.primary }} className="text-xs font-bold">
                                        {treino.exercicios.length} exercícios
                                    </Text>
                                </View>
                            </View>

                            <Text style={{ color: theme.textSecondary }} className="text-sm" numberOfLines={1}>
                                {treino.exercicios.slice(0, 3).map(e => e.nome).join(', ')}
                                {treino.exercicios.length > 3 && '...'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}

            <View className="mb-20" />
        </ScrollView>
    );
};

export const ExercisesScreen = () => {
    const { theme } = useTheme();

    const exerciciosContagem: Record<string, number> = {};
    treinos.forEach(treino => {
        treino.exercicios.forEach(ex => {
            exerciciosContagem[ex.nome] = (exerciciosContagem[ex.nome] || 0) + 1;
        });
    });

    const exerciciosOrdenados = Object.entries(exerciciosContagem)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);

    const { getItemStyle } = useScreenAnimation({
        itemCount: exerciciosOrdenados.length + 1,
        staggerDelay: 50,
        duration: 400,
        bounceHeight: 10,
    });

    return (
        <ScrollView
            style={{ backgroundColor: theme.background }}
            className="flex-1 px-5 pt-16"
            showsVerticalScrollIndicator={false}
        >
            <Animated.View style={getItemStyle(0)}>
                <Text style={{ color: theme.text }} className="text-2xl font-bold mb-2">Exercícios</Text>
                <Text style={{ color: theme.textSecondary }} className="mb-6">
                    {Object.keys(exerciciosContagem).length} exercícios registrados
                </Text>
            </Animated.View>

            {exerciciosOrdenados.map(([nome, count], index) => {
                const { onPressIn, onPressOut, animatedStyle: pressStyle } = usePressAnimation();

                return (
                    <Animated.View key={index} style={[getItemStyle(index + 1), pressStyle]}>
                        <TouchableOpacity
                            style={{ backgroundColor: theme.surface }}
                            className="p-4 rounded-xl mb-2 flex-row justify-between items-center"
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                            activeOpacity={1}
                        >
                            <View className="flex-row items-center flex-1">
                                <View
                                    style={{ backgroundColor: theme.primary + '20' }}
                                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                >
                                    <Text style={{ color: theme.primary }} className="font-bold text-sm">
                                        {index + 1}
                                    </Text>
                                </View>
                                <Text style={{ color: theme.text }} className="font-medium flex-1" numberOfLines={1}>
                                    {nome}
                                </Text>
                            </View>
                            <Text style={{ color: theme.textSecondary }} className="text-sm">
                                {count}x
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}

            <View className="mb-20" />
        </ScrollView>
    );
};

export const StoreScreen = () => <PlaceholderScreen name="Store" />;

export const ProfileScreen = () => {
    const { theme } = useTheme();
    const metaProgress = userStats.metaSemanal.atual / userStats.metaSemanal.meta;

    const { getItemStyle } = useScreenAnimation({
        itemCount: 6,
        staggerDelay: 80,
        duration: 450,
        bounceHeight: 12,
    });

    return (
        <ScrollView
            style={{ backgroundColor: theme.background }}
            className="flex-1 px-5 pt-16"
            showsVerticalScrollIndicator={false}
        >
            {/* Header do perfil */}
            <Animated.View style={getItemStyle(0)} className="items-center mb-6">
                <View
                    style={{ backgroundColor: theme.primary }}
                    className="w-20 h-20 rounded-full items-center justify-center mb-3"
                >
                    <Text className="text-white text-3xl font-bold">
                        {currentUser.nome.charAt(0)}
                    </Text>
                </View>
                <Text style={{ color: theme.text }} className="text-2xl font-bold">
                    {currentUser.nome}
                </Text>
                <Text style={{ color: theme.textSecondary }}>
                    {currentUser.peso}kg → {currentUser.pesoMeta}kg
                </Text>
                <View
                    style={{ backgroundColor: theme.surface }}
                    className="px-3 py-1 rounded-full mt-2"
                >
                    <Text style={{ color: theme.primary }} className="text-sm font-medium">
                        {currentUser.nivel.charAt(0).toUpperCase() + currentUser.nivel.slice(1)}
                    </Text>
                </View>
            </Animated.View>

            {/* Stats Cards */}
            <Animated.View style={getItemStyle(1)} className="flex-row justify-between mb-4">
                <View style={{ backgroundColor: theme.surface }} className="flex-1 mr-2 p-4 rounded-xl items-center">
                    <Progress.Circle
                        size={70}
                        progress={metaProgress}
                        thickness={6}
                        color={theme.primary}
                        unfilledColor={theme.field}
                        borderWidth={0}
                        showsText
                        formatText={() => `${Math.round(metaProgress * 100)}%`}
                        textStyle={{ color: theme.text, fontSize: 14, fontWeight: 'bold' }}
                    />
                    <Text style={{ color: theme.textSecondary }} className="text-xs mt-2">Meta semanal</Text>
                    <Text style={{ color: theme.text }} className="font-bold">
                        {userStats.metaSemanal.atual}/{userStats.metaSemanal.meta} treinos
                    </Text>
                </View>

                <View style={{ backgroundColor: theme.surface }} className="flex-1 ml-2 p-4 rounded-xl items-center">
                    <View className="items-center justify-center h-[70px]">
                        <Fire size={32} color="#f97316" weight="fill" />
                        <Text style={{ color: theme.text }} className="text-2xl font-bold mt-1">
                            {userStats.streak}
                        </Text>
                    </View>
                    <Text style={{ color: theme.textSecondary }} className="text-xs mt-2">Streak</Text>
                    <Text style={{ color: theme.text }} className="font-bold">dias seguidos</Text>
                </View>
            </Animated.View>

            {/* Estatísticas gerais */}
            <Animated.View style={[getItemStyle(2), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-4">
                <Text style={{ color: theme.text }} className="font-bold text-lg mb-3">Estatísticas</Text>

                <View className="flex-row justify-between py-3 border-b" style={{ borderColor: theme.borderSubtle }}>
                    <View className="flex-row items-center">
                        <Barbell size={20} color={theme.textSecondary} />
                        <Text style={{ color: theme.textSecondary }} className="ml-2">Total de treinos</Text>
                    </View>
                    <Text style={{ color: theme.text }} className="font-bold">{userStats.totalTreinos}</Text>
                </View>

                <View className="flex-row justify-between py-3 border-b" style={{ borderColor: theme.borderSubtle }}>
                    <View className="flex-row items-center">
                        <Timer size={20} color={theme.textSecondary} />
                        <Text style={{ color: theme.textSecondary }} className="ml-2">Tempo total</Text>
                    </View>
                    <Text style={{ color: theme.text }} className="font-bold">{userStats.tempoTotal}</Text>
                </View>

                <View className="flex-row justify-between py-3">
                    <View className="flex-row items-center">
                        <Trophy size={20} color={theme.textSecondary} />
                        <Text style={{ color: theme.textSecondary }} className="ml-2">Volume total</Text>
                    </View>
                    <Text style={{ color: theme.text }} className="font-bold">
                        {userStats.volumeTotal.toLocaleString()} kg
                    </Text>
                </View>
            </Animated.View>

            {/* Progressão */}
            <Animated.View style={[getItemStyle(3), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-4">
                <View className="flex-row items-center mb-3">
                    <TrendUp size={20} color={theme.primary} />
                    <Text style={{ color: theme.text }} className="font-bold text-lg ml-2">Progressão</Text>
                </View>

                {userStats.progressao.map((prog, index) => (
                    <View
                        key={index}
                        className="flex-row justify-between items-center py-2"
                        style={index < userStats.progressao.length - 1 ? { borderBottomWidth: 1, borderColor: theme.borderSubtle } : {}}
                    >
                        <Text style={{ color: theme.text }} className="flex-1">{prog.exercicio}</Text>
                        <Text style={{ color: theme.textSecondary }} className="text-sm">
                            {prog.cargaInicial}kg → {prog.cargaAtual}kg
                        </Text>
                        <View
                            style={{ backgroundColor: '#22c55e20' }}
                            className="ml-2 px-2 py-0.5 rounded"
                        >
                            <Text style={{ color: '#22c55e' }} className="text-xs font-bold">
                                +{prog.evolucao}%
                            </Text>
                        </View>
                    </View>
                ))}
            </Animated.View>

            {/* Prioridades musculares */}
            <Animated.View style={[getItemStyle(4), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-20">
                <Text style={{ color: theme.text }} className="font-bold text-lg mb-3">Prioridades</Text>
                <View className="flex-row flex-wrap">
                    {currentUser.prioridadesMusculares.map((prioridade, index) => (
                        <View
                            key={index}
                            style={{ backgroundColor: theme.primary + '20' }}
                            className="px-3 py-1.5 rounded-full mr-2 mb-2"
                        >
                            <Text style={{ color: theme.primary }} className="text-sm">
                                {prioridade}
                            </Text>
                        </View>
                    ))}
                </View>
            </Animated.View>
        </ScrollView>
    );
};
