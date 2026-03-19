/**
 * RestTimerBanner - Timer de descanso inline entre header e exercícios
 *
 * Aparece como um banner compacto dentro do sheet após completar uma série.
 * Barra de progresso + countdown + controles (pause, +15s, skip).
 */
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { Play, Pause, X, Plus } from 'phosphor-react-native';
import { CoreHaptics } from 'expo-core-haptics';

interface RestTimerBannerProps {
    visible: boolean;
    initialSeconds: number;
    onDismiss: () => void;
    onFinish: () => void;
}

export const RestTimerBanner = memo(({ visible, initialSeconds, onDismiss, onFinish }: RestTimerBannerProps) => {
    const { theme } = useTheme();
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(true);
    const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Animações
    const progress = useSharedValue(1);
    const bannerHeight = useSharedValue(0);

    // Reset quando timer abre
    useEffect(() => {
        if (visible) {
            setSeconds(initialSeconds);
            setTotalSeconds(initialSeconds);
            setIsRunning(true);
            progress.value = 1;
            bannerHeight.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
        } else {
            bannerHeight.value = withTiming(0, { duration: 200 });
        }
    }, [visible, initialSeconds]);

    // Countdown
    useEffect(() => {
        if (!visible || !isRunning) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }

                    // Haptic de conclusão
                    if (CoreHaptics.isSupported()) {
                        CoreHaptics.patterns.success();
                    }

                    onFinish();
                    return 0;
                }

                // Haptic nos últimos 3 segundos
                if (prev <= 4 && CoreHaptics.isSupported()) {
                    CoreHaptics.tap.medium();
                }

                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [visible, isRunning, onFinish]);

    // Atualiza progresso visual
    useEffect(() => {
        if (totalSeconds > 0) {
            progress.value = withTiming(seconds / totalSeconds, {
                duration: 900,
                easing: Easing.linear,
            });
        }
    }, [seconds, totalSeconds]);

    // Handlers
    const togglePause = useCallback(() => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.light();
        }
        setIsRunning(prev => !prev);
    }, []);

    const addTime = useCallback(() => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.light();
        }
        setSeconds(prev => prev + 15);
        setTotalSeconds(prev => Math.max(prev, seconds + 15));
    }, [seconds]);

    const handleDismiss = useCallback(() => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.light();
        }
        onDismiss();
    }, [onDismiss]);

    // Estilo animado para a barra de progresso (largura relativa)
    const progressBarStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%` as any,
    }));

    // Estilo de entrada/saída do banner
    const containerStyle = useAnimatedStyle(() => {
        const h = bannerHeight.value;
        return {
            opacity: h,
            maxHeight: interpolate(h, [0, 1], [0, 120], Extrapolation.CLAMP),
            marginBottom: interpolate(h, [0, 1], [0, 12], Extrapolation.CLAMP),
            transform: [{ scale: interpolate(h, [0, 1], [0.95, 1], Extrapolation.CLAMP) }],
        };
    });

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    // Cor do timer muda nos últimos 5 segundos
    const isEnding = seconds <= 5 && seconds > 0;

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <View style={[styles.banner, { backgroundColor: theme.field }]}>
                {/* Barra de progresso no topo */}
                <View style={[styles.progressBar, { backgroundColor: theme.borderSubtle }]}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            { backgroundColor: isEnding ? '#f59e0b' : theme.primary },
                            progressBarStyle,
                        ]}
                    />
                </View>

                {/* Conteúdo */}
                <View style={styles.content}>
                    {/* Lado esquerdo: Timer */}
                    <View style={styles.timerSection}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>DESCANSO</Text>
                        <Text style={[
                            styles.timeText,
                            { color: isEnding ? '#f59e0b' : theme.text },
                        ]}>
                            {formatTime(seconds)}
                        </Text>
                    </View>

                    {/* Lado direito: Controles */}
                    <View style={styles.controls}>
                        {/* +15s */}
                        <TouchableOpacity
                            style={[styles.controlBtn, { backgroundColor: theme.borderSubtle }]}
                            onPress={addTime}
                        >
                            <Plus size={14} color={theme.text} weight="bold" />
                            <Text style={[styles.controlText, { color: theme.text }]}>15s</Text>
                        </TouchableOpacity>

                        {/* Play/Pause */}
                        <TouchableOpacity
                            style={[styles.playBtn, { backgroundColor: theme.primary }]}
                            onPress={togglePause}
                        >
                            {isRunning ? (
                                <Pause size={16} color="#fff" weight="fill" />
                            ) : (
                                <Play size={16} color="#fff" weight="fill" />
                            )}
                        </TouchableOpacity>

                        {/* Fechar/Pular */}
                        <TouchableOpacity
                            style={[styles.controlBtn, { backgroundColor: theme.borderSubtle }]}
                            onPress={handleDismiss}
                        >
                            <X size={16} color={theme.textSecondary} weight="bold" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    banner: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: 3,
        width: '100%',
    },
    progressFill: {
        height: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    timerSection: {
        gap: 2,
    },
    label: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    timeText: {
        fontSize: 28,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    controlBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 3,
    },
    controlText: {
        fontSize: 12,
        fontWeight: '700',
    },
    playBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
