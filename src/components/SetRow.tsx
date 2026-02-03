import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withSpring,
    withDelay,
    interpolate,
    runOnJS,
    Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useTheme } from '../theme';
import { Check, Barbell, Repeat, Target, Trash } from 'phosphor-react-native';
import { SetType } from './SetTypeModal';
import { SetTypeDropdown } from './SetTypeDropdown';
import { KeyboardInput } from './KeyboardInput';
import { CoreHaptics } from 'expo-core-haptics';

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
    onRemove?: (setId: string) => void;
}

const SWIPE_THRESHOLD = -80;

const SetRowComponent = ({
    setId,
    index,
    prev,
    prData,
    kg,
    reps,
    rir,
    completed,
    type,
    targetReps,
    targetRir,
    onUpdate,
    onToggle,
    onChangeType,
    onFillFromPR,
    onRemove
}: SetRowProps) => {
    const { theme } = useTheme();

    // ========== ANIMAÇÕES ESSENCIAIS ==========
    // Swipe-to-delete
    const translateX = useSharedValue(0);
    const deleteOpacity = useSharedValue(0);

    // Shake para erro
    const shakeX = useSharedValue(0);

    // Animação do checkbox (scale)
    const checkScale = useSharedValue(completed ? 1 : 0);

    // Animação de completar: verde preenchendo + flash
    const fillProgress = useSharedValue(completed ? 1 : 0);
    const flashOpacity = useSharedValue(0);


    // ========== ESTADO DE ERRO ==========
    const [kgError, setKgError] = useState(false);
    const [repsError, setRepsError] = useState(false);

    // IDs para o KeyboardInput
    const kgInputId = `${setId}-kg`;
    const repsInputId = `${setId}-reps`;
    const rirInputId = `${setId}-rir`;

    // Handler para deletar a série
    const handleRemove = useCallback(() => {
        if (onRemove) {
            if (CoreHaptics.isSupported()) {
                CoreHaptics.tap.heavy();
            }
            onRemove(setId);
        }
    }, [setId, onRemove]);

    // Gesture pan para swipe-to-delete
    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate((event) => {
            if (event.translationX < 0) {
                translateX.value = Math.max(event.translationX, -120);
                deleteOpacity.value = interpolate(
                    event.translationX,
                    [0, SWIPE_THRESHOLD],
                    [0, 1]
                );
            }
        })
        .onEnd((event) => {
            if (event.translationX < SWIPE_THRESHOLD) {
                translateX.value = withTiming(-400, { duration: 200 });
                runOnJS(handleRemove)();
            } else {
                translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
                deleteOpacity.value = withTiming(0, { duration: 150 });
            }
        });

    // Estilo da row (swipe + shake)
    const rowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value + shakeX.value },
        ],
    }));

    // Estilo do botão de delete
    const deleteButtonStyle = useAnimatedStyle(() => ({
        opacity: deleteOpacity.value,
    }));

    // Estilo do check icon (animação de scale)
    const checkAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
        opacity: checkScale.value,
    }));

    // Estilo do preenchimento verde (de cima pra baixo)
    // Usa scaleY para animação suave (0 = invisível, 1 = completo)
    const fillAnimatedStyle = useAnimatedStyle(() => {
        'worklet';
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#22c55e20',
            transform: [
                { scaleY: fillProgress.value },
            ],
            transformOrigin: 'top',
        };
    });

    // Estilo do flash branco
    const flashAnimatedStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        opacity: flashOpacity.value,
    }));

    // Trigger shake animation
    const triggerShake = useCallback(() => {
        shakeX.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );
    }, [shakeX]);

    // ========== HANDLERS ==========
    const handleToggle = useCallback(() => {
        if (!completed) {
            const missingKg = !kg || kg.trim() === '';
            const missingReps = !reps || reps.trim() === '';

            if (missingKg || missingReps) {
                setKgError(missingKg);
                setRepsError(missingReps);
                triggerShake();

                if (CoreHaptics.isSupported()) {
                    CoreHaptics.tap.custom(0.6, 0.3);
                }

                setTimeout(() => {
                    setKgError(false);
                    setRepsError(false);
                }, 2000);

                return;
            }

            // Duração total da animação de preenchimento
            const fillDuration = 400; // Velocidade normal (um pouco mais lento que 280)
            const flashDelay = fillDuration - 60;
            const flashRiseDuration = 60;
            const flashPeakTime = flashDelay + flashRiseDuration;

            // 1. Preenche de verde de cima pra baixo - LINEAR
            fillProgress.value = withTiming(1, {
                duration: fillDuration,
                easing: Easing.linear,
            });

            // 2. Flash branco no final do preenchimento
            flashOpacity.value = withDelay(
                flashDelay,
                withSequence(
                    withTiming(0.3, { duration: flashRiseDuration }),
                    withTiming(0, { duration: 80 })
                )
            );

            // 3. Check aparece quando flash está no pico
            checkScale.value = withDelay(
                flashPeakTime,
                withTiming(1, { duration: 80, easing: Easing.out(Easing.back(1.5)) })
            );

            // 4. Haptic RAMP contínuo: grave → médio-agudo
            if (CoreHaptics.isSupported()) {
                CoreHaptics.ramp.custom(
                    0.5,  // fromIntensity: começa médio
                    0.6,  // toIntensity: termina médio-forte
                    0.15, // fromSharpness: começa grave
                    0.6,  // toSharpness: termina médio-agudo
                    fillDuration / 1000
                );

                // HEAVY no pico do flash
                setTimeout(() => {
                    CoreHaptics.tap.heavy();
                }, flashPeakTime);
            }
        } else {
            // Descompletando - reverte tudo
            fillProgress.value = withTiming(0, { duration: 150 });
            checkScale.value = withTiming(0, { duration: 150 });
        }

        onToggle(setId);
    }, [setId, onToggle, completed, kg, reps, triggerShake, checkScale]);

    const handleChangeType = useCallback((newType: SetType) => {
        onChangeType(setId, newType);
    }, [setId, onChangeType]);

    const handleFillFromPR = useCallback(() => {
        if (onFillFromPR && !completed) {
            onFillFromPR(setId);
        }
    }, [setId, onFillFromPR, completed]);

    // Formata PR: "20kg x 9 @ 2"
    const formatPR = useCallback(() => {
        if (!prData) return prev || '-';
        const { weight, reps: prReps, rir: prRir } = prData;
        const rirStr = prRir !== null ? ` @ ${prRir}` : '';
        return `${weight}kg x ${prReps}${rirStr}`;
    }, [prData, prev]);

    // ========== ESTILOS COMPUTADOS ==========
    const checkboxBackgroundColor = completed ? '#22c55e' : theme.field;
    const checkboxBorderColor = completed ? '#22c55e' : theme.textSecondary + '40';
    const anteriorTextColor = completed ? theme.textSecondary : theme.text;
    const anteriorOpacity = completed ? 0.5 : 1;

    // Placeholders baseados no PR
    const kgPlaceholder = prData ? String(prData.weight) : '-';
    const repsPlaceholder = prData ? String(prData.reps) : (targetReps || '-');
    const rirPlaceholder = prData?.rir !== null && prData?.rir !== undefined
        ? String(prData.rir)
        : (targetRir || '-');

    return (
        <View style={styles.swipeContainer}>
            {/* Background vermelho com ícone de lixeira */}
            <Animated.View style={[styles.deleteBackground, deleteButtonStyle]}>
                <Trash size={24} color="#fff" weight="bold" />
            </Animated.View>

            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[
                        styles.row,
                        { backgroundColor: theme.surface },
                        rowAnimatedStyle
                    ]}
                >
                    {/* Preenchimento verde animado */}
                    <Animated.View style={fillAnimatedStyle} pointerEvents="none" />

                    {/* Flash branco */}
                    <Animated.View style={flashAnimatedStyle} pointerEvents="none" />
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
                            disabled={completed}
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
                            disabled={completed}
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
                            disabled={completed}
                        />
                    </View>

                    {/* Checkbox com animação leve */}
                    <TouchableOpacity
                        onPress={handleToggle}
                        style={[
                            styles.checkbox,
                            {
                                backgroundColor: checkboxBackgroundColor,
                                borderWidth: completed ? 0 : 2,
                                borderColor: checkboxBorderColor,
                            }
                        ]}
                        activeOpacity={0.8}
                    >
                        <Animated.View style={checkAnimatedStyle}>
                            <Check size={16} color="#fff" weight="bold" />
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

// Memoização com comparação otimizada
export const SetRow = memo(SetRowComponent, (prevProps, nextProps) => {
    return (
        prevProps.kg === nextProps.kg &&
        prevProps.reps === nextProps.reps &&
        prevProps.rir === nextProps.rir &&
        prevProps.completed === nextProps.completed &&
        prevProps.type === nextProps.type &&
        prevProps.index === nextProps.index &&
        prevProps.prev === nextProps.prev &&
        prevProps.targetReps === nextProps.targetReps &&
        prevProps.targetRir === nextProps.targetRir &&
        prevProps.prData === nextProps.prData
    );
});

const styles = StyleSheet.create({
    swipeContainer: {
        position: 'relative',
        overflow: 'hidden',
    },
    deleteBackground: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 80,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        overflow: 'hidden', // Contém o preenchimento verde
        minHeight: 48,
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
