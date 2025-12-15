import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Player, AhapType } from 'expo-ahap';
import * as Haptics from 'expo-haptics';

// AHAP Patterns definidos inline

// GROSSO → FINO → CLICK
// Sharpness baixo = grosso/macio, Sharpness alto = fino/afiado
const completeSetPattern: any = {
    "Version": 1.0,
    "Pattern": [
        // --- MESMO BUILDUP GRAVE DE ANTES ---
        {
            "Event": {
                "Time": 0.0,
                "EventType": "HapticContinuous",
                "EventDuration": 0.5,
                "EventParameters": [
                    { "ParameterID": "HapticIntensity", "ParameterValue": 0.5 },
                    { "ParameterID": "HapticSharpness", "ParameterValue": 0.5 }
                ]
            }
        },
        {
            "ParameterCurve": {
                "ParameterID": "HapticIntensityControl",
                "Time": 0.0,
                "ParameterCurveControlPoints": [
                    { "Time": 0.0, "ParameterValue": 0.0 },
                    { "Time": 0.2, "ParameterValue": 0.5 }, // Fica forte rápido
                    { "Time": 0.5, "ParameterValue": 0.5 }
                ]
            }
        },
        {
            "ParameterCurve": {
                "ParameterID": "HapticSharpnessControl",
                "Time": 0.0,
                "ParameterCurveControlPoints": [
                    { "Time": 0.0, "ParameterValue": -0.5 }, // Começa no chão (grave)
                    { "Time": 0.4, "ParameterValue": -0.4 }, // Segura o grave até o fim
                    { "Time": 0.5, "ParameterValue": 0.5 }   // Sobe no último instante
                ]
            }
        },

        // --- AQUI ESTÁ A MUDANÇA: A PANCADA GROSSA FINAL ---
        {
            "Event": {
                "Time": 0.55,
                "EventType": "HapticTransient",
                "EventParameters": [
                    // FORÇA MÁXIMA
                    { "ParameterID": "HapticIntensity", "ParameterValue": 1.0 },

                    // O SEGREDO DO "GROSSO": SHARPNESS ZERO
                    // Isso faz o motor dar um "coice" pesado em vez de um click seco.
                    { "ParameterID": "HapticSharpness", "ParameterValue": 0.0 }
                ]
            }
        }
    ]
};
const finishWorkoutPattern: AhapType = {
    Version: 1.0,
    Pattern: [
        {
            Event: {
                Time: 0.0,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.3 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.2 },
                ],
            },
        },
        {
            Event: {
                Time: 0.08,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.4 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.3 },
                ],
            },
        },
        {
            Event: {
                Time: 0.15,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.5 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.4 },
                ],
            },
        },
        {
            Event: {
                Time: 0.21,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.65 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.5 },
                ],
            },
        },
        {
            Event: {
                Time: 0.26,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.8 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.6 },
                ],
            },
        },
        {
            Event: {
                Time: 0.30,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 1.0 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.8 },
                ],
            },
        },
        {
            Event: {
                Time: 0.35,
                EventType: 'HapticContinuous',
                EventDuration: 0.3,
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.7 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.3 },
                ],
            },
        },
        {
            ParameterCurve: {
                ParameterID: 'HapticIntensityControl',
                Time: 0.35,
                ParameterCurveControlPoints: [
                    { Time: 0, ParameterValue: 0.7 },
                    { Time: 0.15, ParameterValue: 0.9 },
                    { Time: 0.3, ParameterValue: 0.0 },
                ],
            },
        },
        {
            Event: {
                Time: 0.75,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 1.0 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 1.0 },
                ],
            },
        },
        {
            Event: {
                Time: 0.85,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.8 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.6 },
                ],
            },
        },
    ],
};

const newPRPattern: AhapType = {
    Version: 1.0,
    Pattern: [
        {
            Event: {
                Time: 0.0,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 1.0 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.9 },
                ],
            },
        },
        {
            Event: {
                Time: 0.1,
                EventType: 'HapticContinuous',
                EventDuration: 0.2,
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.6 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.3 },
                ],
            },
        },
        {
            Event: {
                Time: 0.35,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.7 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.7 },
                ],
            },
        },
        {
            Event: {
                Time: 0.42,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.8 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.8 },
                ],
            },
        },
        {
            Event: {
                Time: 0.49,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.9 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.9 },
                ],
            },
        },
        {
            Event: {
                Time: 0.6,
                EventType: 'HapticContinuous',
                EventDuration: 0.25,
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.8 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.4 },
                ],
            },
        },
        {
            ParameterCurve: {
                ParameterID: 'HapticIntensityControl',
                Time: 0.6,
                ParameterCurveControlPoints: [
                    { Time: 0, ParameterValue: 0.8 },
                    { Time: 0.12, ParameterValue: 1.0 },
                    { Time: 0.25, ParameterValue: 0.0 },
                ],
            },
        },
    ],
};

const selectionPattern: AhapType = {
    Version: 1.0,
    Pattern: [
        {
            Event: {
                Time: 0.0,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.3 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.5 },
                ],
            },
        },
    ],
};

const errorPattern: AhapType = {
    Version: 1.0,
    Pattern: [
        {
            Event: {
                Time: 0.0,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.8 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.9 },
                ],
            },
        },
        {
            Event: {
                Time: 0.1,
                EventType: 'HapticTransient',
                EventParameters: [
                    { ParameterID: 'HapticIntensity', ParameterValue: 0.8 },
                    { ParameterID: 'HapticSharpness', ParameterValue: 0.9 },
                ],
            },
        },
    ],
};

/**
 * Hook para padrões de vibração personalizados usando Core Haptics (AHAP)
 * Padrões estilo Duolingo com intensidade e sharpness customizados
 */
export const useHapticPatterns = () => {
    const isAvailable = Platform.OS === 'ios';

    // Refs para os players (para não recriar a cada render)
    const playersRef = useRef<{
        completeSet?: Player;
        finishWorkout?: Player;
        newPR?: Player;
        selection?: Player;
        error?: Player;
    }>({});

    // Inicializa os players uma vez
    useEffect(() => {
        if (!isAvailable) return;

        try {
            playersRef.current = {
                completeSet: new Player(completeSetPattern),
                finishWorkout: new Player(finishWorkoutPattern),
                newPR: new Player(newPRPattern),
                selection: new Player(selectionPattern),
                error: new Player(errorPattern),
            };
        } catch (e) {
            console.warn('[Haptics] Failed to initialize Core Haptics players:', e);
        }

        // Cleanup
        return () => {
            try {
                Object.values(playersRef.current).forEach(player => player?.unregister());
            } catch (e) {
                // Ignore cleanup errors
            }
        };
    }, [isAvailable]);

    /**
     * Vibração de seleção (tick suave)
     */
    const selection = useCallback(async () => {
        if (!isAvailable) return;
        try {
            playersRef.current.selection?.start();
        } catch {
            await Haptics.selectionAsync();
        }
    }, [isAvailable]);

    /**
     * Completar série - rising intensity pattern
     */
    const completeSet = useCallback(async () => {
        if (!isAvailable) return;
        try {
            playersRef.current.completeSet?.start();
        } catch {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [isAvailable]);

    /**
     * Novo PR batido! - achievement unlocked
     */
    const newPR = useCallback(async () => {
        if (!isAvailable) return;
        try {
            playersRef.current.newPR?.start();
        } catch {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [isAvailable]);

    /**
     * Terminar treino - celebration fanfare
     */
    const finishWorkout = useCallback(async () => {
        if (!isAvailable) return;
        try {
            playersRef.current.finishWorkout?.start();
        } catch {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [isAvailable]);

    /**
     * Erro - double buzz
     */
    const error = useCallback(async () => {
        if (!isAvailable) return;
        try {
            playersRef.current.error?.start();
        } catch {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    }, [isAvailable]);

    /**
     * Warning - usa expo-haptics
     */
    const warning = useCallback(async () => {
        if (!isAvailable) return;
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }, [isAvailable]);

    /**
     * Adicionar item - light double tap
     */
    const addItem = useCallback(async () => {
        if (!isAvailable) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, [isAvailable]);

    /**
     * Remover item - rigid double tap
     */
    const removeItem = useCallback(async () => {
        if (!isAvailable) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }, [isAvailable]);

    /**
     * Impacto suave
     */
    const softImpact = useCallback(async () => {
        if (!isAvailable) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }, [isAvailable]);

    /**
     * Impacto rígido
     */
    const rigidImpact = useCallback(async () => {
        if (!isAvailable) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }, [isAvailable]);

    /**
     * Progress bar - intensidade baseada no progresso
     */
    const progressBar = useCallback(async (progress: number) => {
        if (!isAvailable) return;

        if (progress >= 1) {
            playersRef.current.completeSet?.start();
        } else if (progress < 0.33) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (progress < 0.66) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    }, [isAvailable]);

    /**
     * Countdown tick - intensifica nos últimos segundos
     */
    const countdownTick = useCallback(async (secondsRemaining: number) => {
        if (!isAvailable) return;

        if (secondsRemaining <= 3) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else if (secondsRemaining <= 10) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [isAvailable]);

    return {
        // Básicos
        selection,
        softImpact,
        rigidImpact,

        // Workout específicos
        completeSet,
        newPR,
        finishWorkout,
        addItem,
        removeItem,

        // Feedback
        error,
        warning,

        // Animações sincronizadas
        progressBar,
        countdownTick,

        // Utils
        isAvailable,
    };
};
