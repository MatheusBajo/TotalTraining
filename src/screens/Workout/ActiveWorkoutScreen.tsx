import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Clock, DotsThree } from 'phosphor-react-native';
import { ExerciseCard } from '../../components/ExerciseCard';
import { SetType } from '../../components/SetTypeModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { treinos } from '../../data/treinos.json';

export const ActiveWorkoutScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { template } = (route.params as any) || {};

    const getLastStats = (exerciseName: string) => {
        // Search backwards through history
        for (let i = treinos.length - 1; i >= 0; i--) {
            const workout = treinos[i];
            const exercise = workout.exercicios.find((e: any) => e.nome === exerciseName);
            if (exercise && exercise.series && Array.isArray(exercise.series) && exercise.series.length > 0) {
                // Get the best set or last set? Let's get the last set for now or a summary
                const lastSet = exercise.series[exercise.series.length - 1];
                if (typeof lastSet === 'object' && lastSet !== null) {
                    if ('carga' in lastSet && 'reps' in lastSet) return `${lastSet.carga}kg x ${lastSet.reps}`;
                    if ('reps' in lastSet) return `${lastSet.reps} reps`;
                }
            }
        }
        return '-';
    };

    // Initialize exercises from template or default to empty
    const initialExercises = template ? template.exercicios.map((ex: any) => ({
        id: ex.id,
        name: ex.nome,
        sets: Array(typeof ex.series === 'number' ? ex.series : 3).fill(0).map((_, i) => ({
            id: Math.random().toString(),
            kg: '',
            reps: '',
            rir: '',
            completed: false,
            type: 'N' as SetType,
            prev: getLastStats(ex.nome)
        }))
    })) : [];

    const [exercises, setExercises] = useState(initialExercises);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddSet = useCallback((exerciseId: string) => {
        setExercises((prev: any[]) => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            const lastSet = ex.sets[ex.sets.length - 1];
            const newSet = {
                id: Math.random().toString(),
                kg: lastSet ? lastSet.kg : '',
                reps: lastSet ? lastSet.reps : '',
                rir: '',
                completed: false,
                type: 'N' as SetType,
                prev: '-'
            };
            return { ...ex, sets: [...ex.sets, newSet] };
        }));
    }, []);

    const handleUpdateSet = useCallback((exerciseId: string, setId: string, field: 'kg' | 'reps' | 'rir', value: string) => {
        setExercises((prev: any[]) => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map((s: any) => s.id === setId ? { ...s, [field]: value } : s)
            };
        }));
    }, []);

    const handleToggleSet = useCallback((exerciseId: string, setId: string) => {
        setExercises((prev: any[]) => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map((s: any) => s.id === setId ? { ...s, completed: !s.completed } : s)
            };
        }));
    }, []);

    const handleChangeSetType = useCallback((exerciseId: string, setId: string, type: SetType) => {
        setExercises((prev: any[]) => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map((s: any) => s.id === setId ? { ...s, type } : s)
            };
        }));
    }, []);

    const handleFinish = () => {
        Alert.alert('Finish Workout', 'Are you sure you want to finish?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Finish', onPress: () => navigation.goBack() }
        ]);
    };

    const handleCancel = () => {
        Alert.alert('Cancel Workout', 'Are you sure you want to cancel? All progress will be lost.', [
            { text: 'No', style: 'cancel' },
            { text: 'Yes, Cancel', style: 'destructive', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            {/* Header */}
            <View className="px-4 py-3 border-b" style={{ borderColor: theme.borderSubtle }}>
                <View className="flex-row justify-between items-center mb-4">
                    <View className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                        <Clock size={20} color={theme.text} />
                    </View>
                    <TouchableOpacity
                        onPress={handleFinish}
                        className="bg-[#22c55e] px-6 py-2 rounded-lg"
                    >
                        <Text className="text-white font-bold">Finish</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-between items-start">
                    <View>
                        <Text style={{ color: theme.text }} className="text-2xl font-bold">{template?.nome || 'Quick Workout'}</Text>
                        <Text style={{ color: theme.textSecondary }} className="text-base">{formatTime(duration)}</Text>
                    </View>
                    <TouchableOpacity>
                        <DotsThree size={24} color={theme.text} weight="bold" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4">
                {exercises.map((ex: any) => (
                    <ExerciseCard
                        key={ex.id}
                        exerciseId={ex.id}
                        name={ex.name}
                        sets={ex.sets}
                        onAddSet={handleAddSet}
                        onUpdateSet={handleUpdateSet}
                        onToggleSet={handleToggleSet}
                        onChangeSetType={handleChangeSetType}
                    />
                ))}

                <TouchableOpacity
                    style={{ backgroundColor: '#e0f2fe' }}
                    className="py-3 rounded-xl items-center mb-4"
                >
                    <Text className="text-[#0ea5e9] font-bold text-lg">Add Exercises</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleCancel}
                    style={{ backgroundColor: '#fee2e2' }}
                    className="py-3 rounded-xl items-center mb-20"
                >
                    <Text className="text-[#ef4444] font-bold text-lg">Cancel Workout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};
