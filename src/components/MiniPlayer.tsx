import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useWorkout } from '../context/WorkoutContext';
import { useSheetAnimation } from '../context/SheetAnimationContext';

const MINI_PLAYER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 60;

export const MiniPlayer = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { animatedPosition, screenHeight } = useSheetAnimation();
    const { isActive, isMinimized, workoutName, duration, maximizeWorkout } = useWorkout();

    const navbarHeight = TAB_BAR_HEIGHT + insets.bottom;

    // Posições
    const expandedSnapPoint = screenHeight - insets.top - 20;
    const expandedPosition = screenHeight - expandedSnapPoint;
    const minimizedPosition = screenHeight; // Quando minimizado, sheet está "fechado"

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Animar opacity baseado na posição do sheet
    // Quando sheet expandido (pos baixo) -> mini-player invisível
    // Quando sheet fechado/minimizado (pos alto) -> mini-player visível
    const animatedStyle = useAnimatedStyle(() => {
        const pos = animatedPosition.value;

        // Se sheet está expandindo (pos < 400), esconder mini-player
        const opacity = interpolate(
            pos,
            [expandedPosition, expandedPosition + 200, screenHeight - 100, screenHeight],
            [0, 0, 1, 1],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            pos,
            [expandedPosition, expandedPosition + 200, screenHeight - 100, screenHeight],
            [MINI_PLAYER_HEIGHT, MINI_PLAYER_HEIGHT * 0.5, 0, 0],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    // Só renderizar se treino ativo
    if (!isActive) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    bottom: navbarHeight,
                    backgroundColor: theme.surface,
                    borderTopColor: theme.border,
                },
                animatedStyle,
            ]}
        >
            <TouchableOpacity
                onPress={maximizeWorkout}
                style={styles.touchable}
                activeOpacity={0.7}
            >
                <View style={styles.handle} />
                <Text style={[styles.title, { color: theme.text }]}>{workoutName}</Text>
                <Text style={[styles.timer, { color: theme.primary }]}>{formatTime(duration)}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: MINI_PLAYER_HEIGHT,
        borderTopWidth: 1,
        zIndex: 50,
        elevation: 50,
    },
    touchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#666',
        borderRadius: 2,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timer: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },
});