import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useWorkout } from '../context/WorkoutContext';
import { CaretDown, DotsThree } from 'phosphor-react-native';
import { ExerciseCard } from './ExerciseCard';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MINIMIZED_HEIGHT = 80;

export const WorkoutDrawer = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const {
        isActive,
        isMinimized,
        workoutName,
        duration,
        exercises,
        minimizeWorkout,
        maximizeWorkout,
        finishWorkout,
        cancelWorkout,
        addSet,
        updateSet,
        toggleSet,
        changeSetType
    } = useWorkout();

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        if (isActive) {
            if (isMinimized) {
                Animated.spring(translateY, {
                    toValue: SCREEN_HEIGHT - MINIMIZED_HEIGHT - 85,
                    useNativeDriver: true,
                    friction: 8,
                }).start();
            } else {
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    friction: 8,
                }).start();
            }
        } else {
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isActive, isMinimized]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFinish = () => {
        Alert.alert('Finish Workout', 'Are you sure you want to finish?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Finish', onPress: finishWorkout }
        ]);
    };

    const handleCancel = () => {
        Alert.alert('Cancel Workout', 'Are you sure you want to cancel?', [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', style: 'destructive', onPress: cancelWorkout }
        ]);
    };

    if (!isActive) return null;

    return (
        <Animated.View
            style={{
                transform: [{ translateY }],
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: SCREEN_HEIGHT,
                zIndex: 100,
                backgroundColor: theme.background,
            }}
        >
            {/* Mini Bar Content (Visible when minimized) */}
            {isMinimized && (
                <TouchableOpacity
                    onPress={maximizeWorkout}
                    style={{
                        height: MINIMIZED_HEIGHT,
                        backgroundColor: theme.surface,
                        borderTopWidth: 1,
                        borderColor: theme.borderSubtle,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <View>
                        <Text style={{ color: theme.text }} className="font-bold text-base">{workoutName}</Text>
                        <Text style={{ color: theme.primary }} className="font-medium">{formatTime(duration)}</Text>
                    </View>
                    <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 absolute top-2 left-1/2 -ml-5" />
                </TouchableOpacity>
            )}

            {/* Full Content (Visible when maximized) */}
            {!isMinimized && (
                <View className="flex-1" style={{ paddingTop: insets.top }}>
                    {/* Header */}
                    <View className="px-4 py-3 border-b" style={{ borderColor: theme.borderSubtle }}>
                        <View className="flex-row justify-between items-center mb-4">
                            <TouchableOpacity onPress={minimizeWorkout} className="p-2">
                                <CaretDown size={24} color={theme.text} weight="bold" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleFinish}
                                className="bg-[#22c55e] px-6 py-2 rounded-lg"
                            >
                                <Text className="text-white font-bold">Finish</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text style={{ color: theme.text }} className="text-2xl font-bold">{workoutName}</Text>
                                <Text style={{ color: theme.textSecondary }} className="text-base">{formatTime(duration)}</Text>
                            </View>
                            <TouchableOpacity>
                                <DotsThree size={24} color={theme.text} weight="bold" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView className="flex-1 px-4 pt-4">
                        {exercises.map(ex => (
                            <ExerciseCard
                                key={ex.id}
                                name={ex.name}
                                sets={ex.sets}
                                onAddSet={() => addSet(ex.id)}
                                onUpdateSet={(setId, field, val) => updateSet(ex.id, setId, field, val)}
                                onToggleSet={(setId) => toggleSet(ex.id, setId)}
                                onChangeSetType={(setId, type) => changeSetType(ex.id, setId, type)}
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
                </View>
            )}
        </Animated.View>
    );
};
