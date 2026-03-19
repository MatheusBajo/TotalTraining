import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { TextInput, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { useKeyboardActions, useIsFocused } from '../context/KeyboardContext';

interface KeyboardInputProps {
    id: string;
    value: string;
    placeholder: string;
    onChange: (val: string) => void;
    inputStep?: number;
    keyboardType?: 'numeric' | 'number-pad';
    icon?: React.ReactNode;
    hasError?: boolean;
    style?: any;
    disabled?: boolean;
    onLeave?: () => void;
}

export const KeyboardInput = React.memo(({
    id,
    value,
    placeholder,
    onChange,
    inputStep = 1,
    keyboardType = 'numeric',
    icon,
    hasError = false,
    style,
    disabled = false,
    onLeave
}: KeyboardInputProps) => {
    const { theme } = useTheme();
    // Usa hooks separados para melhor performance:
    // - useKeyboardActions não re-renderiza quando foco muda
    // - useIsFocused só re-renderiza ESTE input quando ele ganha/perde foco
    const { openKeyboard, registerInput, unregisterInput, registerOnLeave, unregisterOnLeave, registerInputRef } = useKeyboardActions();
    const isFocused = useIsFocused(id);
    const inputRef = useRef<TextInput>(null);
    const containerRef = useRef<any>(null);

    // Refs para valores atuais (evita stale closures)
    const valueRef = useRef(value);
    const onChangeRef = useRef(onChange);
    const inputStepRef = useRef(inputStep);
    const disabledRef = useRef(disabled);

    // Atualiza refs quando props mudam
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        inputStepRef.current = inputStep;
    }, [inputStep]);

    useEffect(() => {
        disabledRef.current = disabled;
    }, [disabled]);

    const onLeaveRef = useRef(onLeave);
    useEffect(() => {
        onLeaveRef.current = onLeave;
    }, [onLeave]);

    // Handler que usa refs para valores atuais
    const handlePress = useCallback(() => {
        if (disabledRef.current) return;
        Keyboard.dismiss();
        openKeyboard(
            id,
            valueRef.current,
            onChangeRef.current,
            undefined,
            inputStepRef.current
        );
    }, [id, openKeyboard]);

    // Registra apenas uma vez (handler usa refs internamente)
    useEffect(() => {
        registerInput(id, handlePress);
        return () => unregisterInput(id);
    }, [id, registerInput, unregisterInput, handlePress]);

    // Registra ref do container para auto-scroll
    const setContainerRef = useCallback((ref: any) => {
        containerRef.current = ref;
        registerInputRef(id, ref);
    }, [id, registerInputRef]);

    // Registra callback de onLeave (chamado quando "Next" sai deste input)
    useEffect(() => {
        if (onLeaveRef.current) {
            registerOnLeave(id, () => onLeaveRef.current?.());
            return () => unregisterOnLeave(id);
        }
    }, [id, registerOnLeave, unregisterOnLeave]);

    // Estilos computados - sem animação, apenas visual
    const borderColor = useMemo(() => {
        if (hasError) return '#ef4444';
        if (isFocused) return '#ffffff';
        return 'transparent';
    }, [hasError, isFocused]);

    const containerStyle = useMemo(() => [
        styles.container,
        {
            backgroundColor: theme.background,
            borderColor,
            borderWidth: (hasError || isFocused) ? 2 : 0,
        },
        style
    ], [theme.background, borderColor, hasError, isFocused, style]);

    return (
        <TouchableOpacity
            ref={setContainerRef}
            onPress={handlePress}
            activeOpacity={0.7}
            style={containerStyle}
        >
            {icon}
            <TextInput
                ref={inputRef}
                value={value}
                editable={false}
                placeholder={placeholder}
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: disabled ? theme.textSecondary : theme.text }]}
                keyboardType={keyboardType}
                pointerEvents="none"
            />
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    // Comparação customizada para evitar re-renders desnecessários
    return (
        prevProps.id === nextProps.id &&
        prevProps.value === nextProps.value &&
        prevProps.placeholder === nextProps.placeholder &&
        prevProps.hasError === nextProps.hasError &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.inputStep === nextProps.inputStep &&
        prevProps.onLeave === nextProps.onLeave
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        paddingHorizontal: 4,
    },
    input: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 4,
        fontWeight: 'bold',
        fontSize: 14,
    }
});
