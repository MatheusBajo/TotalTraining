import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSheetAnimation } from '../context/SheetAnimationContext';
import { useWorkout } from '../context/WorkoutContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINI_PLAYER_HEIGHT = 70;
const TAB_BAR_HEIGHT = 60;

export const SheetBackdrop = () => {
    const insets = useSafeAreaInsets();
    const { animatedPosition, screenHeight } = useSheetAnimation();
    const { isActive, isMinimized, minimizeWorkout } = useWorkout();

    const navbarHeight = TAB_BAR_HEIGHT + insets.bottom;
    const snapPointMinimized = MINI_PLAYER_HEIGHT + navbarHeight + 10;
    const snapPointExpanded = screenHeight * 0.75;

    const expandedPosition = screenHeight - snapPointExpanded;
    const minimizedPosition = screenHeight - snapPointMinimized;

    const animatedStyle = useAnimatedStyle(() => {
        const pos = animatedPosition.value;
        const opacity = interpolate(
            pos,
            [expandedPosition, expandedPosition + 100, minimizedPosition],
            [0.5, 0.2, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    // Só mostra se treino ativo e não minimizado
    if (!isActive || isMinimized) return null;

    return (
        <TouchableWithoutFeedback onPress={minimizeWorkout}>
            <Animated.View style={[styles.backdrop, animatedStyle]} />
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
});