import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { DotsThree, Link } from 'phosphor-react-native';
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
    prData?: {
        weight: number;
        reps: number;
        rir: number | null;
    };
    targetReps?: string;
    targetRir?: string;
}

interface ExerciseCardProps {
    name: string;
    sets: ExerciseSet[];
    onAddSet: () => void;
    onUpdateSet: (setId: string, field: 'kg' | 'reps' | 'rir', value: string) => void;
    onToggleSet: (setId: string) => void;
    onChangeSetType: (setId: string, type: SetType) => void;
    isSuperset?: boolean;
    supersetPosition?: 'first' | 'last' | 'middle';
}

export const ExerciseCard = ({
    name,
    sets,
    onAddSet,
    onUpdateSet,
    onToggleSet,
    onChangeSetType,
    isSuperset = false,
    supersetPosition
}: ExerciseCardProps) => {
    const { theme } = useTheme();

    // Estilos condicionais para superset
    const supersetBorderStyle = isSuperset ? {
        borderLeftWidth: 3,
        borderLeftColor: '#10b981', // Verde para superset
    } : {};

    const marginStyle = isSuperset && supersetPosition !== 'last' ? { marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {};
    const topRadiusStyle = isSuperset && supersetPosition !== 'first' ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : {};

    return (
        <View
            style={[
                { backgroundColor: theme.surface },
                supersetBorderStyle,
                marginStyle,
                topRadiusStyle
            ]}
            className="mb-4 pt-4 pb-2 rounded-xl overflow-hidden"
        >
            {/* Superset badge */}
            {isSuperset && supersetPosition === 'first' && (
                <View className="px-4 mb-2">
                    <View style={{ backgroundColor: '#10b98120' }} className="self-start px-2 py-1 rounded">
                        <Text style={{ color: '#10b981' }} className="text-xs font-bold">SUPERSET</Text>
                    </View>
                </View>
            )}

            {/* Header */}
            <View className="flex-row justify-between items-center px-2 mb-4">
                <View className="flex-row items-center">
                    <View
                        style={{
                            width: 4,
                            height: '100%',
                            minHeight: 24,
                            backgroundColor: theme.primary,
                            borderRadius: 2,
                            marginRight: 10,
                        }}
                    />
                    <Text style={{ color: theme.primary }} className="font-bold text-lg uppercase">{name}</Text>
                </View>
                <View className="flex-row gap-4">
                    <TouchableOpacity>
                        <Link size={20} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <DotsThree size={20} color={theme.primary} weight="bold" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Column Headers */}
            <View className="flex-row px-1 mb-2">
                <Text style={{ color: theme.text }} className="w-10 text-center font-bold text-xs">Série</Text>
                <Text style={{ color: theme.text }} className="flex-1 text-center font-bold text-xs">PR</Text>
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
                        prData={set.prData}
                        kg={set.kg}
                        reps={set.reps}
                        rir={set.rir}
                        completed={set.completed}
                        type={set.type}
                        targetReps={set.targetReps}
                        targetRir={set.targetRir}
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
