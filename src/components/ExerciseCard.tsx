import React, { memo, useCallback, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { DotsThree, Link, CaretUp } from 'phosphor-react-native';
import { SetRow } from './SetRow';
import { SetType } from './SetTypeModal';
import { ExercisePickerModal } from './ExercisePickerModal';
import {opacity} from "react-native-reanimated/lib/typescript/Colors";

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
    exerciseId: string;
    name: string;
    sets: ExerciseSet[];
    onAddSet: (exerciseId: string) => void;
    onUpdateSet: (exerciseId: string, setId: string, field: 'kg' | 'reps' | 'rir', value: string) => void;
    onToggleSet: (exerciseId: string, setId: string) => void;
    onChangeSetType: (exerciseId: string, setId: string, type: SetType) => void;
    onFillFromPR: (exerciseId: string, setId: string) => void;
    onReplaceExercise?: (exerciseId: string, newName: string) => void;
    onRemoveSet?: (exerciseId: string, setId: string) => void;
    onToggleSuperset?: (exerciseId: string) => void;
    isSuperset?: boolean;
    supersetPosition?: 'first' | 'last' | 'middle';
    isSupersetLinkedWithNext?: boolean;
}

const ExerciseCardComponent = ({
    exerciseId,
    name,
    sets,
    onAddSet,
    onUpdateSet,
    onToggleSet,
    onChangeSetType,
    onFillFromPR,
    onReplaceExercise,
    onRemoveSet,
    onToggleSuperset,
    isSuperset = false,
    supersetPosition,
    isSupersetLinkedWithNext = false,
}: ExerciseCardProps) => {
    const { theme } = useTheme();
    const [showExercisePicker, setShowExercisePicker] = useState(false);

    // Memoiza callbacks
    const handleAddSet = useCallback(() => {
        onAddSet(exerciseId);
    }, [exerciseId, onAddSet]);

    const handleUpdateSet = useCallback((setId: string, field: 'kg' | 'reps' | 'rir', value: string) => {
        onUpdateSet(exerciseId, setId, field, value);
    }, [exerciseId, onUpdateSet]);

    const handleToggleSet = useCallback((setId: string) => {
        onToggleSet(exerciseId, setId);
    }, [exerciseId, onToggleSet]);

    const handleChangeSetType = useCallback((setId: string, type: SetType) => {
        onChangeSetType(exerciseId, setId, type);
    }, [exerciseId, onChangeSetType]);

    const handleFillFromPR = useCallback((setId: string) => {
        onFillFromPR(exerciseId, setId);
    }, [exerciseId, onFillFromPR]);

    const handleRemoveSet = useCallback((setId: string) => {
        if (onRemoveSet) {
            onRemoveSet(exerciseId, setId);
        }
    }, [exerciseId, onRemoveSet]);

    const handleSelectExercise = useCallback((newName: string) => {
        if (onReplaceExercise) {
            onReplaceExercise(exerciseId, newName);
        }
    }, [exerciseId, onReplaceExercise]);

    const handleToggleSuperset = useCallback(() => {
        if (onToggleSuperset) {
            onToggleSuperset(exerciseId);
        }
    }, [exerciseId, onToggleSuperset]);

    // Estilos computados com useMemo
    const containerStyle = useMemo(() => {
        const marginStyle = isSuperset && supersetPosition !== 'last' ? { marginBottom: 0 } : {};
        const topRadiusStyle = isSuperset && supersetPosition !== 'first'
            ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 }
            : {};
        const bottomRadiusStyle = isSuperset && supersetPosition !== 'last'
            ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
            : {};
        const supersetPaddingLeft = isSuperset ? { paddingLeft: 8 } : {};

        return [
            { backgroundColor: theme.surface, position: 'relative' as const },
            marginStyle,
            topRadiusStyle,
            bottomRadiusStyle,
            supersetPaddingLeft
        ];
    }, [theme.surface, isSuperset, supersetPosition]);

    const supersetBarRadius = useMemo(() => {
        if (supersetPosition === 'first') return { borderTopLeftRadius: 2, borderTopRightRadius: 2 };
        if (supersetPosition === 'last') return { borderBottomLeftRadius: 2, borderBottomRightRadius: 2 };
        return {};
    }, [supersetPosition]);

    // Header do Reps - memoizado
    const repsHeaderText = useMemo(() => {
        return sets[0]?.targetReps ? `Reps (${sets[0].targetReps})` : 'Reps';
    }, [sets[0]?.targetReps]);

    return (
        <View style={containerStyle} className="mb-0 pt-4 pb-2">
            {/* Borda lateral do superset */}
            {isSuperset && (
                <View
                    style={[
                        {
                            position: 'absolute',
                            left: 8,
                            top: supersetPosition === 'first' ? 16 : 0,
                            bottom: supersetPosition === 'last' ? 16 : 0,
                            width: 4,
                            backgroundColor: '#10b981',
                            zIndex: 2,
                        },
                        supersetBarRadius
                    ]}
                />
            )}

            {/* Superset badge */}
            {isSuperset && supersetPosition === 'first' && (
                <View className="px-0 mb-4">
                    <View style={{ backgroundColor: '#10b981', }} className="self-start px-4 py-0.5 rounded rounded-tl-none rounded-bl-none">
                        <Text style={{ color: '#ffffff' }} className="text-xs font-bold uppercase">SUPERSET</Text>
                    </View>
                </View>
            )}

            {/* Header */}
            <View className="flex-row justify-between items-center px-4 mb-4">
                <TouchableOpacity
                    onPress={() => setShowExercisePicker(true)}
                    className="flex-row items-center flex-1"
                    activeOpacity={0.7}
                >
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
                    <Text style={{ color: theme.primary }} className="font-bold text-lg uppercase flex-1" numberOfLines={1}>
                        {name}
                    </Text>
                    <CaretUp size={16} color={theme.primary} weight="bold" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
                <View className="flex-row gap-4 ml-2">
                    {onToggleSuperset && (
                        <TouchableOpacity onPress={handleToggleSuperset}>
                            <Link
                                size={20}
                                color={isSupersetLinkedWithNext ? '#10b981' : theme.textSecondary}
                                weight={isSupersetLinkedWithNext ? 'bold' : 'regular'}
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity>
                        <DotsThree size={20} color={theme.primary} weight="bold" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal de troca de exercício */}
            <ExercisePickerModal
                visible={showExercisePicker}
                onClose={() => setShowExercisePicker(false)}
                onSelect={handleSelectExercise}
                currentExerciseName={name}
            />

            {/* Column Headers */}
            <View className="flex-row px-4 mb-2">
                <Text style={{ color: theme.text }} className="w-10 text-center font-bold text-xs">Série</Text>
                <Text style={{ color: theme.text }} className="flex-1 text-center font-bold text-xs">Anterior</Text>
                <Text style={{ color: theme.text }} className="flex-1 text-center font-bold text-xs">kg</Text>
                <Text style={{ color: theme.text }} className="flex-1 text-center font-bold text-xs">
                    {repsHeaderText}
                </Text>
                <Text style={{ color: theme.text }} className="flex-1 text-center font-bold text-xs">RIR</Text>
                <View className="w-10" />
            </View>

            {/* Sets */}
            <View>
                {sets.map((set, index) => (
                    <SetRow
                        key={set.id}
                        setId={set.id}
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
                        onUpdate={handleUpdateSet}
                        onToggle={handleToggleSet}
                        onChangeType={handleChangeSetType}
                        onFillFromPR={handleFillFromPR}
                        onRemove={handleRemoveSet}
                    />
                ))}
            </View>

            {/* Add Set Button */}
            <TouchableOpacity
                onPress={handleAddSet}
                style={{ backgroundColor: theme.background, opacity: 0.7 }}
                className="mx-4 mt-2 mb-2 py-2 rounded-lg items-center justify-center"
            >
                <Text style={{ color: theme.textSecondary }} className="font-bold text-sm">+ Adicionar Série</Text>
            </TouchableOpacity>
        </View>
    );
};

// Memoização com comparação profunda otimizada
export const ExerciseCard = memo(ExerciseCardComponent, (prevProps, nextProps) => {
    // Compara props simples
    if (
        prevProps.exerciseId !== nextProps.exerciseId ||
        prevProps.name !== nextProps.name ||
        prevProps.isSuperset !== nextProps.isSuperset ||
        prevProps.supersetPosition !== nextProps.supersetPosition ||
        prevProps.isSupersetLinkedWithNext !== nextProps.isSupersetLinkedWithNext ||
        (prevProps.onToggleSuperset !== undefined) !== (nextProps.onToggleSuperset !== undefined)
    ) {
        return false;
    }

    // Compara sets (shallow comparison dos IDs e valores)
    if (prevProps.sets.length !== nextProps.sets.length) {
        return false;
    }

    for (let i = 0; i < prevProps.sets.length; i++) {
        const prevSet = prevProps.sets[i];
        const nextSet = nextProps.sets[i];

        if (
            prevSet.id !== nextSet.id ||
            prevSet.kg !== nextSet.kg ||
            prevSet.reps !== nextSet.reps ||
            prevSet.rir !== nextSet.rir ||
            prevSet.completed !== nextSet.completed ||
            prevSet.type !== nextSet.type
        ) {
            return false;
        }
    }

    return true;
});
