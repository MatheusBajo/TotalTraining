/**
 * ActionDropdown - Componente unificado de dropdown para todo o app
 *
 * Suporta dois modos:
 * 1. Com trigger customizado (children)
 * 2. Com botão padrão (DotsThree)
 */
import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import {
    DotsThree,
    Export,
    Trash,
    PencilSimple,
    Copy,
    Link,
    LinkBreak,
    Note,
    Gear,
    Question,
    Warning,
    CheckCircle,
    Fire,
    Snowflake,
    Repeat,
    Target,
    IconProps,
} from 'phosphor-react-native';
import { CoreHaptics } from 'expo-core-haptics';

// ========== TIPOS ==========
export type DropdownIconType =
    | 'export'
    | 'delete'
    | 'edit'
    | 'copy'
    | 'link'
    | 'unlink'
    | 'note'
    | 'settings'
    | 'question'
    | 'warning'
    | 'success'
    | 'fire'
    | 'snowflake'
    | 'repeat'
    | 'target';

export interface DropdownOption {
    id: string;
    label: string;
    description?: string;
    icon?: DropdownIconType;
    color?: string;
    letter?: string; // Para SetType dropdown
    disabled?: boolean;
    destructive?: boolean;
    onPress: () => void;
}

export interface ActionDropdownProps {
    options: DropdownOption[];
    children?: ReactNode; // Trigger customizado
    iconSize?: number;
    iconColor?: string;
    disabled?: boolean;
    anchor?: 'left' | 'right' | 'center'; // Onde ancorar o dropdown
    showLetters?: boolean; // Mostra letra colorida (estilo SetType)
}

// ========== CONSTANTES ==========
const ANIMATION_DURATION = 170;

// ========== ÍCONES ==========
const IconComponent = ({
    icon,
    color,
    size,
}: {
    icon?: DropdownIconType;
    color: string;
    size: number;
}) => {
    const props: IconProps = { size, color, weight: 'bold' };

    switch (icon) {
        case 'export':
            return <Export {...props} />;
        case 'delete':
            return <Trash {...props} />;
        case 'edit':
            return <PencilSimple {...props} />;
        case 'copy':
            return <Copy {...props} />;
        case 'link':
            return <Link {...props} />;
        case 'unlink':
            return <LinkBreak {...props} />;
        case 'note':
            return <Note {...props} />;
        case 'settings':
            return <Gear {...props} />;
        case 'question':
            return <Question {...props} />;
        case 'warning':
            return <Warning {...props} />;
        case 'success':
            return <CheckCircle {...props} />;
        case 'fire':
            return <Fire {...props} />;
        case 'snowflake':
            return <Snowflake {...props} />;
        case 'repeat':
            return <Repeat {...props} />;
        case 'target':
            return <Target {...props} />;
        default:
            return null;
    }
};

// ========== COMPONENTE PRINCIPAL ==========
export const ActionDropdown = ({
    options,
    children,
    iconSize = 24,
    iconColor,
    disabled = false,
    anchor = 'right',
    showLetters = false,
}: ActionDropdownProps) => {
    const { theme } = useTheme();
    const dotsColor = iconColor || theme.primary;

    const [modalVisible, setModalVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const buttonRef = useRef<View>(null);

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);

    // Calcula posição baseado no anchor
    const calculatePosition = useCallback(
        (x: number, y: number, width: number, height: number) => {
            const dropdownWidth = showLetters ? 200 : 180;

            let left: number;
            switch (anchor) {
                case 'left':
                    left = x;
                    break;
                case 'center':
                    left = x + width / 2 - dropdownWidth / 2;
                    break;
                case 'right':
                default:
                    left = x + width - dropdownWidth;
                    break;
            }

            return {
                x: Math.max(10, left),
                y: y + height + 4,
                width,
                height,
            };
        },
        [anchor, showLetters]
    );

    const handlePress = useCallback(() => {
        if (disabled) return;

        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.light();
        }

        buttonRef.current?.measureInWindow((x, y, width, height) => {
            setPosition(calculatePosition(x, y, width, height));
            setIsClosing(false);
            setModalVisible(true);
        });
    }, [disabled, calculatePosition]);

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

    const handleSelect = useCallback(
        (option: DropdownOption) => {
            if (option.disabled) return;

            if (CoreHaptics.isSupported()) {
                CoreHaptics.tap.medium();
            }

            startClosing();
            // Delay para a animação terminar antes de executar a ação
            setTimeout(() => {
                option.onPress();
            }, ANIMATION_DURATION);
        },
        [startClosing]
    );

    const handleClose = useCallback(() => {
        startClosing();
    }, [startClosing]);

    // Estilos animados
    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value * 0.5,
    }));

    const dropdownStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
        transformOrigin: anchor === 'left' ? 'left top' : anchor === 'center' ? 'center top' : 'right top',
    }));

    return (
        <>
            <Pressable
                ref={buttonRef}
                onPress={handlePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={disabled ? { opacity: 0.5 } : undefined}
            >
                {children || <DotsThree size={iconSize} color={dotsColor} weight="bold" />}
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
                    {options.map((opt, index) => {
                        const optColor = opt.destructive
                            ? '#ef4444'
                            : opt.color || theme.text;
                        const isDisabled = opt.disabled;

                        return (
                            <Pressable
                                key={opt.id}
                                style={[
                                    styles.option,
                                    index < options.length - 1 && {
                                        borderBottomWidth: 1,
                                        borderBottomColor: theme.borderSubtle,
                                    },
                                    isDisabled && { opacity: 0.4 },
                                ]}
                                onPress={() => handleSelect(opt)}
                                android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                                disabled={isDisabled}
                            >
                                {/* Letra colorida (estilo SetType) */}
                                {showLetters && opt.letter && (
                                    <Text style={[styles.optionLetter, { color: optColor }]}>
                                        {opt.letter}
                                    </Text>
                                )}

                                {/* Ícone */}
                                {opt.icon && !showLetters && (
                                    <View style={styles.iconContainer}>
                                        <IconComponent icon={opt.icon} color={optColor} size={18} />
                                    </View>
                                )}

                                {/* Texto */}
                                <View style={styles.textContainer}>
                                    <Text style={[styles.optionLabel, { color: optColor }]}>
                                        {opt.label}
                                    </Text>
                                    {opt.description && (
                                        <Text
                                            style={[styles.optionDescription, { color: theme.textSecondary }]}
                                        >
                                            {opt.description}
                                        </Text>
                                    )}
                                </View>

                                {/* Ícone de ajuda para SetType */}
                                {showLetters && (
                                    <Question size={16} color={theme.textSecondary} />
                                )}
                            </Pressable>
                        );
                    })}
                </Animated.View>
            </Modal>
        </>
    );
};

// ========== ESTILOS ==========
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
        minWidth: 180,
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
    textContainer: {
        flex: 1,
    },
    optionLetter: {
        fontWeight: '800',
        fontSize: 14,
        width: 24,
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    optionDescription: {
        fontSize: 12,
        marginTop: 2,
    },
});
