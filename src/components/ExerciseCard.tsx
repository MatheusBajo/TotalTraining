import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { DotsThree, Link, Lightbulb } from 'phosphor-react-native';
import { SetRow } from './SetRow';
import { SetType } from './SetTypeModal';

interface ExerciseSet {
    id: string;
    kg: string;
    reps: string;
    rir: string;
    completed: boolean;
    type: SetType;
    prev?: string;
}

interface ExerciseCardProps {
    name: string;
    sets: ExerciseSet[];
    onAddSet: () => void;
    onUpdateSet: (setId: string, field: 'kg' | 'reps' | 'rir', value: string) => void;
    onToggleSet: (setId: string) => void;
    onChangeSetType: (setId: string, type: SetType) => void;
}

export const ExerciseCard = ({ name, sets, onAddSet, onUpdateSet, onToggleSet, onChangeSetType }: ExerciseCardProps) => {
    const { theme } = useTheme();

    return (
        <View style={{ backgroundColor: theme.surface }} className="mb-4 pt-4 pb-2 rounded-xl overflow-hidden">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 mb-3">
                <Text style={{ color: theme.primary }} className="font-bold text-lg">{name}</Text>
                <View className="flex-row gap-3">
                    <TouchableOpacity>
                        <Link size={20} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <DotsThree size={20} color={theme.primary} weight="bold" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Note */}
            <View className="bg-[#fef3c7] px-4 py-2 mb-2 flex-row justify-between items-center">
                <Text className="text-[#d97706] font-medium">Watch back rounding</Text>
                <Lightbulb size={16} color="#d97706" weight="fill" />
            </View>

            {/* Column Headers */}
            <View className="flex-row px-1 mb-2">
                <Text style={{ color: theme.text }} className="w-10 text-center font-bold text-xs">Set</Text>
                <Text style={{ color: theme.text }} className="flex-1 text-center font-bold text-xs">Previous</Text>
                <Text style={{ color: theme.text }} className="flex-1 text-center font-bold text-xs">kg</Text>
                <Text style={{ color: theme.text }} className="flex-1 text-center font-bold text-xs">Reps</Text>
                <Text style={{ color: theme.text }} className="flex-1 text-center font-bold text-xs">RIR</Text>
                <View className="w-10" />
            </View>

            {/* Sets */}
            <View className="px-1">
                {sets.map((set, index) => (
                    <SetRow
                        key={set.id}
                        index={index}
                        prev={set.prev}
                        kg={set.kg}
                        reps={set.reps}
                        rir={set.rir}
                        completed={set.completed}
                        type={set.type}
                        onUpdate={(field, value) => onUpdateSet(set.id, field, value)}
                        onToggle={() => onToggleSet(set.id)}
                        onChangeType={(type) => onChangeSetType(set.id, type)}
                    />
                ))}
            </View>

            {/* Add Set Button */}
            <TouchableOpacity
                onPress={onAddSet}
                style={{ backgroundColor: theme.background }}
                className="mx-4 mt-2 mb-2 py-2 rounded items-center justify-center"
            >
                <Text style={{ color: theme.text }} className="font-bold text-sm uppercase">+ Add Set</Text>
            </TouchableOpacity>
        </View>
    );
};
