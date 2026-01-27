import { View, Text, ScrollView, TouchableOpacity, Animated, Alert, TextInput, SectionList, Image } from 'react-native';
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useTheme } from '../theme';
import * as Progress from 'react-native-progress';
import { currentUser, treinos } from '../data';
import { TrendUp, Fire, Barbell, Timer, Trophy, Export, Trash, MagnifyingGlass, FunnelSimple, SignOut, UserMinus } from 'phosphor-react-native';
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePressAnimation, useScreenAnimation } from '../hooks';
import { getAllWorkouts, getExercisesByWorkout, getFullWorkout, deleteWorkout, WorkoutRecord, getUserStats, UserStats, getExerciseDBPriority, getExerciseDBTargets, getExerciseImageUrl, ExerciseDBPriority } from '../api';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { WorkoutDetailModal } from '../components/WorkoutDetailModal';

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
    onPress,
    onExport,
    onDelete
}: {
    workout: WorkoutWithExercises;
    style: any;
    onPress: (id: number) => void;
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
            <TouchableOpacity
                onPress={() => onPress(workout.id)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
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
                    {workout.exerciseNames.slice(0, 3).join(', ')}{workout.exerciseNames.length > 3 ? '...' : ''}
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
            </TouchableOpacity>
        </Animated.View>
    );
};

export const HistoryScreen = () => {
    const { theme } = useTheme();
    const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

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

    const handleOpenDetail = useCallback((workoutId: number) => {
        setSelectedWorkoutId(workoutId);
    }, []);

    return (
        <>
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
                        onPress={handleOpenDetail}
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

            <WorkoutDetailModal
                visible={selectedWorkoutId !== null}
                workoutId={selectedWorkoutId}
                onClose={() => setSelectedWorkoutId(null)}
                onWorkoutUpdated={loadWorkouts}
            />
        </>
    );
};

// Traduz músculo alvo (target) para português
const getTargetLabel = (target: string) => {
    const translations: Record<string, string> = {
        'pectorals': 'Peito',
        'lats': 'Dorsais',
        'delts': 'Deltoides',
        'biceps': 'Bíceps',
        'triceps': 'Tríceps',
        'forearms': 'Antebraços',
        'abs': 'Abdômen',
        'quads': 'Quadríceps',
        'hamstrings': 'Posterior',
        'glutes': 'Glúteos',
        'calves': 'Panturrilha',
        'traps': 'Trapézio',
        'upper back': 'Costas Superior',
        'spine': 'Coluna',
        'serratus anterior': 'Serrátil',
        'levator scapulae': 'Elevador Escápula',
        'cardiovascular system': 'Cardio',
        'adductors': 'Adutores',
        'abductors': 'Abdutores',
    };
    return translations[target?.toLowerCase()] || target || '';
};

// Componente de item de exercício (ExerciseDB com GIFs)
const ExerciseItem = ({ exercise, theme }: { exercise: ExerciseDBPriority; theme: any }) => {
    const imageUrl = exercise.localImage ? getExerciseImageUrl(exercise.localImage) : null;
    const displayName = exercise.name_pt || exercise.name;
    const displayEquipment = exercise.equipment_pt || exercise.equipment;

    return (
        <TouchableOpacity
            style={{ backgroundColor: theme.surface, borderBottomColor: theme.borderSubtle }}
            className="flex-row items-center px-4 py-3 border-b"
            activeOpacity={0.7}
        >
            {/* Imagem GIF ou placeholder */}
            <View
                style={{ backgroundColor: theme.field }}
                className="w-14 h-14 rounded-lg mr-3 overflow-hidden items-center justify-center"
            >
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 56, height: 56 }}
                        resizeMode="cover"
                    />
                ) : (
                    <Text style={{ color: theme.textSecondary }} className="text-2xl font-bold">
                        {displayName.charAt(0).toUpperCase()}
                    </Text>
                )}
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text style={{ color: theme.text }} className="font-semibold text-base" numberOfLines={1}>
                    {displayName}
                </Text>
                <Text style={{ color: theme.textSecondary }} className="text-sm" numberOfLines={1}>
                    {getTargetLabel(exercise.target)} • {displayEquipment}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export const ExercisesScreen = () => {
    const { theme } = useTheme();
    const sectionListRef = useRef<SectionList>(null);
    const [exercises, setExercises] = useState<ExerciseDBPriority[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
    const [targets, setTargets] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Carrega exercícios do ExerciseDB com GIFs
    const loadExercises = useCallback(async () => {
        setLoading(true);
        try {
            const results = await getExerciseDBPriority({
                q: searchQuery || undefined,
                target: selectedTarget || undefined,
                limit: 100,
            });
            setExercises(results);
        } catch (error) {
            console.error('[ExercisesScreen] Error loading exercises:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedTarget]);

    // Carrega filtros ao montar
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const targetList = await getExerciseDBTargets();
                setTargets(targetList);
            } catch (error) {
                console.error('[ExercisesScreen] Error loading filters:', error);
            }
        };
        loadFilters();
    }, []);

    // Recarrega quando filtros mudam
    useEffect(() => {
        loadExercises();
    }, [loadExercises]);

    // Agrupa exercícios por letra (usando nome em português)
    const sections = useMemo(() => {
        const grouped: Record<string, ExerciseDBPriority[]> = {};

        exercises.forEach(ex => {
            const displayName = ex.name_pt || ex.name;
            const letter = displayName.charAt(0).toUpperCase();
            if (!grouped[letter]) {
                grouped[letter] = [];
            }
            grouped[letter].push(ex);
        });

        return Object.keys(grouped)
            .sort()
            .map(letter => ({
                title: letter,
                data: grouped[letter].sort((a, b) => {
                    const nameA = a.name_pt || a.name;
                    const nameB = b.name_pt || b.name;
                    return nameA.localeCompare(nameB);
                }),
            }));
    }, [exercises]);

    // Letras disponíveis para o índice
    const availableLetters = useMemo(() => sections.map(s => s.title), [sections]);

    // Scroll para letra
    const scrollToLetter = useCallback((letter: string) => {
        const sectionIndex = sections.findIndex(s => s.title === letter);
        if (sectionIndex >= 0 && sectionListRef.current) {
            sectionListRef.current.scrollToLocation({
                sectionIndex,
                itemIndex: 0,
                viewOffset: 50,
                animated: true,
            });
        }
    }, [sections]);

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1">
            {/* Header */}
            <View className="px-4 pt-16 pb-2">
                <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity>
                        <Text style={{ color: theme.primary }} className="text-base font-semibold">Novo</Text>
                    </TouchableOpacity>
                    <Text style={{ color: theme.text }} className="text-lg font-bold">Exercícios</Text>
                    <TouchableOpacity>
                        <Text style={{ color: theme.primary }} className="text-xl">•••</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View
                    style={{ backgroundColor: theme.field }}
                    className="flex-row items-center px-3 py-2 rounded-lg mb-3"
                >
                    <MagnifyingGlass size={20} color={theme.textSecondary} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Pesquisar exercício..."
                        placeholderTextColor={theme.textSecondary}
                        style={{ color: theme.text }}
                        className="flex-1 ml-2 text-base"
                    />
                </View>

                {/* Filter Button */}
                <View className="flex-row mb-2">
                    <TouchableOpacity
                        onPress={() => setShowFilters(!showFilters)}
                        style={{ backgroundColor: selectedTarget ? theme.primary : theme.field }}
                        className="flex-1 mr-2 py-2 px-3 rounded-lg"
                    >
                        <Text
                            style={{ color: selectedTarget ? '#fff' : theme.text }}
                            className="text-center text-sm font-medium"
                        >
                            {selectedTarget ? getTargetLabel(selectedTarget) : 'Qualquer músculo'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowFilters(!showFilters)}
                        style={{ backgroundColor: theme.field }}
                        className="py-2 px-3 rounded-lg"
                    >
                        <FunnelSimple size={20} color={theme.text} />
                    </TouchableOpacity>
                </View>

                {/* Filtros expandidos */}
                {showFilters && (
                    <View className="mb-2">
                        <Text style={{ color: theme.textSecondary }} className="text-xs mb-2">MÚSCULO ALVO:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity
                                onPress={() => setSelectedTarget(null)}
                                style={{ backgroundColor: !selectedTarget ? theme.primary : theme.field }}
                                className="px-3 py-1 rounded-full mr-2"
                            >
                                <Text style={{ color: !selectedTarget ? '#fff' : theme.text }} className="text-sm">
                                    Todos
                                </Text>
                            </TouchableOpacity>
                            {targets.map(target => (
                                <TouchableOpacity
                                    key={target}
                                    onPress={() => setSelectedTarget(target === selectedTarget ? null : target)}
                                    style={{ backgroundColor: selectedTarget === target ? theme.primary : theme.field }}
                                    className="px-3 py-1 rounded-full mr-2"
                                >
                                    <Text style={{ color: selectedTarget === target ? '#fff' : theme.text }} className="text-sm">
                                        {getTargetLabel(target)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* Exercise List */}
            <View className="flex-1 flex-row">
                <SectionList
                    ref={sectionListRef}
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ExerciseItem exercise={item} theme={theme} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ backgroundColor: theme.background }} className="px-4 py-2">
                            <Text style={{ color: theme.textSecondary }} className="text-sm font-bold">
                                {title}
                            </Text>
                        </View>
                    )}
                    stickySectionHeadersEnabled={true}
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    onScrollToIndexFailed={() => {}}
                    ListEmptyComponent={
                        <View className="items-center py-8">
                            <Text style={{ color: theme.textSecondary }}>
                                {loading ? 'Carregando...' : 'Nenhum exercício encontrado'}
                            </Text>
                        </View>
                    }
                />

                {/* Índice alfabético lateral */}
                {availableLetters.length > 0 && (
                    <View className="absolute right-0 top-0 bottom-0 justify-center pr-1">
                        {availableLetters.map(letter => (
                            <TouchableOpacity
                                key={letter}
                                onPress={() => scrollToLetter(letter)}
                                className="py-0.5 px-1"
                            >
                                <Text style={{ color: theme.primary }} className="text-xs font-bold">
                                    {letter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

export const StoreScreen = () => <PlaceholderScreen name="Store" />;

// Dados padrão enquanto carrega
const defaultStats: UserStats = {
    totalTreinos: 0,
    tempoTotal: '0h 0min',
    volumeTotal: 0,
    streak: {
        current: 0,
        best: 0,
        trainedToday: false,
        atRisk: false,
        freezesAvailable: 1
    },
    metaSemanal: { atual: 0, meta: 4 },
    progressao: []
};

export const ProfileScreen = () => {
    const { theme } = useTheme();
    const { user, signOut, deleteAccount } = useAuth();
    const [stats, setStats] = useState<UserStats>(defaultStats);
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleLogout = () => {
        Alert.alert(
            'Sair da conta',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                        } catch (error: any) {
                            Alert.alert('Erro', error.message);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Excluir conta',
            'Tem certeza que deseja excluir sua conta?\n\nTodos os seus treinos serão apagados permanentemente. Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAccount();
                            Alert.alert('Conta excluída', 'Seus dados foram removidos.');
                        } catch (error: any) {
                            Alert.alert('Erro', error.message);
                        }
                    }
                }
            ]
        );
    };

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
                        <Fire
                            size={32}
                            color={stats.streak.atRisk ? '#fbbf24' : '#f97316'}
                            weight="fill"
                        />
                        <Text style={{ color: theme.text }} className="text-2xl font-bold mt-1">
                            {stats.streak.current}
                        </Text>
                    </View>
                    <Text style={{ color: theme.textSecondary }} className="text-xs mt-2">
                        {stats.streak.atRisk ? 'Streak em risco!' : 'Streak'}
                    </Text>
                    <Text style={{ color: theme.text }} className="font-bold">
                        {stats.streak.trainedToday ? 'treinou hoje' : 'dias seguidos'}
                    </Text>
                    {stats.streak.best > stats.streak.current && (
                        <Text style={{ color: theme.textSecondary }} className="text-xs mt-1">
                            Recorde: {stats.streak.best}
                        </Text>
                    )}
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
                                    {prog.evolucao >= 0 ? '+' : ''}{prog.evolucao}kg
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

            {/* Conta */}
            <Animated.View style={[getItemStyle(5), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-4">
                <Text style={{ color: theme.text }} className="font-bold text-lg mb-3">Conta</Text>

                {user?.email && (
                    <Text style={{ color: theme.textSecondary }} className="text-sm mb-4">
                        {user.email}
                    </Text>
                )}

                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center py-3 border-b"
                    style={{ borderColor: theme.borderSubtle }}
                >
                    <SignOut size={20} color={theme.textSecondary} />
                    <Text style={{ color: theme.text }} className="ml-3 flex-1">Sair da conta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleDeleteAccount}
                    className="flex-row items-center py-3"
                >
                    <UserMinus size={20} color="#ef4444" />
                    <Text style={{ color: '#ef4444' }} className="ml-3 flex-1">Excluir conta</Text>
                </TouchableOpacity>
            </Animated.View>

            <View className="h-32" />
        </ScrollView>
    );
};
