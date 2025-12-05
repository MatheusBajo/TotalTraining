import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface UseAnimatedListOptions {
    itemCount: number;
    delay?: number; // delay entre cada item (ms)
    duration?: number; // duração da animação (ms)
    initialDelay?: number; // delay inicial antes de começar
}

export const useAnimatedList = ({
    itemCount,
    delay = 80,
    duration = 400,
    initialDelay = 100,
}: UseAnimatedListOptions) => {
    const animations = useRef<Animated.Value[]>([]);

    // Criar valores animados para cada item
    if (animations.current.length !== itemCount) {
        animations.current = Array(itemCount)
            .fill(0)
            .map(() => new Animated.Value(0));
    }

    useEffect(() => {
        // Reset
        animations.current.forEach((anim) => anim.setValue(0));

        // Staggered animation
        const staggeredAnimations = animations.current.map((anim, index) =>
            Animated.timing(anim, {
                toValue: 1,
                duration,
                delay: initialDelay + index * delay,
                useNativeDriver: true,
            })
        );

        Animated.parallel(staggeredAnimations).start();
    }, [itemCount, delay, duration, initialDelay]);

    const getAnimatedStyle = (index: number) => {
        const anim = animations.current[index];
        if (!anim) return {};

        return {
            opacity: anim,
            transform: [
                {
                    translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                    }),
                },
                {
                    scale: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                    }),
                },
            ],
        };
    };

    return { getAnimatedStyle, animations: animations.current };
};

// Hook simples para fade in de um único elemento
export const useFadeIn = (duration = 400, delay = 0) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(15)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return {
        opacity,
        transform: [{ translateY }],
    };
};

// Hook para animação de escala ao pressionar
export const usePressAnimation = () => {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return {
        scale,
        onPressIn,
        onPressOut,
        animatedStyle: { transform: [{ scale }] },
    };
};
