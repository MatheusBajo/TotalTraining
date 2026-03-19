/**
 * RestTimerPicker - Dropdown para selecionar duração do descanso
 *
 * Usa o mesmo padrão visual do ActionDropdown com opções de tempo pré-definidas.
 * Indica a opção selecionada com um checkmark verde.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Dimensions, TextInput } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { CheckCircle, Timer } from 'phosphor-react-native';
import { CoreHaptics } from 'expo-core-haptics';

interface RestTimerPickerProps {
    visible: boolean;
    currentDuration: number;
    onSelect: (seconds: number) => void;
    onClose: () => void;
    /** Posição do botão trigger para posicionar o dropdown */
    anchorPosition?: { x: number; y: number; width: number; height: number };
}

interface DurationOption {
    label: string;
    seconds: number;
}

const PRESET_OPTIONS: DurationOption[] = [
    { label: '0:30', seconds: 30 },
    { label: '1:00', seconds: 60 },
    { label: '1:30', seconds: 90 },
    { label: '2:00', seconds: 120 },
    { label: '2:30', seconds: 150 },
    { label: '3:00', seconds: 180 },
];

const ANIMATION_DURATION = 170;

export const RestTimerPicker = ({
    visible,
    currentDuration,
    onSelect,
    onClose,
    anchorPosition,
}: RestTimerPickerProps) => {
    const { theme } = useTheme();
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customMinutes, setCustomMinutes] = useState('');
    const [customSeconds, setCustomSeconds] = useState('');

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);

    // Anima entrada
    useEffect(() => {
        if (visible) {
            setShowCustomInput(false);
            opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
            scale.value = withTiming(1, { duration: ANIMATION_DURATION });
        }
    }, [visible]);

    const closeModal = useCallback(() => {
        onClose();
    }, [onClose]);

    const startClosing = useCallback(() => {
        opacity.value = withTiming(0, { duration: ANIMATION_DURATION }, (finished) => {
            if (finished) {
                runOnJS(closeModal)();
            }
        });
        scale.value = withTiming(0.9, { duration: ANIMATION_DURATION });
    }, [closeModal]);

    const handleSelect = useCallback((seconds: number) => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.medium();
        }
        startClosing();
        setTimeout(() => {
            onSelect(seconds);
        }, ANIMATION_DURATION);
    }, [onSelect, startClosing]);

    const handleCustomConfirm = useCallback(() => {
        const mins = parseInt(customMinutes || '0', 10);
        const secs = parseInt(customSeconds || '0', 10);
        const total = mins * 60 + secs;
        if (total > 0 && total <= 600) { // max 10 min
            handleSelect(total);
        }
    }, [customMinutes, customSeconds, handleSelect]);

    const handleClose = useCallback(() => {
        startClosing();
    }, [startClosing]);

    // Calcula posição do dropdown
    const dropdownPosition = useCallback(() => {
        if (!anchorPosition) {
            // Fallback: centralizar
            const { width: screenWidth } = Dimensions.get('window');
            return { top: 120, left: (screenWidth - 200) / 2 };
        }

        const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
        const dropdownWidth = 200;
        const dropdownHeight = showCustomInput ? 380 : 340;

        let left = anchorPosition.x + anchorPosition.width / 2 - dropdownWidth / 2;
        left = Math.max(10, Math.min(left, screenWidth - dropdownWidth - 10));

        let top = anchorPosition.y + anchorPosition.height + 8;
        if (top + dropdownHeight > screenHeight - 20) {
            top = anchorPosition.y - dropdownHeight - 8;
        }
        top = Math.max(50, top);

        return { top, left };
    }, [anchorPosition, showCustomInput]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value * 0.5,
    }));

    const dropdownStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const pos = dropdownPosition();

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <Pressable style={styles.backdrop} onPress={handleClose}>
                <Animated.View style={[styles.backdropInner, backdropStyle]} />
            </Pressable>

            <Animated.View
                style={[
                    styles.dropdown,
                    {
                        backgroundColor: theme.surface,
                        top: pos.top,
                        left: pos.left,
                    },
                    dropdownStyle,
                ]}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
                    <Timer size={18} color={theme.primary} weight="bold" />
                    <Text style={[styles.headerText, { color: theme.text }]}>Tempo de Descanso</Text>
                </View>

                {/* Opções de tempo */}
                {PRESET_OPTIONS.map((opt) => {
                    const isSelected = currentDuration === opt.seconds;
                    return (
                        <Pressable
                            key={opt.seconds}
                            style={[
                                styles.option,
                                isSelected && { backgroundColor: theme.primary + '15' },
                            ]}
                            onPress={() => handleSelect(opt.seconds)}
                            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                        >
                            <Text
                                style={[
                                    styles.optionLabel,
                                    { color: isSelected ? theme.primary : theme.text },
                                    isSelected && { fontWeight: '800' },
                                ]}
                            >
                                {opt.label}
                            </Text>
                            {isSelected && (
                                <CheckCircle size={18} color={theme.primary} weight="fill" />
                            )}
                        </Pressable>
                    );
                })}

                {/* Personalizado */}
                {!showCustomInput ? (
                    <Pressable
                        style={[styles.option, { borderTopWidth: 1, borderTopColor: theme.borderSubtle }]}
                        onPress={() => setShowCustomInput(true)}
                        android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                    >
                        <Text style={[styles.optionLabel, { color: theme.textSecondary }]}>
                            Personalizado...
                        </Text>
                    </Pressable>
                ) : (
                    <View style={[styles.customContainer, { borderTopWidth: 1, borderTopColor: theme.borderSubtle }]}>
                        <View style={styles.customInputRow}>
                            <TextInput
                                style={[styles.customInput, { color: theme.text, backgroundColor: theme.field }]}
                                value={customMinutes}
                                onChangeText={setCustomMinutes}
                                placeholder="0"
                                placeholderTextColor={theme.textSecondary}
                                keyboardType="number-pad"
                                maxLength={2}
                                autoFocus
                            />
                            <Text style={[styles.customLabel, { color: theme.textSecondary }]}>min</Text>
                            <TextInput
                                style={[styles.customInput, { color: theme.text, backgroundColor: theme.field }]}
                                value={customSeconds}
                                onChangeText={setCustomSeconds}
                                placeholder="00"
                                placeholderTextColor={theme.textSecondary}
                                keyboardType="number-pad"
                                maxLength={2}
                            />
                            <Text style={[styles.customLabel, { color: theme.textSecondary }]}>seg</Text>
                        </View>
                        <Pressable
                            style={[styles.customConfirm, { backgroundColor: theme.primary }]}
                            onPress={handleCustomConfirm}
                        >
                            <Text style={styles.customConfirmText}>OK</Text>
                        </Pressable>
                    </View>
                )}
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    backdropInner: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdown: {
        position: 'absolute',
        width: 200,
        borderRadius: 12,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    headerText: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 11,
        paddingHorizontal: 14,
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    customContainer: {
        padding: 12,
    },
    customInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    customInput: {
        width: 48,
        height: 38,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
    },
    customLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    customConfirm: {
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    customConfirmText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
