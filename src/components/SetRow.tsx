import React, { useRef, memo, useCallback, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withSpring,
    interpolate,
    Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
import { useTheme } from '../theme';
import { Check, Barbell, Repeat, Target } from 'phosphor-react-native';
import { SetType } from './SetTypeModal';
import { SetTypeDropdown } from './SetTypeDropdown';
import { KeyboardInput } from './KeyboardInput';

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

    // IDs unicos para registro no contexto (passed to KeyboardInput)
    const kgInputId = `${setId}-kg`;
    const repsInputId = `${setId}-reps`;
    const rirInputId = `${setId}-rir`;

    // Estados de erro para validação
    const [kgError, setKgError] = useState(false);
    const [repsError, setRepsError] = useState(false);

    // Animação de shake (erro)
    const shakeX = useSharedValue(0);

    // Animação de Haptic (sucesso)
    // 0 -> 1: Progresso do verde descendo
    const progress = useSharedValue(completed ? 1 : 0);
    // Flash de impacto: 0 -> 1 -> 0
    const impactFlash = useSharedValue(0);
    // Scale: 1 -> 1.02 -> 1 (sobe com buildup, volta na porrada)
    const rowScale = useSharedValue(1);

    // Reage a mudanças em 'completed'
    useEffect(() => {
        if (completed) {
            // SEQUÊNCIA DE SUCESSO SINCRONIZADA COM HAPTIC
            // 0ms -- 500ms: Buildup (Verde descendo + Scale subindo)
            // 550ms: Impacto (Flash + Scale volta)

            // Verde desce de cima pra baixo
            progress.value = withTiming(1, {
                duration: 500,
                easing: Easing.out(Easing.cubic)
            });

            // Scale sobe durante buildup
            rowScale.value = withTiming(1.015, {
                duration: 500,
                easing: Easing.out(Easing.cubic)
            });

            // Na porrada (550ms): flash + scale volta com bounce
            setTimeout(() => {
                impactFlash.value = withSequence(
                    withTiming(1, { duration: 50 }),
                    withTiming(0, { duration: 300 })
                );
                rowScale.value = withSpring(1, {
                    damping: 12,
                    stiffness: 400,
                });
            }, 500);

        } else {
            // Reset rápido
            progress.value = withTiming(0, { duration: 200 });
            impactFlash.value = 0;
            rowScale.value = withTiming(1, { duration: 150 });
        }
    }, [completed]);

    // Estilo com shake + scale
    const rowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: shakeX.value },
            { scale: rowScale.value },
        ],
    }));

    // Verde desce de cima pra baixo (cobre 100%)
    const gradientFillStyle = useAnimatedStyle(() => {
        // translateY: -100% (escondido acima) -> 0% (cobrindo tudo)
        const translateY = interpolate(
            progress.value,
            [0, 1],
            [-100, 0]
        );

        return {
            transform: [{ translateY: `${translateY}%` }]
        };
    });

    // Flash de impacto
    const impactStyle = useAnimatedStyle(() => ({
        opacity: impactFlash.value,
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

    // Handlers memoizados que incluem o setId


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

    // Background: só mostra cor do tipo se NÃO está completed
    // Quando completed, o verde sólido cobre tudo
    const rowBackgroundColor = theme.surface;

    const checkboxBackgroundColor = completed ? '#22c55e' : theme.surface;
    const checkColor = completed ? '#fff' : theme.textSecondary;

    // Cor do texto "Anterior" - disabled quando completed
    const anteriorTextColor = completed ? theme.textSecondary : theme.text;
    const anteriorOpacity = completed ? 0.5 : 1;

    // Placeholders baseados no PR
    const kgPlaceholder = prData ? String(prData.weight) : '-';
    const repsPlaceholder = prData ? String(prData.reps) : (targetReps || '-');
    const rirPlaceholder = prData?.rir !== null && prData?.rir !== undefined ? String(prData.rir) : (targetRir || '-');

    // Cores de erro ou Foco (agora handled no KeyboardInput)
    // ...

    return (
        <Animated.View style={[styles.row, { backgroundColor: rowBackgroundColor, overflow: 'hidden' }, rowAnimatedStyle]}>
            {/* Background Layer: Verde sólido descendo de cima */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: '#22c55e20',
                        zIndex: -2,
                    },
                    gradientFillStyle
                ]}
            />

            {/* Background Layer: Flash branco no impacto */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: '#ffffff40',
                        zIndex: -1,
                    },
                    impactStyle
                ]}
            />

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
                    style={{
                        color: anteriorTextColor,
                        opacity: anteriorOpacity,
                    }}
                    className="text-xs text-center"
                >
                    {formatPR()}
                </Text>
            </TouchableOpacity>

            {/* KG */}
            <View className="flex-1 items-center justify-center mx-1">
                <KeyboardInput
                    id={kgInputId}
                    value={kg}
                    placeholder={kgPlaceholder}
                    onChange={(val) => onUpdate(setId, 'kg', val)}
                    inputStep={2.5}
                    hasError={kgError}
                    icon={<Barbell size={12} color={kgError ? '#ef4444' : theme.textSecondary} weight="bold" />}
                />
            </View>

            {/* Reps */}
            <View className="flex-1 items-center justify-center mx-1">
                <KeyboardInput
                    id={repsInputId}
                    value={reps}
                    placeholder={repsPlaceholder}
                    onChange={(val) => onUpdate(setId, 'reps', val)}
                    inputStep={1}
                    hasError={repsError}
                    icon={<Repeat size={12} color={repsError ? '#ef4444' : theme.textSecondary} weight="bold" />}
                    keyboardType="number-pad"
                />
            </View>

            {/* RIR */}
            <View className="flex-1 items-center justify-center mx-1">
                <KeyboardInput
                    id={rirInputId}
                    value={rir}
                    placeholder={rirPlaceholder}
                    onChange={(val) => onUpdate(setId, 'rir', val)}
                    inputStep={1}
                    icon={<Target size={12} color={theme.textSecondary} weight="bold" />}
                    keyboardType="number-pad"
                />
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
