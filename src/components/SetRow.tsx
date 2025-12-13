import React, { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { Check, Barbell, Repeat, Target } from 'phosphor-react-native';
import { SetType } from './SetTypeModal';
import { SetTypeDropdown } from './SetTypeDropdown';
import { useHapticPatterns } from '../hooks';

interface SetRowProps {
    index: number;
    prev?: string;
    prData?: {
        weight: number;
        reps: number;
        rir: number | null;
    };
    kg: string;
    reps: string;
    rir: string;
    completed: boolean;
    type: SetType;
    targetReps?: string;
    targetRir?: string;
    onUpdate: (field: 'kg' | 'reps' | 'rir', value: string) => void;
    onToggle: () => void;
    onChangeType: (type: SetType) => void;
}

// Caracteres Unicode para superscript (0-9)
const SUPERSCRIPT_DIGITS: Record<string, string> = {
    '0': '\u2070',
    '1': '\u00B9',
    '2': '\u00B2',
    '3': '\u00B3',
    '4': '\u2074',
    '5': '\u2075',
    '6': '\u2076',
    '7': '\u2077',
    '8': '\u2078',
    '9': '\u2079',
};

// Converte número para superscript
const toSuperscript = (num: number): string => {
    return String(num).split('').map(d => SUPERSCRIPT_DIGITS[d] || d).join('');
};

export const SetRow = ({ index, prev, prData, kg, reps, rir, completed, type, targetReps, targetRir, onUpdate, onToggle, onChangeType }: SetRowProps) => {
    const { theme } = useTheme();
    const haptics = useHapticPatterns();
    const kgRef = useRef<TextInput>(null);
    const repsRef = useRef<TextInput>(null);
    const rirRef = useRef<TextInput>(null);

    // Formata PR com RIR em superscript: "20kg x 9²" (9 reps com RIR 2)
    const formatPR = () => {
        if (!prData) return prev || '-';

        const { weight, reps: prReps, rir: prRir } = prData;
        const rirStr = prRir !== null ? toSuperscript(prRir) : '';

        return `${weight}x${prReps}${rirStr}`;
    };

    const getBackgroundColor = () => {
        if (completed) return '#22c55e20'; // Green tint
        switch (type) {
            case 'W': return '#f59e0b10';
            case 'D': return '#a855f710';
            case 'F': return '#ef444410';
            case 'R': return '#06b6d410';
            case 'S': return '#10b98110';
            default: return 'transparent';
        }
    };

    return (
        <View style={{ backgroundColor: getBackgroundColor() }} className="flex-row items-center py-2 px-1 rounded-md mb-1">
            {/* Set Number / Type - Dropdown */}
            <SetTypeDropdown
                currentType={type}
                index={index}
                onSelect={onChangeType}
            />

            {/* PR */}
            <View className="flex-1 items-center justify-center">
                <Text style={{ color: theme.textSecondary }} className="text-xs text-center">
                    {formatPR()}
                </Text>
            </View>

            {/* KG */}
            <View className="flex-1 items-center justify-center mx-1">
                <View style={{ backgroundColor: theme.background }} className="flex-row items-center rounded px-1">
                    <Barbell size={12} color={theme.textSecondary} weight="bold" />
                    <TextInput
                        ref={kgRef}
                        value={kg}
                        onChangeText={(v) => onUpdate('kg', v)}
                        keyboardType="decimal-pad"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => repsRef.current?.focus()}
                        placeholder="-"
                        placeholderTextColor={theme.textSecondary}
                        style={{ color: theme.text }}
                        className="flex-1 text-center py-1 font-bold"
                    />
                </View>
            </View>

            {/* Reps */}
            <View className="flex-1 items-center justify-center mx-1">
                <View style={{ backgroundColor: theme.background }} className="flex-row items-center rounded px-1">
                    <Repeat size={12} color={theme.textSecondary} weight="bold" />
                    <TextInput
                        ref={repsRef}
                        value={reps}
                        onChangeText={(v) => onUpdate('reps', v)}
                        keyboardType="number-pad"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => rirRef.current?.focus()}
                        placeholder={targetReps || '-'}
                        placeholderTextColor={theme.textSecondary}
                        style={{ color: theme.text }}
                        className="flex-1 text-center py-1 font-bold"
                    />
                </View>
            </View>

            {/* RIR */}
            <View className="flex-1 items-center justify-center mx-1">
                <View style={{ backgroundColor: theme.background }} className="flex-row items-center rounded px-1">
                    <Target size={12} color={theme.textSecondary} weight="bold" />
                    <TextInput
                        ref={rirRef}
                        value={rir}
                        onChangeText={(v) => onUpdate('rir', v)}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        placeholder={targetRir || '-'}
                        placeholderTextColor={theme.textSecondary}
                        style={{ color: theme.text }}
                        className="flex-1 text-center py-1 font-bold"
                    />
                </View>
            </View>

            {/* Checkbox */}
            <TouchableOpacity
                onPress={() => {
                    // Vibra padrão crescente quando completa série
                    if (!completed) {
                        haptics.completeSet();
                    }
                    onToggle();
                }}
                style={{ backgroundColor: completed ? '#22c55e' : theme.surface }}
                className="w-8 h-8 rounded items-center justify-center ml-2"
            >
                <Check size={16} color={completed ? '#fff' : theme.textSecondary} weight="bold" />
            </TouchableOpacity>
        </View>
    );
};
