import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useTheme } from '../theme';
// CaretUp removido — nome do exercício agora abre ExerciseDetailModal
import { SetRow } from './SetRow';
import { SetType } from './SetTypeModal';
import { ActionDropdown, DropdownOption } from './ActionDropdown';
import { PencilSimpleLine } from 'phosphor-react-native';
import { CoreHaptics } from 'expo-core-haptics';

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
    onShowExercisePicker?: (exerciseId: string) => void;
    onOpenExerciseDetail?: (exerciseId: string) => void;
    onRemoveSet?: (exerciseId: string, setId: string) => void;
    onToggleSuperset?: (exerciseId: string) => void;
    onRemoveExercise?: (exerciseId: string) => void;
    onUpdateNotes?: (exerciseId: string, notes: string) => void;
    onSwitchAlternative?: (exerciseId: string, newName: string) => void;
    notes?: string;
    alternativas?: string[];
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
    onShowExercisePicker,
    onOpenExerciseDetail,
    onRemoveSet,
    onToggleSuperset,
    onRemoveExercise,
    onUpdateNotes,
    onSwitchAlternative,
    notes,
    alternativas,
    isSuperset = false,
    supersetPosition,
    isSupersetLinkedWithNext = false,
}: ExerciseCardProps) => {
    const { theme } = useTheme();
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [localNote, setLocalNote] = useState(notes || '');
    const noteInputRef = useRef<TextInput>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const localNoteRef = useRef(localNote);
    localNoteRef.current = localNote;

    // Sync localNote com prop notes (ex: após restauração)
    useEffect(() => {
        if (!showNoteInput) {
            setLocalNote(notes || '');
        }
    }, [notes]);

    // Salva nota com debounce ao digitar (protege contra app fechar sem onBlur)
    const handleNoteChange = useCallback((text: string) => {
        setLocalNote(text);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onUpdateNotes?.(exerciseId, text);
        }, 500);
    }, [exerciseId, onUpdateNotes]);

    // Flush nota pendente no unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                onUpdateNotes?.(exerciseId, localNoteRef.current);
            }
        };
    }, [exerciseId, onUpdateNotes]);

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

    const handleOpenExercisePicker = useCallback(() => {
        if (onShowExercisePicker) {
            onShowExercisePicker(exerciseId);
        }
    }, [exerciseId, onShowExercisePicker]);

    const handleOpenExerciseDetail = useCallback(() => {
        if (onOpenExerciseDetail) {
            onOpenExerciseDetail(exerciseId);
        }
    }, [exerciseId, onOpenExerciseDetail]);

    const handleToggleSuperset = useCallback(() => {
        if (onToggleSuperset) {
            onToggleSuperset(exerciseId);
        }
    }, [exerciseId, onToggleSuperset]);

    const handleRemoveExercise = useCallback(() => {
        Alert.alert(
            'Remover Exercício',
            `Tem certeza que deseja remover "${name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => onRemoveExercise?.(exerciseId)
                }
            ]
        );
    }, [exerciseId, name, onRemoveExercise]);

    // Opções do dropdown do exercício
    const exerciseMenuOptions = useMemo<DropdownOption[]>(() => {
        const options: DropdownOption[] = [
            {
                id: 'note',
                label: notes ? 'Editar nota' : 'Adicionar nota',
                icon: 'note',
                onPress: () => {
                    setShowNoteInput(true);
                    setLocalNote(notes || '');
                    setTimeout(() => noteInputRef.current?.focus(), 100);
                },
            },
            {
                id: 'replace',
                label: 'Trocar exercício',
                icon: 'edit',
                onPress: handleOpenExercisePicker,
            },
        ];

        // Adiciona opção de superset se disponível
        if (onToggleSuperset) {
            options.push({
                id: 'superset',
                label: isSupersetLinkedWithNext ? 'Remover superset' : 'Criar superset',
                icon: isSupersetLinkedWithNext ? 'unlink' : 'link',
                color: isSupersetLinkedWithNext ? '#10b981' : undefined,
                onPress: handleToggleSuperset,
            });
        }

        // Adiciona opção de remover
        if (onRemoveExercise) {
            options.push({
                id: 'remove',
                label: 'Remover exercício',
                icon: 'delete',
                destructive: true,
                onPress: handleRemoveExercise,
            });
        }

        return options;
    }, [handleOpenExercisePicker, onToggleSuperset, isSupersetLinkedWithNext, handleToggleSuperset, onRemoveExercise, handleRemoveExercise]);

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
                    onPress={handleOpenExerciseDetail}
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
                </TouchableOpacity>

                {/* Menu de opções usando ActionDropdown */}
                <View className="ml-2">
                    <ActionDropdown
                        options={exerciseMenuOptions}
                        iconSize={20}
                        iconColor={theme.primary}
                        anchor="right"
                    />
                </View>
            </View>

            {/* Alternativas (tabs para trocar exercício equivalente) */}
            {alternativas && alternativas.length > 1 && (
                <View style={{ flexDirection: 'row', gap: 6, marginHorizontal: 16, marginBottom: 8 }}>
                    {alternativas.map((alt) => {
                        const isSelected = alt === name;
                        return (
                            <TouchableOpacity
                                key={alt}
                                style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 8,
                                    backgroundColor: isSelected ? theme.primary : theme.field,
                                }}
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (!isSelected && onSwitchAlternative) {
                                        if (CoreHaptics.isSupported()) {
                                            CoreHaptics.tap.light();
                                        }
                                        onSwitchAlternative(exerciseId, alt);
                                    }
                                }}
                            >
                                <Text style={{
                                    fontSize: 12,
                                    fontWeight: '700',
                                    color: isSelected ? '#fff' : theme.textSecondary,
                                }}>
                                    {alt}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            {/* Notas do exercício - estilo Strong */}
            {(notes || showNoteInput) ? (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        setShowNoteInput(true);
                        setLocalNote(notes || '');
                        setTimeout(() => noteInputRef.current?.focus(), 100);
                    }}
                    style={{
                        backgroundColor: '#5d5832',
                        marginHorizontal: 0,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#edbf26',
                        marginBottom: 8,
                    }}
                >
                    {showNoteInput ? (
                        <TextInput
                            ref={noteInputRef}
                            value={localNote}
                            onChangeText={handleNoteChange}
                            onBlur={() => {
                                // Cancela debounce pendente e salva imediatamente
                                if (debounceRef.current) clearTimeout(debounceRef.current);
                                setShowNoteInput(false);
                                onUpdateNotes?.(exerciseId, localNote);
                            }}
                            placeholder="Adicionar nota..."
                            placeholderTextColor="#edbf2680"
                            style={{
                                color: '#edbf26',
                                fontSize: 14,
                                padding: 0,
                                minHeight: 20,
                            }}
                            multiline
                            autoFocus
                        />
                    ) : (
                        <Text style={{ color: '#edbf26', fontSize: 14 }}>{notes}</Text>
                    )}
                </TouchableOpacity>
            ) : null}

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
        prevProps.notes !== nextProps.notes ||
        prevProps.isSuperset !== nextProps.isSuperset ||
        prevProps.supersetPosition !== nextProps.supersetPosition ||
        prevProps.isSupersetLinkedWithNext !== nextProps.isSupersetLinkedWithNext ||
        (prevProps.onToggleSuperset !== undefined) !== (nextProps.onToggleSuperset !== undefined) ||
        (prevProps.onRemoveExercise !== undefined) !== (nextProps.onRemoveExercise !== undefined) ||
        (prevProps.onOpenExerciseDetail !== undefined) !== (nextProps.onOpenExerciseDetail !== undefined)
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
