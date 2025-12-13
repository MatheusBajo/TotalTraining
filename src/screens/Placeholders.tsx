import { View, Text, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useTheme } from '../theme';
import * as Progress from 'react-native-progress';
import { currentUser, treinos } from '../data';
import { TrendUp, Fire, Barbell, Timer, Trophy, Export, Trash } from 'phosphor-react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePressAnimation, useScreenAnimation } from '../hooks';
import { getAllWorkouts, getExercisesByWorkout, getFullWorkout, deleteWorkout, WorkoutRecord, getUserStats, UserStats } from '../api';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';

const PlaceholderScreen = ({ name }: { name: string }) => {
    const { theme } = useTheme();

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1 items-center justify-center">
            <Text style={{ color: theme.text }} className="text-xl">{name}</Text>
        </View>
    );
};

interface WorkoutWithExercises extends WorkoutRecord {
    exerciseNames: string[];
    exerciseCount: number;
}

// Componente separado para evitar erro de hooks no map
const WorkoutCard = ({
    workout,
    style,
    onExport,
    onDelete
}: {
    workout: WorkoutWithExercises;
    style: any;
    onExport: (id: number) => void;
    onDelete: (id: number) => void;
}) => {
    const { theme } = useTheme();
    const { onPressIn, onPressOut, animatedStyle: pressStyle } = usePressAnimation();

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '';
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    return (
        <Animated.View style={[style, pressStyle]}>
            <View
                style={{ backgroundColor: theme.surface }}
                className="p-4 rounded-xl mb-3"
            >
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                        <Text style={{ color: theme.text }} className="font-bold text-base">
                            {workout.name}
                        </Text>
                        <Text style={{ color: theme.textSecondary }} className="text-sm">
                            {format(parseISO(workout.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </Text>
                    </View>
                    <View className="items-end">
                        <View style={{ backgroundColor: theme.primary + '20' }} className="px-2 py-1 rounded">
                            <Text style={{ color: theme.primary }} className="text-xs font-bold">
                                {workout.exerciseCount} exercícios
                            </Text>
                        </View>
                        {workout.duration_seconds && (
                            <Text style={{ color: theme.textSecondary }} className="text-xs mt-1">
                                {formatDuration(workout.duration_seconds)}
                            </Text>
                        )}
                    </View>
                </View>

                <Text style={{ color: theme.textSecondary }} className="text-sm mb-3" numberOfLines={1}>
                    {workout.exerciseNames.slice(0, 3).join(', ')}
                    {workout.exerciseNames.length > 3 && '...'}
                </Text>

                {/* Botões de ação */}
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        onPress={() => onExport(workout.id)}
                        style={{ backgroundColor: theme.primary + '20' }}
                        className="flex-1 flex-row items-center justify-center py-2 rounded-lg"
                    >
                        <Export size={16} color={theme.primary} weight="bold" />
                        <Text style={{ color: theme.primary }} className="ml-2 font-bold text-sm">
                            Exportar JSON
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onDelete(workout.id)}
                        style={{ backgroundColor: '#ef444420' }}
                        className="px-4 py-2 rounded-lg"
                    >
                        <Trash size={16} color="#ef4444" weight="bold" />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

export const HistoryScreen = () => {
    const { theme } = useTheme();
    const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    const loadWorkouts = useCallback(async () => {
        try {
            const allWorkouts = await getAllWorkouts();

            // Busca exercícios para cada treino
            const workoutsWithExercises = await Promise.all(
                allWorkouts.slice(0, 50).map(async (workout) => {
                    const exercises = await getExercisesByWorkout(workout.id);
                    return {
                        ...workout,
                        exerciseNames: exercises.map(e => e.exercise_name),
                        exerciseCount: exercises.length,
                    };
                })
            );

            setWorkouts(workoutsWithExercises);
        } catch (error) {
            console.error('[HistoryScreen] Error loading workouts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Recarrega quando a tela ganha foco e volta ao topo
    useFocusEffect(
        useCallback(() => {
            loadWorkouts();
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [loadWorkouts])
    );

    // Exporta treino como JSON para clipboard
    const handleExport = useCallback(async (workoutId: number) => {
        try {
            const fullWorkout = await getFullWorkout(workoutId);
            if (!fullWorkout) {
                Alert.alert('Erro', 'Treino não encontrado');
                return;
            }

            // Formata para JSON legível no formato do treinos.json
            const exportData = {
                data: fullWorkout.workout.date,
                treino: fullWorkout.workout.name,
                horario_inicio: fullWorkout.workout.started_at?.split('T')[1]?.slice(0, 5),
                duracao_segundos: fullWorkout.workout.duration_seconds,
                observacoes: fullWorkout.workout.notes,
                exercicios: fullWorkout.exercises.map(ex => ({
                    nome: ex.exercise_name,
                    observacao: ex.notes,
                    series: ex.sets.map(set => ({
                        peso_kg: set.weight,
                        tipo_peso: set.weight_type,
                        reps: set.reps,
                        RIR: set.rir,
                        tipo: set.set_type,
                        tempo_seg: set.time_seconds,
                        completado: set.completed,
                        observacao: set.notes,
                    })).filter(s => s.completado || s.peso_kg || s.reps) // Remove séries vazias
                }))
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            await Clipboard.setStringAsync(jsonString);

            Alert.alert(
                'Exportado!',
                `Treino "${fullWorkout.workout.name}" copiado para a área de transferência.\n\nCole em um arquivo .json no seu PC.`,
                [{ text: 'OK' }]
            );

            console.log('[Export] Workout JSON:', jsonString);
        } catch (error) {
            console.error('[Export] Error:', error);
            Alert.alert('Erro', 'Não foi possível exportar o treino');
        }
    }, []);

    // Deleta treino
    const handleDelete = useCallback(async (workoutId: number) => {
        const workout = workouts.find(w => w.id === workoutId);

        Alert.alert(
            'Deletar treino?',
            `Tem certeza que deseja deletar "${workout?.name}" de ${workout?.date}?\n\nEssa ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteWorkout(workoutId);
                            setWorkouts(prev => prev.filter(w => w.id !== workoutId));
                            Alert.alert('Deletado', 'Treino removido com sucesso');
                        } catch (error) {
                            console.error('[Delete] Error:', error);
                            Alert.alert('Erro', 'Não foi possível deletar o treino');
                        }
                    }
                }
            ]
        );
    }, [workouts]);

    return (
        <ScrollView
            ref={scrollViewRef}
            style={{ backgroundColor: theme.background }}
            className="flex-1 px-5 pt-16"
            showsVerticalScrollIndicator={false}
        >
            <View>
                <Text style={{ color: theme.text }} className="text-2xl font-bold mb-6">Histórico</Text>
            </View>

            <View>
                <Text style={{ color: theme.text }} className="font-bold text-lg mb-3">
                    {loading ? 'Carregando...' : `${workouts.length} treinos`}
                </Text>
            </View>

            {workouts.map((workout) => (
                <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    style={{}}
                    onExport={handleExport}
                    onDelete={handleDelete}
                />
            ))}

            {!loading && workouts.length === 0 && (
                <View className="items-center py-8">
                    <Text style={{ color: theme.textSecondary }}>Nenhum treino registrado ainda</Text>
                </View>
            )}

            <View className="h-32" />
        </ScrollView>
    );
};

export const ExercisesScreen = () => {
    const { theme } = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);

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

    // Volta ao topo quando a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    return (
        <ScrollView
            ref={scrollViewRef}
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

            <View className="h-32" />
        </ScrollView>
    );
};

export const StoreScreen = () => <PlaceholderScreen name="Store" />;

// Dados padrão enquanto carrega
const defaultStats: UserStats = {
    totalTreinos: 0,
    tempoTotal: '0h 0min',
    volumeTotal: 0,
    streak: 0,
    metaSemanal: { atual: 0, meta: 4 },
    progressao: []
};

export const ProfileScreen = () => {
    const { theme } = useTheme();
    const [stats, setStats] = useState<UserStats>(defaultStats);
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    // Carrega stats do banco
    const loadStats = useCallback(async () => {
        try {
            const data = await getUserStats();
            setStats(data);
        } catch (error) {
            console.error('[ProfileScreen] Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Recarrega quando a tela ganha foco e volta ao topo
    useFocusEffect(
        useCallback(() => {
            loadStats();
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [loadStats])
    );

    const metaProgress = stats.metaSemanal.meta > 0
        ? stats.metaSemanal.atual / stats.metaSemanal.meta
        : 0;

    const { getItemStyle } = useScreenAnimation({
        itemCount: 6,
        staggerDelay: 80,
        duration: 450,
        bounceHeight: 12,
    });

    return (
        <ScrollView
            ref={scrollViewRef}
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
                        {stats.metaSemanal.atual}/{stats.metaSemanal.meta} treinos
                    </Text>
                </View>

                <View style={{ backgroundColor: theme.surface }} className="flex-1 ml-2 p-4 rounded-xl items-center">
                    <View className="items-center justify-center h-[70px]">
                        <Fire size={32} color="#f97316" weight="fill" />
                        <Text style={{ color: theme.text }} className="text-2xl font-bold mt-1">
                            {stats.streak}
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
                    <Text style={{ color: theme.text }} className="font-bold">{stats.totalTreinos}</Text>
                </View>

                <View className="flex-row justify-between py-3 border-b" style={{ borderColor: theme.borderSubtle }}>
                    <View className="flex-row items-center">
                        <Timer size={20} color={theme.textSecondary} />
                        <Text style={{ color: theme.textSecondary }} className="ml-2">Tempo total</Text>
                    </View>
                    <Text style={{ color: theme.text }} className="font-bold">{stats.tempoTotal}</Text>
                </View>

                <View className="flex-row justify-between py-3">
                    <View className="flex-row items-center">
                        <Trophy size={20} color={theme.textSecondary} />
                        <Text style={{ color: theme.textSecondary }} className="ml-2">Volume total</Text>
                    </View>
                    <Text style={{ color: theme.text }} className="font-bold">
                        {stats.volumeTotal.toLocaleString()} kg
                    </Text>
                </View>
            </Animated.View>

            {/* Progressão */}
            {stats.progressao.length > 0 && (
                <Animated.View style={[getItemStyle(3), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-4">
                    <View className="flex-row items-center mb-3">
                        <TrendUp size={20} color={theme.primary} />
                        <Text style={{ color: theme.text }} className="font-bold text-lg ml-2">Progressão</Text>
                    </View>

                    {stats.progressao.map((prog, index) => (
                        <View
                            key={index}
                            className="flex-row justify-between items-center py-2"
                            style={index < stats.progressao.length - 1 ? { borderBottomWidth: 1, borderColor: theme.borderSubtle } : {}}
                        >
                            <Text style={{ color: theme.text }} className="flex-1">{prog.exercicio}</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-sm">
                                {prog.cargaInicial}kg → {prog.cargaAtual}kg
                            </Text>
                            <View
                                style={{ backgroundColor: prog.evolucao >= 0 ? '#22c55e20' : '#ef444420' }}
                                className="ml-2 px-2 py-0.5 rounded"
                            >
                                <Text style={{ color: prog.evolucao >= 0 ? '#22c55e' : '#ef4444' }} className="text-xs font-bold">
                                    {prog.evolucao >= 0 ? '+' : ''}{prog.evolucao}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>
            )}

            {/* Prioridades musculares */}
            <Animated.View style={[getItemStyle(4), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-4">
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

            <View className="h-32" />
        </ScrollView>
    );
};
