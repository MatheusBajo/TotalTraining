import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { X, CalendarBlank, Clock, Barbell, Check } from 'phosphor-react-native';
import { getFullWorkout } from '../api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkoutDetailModalProps {
    visible: boolean;
    workoutId: number | null;
    onClose: () => void;
}

interface FullWorkoutData {
    workout: {
        id: number;
        date: string;
        name: string;
        duration_seconds: number | null;
        notes: string | null;
    };
    exercises: Array<{
        id: number;
        exercise_name: string;
        notes: string | null;
        sets: Array<{
            id: number;
            order_index: number;
            set_type: string;
            weight: number | null;
            reps: number | null;
            rir: number | null;
            completed: boolean;
        }>;
    }>;
}

export const WorkoutDetailModal = ({ visible, workoutId, onClose }: WorkoutDetailModalProps) => {
    const { theme } = useTheme();
    const [data, setData] = useState<FullWorkoutData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && workoutId) {
            loadWorkout();
        } else {
            setData(null);
        }
    }, [visible, workoutId]);

    const loadWorkout = async () => {
        if (!workoutId) return;
        setLoading(true);
        try {
            const result = await getFullWorkout(workoutId);
            setData(result as FullWorkoutData);
        } catch (error) {
            console.error('[WorkoutDetailModal] Error loading workout:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '-';
        const mins = Math.floor(seconds / 60);
        const hrs = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        if (hrs > 0) {
            return `${hrs}h ${remainingMins}min`;
        }
        return `${mins}min`;
    };

    const getSetTypeLabel = (type: string) => {
        switch (type) {
            case 'W': return 'Aquec.';
            case 'D': return 'Drop';
            case 'F': return 'Falha';
            default: return '';
        }
    };

    const getSetTypeColor = (type: string) => {
        switch (type) {
            case 'W': return '#f97316'; // Orange
            case 'D': return '#8b5cf6'; // Purple
            case 'F': return '#ef4444'; // Red
            default: return theme.text;
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={{ backgroundColor: theme.background }} className="flex-1">
                {/* Header */}
                <View
                    style={{ backgroundColor: theme.surface, borderBottomColor: theme.borderSubtle }}
                    className="px-4 pt-4 pb-3 flex-row justify-between items-center border-b"
                >
                    <View className="flex-1">
                        <Text style={{ color: theme.text }} className="text-xl font-bold">
                            {data?.workout.name || 'Carregando...'}
                        </Text>
                        {data && (
                            <Text style={{ color: theme.textSecondary }} className="text-sm">
                                {format(parseISO(data.workout.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{ backgroundColor: theme.field }}
                        className="w-10 h-10 rounded-full items-center justify-center"
                    >
                        <X size={20} color={theme.text} weight="bold" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                ) : data ? (
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Stats Row */}
                        <View className="flex-row mb-6">
                            <View
                                style={{ backgroundColor: theme.surface }}
                                className="flex-1 mr-2 p-4 rounded-xl flex-row items-center"
                            >
                                <Clock size={20} color={theme.primary} />
                                <View className="ml-3">
                                    <Text style={{ color: theme.textSecondary }} className="text-xs">
                                        Duração
                                    </Text>
                                    <Text style={{ color: theme.text }} className="font-bold">
                                        {formatDuration(data.workout.duration_seconds)}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{ backgroundColor: theme.surface }}
                                className="flex-1 ml-2 p-4 rounded-xl flex-row items-center"
                            >
                                <Barbell size={20} color={theme.primary} />
                                <View className="ml-3">
                                    <Text style={{ color: theme.textSecondary }} className="text-xs">
                                        Exercícios
                                    </Text>
                                    <Text style={{ color: theme.text }} className="font-bold">
                                        {data.exercises.length}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Exercises */}
                        {data.exercises.map((exercise, exIndex) => (
                            <View
                                key={exercise.id}
                                style={{ backgroundColor: theme.surface }}
                                className="mb-4 rounded-xl overflow-hidden"
                            >
                                {/* Exercise Header */}
                                <View className="px-4 pt-4 pb-2 flex-row items-center">
                                    <View
                                        style={{
                                            width: 4,
                                            height: 24,
                                            backgroundColor: theme.primary,
                                            borderRadius: 2,
                                            marginRight: 10,
                                        }}
                                    />
                                    <Text style={{ color: theme.primary }} className="font-bold text-base uppercase flex-1">
                                        {exercise.exercise_name}
                                    </Text>
                                </View>

                                {/* Column Headers */}
                                <View className="flex-row px-4 py-2" style={{ backgroundColor: theme.background + '40' }}>
                                    <Text style={{ color: theme.textSecondary }} className="w-12 text-xs font-bold">
                                        Série
                                    </Text>
                                    <Text style={{ color: theme.textSecondary }} className="flex-1 text-center text-xs font-bold">
                                        Peso
                                    </Text>
                                    <Text style={{ color: theme.textSecondary }} className="flex-1 text-center text-xs font-bold">
                                        Reps
                                    </Text>
                                    <Text style={{ color: theme.textSecondary }} className="flex-1 text-center text-xs font-bold">
                                        RIR
                                    </Text>
                                    <View className="w-8" />
                                </View>

                                {/* Sets */}
                                {exercise.sets.map((set, setIndex) => {
                                    const isSpecialType = set.set_type && set.set_type !== 'N';
                                    const typeColor = getSetTypeColor(set.set_type);

                                    return (
                                        <View
                                            key={set.id}
                                            className="flex-row items-center px-4 py-3"
                                            style={{
                                                backgroundColor: set.completed ? '#22c55e10' : 'transparent',
                                                borderTopWidth: setIndex > 0 ? 1 : 0,
                                                borderTopColor: theme.borderSubtle,
                                            }}
                                        >
                                            {/* Set Number */}
                                            <View className="w-12">
                                                {isSpecialType ? (
                                                    <Text style={{ color: typeColor }} className="text-sm font-bold">
                                                        {getSetTypeLabel(set.set_type)}
                                                    </Text>
                                                ) : (
                                                    <Text style={{ color: theme.text }} className="text-sm font-bold">
                                                        {setIndex + 1}
                                                    </Text>
                                                )}
                                            </View>

                                            {/* Weight */}
                                            <Text style={{ color: theme.text }} className="flex-1 text-center font-medium">
                                                {set.weight ? `${set.weight}kg` : '-'}
                                            </Text>

                                            {/* Reps */}
                                            <Text style={{ color: theme.text }} className="flex-1 text-center font-medium">
                                                {set.reps ?? '-'}
                                            </Text>

                                            {/* RIR */}
                                            <Text style={{ color: theme.text }} className="flex-1 text-center font-medium">
                                                {set.rir !== null ? set.rir : '-'}
                                            </Text>

                                            {/* Completed Check */}
                                            <View className="w-8 items-center">
                                                {set.completed && (
                                                    <View
                                                        style={{ backgroundColor: '#22c55e' }}
                                                        className="w-6 h-6 rounded items-center justify-center"
                                                    >
                                                        <Check size={14} color="#fff" weight="bold" />
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}

                                {/* Exercise Notes */}
                                {exercise.notes && (
                                    <View className="px-4 py-2" style={{ backgroundColor: theme.background + '40' }}>
                                        <Text style={{ color: theme.textSecondary }} className="text-sm italic">
                                            {exercise.notes}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}

                        {/* Workout Notes */}
                        {data.workout.notes && (
                            <View
                                style={{ backgroundColor: theme.surface }}
                                className="p-4 rounded-xl mb-4"
                            >
                                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2">
                                    OBSERVAÇÕES
                                </Text>
                                <Text style={{ color: theme.text }}>
                                    {data.workout.notes}
                                </Text>
                            </View>
                        )}

                        <View className="h-8" />
                    </ScrollView>
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text style={{ color: theme.textSecondary }}>
                            Treino não encontrado
                        </Text>
                    </View>
                )}
            </View>
        </Modal>
    );
};
