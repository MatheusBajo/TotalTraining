import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Hook para padrões de vibração personalizados estilo Duolingo
 * Sincroniza haptics com animações para criar feedback "juicy"
 */
export const useHapticPatterns = () => {
    // Verifica se haptics está disponível
    const isAvailable = Platform.OS === 'ios';

    /**
     * Vibração simples de seleção (tick)
     */
    const selection = useCallback(async () => {
        if (!isAvailable) return;
        await Haptics.selectionAsync();
    }, [isAvailable]);

    /**
     * Completar série - padrão crescente de sucesso
     * Light -> Medium -> Success notification
     */
    const completeSet = useCallback(async () => {
        if (!isAvailable) return;

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await delay(50);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await delay(50);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, [isAvailable]);

    /**
     * Novo PR batido! - padrão especial de conquista
     * Heavy -> pause -> triple success burst
     */
    const newPR = useCallback(async () => {
        if (!isAvailable) return;

        // Impacto forte inicial
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await delay(100);

        // Triple burst de celebração
        for (let i = 0; i < 3; i++) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await delay(60);
        }

        await delay(50);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, [isAvailable]);

    /**
     * Terminar treino - sequência de celebração "fanfarra"
     * Padrão crescente que simula aplausos
     */
    const finishWorkout = useCallback(async () => {
        if (!isAvailable) return;

        // Build up - crescendo
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await delay(80);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await delay(70);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await delay(60);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await delay(50);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await delay(40);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await delay(100);

        // Grand finale
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await delay(150);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, [isAvailable]);

    /**
     * Erro / Falha - buzz duplo
     */
    const error = useCallback(async () => {
        if (!isAvailable) return;

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        await delay(100);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }, [isAvailable]);

    /**
     * Warning / Alerta - vibração de atenção
     */
    const warning = useCallback(async () => {
        if (!isAvailable) return;

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }, [isAvailable]);

    /**
     * Barra de progresso - vibração sincronizada com porcentagem
     * Quanto maior a porcentagem, mais forte a vibração
     * @param progress - valor de 0 a 1
     */
    const progressBar = useCallback(async (progress: number) => {
        if (!isAvailable) return;

        if (progress < 0.33) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (progress < 0.66) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (progress < 1) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else {
            // 100% - celebração!
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await delay(50);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [isAvailable]);

    /**
     * Countdown tick - para timer
     * Fica mais intenso nos últimos 3 segundos
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

    /**
     * Adicionar item (série, exercício)
     */
    const addItem = useCallback(async () => {
        if (!isAvailable) return;

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await delay(30);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, [isAvailable]);

    /**
     * Remover / Deletar - vibração de alerta
     */
    const removeItem = useCallback(async () => {
        if (!isAvailable) return;

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        await delay(50);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }, [isAvailable]);

    /**
     * Impacto suave para interações de UI
     */
    const softImpact = useCallback(async () => {
        if (!isAvailable) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }, [isAvailable]);

    /**
     * Impacto rígido para confirmações
     */
    const rigidImpact = useCallback(async () => {
        if (!isAvailable) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
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
