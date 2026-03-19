import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { DotsThree, Export, Trash, PencilSimple, Copy } from 'phosphor-react-native';

export interface DropdownOption {
    id: string;
    label: string;
    icon?: 'export' | 'delete' | 'edit' | 'copy';
    color?: string;
    onPress: () => void;
}

interface OptionsDropdownProps {
    options: DropdownOption[];
    iconSize?: number;
    iconColor?: string;
}

const ANIMATION_DURATION = 170;

const IconComponent = ({ icon, color, size }: { icon?: string; color: string; size: number }) => {
    switch (icon) {
        case 'export': return <Export size={size} color={color} weight="bold" />;
        case 'delete': return <Trash size={size} color={color} weight="bold" />;
        case 'edit': return <PencilSimple size={size} color={color} weight="bold" />;
        case 'copy': return <Copy size={size} color={color} weight="bold" />;
        default: return null;
    }
};

export const OptionsDropdown = ({ options, iconSize = 24, iconColor }: OptionsDropdownProps) => {
    const { theme } = useTheme();
    const dotsColor = iconColor || theme.primary;
    const [modalVisible, setModalVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
    const buttonRef = useRef<View>(null);

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);

    const handlePress = useCallback(() => {
        buttonRef.current?.measureInWindow((x, y, width, height) => {
            // Posiciona o dropdown abaixo e à esquerda do botão
            setPosition({ x: x - 130, y: y + height + 4, width });
            setIsClosing(false);
            setModalVisible(true);
        });
    }, []);

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

    const handleSelect = useCallback((option: DropdownOption) => {
        startClosing();
        // Delay para a animação terminar antes de executar a ação
        setTimeout(() => {
            option.onPress();
        }, ANIMATION_DURATION);
    }, [startClosing]);

    const handleClose = useCallback(() => {
        startClosing();
    }, [startClosing]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value * 0.5,
    }));

    const dropdownStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
        transformOrigin: 'right top',
    }));

    return (
        <>
            <Pressable
                ref={buttonRef}
                onPress={handlePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <DotsThree size={iconSize} color={dotsColor} weight="bold" />
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
                            left: Math.max(10, position.x),
                        },
                        dropdownStyle,
                    ]}
                >
                    {options.map((opt, index) => (
                        <Pressable
                            key={opt.id}
                            style={[
                                styles.option,
                                index < options.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.borderSubtle }
                            ]}
                            onPress={() => handleSelect(opt)}
                            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                        >
                            {opt.icon && (
                                <View style={styles.iconContainer}>
                                    <IconComponent
                                        icon={opt.icon}
                                        color={opt.color || theme.text}
                                        size={18}
                                    />
                                </View>
                            )}
                            <Text style={[styles.optionLabel, { color: opt.color || theme.text }]}>
                                {opt.label}
                            </Text>
                        </Pressable>
                    ))}
                </Animated.View>
            </Modal>
        </>
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
        minWidth: 170,
        borderRadius: 12,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    iconContainer: {
        width: 28,
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
});
