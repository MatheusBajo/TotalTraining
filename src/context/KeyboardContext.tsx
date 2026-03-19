import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';
import { CoreHaptics } from 'expo-core-haptics';
import { Dimensions } from 'react-native';

// ==================== TIPOS ====================

interface KeyboardActionsContextData {
    isVisible: boolean;
    openKeyboard: (id: string, initialValue: string, onChange: (val: string) => void, onHide?: () => void, inputStep?: number) => void;
    closeKeyboard: () => void;
    registerInput: (id: string, focusHandler: () => void) => void;
    unregisterInput: (id: string) => void;
    registerOnLeave: (id: string, callback: () => void) => void;
    unregisterOnLeave: (id: string) => void;
    registerInputRef: (id: string, ref: any) => void;
    setScrollRef: (ref: any) => void;
    handleKeyPress: (key: string) => void;
    handleBackspace: () => void;
    handleNext: () => void;
    handlePrevious: () => void;
    handleIncrement: () => void;
    handleDecrement: () => void;
}

// Contexto separado apenas para o ID do input focado (muda frequentemente)
// Isso evita que todos os inputs re-renderizem quando apenas o foco muda
const KeyboardFocusContext = createContext<string | null>(null);

// Contexto para ações e estado de visibilidade (muda raramente)
const KeyboardActionsContext = createContext<KeyboardActionsContextData>({} as KeyboardActionsContextData);

// ==================== PROVIDER ====================

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeInputId, setActiveInputId] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Usar refs para valores que mudam frequentemente (evita re-render do context)
    const inputValueRef = useRef('');
    const stepRef = useRef(1);
    const onChangeRef = useRef<((val: string) => void) | null>(null);
    const onHideRef = useRef<(() => void) | null>(null);
    const inputRegistry = useRef<Map<string, () => void>>(new Map());
    const onLeaveRegistry = useRef<Map<string, () => void>>(new Map());
    const inputRefRegistry = useRef<Map<string, any>>(new Map());
    const scrollRef = useRef<any>(null);
    const inputOrder = useRef<string[]>([]);

    const registerInput = useCallback((id: string, focusHandler: () => void) => {
        inputRegistry.current.set(id, focusHandler);
        if (!inputOrder.current.includes(id)) {
            inputOrder.current.push(id);
        }
    }, []);

    const unregisterInput = useCallback((id: string) => {
        inputRegistry.current.delete(id);
        onLeaveRegistry.current.delete(id);
        inputOrder.current = inputOrder.current.filter(i => i !== id);
    }, []);

    const registerOnLeave = useCallback((id: string, callback: () => void) => {
        onLeaveRegistry.current.set(id, callback);
    }, []);

    const unregisterOnLeave = useCallback((id: string) => {
        onLeaveRegistry.current.delete(id);
    }, []);

    const registerInputRef = useCallback((id: string, ref: any) => {
        if (ref) {
            inputRefRegistry.current.set(id, ref);
        } else {
            inputRefRegistry.current.delete(id);
        }
    }, []);

    const setScrollRefFn = useCallback((ref: any) => {
        scrollRef.current = ref;
    }, []);

    // Scroll para manter input visível acima do teclado
    const KEYBOARD_TOTAL_HEIGHT = 60 * 4 + 24 + 12 + 44; // rows + gaps + bottom inset approx
    const scrollToInput = useCallback((inputId: string) => {
        const inputEl = inputRefRegistry.current.get(inputId);
        const list = scrollRef.current;
        if (!inputEl || !list) return;

        setTimeout(() => {
            requestAnimationFrame(() => {
                try {
                    inputEl.measureInWindow?.((x: number, y: number, width: number, height: number) => {
                        if (y === 0 && height === 0) return; // unmounted
                        const screenHeight = Dimensions.get('window').height;
                        const keyboardTop = screenHeight - KEYBOARD_TOTAL_HEIGHT;
                        const inputBottom = y + height + 20; // 20px margem

                        if (inputBottom > keyboardTop) {
                            const scrollAmount = inputBottom - keyboardTop;
                            const currentOffset = list._currentOffset || 0;
                            list.scrollToOffset?.({ offset: currentOffset + scrollAmount, animated: true });
                        }
                    });
                } catch {}
            });
        }, 100);
    }, []);

    const openKeyboard = useCallback((id: string, initialValue: string, onChange: (val: string) => void, onHide?: () => void, inputStep: number = 1) => {
        setActiveInputId(id);
        inputValueRef.current = initialValue;
        stepRef.current = inputStep;
        onChangeRef.current = onChange;
        onHideRef.current = onHide || null;
        setIsVisible(true);

        // Haptic feedback ao abrir teclado
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.light();
        }

        // Auto-scroll para manter input visível acima do teclado
        scrollToInput(id);
    }, [scrollToInput]);

    const closeKeyboard = useCallback(() => {
        setIsVisible(false);
        setActiveInputId(null);
        if (onHideRef.current) {
            onHideRef.current();
        }
        onChangeRef.current = null;
        onHideRef.current = null;
    }, []);

    // Função otimizada que atualiza direto sem setState
    const updateValue = useCallback((newValue: string) => {
        inputValueRef.current = newValue;
        if (onChangeRef.current) {
            onChangeRef.current(newValue);
        }
    }, []);

    const handleKeyPress = useCallback((key: string) => {
        if (!activeInputId) return;

        const currentValue = inputValueRef.current;

        // Impede múltiplos pontos decimais
        if (key === '.' && currentValue.includes('.')) return;

        const newValue = currentValue + key;
        updateValue(newValue);

        // Haptic sutil por tecla
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.custom(0.3, 0.2);
        }
    }, [activeInputId, updateValue]);

    const handleBackspace = useCallback(() => {
        if (!activeInputId) return;
        const newValue = inputValueRef.current.slice(0, -1);
        updateValue(newValue);

        // Haptic diferente para backspace
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.custom(0.2, 0.4);
        }
    }, [activeInputId, updateValue]);

    const handleNext = useCallback(() => {
        if (!activeInputId) return;

        // Chama onLeave do input atual (ex: auto-check ao sair do RIR)
        const onLeave = onLeaveRegistry.current.get(activeInputId);
        if (onLeave) onLeave();

        const currentIndex = inputOrder.current.indexOf(activeInputId);
        if (currentIndex !== -1 && currentIndex < inputOrder.current.length - 1) {
            const nextId = inputOrder.current[currentIndex + 1];
            const focusNext = inputRegistry.current.get(nextId);
            if (focusNext) {
                // Haptic ao navegar
                if (CoreHaptics.isSupported()) {
                    CoreHaptics.tap.light();
                }
                focusNext();
                scrollToInput(nextId);
            }
        } else {
            closeKeyboard();
        }
    }, [activeInputId, closeKeyboard, scrollToInput]);

    const handlePrevious = useCallback(() => {
        if (!activeInputId) return;

        const currentIndex = inputOrder.current.indexOf(activeInputId);
        if (currentIndex > 0) {
            const prevId = inputOrder.current[currentIndex - 1];
            const focusPrev = inputRegistry.current.get(prevId);
            if (focusPrev) {
                if (CoreHaptics.isSupported()) {
                    CoreHaptics.tap.light();
                }
                focusPrev();
                scrollToInput(prevId);
            }
        }
    }, [activeInputId, scrollToInput]);

    const handleIncrement = useCallback(() => {
        if (!activeInputId) return;
        const current = parseFloat(inputValueRef.current) || 0;
        const newValue = String(current + stepRef.current);
        updateValue(newValue);

        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.medium();
        }
    }, [activeInputId, updateValue]);

    const handleDecrement = useCallback(() => {
        if (!activeInputId) return;
        const current = parseFloat(inputValueRef.current) || 0;
        const newValue = String(Math.max(0, current - stepRef.current));
        updateValue(newValue);

        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.medium();
        }
    }, [activeInputId, updateValue]);

    // Memoiza o valor das ações (muda raramente)
    const actionsValue = useMemo(() => ({
        isVisible,
        openKeyboard,
        closeKeyboard,
        registerInput,
        unregisterInput,
        registerOnLeave,
        unregisterOnLeave,
        registerInputRef,
        setScrollRef: setScrollRefFn,
        handleKeyPress,
        handleBackspace,
        handleNext,
        handlePrevious,
        handleIncrement,
        handleDecrement
    }), [
        isVisible,
        openKeyboard,
        closeKeyboard,
        registerInput,
        unregisterInput,
        registerOnLeave,
        unregisterOnLeave,
        registerInputRef,
        setScrollRefFn,
        handleKeyPress,
        handleBackspace,
        handleNext,
        handlePrevious,
        handleIncrement,
        handleDecrement
    ]);

    return (
        <KeyboardActionsContext.Provider value={actionsValue}>
            <KeyboardFocusContext.Provider value={activeInputId}>
                {children}
            </KeyboardFocusContext.Provider>
        </KeyboardActionsContext.Provider>
    );
};

// ==================== HOOKS ====================

// Hook para obter apenas o ID do input focado (re-renderiza quando foco muda)
export const useKeyboardFocus = () => useContext(KeyboardFocusContext);

// Hook otimizado para verificar se um input específico está focado
// Usa selector pattern para evitar re-renders desnecessários
export const useIsFocused = (id: string) => {
    const activeId = useContext(KeyboardFocusContext);
    return activeId === id;
};

// Hook para obter ações do teclado (não re-renderiza quando apenas foco muda)
export const useKeyboardActions = () => useContext(KeyboardActionsContext);

// Hook legacy que combina tudo (para compatibilidade)
export const useKeyboard = () => {
    const activeInputId = useContext(KeyboardFocusContext);
    const actions = useContext(KeyboardActionsContext);
    return { activeInputId, ...actions };
};
