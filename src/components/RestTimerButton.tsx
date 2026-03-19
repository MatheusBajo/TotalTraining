/**
 * RestTimerButton - Botão de timer que expande para a direita quando ativo
 *
 * Inativo: [🕐]  (44x44, ícone centralizado, fundo fieldColor, sem azul)
 * Ativo:   [🕐  1:30  ✕]  (expande pra direita, bg azul diminuindo da direita→esquerda)
 *
 * Usa timestamps (não setInterval puro) para sobreviver ao background do iOS.
 */
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Text, TouchableOpacity, StyleSheet, AppState, AppStateStatus } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { Timer, X } from 'phosphor-react-native';
import { CoreHaptics } from 'expo-core-haptics';

interface RestTimerButtonProps {
    isActive: boolean;
    initialSeconds: number;
    onFinish: () => void;
    onDismiss: () => void;
    onPress: () => void;
    primaryColor: string;
    fieldColor: string;
    textColor: string;
}

export const RestTimerButton = memo(({
    isActive,
    initialSeconds,
    onFinish,
    onDismiss,
    onPress,
    primaryColor,
    fieldColor,
    textColor,
}: RestTimerButtonProps) => {
    const [seconds, setSeconds] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const prevActiveRef = useRef(false);
    const onFinishRef = useRef(onFinish);
    onFinishRef.current = onFinish;

    // Timestamps para sobreviver ao background
    const endTimeRef = useRef(0); // quando o timer deve terminar (ms)
    const isActiveRef = useRef(false);

    // SharedValues
    const expansion = useSharedValue(0);   // 0=collapsed, 1=expanded
    const progress = useSharedValue(0);    // 0=vazio, 1=cheio

    // Calcula remaining a partir do timestamp
    const calcRemaining = useCallback(() => {
        if (endTimeRef.current <= 0) return 0;
        return Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    }, []);

    // Tick: recalcula a partir do timestamp real
    const tick = useCallback(() => {
        const remaining = calcRemaining();
        setSeconds(remaining);

        if (remaining <= 0) {
            // Timer terminou
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            try { CoreHaptics.isSupported() && CoreHaptics.patterns.success(); } catch {}
            onFinishRef.current();
            return;
        }

        if (remaining <= 4) {
            try { CoreHaptics.isSupported() && CoreHaptics.tap.medium(); } catch {}
        }
    }, [calcRemaining]);

    // Inicia o interval de 1s
    const startInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(tick, 1000);
    }, [tick]);

    // Detecta transição isActive
    useEffect(() => {
        const wasActive = prevActiveRef.current;
        prevActiveRef.current = isActive;
        isActiveRef.current = isActive;

        if (isActive && !wasActive) {
            // START — guarda timestamp de quando termina
            endTimeRef.current = Date.now() + initialSeconds * 1000;
            setSeconds(initialSeconds);
            setTotalSeconds(initialSeconds);
            progress.value = 1;
            expansion.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
            setTimeout(() => startInterval(), 50);
        } else if (!isActive && wasActive) {
            // STOP: retrai suavemente
            endTimeRef.current = 0;
            expansion.value = withTiming(0, { duration: 250 });
            progress.value = withTiming(0, { duration: 200 });
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setSeconds(0);
        }
    }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

    // AppState: recalcula ao voltar do background
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
            if (nextState === 'active' && isActiveRef.current && endTimeRef.current > 0) {
                const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));

                if (remaining <= 0) {
                    // Timer expirou no background
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    setSeconds(0);
                    try { CoreHaptics.isSupported() && CoreHaptics.patterns.success(); } catch {}
                    onFinishRef.current();
                } else {
                    // Ainda tem tempo — atualiza e reinicia interval
                    setSeconds(remaining);
                    startInterval();
                }
            }
        });
        return () => subscription.remove();
    }, [startInterval]);

    // Cleanup no unmount
    useEffect(() => () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Progresso visual suave
    useEffect(() => {
        if (totalSeconds > 0 && isActive) {
            progress.value = withTiming(Math.max(0, seconds / totalSeconds), {
                duration: 900,
                easing: Easing.linear,
            });
        }
    }, [seconds]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePress = useCallback(() => {
        if (isActive) {
            try { CoreHaptics.isSupported() && CoreHaptics.tap.light(); } catch {}
            onDismiss();
        } else {
            onPress();
        }
    }, [isActive, onDismiss, onPress]);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const rem = secs % 60;
        return `${mins}:${rem.toString().padStart(2, '0')}`;
    };

    // ========== ANIMATED STYLES ==========

    // Container: 44 → 130
    const containerStyle = useAnimatedStyle(() => ({
        width: interpolate(expansion.value, [0, 1], [44, 130], Extrapolation.CLAMP),
    }));

    // Background azul — só visível quando expandido (opacity vinculada ao expansion)
    const progressStyle = useAnimatedStyle(() => ({
        width: `${Math.max(0, progress.value * 100)}%` as any,
        opacity: interpolate(expansion.value, [0, 0.3], [0, 1], Extrapolation.CLAMP),
    }));

    // Countdown text
    const countdownStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expansion.value, [0.6, 1], [0, 1], Extrapolation.CLAMP),
        transform: [{
            translateX: interpolate(expansion.value, [0.6, 1], [10, 0], Extrapolation.CLAMP),
        }],
    }));

    // Botão X
    const closeStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expansion.value, [0.7, 1], [0, 1], Extrapolation.CLAMP),
    }));

    // Ícone: troca cor suavemente (2 camadas com opacity)
    const iconInactiveStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expansion.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    }));
    const iconActiveStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expansion.value, [0.3, 0.7], [0, 1], Extrapolation.CLAMP),
    }));

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <TouchableOpacity
                onPress={handlePress}
                style={[styles.button, { backgroundColor: fieldColor }]}
                activeOpacity={0.7}
            >
                {/* Background azul de progresso — invisível quando collapsed */}
                <Animated.View
                    style={[styles.progressBg, { backgroundColor: primaryColor }, progressStyle]}
                />

                {/* Ícone fixo na esquerda — cor muda com expansion */}
                <Animated.View style={[styles.iconWrap, iconInactiveStyle]}>
                    <Timer size={20} color={textColor} />
                </Animated.View>
                <Animated.View style={[styles.iconWrap, iconActiveStyle]}>
                    <Timer size={20} color="#fff" weight="bold" />
                </Animated.View>

                {/* Countdown */}
                <Animated.View style={[styles.countdownWrap, countdownStyle]}>
                    <Text style={styles.countdownText}>{formatTime(seconds)}</Text>
                </Animated.View>

                {/* X fechar */}
                <Animated.View style={[styles.closeWrap, closeStyle]}>
                    <X size={14} color="rgba(255,255,255,0.8)" weight="bold" />
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        height: 44,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden',
    },
    progressBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
    },
    iconWrap: {
        position: 'absolute',
        left: 0,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countdownWrap: {
        position: 'absolute',
        left: 40,
    },
    countdownText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    closeWrap: {
        position: 'absolute',
        right: 10,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
