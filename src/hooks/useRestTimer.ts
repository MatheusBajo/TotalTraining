/**
 * useRestTimer - Hook para gerenciar o timer de descanso entre séries
 *
 * Persiste a duração preferida no AsyncStorage.
 * Expõe controle de visibilidade e trigger automático.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'totaltraining:restTimerDuration';
const DEFAULT_DURATION = 90; // 1:30

export interface UseRestTimerReturn {
    /** Duração do descanso em segundos */
    restDuration: number;
    /** Se o timer está visível/ativo */
    isTimerVisible: boolean;
    /** Se o timer está rodando (para indicador visual no header) */
    isTimerActive: boolean;
    /** Abre o picker de duração */
    showPicker: () => void;
    /** Se o picker está visível */
    isPickerVisible: boolean;
    /** Fecha o picker */
    closePicker: () => void;
    /** Define a duração e persiste */
    setRestDuration: (seconds: number) => void;
    /** Inicia o timer */
    startTimer: () => void;
    /** Fecha/pula o timer */
    dismissTimer: () => void;
    /** Callback quando o timer termina (close automático) */
    onTimerFinish: () => void;
    /** Reseta tudo — usar quando treino finaliza/cancela */
    resetTimer: () => void;
}

export const useRestTimer = (): UseRestTimerReturn => {
    const [restDuration, setRestDurationState] = useState(DEFAULT_DURATION);
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const loadedRef = useRef(false);

    // Carrega duração salva
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((value) => {
                if (value) {
                    const parsed = parseInt(value, 10);
                    if (!isNaN(parsed) && parsed > 0) {
                        setRestDurationState(parsed);
                    }
                }
                loadedRef.current = true;
            })
            .catch(() => {
                loadedRef.current = true;
            });
    }, []);

    const setRestDuration = useCallback((seconds: number) => {
        setRestDurationState(seconds);
        AsyncStorage.setItem(STORAGE_KEY, String(seconds)).catch(() => {});
    }, []);

    const showPicker = useCallback(() => {
        setIsPickerVisible(true);
    }, []);

    const closePicker = useCallback(() => {
        setIsPickerVisible(false);
    }, []);

    const startTimer = useCallback(() => {
        setIsTimerVisible(true);
        setIsTimerActive(true);
    }, []);

    const dismissTimer = useCallback(() => {
        setIsTimerVisible(false);
        setIsTimerActive(false);
    }, []);

    const onTimerFinish = useCallback(() => {
        setIsTimerVisible(false);
        setIsTimerActive(false);
    }, []);

    const resetTimer = useCallback(() => {
        setIsTimerVisible(false);
        setIsTimerActive(false);
        setIsPickerVisible(false);
    }, []);

    return {
        restDuration,
        isTimerVisible,
        isTimerActive,
        showPicker,
        isPickerVisible,
        closePicker,
        setRestDuration,
        startTimer,
        dismissTimer,
        onTimerFinish,
        resetTimer,
    };
};
