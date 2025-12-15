import React, { useRef, memo, useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { Check, Barbell, Repeat, Target } from 'phosphor-react-native';
import { SetType } from './SetTypeModal';
import { SetTypeDropdown } from './SetTypeDropdown';

interface SetRowProps {
    setId: string;
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
    onUpdate: (setId: string, field: 'kg' | 'reps' | 'rir', value: string) => void;
    onToggle: (setId: string) => void;
    onChangeType: (setId: string, type: SetType) => void;
    onFillFromPR?: (setId: string) => void;
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

const SetRowComponent = ({ setId, index, prev, prData, kg, reps, rir, completed, type, targetReps, targetRir, onUpdate, onToggle, onChangeType, onFillFromPR }: SetRowProps) => {
    const { theme } = useTheme();
    const kgRef = useRef<TextInput>(null);
    const repsRef = useRef<TextInput>(null);
    const rirRef = useRef<TextInput>(null);

    // Estados de erro para validação
    const [kgError, setKgError] = useState(false);
    const [repsError, setRepsError] = useState(false);

    // Animação de shake
    const shakeX = useSharedValue(0);

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeX.value }],
    }));

    const triggerShake = useCallback(() => {
        shakeX.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );
    }, []);

    // Handlers memoizados que incluem o setId
    const handleToggle = useCallback(() => {
        // Validação: kg e reps são obrigatórios para completar
        if (!completed) {
            const missingKg = !kg || kg.trim() === '';
            const missingReps = !reps || reps.trim() === '';

            if (missingKg || missingReps) {
                setKgError(missingKg);
                setRepsError(missingReps);
                triggerShake();

                // Limpa erro após 2 segundos
                setTimeout(() => {
                    setKgError(false);
                    setRepsError(false);
                }, 2000);

                return;
            }
        }

        onToggle(setId);
    }, [setId, onToggle, completed, kg, reps, triggerShake]);

    const handleChangeType = useCallback((newType: SetType) => {
        onChangeType(setId, newType);
    }, [setId, onChangeType]);

    const handleUpdateKg = useCallback((value: string) => {
        if (kgError) setKgError(false);
        onUpdate(setId, 'kg', value);
    }, [setId, onUpdate, kgError]);

    const handleUpdateReps = useCallback((value: string) => {
        if (repsError) setRepsError(false);
        onUpdate(setId, 'reps', value);
    }, [setId, onUpdate, repsError]);

    const handleUpdateRir = useCallback((value: string) => {
        onUpdate(setId, 'rir', value);
    }, [setId, onUpdate]);

    // Preenche campos com dados do PR
    const handleFillFromPR = useCallback(() => {
        if (onFillFromPR && !completed) {
            onFillFromPR(setId);
        }
    }, [setId, onFillFromPR, completed]);

    // Formata PR: "20kg x 9 @ 2" (20kg, 9 reps, RIR 2)
    const formatPR = () => {
        if (!prData) return prev || '-';

        const { weight, reps: prReps, rir: prRir } = prData;
        const rirStr = prRir !== null ? ` @ ${prRir}` : '';

        return `${weight}kg x ${prReps}${rirStr}`;
    };

    const getTypeBackgroundColor = () => {
        switch (type) {
            case 'W': return '#f59e0b10';
            case 'D': return '#a855f710';
            case 'F': return '#ef444410';
            case 'R': return '#06b6d410';
            case 'S': return '#10b98110';
            default: return 'transparent';
        }
    };

    const rowBackgroundColor = completed ? '#22c55e20' : getTypeBackgroundColor();
    const checkboxBackgroundColor = completed ? '#22c55e' : theme.surface;
    const checkColor = completed ? '#fff' : theme.textSecondary;

    // Placeholders baseados no PR
    const kgPlaceholder = prData ? String(prData.weight) : '-';
    const repsPlaceholder = prData ? String(prData.reps) : (targetReps || '-');
    const rirPlaceholder = prData?.rir !== null && prData?.rir !== undefined ? String(prData.rir) : (targetRir || '-');

    // Cores de erro
    const kgBorderColor = kgError ? '#ef4444' : 'transparent';
    const repsBorderColor = repsError ? '#ef4444' : 'transparent';

    return (
        <Animated.View style={[styles.row, { backgroundColor: rowBackgroundColor }, shakeStyle]}>
            {/* Set Number / Type - Dropdown */}
            <SetTypeDropdown
                currentType={type}
                index={index}
                completed={completed}
                onSelect={handleChangeType}
            />

            {/* PR - Clicável para preencher campos */}
            <TouchableOpacity
                className="flex-1 items-center justify-center"
                onPress={handleFillFromPR}
                disabled={completed}
                activeOpacity={completed ? 1 : 0.6}
            >
                <Text
                    style={{ color: theme.text }}
                    className="text-xs text-center"
                >
                    {formatPR()}
                </Text>
            </TouchableOpacity>

            {/* KG */}
            <View className="flex-1 items-center justify-center mx-1">
                <View
                    style={{
                        backgroundColor: theme.background,
                        borderWidth: 2,
                        borderColor: kgBorderColor,
                        borderRadius: 4,
                    }}
                    className="flex-row items-center px-1"
                >
                    <Barbell size={12} color={kgError ? '#ef4444' : theme.textSecondary} weight="bold" />
                    <TextInput
                        ref={kgRef}
                        value={kg}
                        onChangeText={handleUpdateKg}
                        keyboardType="decimal-pad"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => repsRef.current?.focus()}
                        placeholder={kgPlaceholder}
                        placeholderTextColor={theme.textSecondary}
                        style={{ color: theme.text }}
                        className="flex-1 text-center py-1 font-bold"
                    />
                </View>
            </View>

            {/* Reps */}
            <View className="flex-1 items-center justify-center mx-1">
                <View
                    style={{
                        backgroundColor: theme.background,
                        borderWidth: 2,
                        borderColor: repsBorderColor,
                        borderRadius: 4,
                    }}
                    className="flex-row items-center px-1"
                >
                    <Repeat size={12} color={repsError ? '#ef4444' : theme.textSecondary} weight="bold" />
                    <TextInput
                        ref={repsRef}
                        value={reps}
                        onChangeText={handleUpdateReps}
                        keyboardType="number-pad"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => rirRef.current?.focus()}
                        placeholder={repsPlaceholder}
                        placeholderTextColor={theme.textSecondary}
                        style={{ color: theme.text }}
                        className="flex-1 text-center py-1 font-bold"
                    />
                </View>
            </View>

            {/* RIR */}
            <View className="flex-1 items-center justify-center mx-1">
                <View style={{ backgroundColor: theme.background, borderRadius: 4 }} className="flex-row items-center px-1">
                    <Target size={12} color={theme.textSecondary} weight="bold" />
                    <TextInput
                        ref={rirRef}
                        value={rir}
                        onChangeText={handleUpdateRir}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        placeholder={rirPlaceholder}
                        placeholderTextColor={theme.textSecondary}
                        style={{ color: theme.text }}
                        className="flex-1 text-center py-1 font-bold"
                    />
                </View>
            </View>

            {/* Checkbox */}
            <TouchableOpacity
                onPress={handleToggle}
                style={[styles.checkbox, { backgroundColor: checkboxBackgroundColor }]}
                activeOpacity={0.8}
            >
                <Check size={16} color={checkColor} weight="bold" />
            </TouchableOpacity>
        </Animated.View>
    );
};

// Memoiza o componente para evitar re-renders desnecessários
export const SetRow = memo(SetRowComponent, (prevProps, nextProps) => {
    // Só re-renderiza se props relevantes mudarem
    return (
        prevProps.kg === nextProps.kg &&
        prevProps.reps === nextProps.reps &&
        prevProps.rir === nextProps.rir &&
        prevProps.completed === nextProps.completed &&
        prevProps.type === nextProps.type &&
        prevProps.index === nextProps.index &&
        prevProps.prev === nextProps.prev &&
        prevProps.targetReps === nextProps.targetReps &&
        prevProps.targetRir === nextProps.targetRir
    );
});

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    checkbox: {
        width: 32,
        height: 32,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
});
