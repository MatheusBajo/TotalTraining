import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useState, useMemo } from 'react';
import { useTheme } from '../theme';
import { Export, Trash, X, CalendarBlank, Timer, Barbell } from 'phosphor-react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getAllWorkouts, getExercisesByWorkout, getFullWorkout, deleteWorkout, WorkoutRecord } from '../api';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { WorkoutDetailModal } from '../components/WorkoutDetailModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface WorkoutWithExercises extends WorkoutRecord {
    exerciseNames: string[];
    exerciseCount: number;
}

// Card de treino com suporte a seleção
const WorkoutCard = ({
    workout,
    isSelectionMode,
    isSelected,
    onPress,
    onLongPress,
    onToggleSelect,
}: {
    workout: WorkoutWithExercises;
    isSelectionMode: boolean;
    isSelected: boolean;
    onPress: (id: number) => void;
    onLongPress: (id: number) => void;
    onToggleSelect: (id: number) => void;
}) => {
    const { theme } = useTheme();

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return null;
        const mins = Math.floor(seconds / 60);
        const hours = Math.floor(mins / 60);
        if (hours > 0) {
            return `${hours}h ${mins % 60}min`;
        }
        return `${mins}min`;
    };

    const handlePress = () => {
        if (isSelectionMode) {
            onToggleSelect(workout.id);
        } else {
            onPress(workout.id);
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            onLongPress={() => onLongPress(workout.id)}
            activeOpacity={0.7}
            delayLongPress={300}
            style={[
                { backgroundColor: theme.surface },
                isSelected && { borderWidth: 2, borderColor: theme.primary }
            ]}
            className="p-4 rounded-2xl mb-3 overflow-hidden"
        >
                <View className="flex-row">
                    {/* Checkbox de seleção */}
                    {isSelectionMode && (
                        <View className="mr-3 justify-center">
                            <View
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: isSelected ? theme.primary : theme.textSecondary,
                                    backgroundColor: isSelected ? theme.primary : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {isSelected && (
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
                                )}
                            </View>
                        </View>
                    )}

                    <View className="flex-1">
                        {/* Header: Nome e badge */}
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1">
                                <Text style={{ color: theme.text }} className="font-bold text-lg">
                                    {workout.name}
                                </Text>
                                <Text style={{ color: theme.textSecondary }} className="text-sm mt-0.5">
                                    {format(parseISO(workout.date), "EEEE, d MMM", { locale: ptBR })}
                                </Text>
                            </View>
                        </View>

                        {/* Stats row */}
                        <View className="flex-row items-center mt-2 flex-wrap gap-3">
                            <View className="flex-row items-center">
                                <Barbell size={14} color={theme.textSecondary} />
                                <Text style={{ color: theme.textSecondary }} className="text-sm ml-1">
                                    {workout.exerciseCount} exercícios
                                </Text>
                            </View>
                            {workout.duration_seconds && (
                                <View className="flex-row items-center">
                                    <Timer size={14} color={theme.textSecondary} />
                                    <Text style={{ color: theme.textSecondary }} className="text-sm ml-1">
                                        {formatDuration(workout.duration_seconds)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Exercícios preview */}
                        <Text
                            style={{ color: theme.textSecondary }}
                            className="text-xs mt-3 opacity-70"
                            numberOfLines={1}
                        >
                            {workout.exerciseNames.slice(0, 4).join(' • ')}{workout.exerciseNames.length > 4 ? ' •••' : ''}
                        </Text>
                    </View>
                </View>
        </TouchableOpacity>
    );
};

// Barra de ações flutuante simples (sem animação por enquanto)
const SelectionActionBar = ({
    selectedCount,
    onExport,
    onDelete,
    onCancel,
    visible,
}: {
    selectedCount: number;
    onExport: () => void;
    onDelete: () => void;
    onCancel: () => void;
    visible: boolean;
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    if (!visible) return null;

    return (
        <View
            style={{
                position: 'absolute',
                bottom: insets.bottom + 80,
                left: 16,
                right: 16,
                backgroundColor: theme.surface,
                borderRadius: 16,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
            }}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={onCancel}
                        className="p-2 mr-2"
                    >
                        <X size={24} color={theme.textSecondary} />
                    </TouchableOpacity>
                    <Text style={{ color: theme.text }} className="font-bold text-base">
                        {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
                    </Text>
                </View>

                <View className="flex-row gap-2">
                    <TouchableOpacity
                        onPress={onExport}
                        style={{ backgroundColor: theme.primary }}
                        className="flex-row items-center px-4 py-2.5 rounded-xl"
                    >
                        <Export size={18} color="#fff" weight="bold" />
                        <Text className="text-white font-bold ml-2">Exportar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onDelete}
                        style={{ backgroundColor: '#ef4444' }}
                        className="flex-row items-center px-4 py-2.5 rounded-xl"
                    >
                        <Trash size={18} color="#fff" weight="bold" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export const HistoryScreen = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

    // Estado de seleção
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const loadWorkouts = useCallback(async () => {
        try {
            const allWorkouts = await getAllWorkouts();

            const workoutsWithExercises = await Promise.all(
                allWorkouts.slice(0, 100).map(async (workout) => {
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

    useFocusEffect(
        useCallback(() => {
            loadWorkouts();
            // Limpa seleção ao sair da tela
            return () => {
                setIsSelectionMode(false);
                setSelectedIds(new Set());
            };
        }, [loadWorkouts])
    );

    // Handlers de seleção
    const handleLongPress = useCallback((id: number) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            setSelectedIds(new Set([id]));
        }
    }, [isSelectionMode]);

    const handleToggleSelect = useCallback((id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            // Se não tem mais nenhum selecionado, sai do modo seleção
            if (next.size === 0) {
                setIsSelectionMode(false);
            }
            return next;
        });
    }, []);

    const handleCancelSelection = useCallback(() => {
        setIsSelectionMode(false);
        setSelectedIds(new Set());
    }, []);

    const handleSelectAll = useCallback(() => {
        if (selectedIds.size === workouts.length) {
            // Desseleciona todos
            setSelectedIds(new Set());
            setIsSelectionMode(false);
        } else {
            // Seleciona todos
            setSelectedIds(new Set(workouts.map(w => w.id)));
        }
    }, [workouts, selectedIds.size]);

    // Exportar treinos como JSON
    const exportWorkouts = useCallback(async (ids: number[]) => {
        try {
            const exportData = await Promise.all(
                ids.map(async (id) => {
                    const fullWorkout = await getFullWorkout(id);
                    if (!fullWorkout) return null;

                    return {
                        data: fullWorkout.workout.date,
                        treino: fullWorkout.workout.name,
                        horario_inicio: fullWorkout.workout.started_at?.split('T')[1]?.slice(0, 5),
                        duracao_segundos: fullWorkout.workout.duration_seconds,
                        observacoes: fullWorkout.workout.notes,
                        exercicios: fullWorkout.exercises.map(ex => ({
                            nome: ex.exercise_name,
                            observacao: ex.notes,
                            series: ex.sets
                                .filter(s => s.completed || s.weight || s.reps)
                                .map(set => ({
                                    peso_kg: set.weight,
                                    tipo_peso: set.weight_type,
                                    reps: set.reps,
                                    RIR: set.rir,
                                    tipo: set.set_type,
                                    tempo_seg: set.time_seconds,
                                    completado: set.completed,
                                    observacao: set.notes,
                                }))
                        }))
                    };
                })
            );

            const validData = exportData.filter(Boolean);
            const jsonString = JSON.stringify(validData, null, 2);
            await Clipboard.setStringAsync(jsonString);

            Alert.alert(
                'Exportado!',
                `${validData.length} treino${validData.length > 1 ? 's' : ''} copiado${validData.length > 1 ? 's' : ''} para a área de transferência.`,
                [{ text: 'OK' }]
            );

            // Sai do modo seleção após exportar
            handleCancelSelection();
        } catch (error) {
            console.error('[Export] Error:', error);
            Alert.alert('Erro', 'Não foi possível exportar os treinos');
        }
    }, [handleCancelSelection]);

    const handleExportSelected = useCallback(() => {
        exportWorkouts(Array.from(selectedIds));
    }, [selectedIds, exportWorkouts]);

    const handleExportAll = useCallback(() => {
        Alert.alert(
            'Exportar todos',
            `Deseja exportar todos os ${workouts.length} treinos como JSON?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Exportar',
                    onPress: () => exportWorkouts(workouts.map(w => w.id))
                }
            ]
        );
    }, [workouts, exportWorkouts]);

    // Deletar treinos
    const handleDeleteSelected = useCallback(() => {
        const count = selectedIds.size;
        Alert.alert(
            `Deletar ${count} treino${count > 1 ? 's' : ''}?`,
            'Essa ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            for (const id of selectedIds) {
                                await deleteWorkout(id);
                            }
                            setWorkouts(prev => prev.filter(w => !selectedIds.has(w.id)));
                            handleCancelSelection();
                            Alert.alert('Deletado', `${count} treino${count > 1 ? 's' : ''} removido${count > 1 ? 's' : ''}`);
                        } catch (error) {
                            console.error('[Delete] Error:', error);
                            Alert.alert('Erro', 'Não foi possível deletar os treinos');
                        }
                    }
                }
            ]
        );
    }, [selectedIds, handleCancelSelection]);

    const handleOpenDetail = useCallback((workoutId: number) => {
        setSelectedWorkoutId(workoutId);
    }, []);

    // Agrupa treinos por mês
    const groupedWorkouts = useMemo(() => {
        const groups: { [key: string]: WorkoutWithExercises[] } = {};

        workouts.forEach(workout => {
            const monthKey = format(parseISO(workout.date), 'MMMM yyyy', { locale: ptBR });
            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }
            groups[monthKey].push(workout);
        });

        return Object.entries(groups).map(([month, items]) => ({
            month: month.charAt(0).toUpperCase() + month.slice(1),
            workouts: items
        }));
    }, [workouts]);

    return (
        <>
            <ScrollView
                style={{ backgroundColor: theme.background }}
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16 }}
            >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text style={{ color: theme.text }} className="text-3xl font-bold">
                            Histórico
                        </Text>
                        <Text style={{ color: theme.textSecondary }} className="text-sm mt-1">
                            {loading ? 'Carregando...' : `${workouts.length} treinos registrados`}
                        </Text>
                    </View>

                    <View className="flex-row gap-2">
                        {isSelectionMode ? (
                            <TouchableOpacity
                                onPress={handleSelectAll}
                                style={{ backgroundColor: theme.surface }}
                                className="px-4 py-2 rounded-xl"
                            >
                                <Text style={{ color: theme.primary }} className="font-bold">
                                    {selectedIds.size === workouts.length ? 'Limpar' : 'Todos'}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={handleExportAll}
                                style={{ backgroundColor: theme.surface }}
                                className="flex-row items-center px-4 py-2 rounded-xl"
                            >
                                <Export size={18} color={theme.primary} weight="bold" />
                                <Text style={{ color: theme.primary }} className="font-bold ml-2">
                                    Exportar
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Lista agrupada por mês */}
                {groupedWorkouts.map(group => (
                    <View key={group.month} className="mb-4">
                        <Text
                            style={{ color: theme.textSecondary }}
                            className="text-xs font-bold uppercase mb-3 ml-1"
                        >
                            {group.month}
                        </Text>

                        {group.workouts.map((workout) => (
                            <WorkoutCard
                                key={workout.id}
                                workout={workout}
                                isSelectionMode={isSelectionMode}
                                isSelected={selectedIds.has(workout.id)}
                                onPress={handleOpenDetail}
                                onLongPress={handleLongPress}
                                onToggleSelect={handleToggleSelect}
                            />
                        ))}
                    </View>
                ))}

                {!loading && workouts.length === 0 && (
                    <View className="items-center py-16">
                        <CalendarBlank size={64} color={theme.textSecondary + '40'} />
                        <Text style={{ color: theme.textSecondary }} className="text-lg mt-4">
                            Nenhum treino ainda
                        </Text>
                        <Text style={{ color: theme.textSecondary }} className="text-sm mt-1 opacity-60">
                            Comece um treino para ver seu histórico aqui
                        </Text>
                    </View>
                )}

                <View className="h-40" />
            </ScrollView>

            {/* Barra de ações flutuante */}
            <SelectionActionBar
                selectedCount={selectedIds.size}
                onExport={handleExportSelected}
                onDelete={handleDeleteSelected}
                onCancel={handleCancelSelection}
                visible={isSelectionMode && selectedIds.size > 0}
            />

            {/* Modal de detalhes */}
            <WorkoutDetailModal
                visible={selectedWorkoutId !== null}
                workoutId={selectedWorkoutId}
                onClose={() => setSelectedWorkoutId(null)}
                onWorkoutUpdated={loadWorkouts}
            />
        </>
    );
};
