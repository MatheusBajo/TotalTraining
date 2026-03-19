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
    description: string;
    color: string;
    letter: string;
}

const options: SetTypeOption[] = [
    { type: 'N', label: 'Normal', description: 'Série normal de trabalho', color: '#9ca3af', letter: 'N' },
    { type: 'W', label: 'Aquecimento', description: 'Série de aquecimento — não conta no volume', color: '#f59e0b', letter: 'W' },
    { type: 'D', label: 'Drop set', description: 'Drop set — reduz peso sem descanso', color: '#a855f7', letter: 'D' },
    { type: 'F', label: 'Falha', description: 'Série até a falha muscular', color: '#ef4444', letter: 'F' },
    { type: 'R', label: 'Rest-Pause', description: 'Rest-Pause — pausa curta e continua', color: '#06b6d4', letter: 'R' },
    { type: 'S', label: 'Superset', description: 'Superset — emparelha com próximo exercício', color: '#10b981', letter: 'S' },
];

interface SetTypeDropdownProps {
    currentType: SetType;
    index: number;
    completed?: boolean;
    disabled?: boolean;
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

const ANIMATION_DURATION = 170;

export const SetTypeDropdown = ({ currentType, index, completed = false, disabled = false, onSelect }: SetTypeDropdownProps) => {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [expandedInfo, setExpandedInfo] = useState<SetType | null>(null);
    const buttonRef = useRef<View>(null);

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);

    const typeStyles = getTypeStyles(currentType, theme.textSecondary);
    // Quando completo, background fica transparente
    const buttonBg = completed ? 'transparent' : typeStyles.bg;

    const handlePress = useCallback(() => {
        if (disabled) return;

        buttonRef.current?.measureInWindow((x, y) => {
            setPosition({ x, y });
            setIsClosing(false);
            setExpandedInfo(null);
            setModalVisible(true);
        });
    }, [disabled]);

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
        setExpandedInfo(null);
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

    const handleToggleInfo = useCallback((type: SetType) => {
        setExpandedInfo(prev => prev === type ? null : type);
    }, []);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value * 0.8,
    }));

    const dropdownStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { scale: scale.value },
        ],
        // Origin no canto superior esquerdo
        transformOrigin: 'left top',
    }));

    return (
        <>
            <Pressable
                ref={buttonRef}
                onPress={handlePress}
                style={[styles.button, { backgroundColor: buttonBg }]}
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
                        <View key={opt.type}>
                            <View style={styles.optionRow}>
                                <Pressable
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
                                </Pressable>
                                <Pressable
                                    onPress={() => handleToggleInfo(opt.type)}
                                    style={styles.questionButton}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Question
                                        size={16}
                                        color={expandedInfo === opt.type ? opt.color : theme.textSecondary}
                                    />
                                </Pressable>
                            </View>
                            {expandedInfo === opt.type && (
                                <View style={[styles.descriptionContainer, { backgroundColor: opt.color + '15' }]}>
                                    <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
                                        {opt.description}
                                    </Text>
                                </View>
                            )}
                        </View>
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
        minWidth: 200,
        borderRadius: 10,
        paddingVertical: 6,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 18,
        elevation: 8,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    option: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    questionButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    optionLetter: {
        fontWeight: '800',
        fontSize: 14,
        width: 24,
    },
    optionLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
    },
    descriptionContainer: {
        marginHorizontal: 12,
        marginBottom: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    descriptionText: {
        fontSize: 12,
        lineHeight: 16,
    },
});
