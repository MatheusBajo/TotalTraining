import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { Question } from 'phosphor-react-native';

export type SetType = 'N' | 'W' | 'D' | 'F' | 'R' | 'S';

interface SetTypeOption {
    type: SetType;
    label: string;
    color: string;
    letter: string;
}

const options: SetTypeOption[] = [
    { type: 'W', label: 'Aquecimento', color: '#f59e0b', letter: 'W' },
    { type: 'D', label: 'Drop set', color: '#a855f7', letter: 'D' },
    { type: 'F', label: 'Falha', color: '#ef4444', letter: 'F' },
    { type: 'R', label: 'Rest-Pause', color: '#06b6d4', letter: 'R' },
    { type: 'S', label: 'Superset', color: '#10b981', letter: 'S' },
];

interface SetTypeDropdownProps {
    currentType: SetType;
    index: number;
    onSelect: (type: SetType) => void;
}

// Helper para pegar cor e background do tipo
const getTypeStyles = (type: SetType, defaultColor: string) => {
    switch (type) {
        case 'W': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' };
        case 'D': return { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)' };
        case 'F': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)' };
        case 'R': return { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)' };
        case 'S': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' };
        default: return { color: defaultColor, bg: 'rgba(0,0,0,0.8)' };
    }
};

const ANIMATION_DURATION = 150;

export const SetTypeDropdown = ({ currentType, index, onSelect }: SetTypeDropdownProps) => {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<View>(null);

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);

    const typeStyles = getTypeStyles(currentType, theme.textSecondary);

    const handlePress = useCallback(() => {
        buttonRef.current?.measureInWindow((x, y) => {
            setPosition({ x, y });
            setIsClosing(false);
            setModalVisible(true);
        });
    }, []);

    // Anima entrada quando modal abre
    useEffect(() => {
        if (modalVisible && !isClosing) {
            opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
            scale.value = withTiming(1, { duration: ANIMATION_DURATION });
        }
    }, [modalVisible, isClosing]);

    const closeModal = useCallback(() => {
        setModalVisible(false);
        setIsClosing(false);
    }, []);

    const startClosing = useCallback(() => {
        setIsClosing(true);
        opacity.value = withTiming(0, { duration: ANIMATION_DURATION }, (finished) => {
            if (finished) {
                runOnJS(closeModal)();
            }
        });
        scale.value = withTiming(0.9, { duration: ANIMATION_DURATION });
    }, [closeModal]);

    const handleSelect = useCallback((type: SetType) => {
        onSelect(type);
        startClosing();
    }, [onSelect, startClosing]);

    const handleClose = useCallback(() => {
        startClosing();
    }, [startClosing]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value * 0.5,
    }));

    const dropdownStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    return (
        <>
            <Pressable
                ref={buttonRef}
                onPress={handlePress}
                style={[styles.button, { backgroundColor: typeStyles.bg }]}
            >
                <Text style={[styles.buttonText, { color: typeStyles.color }]}>
                    {currentType === 'N' ? index + 1 : currentType}
                </Text>
            </Pressable>

            <Modal
                visible={modalVisible}
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
                            top: position.y,
                            left: position.x,
                        },
                        dropdownStyle,
                    ]}
                >
                    {options.map((opt) => (
                        <Pressable
                            key={opt.type}
                            style={styles.option}
                            onPress={() => handleSelect(opt.type)}
                            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                        >
                            <Text style={[styles.optionLetter, { color: opt.color }]}>
                                {opt.letter}
                            </Text>
                            <Text style={[styles.optionLabel, { color: theme.text }]}>
                                {opt.label}
                            </Text>
                            <Question size={16} color={theme.textSecondary} />
                        </Pressable>
                    ))}
                </Animated.View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        borderRadius: 6,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    backdropInner: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdown: {
        position: 'absolute',
        minWidth: 170,
        borderRadius: 10,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    optionLetter: {
        fontWeight: 'bold',
        fontSize: 14,
        width: 24,
    },
    optionLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
});
