import { requireNativeModule, Platform } from 'expo-modules-core';

// Interface do módulo nativo
interface CoreHapticsNativeModule {
  prepare(): void;
  transient(intensity: number, sharpness: number): void;
  startContinuous(intensity: number, sharpness: number, duration: number): void;
  updateContinuous(intensity: number, sharpness: number): void;
  stopContinuous(): void;
  playPattern(ahapJSON: string): void;
  playRamp(
    fromIntensity: number,
    toIntensity: number,
    fromSharpness: number,
    toSharpness: number,
    duration: number
  ): void;
  isSupported(): boolean;
}

// Módulo nativo (só existe no iOS)
const NativeModule: CoreHapticsNativeModule | null =
  Platform.OS === 'ios'
    ? requireNativeModule<CoreHapticsNativeModule>('ExpoCoreHaptics')
    : null;

// Fallback para Android/Web - não faz nada mas não quebra
const noopModule: CoreHapticsNativeModule = {
  prepare: () => {},
  transient: () => {},
  startContinuous: () => {},
  updateContinuous: () => {},
  stopContinuous: () => {},
  playPattern: () => {},
  playRamp: () => {},
  isSupported: () => false,
};

const CoreHapticsModule = NativeModule || noopModule;

// ============ API DE ALTO NÍVEL ============

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const CoreHaptics = {
  /**
   * Prepara o haptic engine. Chamar no início do app.
   */
  prepare: () => CoreHapticsModule.prepare(),

  /**
   * Verifica se o dispositivo suporta Core Haptics.
   * Retorna false no Android/Web/Simulador.
   */
  isSupported: () => CoreHapticsModule.isSupported(),

  /**
   * Taps únicos com controle de intensidade e sharpness.
   * - intensity: 0.0 (suave) a 1.0 (forte)
   * - sharpness: 0.0 (grave/orgânico) a 1.0 (agudo/mecânico)
   */
  tap: {
    /** Toque leve, mais agudo */
    light: () => CoreHapticsModule.transient(0.4, 0.8),

    /** Toque médio, balanceado */
    medium: () => CoreHapticsModule.transient(0.6, 0.5),

    /** Toque pesado, mais grave */
    heavy: () => CoreHapticsModule.transient(1.0, 0.2),

    /** Toque suave e orgânico (como batimento cardíaco) */
    soft: () => CoreHapticsModule.transient(0.5, 0.1),

    /** Toque rígido e mecânico (como clique de botão) */
    rigid: () => CoreHapticsModule.transient(0.8, 1.0),

    /** Toque customizado */
    custom: (intensity: number, sharpness: number) =>
      CoreHapticsModule.transient(intensity, sharpness),
  },

  /**
   * Vibração contínua com controle em tempo real.
   * Ideal para gestos de arrasto, sliders, etc.
   */
  continuous: {
    /** Inicia vibração contínua */
    start: (intensity: number, sharpness: number, duration: number) =>
      CoreHapticsModule.startContinuous(intensity, sharpness, duration),

    /** Atualiza parâmetros durante a vibração */
    update: (intensity: number, sharpness: number) =>
      CoreHapticsModule.updateContinuous(intensity, sharpness),

    /** Para a vibração */
    stop: () => CoreHapticsModule.stopContinuous(),
  },

  /**
   * Ramps - transições suaves entre estados.
   * Perfeito para sincronizar com animações.
   */
  ramp: {
    /**
     * Grave → Agudo (barra de progresso enchendo)
     * Sensação de "construindo algo"
     */
    graveToAgudo: (duration: number) =>
      CoreHapticsModule.playRamp(0.8, 0.6, 0.1, 0.9, duration),

    /**
     * Agudo → Grave (relaxamento)
     * Sensação de "descida suave"
     */
    agudoToGrave: (duration: number) =>
      CoreHapticsModule.playRamp(0.6, 0.8, 0.9, 0.1, duration),

    /**
     * Build up - intensidade crescente, mesmo tom
     * Sensação de "acumulando energia"
     */
    buildUp: (duration: number) =>
      CoreHapticsModule.playRamp(0.2, 1.0, 0.5, 0.5, duration),

    /**
     * Fade out - diminui gradualmente
     * Sensação de "terminando suavemente"
     */
    fadeOut: (duration: number) =>
      CoreHapticsModule.playRamp(1.0, 0.1, 0.5, 0.3, duration),

    /** Ramp totalmente customizado */
    custom: (
      fromIntensity: number,
      toIntensity: number,
      fromSharpness: number,
      toSharpness: number,
      duration: number
    ) => CoreHapticsModule.playRamp(
      fromIntensity,
      toIntensity,
      fromSharpness,
      toSharpness,
      duration
    ),
  },

  /**
   * Padrões compostos pré-definidos (tipo Duolingo).
   */
  patterns: {
    /** Moedas/XP caindo - sequência rápida ascendente */
    coinDrop: async (count: number = 5) => {
      for (let i = 0; i < count; i++) {
        CoreHapticsModule.transient(0.7 + i * 0.06, 0.6 + i * 0.08);
        await delay(50);
      }
    },

    /** Heartbeat - batida cardíaca dupla */
    heartbeat: async (beats: number = 2) => {
      for (let i = 0; i < beats; i++) {
        CoreHapticsModule.transient(1.0, 0.2); // lub
        await delay(100);
        CoreHapticsModule.transient(0.6, 0.3); // dub
        await delay(400);
      }
    },

    /** Sucesso - feedback positivo de conclusão */
    success: async () => {
      CoreHapticsModule.transient(0.6, 0.4);
      await delay(60);
      CoreHapticsModule.transient(1.0, 0.8);
    },

    /** Erro - shake de negação */
    error: async () => {
      for (let i = 0; i < 3; i++) {
        CoreHapticsModule.transient(0.9, 0.3);
        await delay(80);
      }
    },

    /** Warning - alerta suave */
    warning: async () => {
      CoreHapticsModule.transient(0.7, 0.5);
      await delay(150);
      CoreHapticsModule.transient(0.7, 0.5);
    },

    /** Tick - como um relógio */
    tick: () => CoreHapticsModule.transient(0.4, 0.9),

    /** Pop - bolha estourando */
    pop: () => CoreHapticsModule.transient(0.7, 0.7),

    /** Bump - encontro suave */
    bump: () => CoreHapticsModule.transient(0.5, 0.2),

    /**
     * Número contando (para AnimatedNumber)
     * @param progress - 0 a 1
     */
    countingNumber: (progress: number) => {
      // Começa grave e vai ficando mais agudo
      const sharpness = 0.1 + progress * 0.7;
      const intensity = 0.8 - progress * 0.3;
      CoreHapticsModule.transient(intensity, sharpness);
    },

    /**
     * Progresso enchendo (para progress bars)
     * @param progress - 0 a 1
     */
    progressFill: (progress: number) => {
      const sharpness = 0.2 + progress * 0.6;
      const intensity = 0.6 + progress * 0.2;
      CoreHapticsModule.transient(intensity, sharpness);
    },

    /** Streak ativo - celebração de fogo */
    streakFire: async () => {
      CoreHapticsModule.transient(0.8, 0.3);
      await delay(80);
      CoreHapticsModule.transient(0.9, 0.5);
      await delay(80);
      CoreHapticsModule.transient(1.0, 0.7);
    },

    /** Meta atingida - celebração completa */
    goalComplete: async () => {
      // Build up rápido
      CoreHapticsModule.playRamp(0.3, 0.9, 0.2, 0.6, 0.3);
      await delay(350);
      // Explosão final
      CoreHapticsModule.transient(1.0, 0.8);
      await delay(100);
      CoreHapticsModule.transient(0.8, 0.9);
    },
  },

  /**
   * Toca padrão AHAP (Apple Haptic Audio Pattern).
   * Para padrões muito complexos que precisam de controle fino.
   */
  playAHAP: (json: string) => CoreHapticsModule.playPattern(json),
};

// ============ HOOKS PARA REACT ============

import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook para preparar o haptic engine automaticamente.
 * Use uma vez no App.tsx ou componente raiz.
 */
export function useCoreHaptics() {
  useEffect(() => {
    CoreHaptics.prepare();
  }, []);

  return CoreHaptics;
}

/**
 * Hook para haptic durante animação de progresso.
 * Retorna uma função para chamar a cada step da animação.
 *
 * @example
 * const triggerHaptic = useProgressHaptic(8);
 *
 * // Durante a animação:
 * triggerHaptic(currentProgress); // 0 a 1
 */
export function useProgressHaptic(steps: number = 8) {
  const lastStep = useRef(-1);

  const trigger = useCallback((progress: number) => {
    const currentStep = Math.floor(progress * steps);

    if (currentStep > lastStep.current && currentStep < steps) {
      lastStep.current = currentStep;
      CoreHaptics.patterns.progressFill(progress);
    }
  }, [steps]);

  const reset = useCallback(() => {
    lastStep.current = -1;
  }, []);

  return { trigger, reset };
}

/**
 * Hook para haptic contínuo sincronizado com gesto.
 *
 * @example
 * const { start, update, stop } = useContinuousHaptic();
 *
 * onGestureStart: () => start(5), // 5 segundos max
 * onGestureMove: (progress) => update(progress),
 * onGestureEnd: () => stop(),
 */
export function useContinuousHaptic() {
  const isRunning = useRef(false);

  const start = useCallback((duration: number = 5) => {
    if (!isRunning.current) {
      isRunning.current = true;
      CoreHaptics.continuous.start(0.5, 0.3, duration);
    }
  }, []);

  const update = useCallback((progress: number) => {
    if (isRunning.current) {
      // Intensidade e sharpness baseados no progresso
      const intensity = 0.3 + progress * 0.5;
      const sharpness = 0.2 + progress * 0.6;
      CoreHaptics.continuous.update(intensity, sharpness);
    }
  }, []);

  const stop = useCallback(() => {
    if (isRunning.current) {
      isRunning.current = false;
      CoreHaptics.continuous.stop();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRunning.current) {
        CoreHaptics.continuous.stop();
      }
    };
  }, []);

  return { start, update, stop, isRunning: isRunning.current };
}

export default CoreHaptics;
