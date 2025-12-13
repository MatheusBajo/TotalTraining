import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    runOnJS
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { User, Clock, Plus, Barbell, Crown } from 'phosphor-react-native';
import { useSheetAnimation } from '../context/SheetAnimationContext';
import { useTheme } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;
const MINI_PLAYER_HEIGHT = 70;

const iconMap: { [key: string]: any } = {
    'Perfil': User,
    'Histórico': Clock,
    'Iniciar o treino': Plus,
    'Exercícios': Barbell,
    'Loja': Crown,
};

const logDebug = (msg: string) => {
    console.log(msg);
};

export const AnimatedTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { animatedPosition, screenHeight } = useSheetAnimation();

    const totalHeight = TAB_BAR_HEIGHT + insets.bottom;
    const navbarHeight = totalHeight;

    // Calcular posições do sheet (SEM bottomInset)
    const snapPointMinimized = MINI_PLAYER_HEIGHT + navbarHeight;  // ~164
    const snapPointExpanded = screenHeight - insets.top - 20;

    const expandedPosition = screenHeight - snapPointExpanded;   // ~79
    const minimizedPosition = screenHeight - snapPointMinimized; // ~768
    const closedPosition = screenHeight;  // Sheet totalmente fechado

    const animatedStyle = useAnimatedStyle(() => {
        const pos = animatedPosition.value;

        // translateY: quando expandido -> desliza pra baixo (sai da tela)
        // quando minimizado/fechado -> volta pra posição normal (0)
        const translateY = interpolate(
            pos,
            [expandedPosition, expandedPosition + 150, minimizedPosition, closedPosition],
            [totalHeight, totalHeight, 0, 0],
            Extrapolation.CLAMP
        );

        // DEBUG
        runOnJS(logDebug)(`[NAVBAR] pos=${pos.toFixed(0)} | translateY=${translateY.toFixed(0)} | expanded=${expandedPosition.toFixed(0)} | minimized=${minimizedPosition.toFixed(0)}`);

        return { transform: [{ translateY }] };
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    height: totalHeight,
                    paddingBottom: insets.bottom,
                    backgroundColor: '#000',
                    borderTopColor: theme.border,
                },
                animatedStyle,
            ]}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;
                const IconComponent = iconMap[route.name] || User;
                const color = isFocused ? theme.tabBarActive : theme.tabBarInactive;
                const iconSize = route.name === 'Iniciar o treino' ? 32 : 24;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tab}
                        activeOpacity={0.7}
                    >
                        <IconComponent color={color} size={iconSize} weight="fill" />
                        <Text style={[styles.label, { color }]} numberOfLines={1}>
                            {typeof label === 'string' ? label : route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 0.5,
        paddingTop: 8,
        // Z-INDEX ALTO - sempre na frente
        zIndex: 9999,
        elevation: 9999,
        // DEBUG - borda vermelha pra ver se tá renderizando
        borderWidth: 3,
        borderColor: 'red',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 10,
        marginTop: 4,
    },
});