/**
 * RestTimer - Timer de descanso entre séries
 *
 * Aparece como um modal/overlay após completar uma série
 * Mostra countdown com animação circular
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedProps,
    withTiming,
    Easing,
    runOnJS,
    interpolate,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme';
import { Play, Pause, X, Plus, Minus } from 'phosphor-react-native';
import { CoreHaptics } from 'expo-core-haptics';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RestTimerProps {
    visible: boolean;
    initialSeconds: number;
    onClose: () => void;
    onFinish: () => void;
}

const CIRCLE_SIZE = 200;
const STROKE_WIDTH = 8;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const RestTimer = ({ visible, initialSeconds, onClose, onFinish }: RestTimerProps) => {
    const { theme } = useTheme();
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(true);
    const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Animação do círculo de progresso
    const progress = useSharedValue(1);

    // Reset quando timer abre
    useEffect(() => {
        if (visible) {
            setSeconds(initialSeconds);
            setTotalSeconds(initialSeconds);
            setIsRunning(true);
            progress.value = 1;
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
                    // Timer acabou
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

    const addTime = useCallback((amount: number) => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.light();
        }
        setSeconds(prev => Math.max(0, prev + amount));
        setTotalSeconds(prev => Math.max(prev, seconds + amount));
    }, [seconds]);

    const handleClose = useCallback(() => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.light();
        }
        onClose();
    }, [onClose]);

    // Estilos animados
    const circleProps = useAnimatedProps(() => ({
        strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    }));

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
                {/* Botão de fechar */}
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <X size={28} color="#fff" weight="bold" />
                </TouchableOpacity>

                {/* Título */}
                <Text style={styles.title}>Descanso</Text>

                {/* Timer circular */}
                <View style={styles.timerContainer}>
                    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svg}>
                        {/* Background circle */}
                        <Circle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                        />
                        {/* Progress circle */}
                        <AnimatedCircle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke={theme.primary}
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                            strokeDasharray={CIRCUMFERENCE}
                            animatedProps={circleProps}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                        />
                    </Svg>

                    {/* Tempo no centro */}
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTime(seconds)}</Text>
                    </View>
                </View>

                {/* Controles */}
                <View style={styles.controls}>
                    {/* -15s */}
                    <TouchableOpacity
                        style={[styles.adjustButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                        onPress={() => addTime(-15)}
                    >
                        <Minus size={20} color="#fff" weight="bold" />
                        <Text style={styles.adjustText}>15s</Text>
                    </TouchableOpacity>

                    {/* Play/Pause */}
                    <TouchableOpacity
                        style={[styles.playButton, { backgroundColor: theme.primary }]}
                        onPress={togglePause}
                    >
                        {isRunning ? (
                            <Pause size={32} color="#fff" weight="fill" />
                        ) : (
                            <Play size={32} color="#fff" weight="fill" />
                        )}
                    </TouchableOpacity>

                    {/* +15s */}
                    <TouchableOpacity
                        style={[styles.adjustButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                        onPress={() => addTime(15)}
                    >
                        <Plus size={20} color="#fff" weight="bold" />
                        <Text style={styles.adjustText}>15s</Text>
                    </TouchableOpacity>
                </View>

                {/* Skip */}
                <TouchableOpacity style={styles.skipButton} onPress={handleClose}>
                    <Text style={styles.skipText}>Pular descanso</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
    },
    timerContainer: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        position: 'absolute',
    },
    timeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#fff',
        fontVariant: ['tabular-nums'],
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        gap: 20,
    },
    adjustButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 4,
    },
    adjustText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    playButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButton: {
        marginTop: 40,
        padding: 16,
    },
    skipText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '500',
    },
});
