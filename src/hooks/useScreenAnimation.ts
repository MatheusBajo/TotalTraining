import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface UseScreenAnimationOptions {
    itemCount: number;
    staggerDelay?: number;
    duration?: number;
    bounceHeight?: number;
}

export const useScreenAnimation = ({
    itemCount,
    staggerDelay = 60,
    duration = 500,
    bounceHeight = 15,
}: UseScreenAnimationOptions) => {
    // Animações para cada item
    const opacityAnims = useRef<Animated.Value[]>(
        Array(itemCount).fill(0).map(() => new Animated.Value(0))
    ).current;

    const translateAnims = useRef<Animated.Value[]>(
        Array(itemCount).fill(0).map(() => new Animated.Value(-30))
    ).current;

    const scaleAnims = useRef<Animated.Value[]>(
        Array(itemCount).fill(0).map(() => new Animated.Value(0.95))
    ).current;

    // Animação de saída global
    const exitOpacity = useRef(new Animated.Value(1)).current;

    // Reset todas as animações
    const resetAnimations = useCallback(() => {
        exitOpacity.setValue(1);
        opacityAnims.forEach(anim => anim.setValue(0));
        translateAnims.forEach(anim => anim.setValue(-30));
        scaleAnims.forEach(anim => anim.setValue(0.95));
    }, []);

    // Animação de entrada com cascade + bounce
    const animateIn = useCallback(() => {
        resetAnimations();

        const animations = opacityAnims.map((_, index) => {
            const delay = index * staggerDelay;

            return Animated.parallel([
                // Fade in
                Animated.timing(opacityAnims[index], {
                    toValue: 1,
                    duration: duration * 0.6,
                    delay,
                    useNativeDriver: true,
                }),
                // Bounce effect: começa de cima (-30), vai até embaixo (+bounceHeight), volta pra 0
                Animated.sequence([
                    Animated.timing(translateAnims[index], {
                        toValue: bounceHeight,
                        duration: duration * 0.6,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.spring(translateAnims[index], {
                        toValue: 0,
                        friction: 6,
                        tension: 80,
                        useNativeDriver: true,
                    }),
                ]),
                // Scale
                Animated.sequence([
                    Animated.timing(scaleAnims[index], {
                        toValue: 1.02,
                        duration: duration * 0.5,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnims[index], {
                        toValue: 1,
                        friction: 6,
                        tension: 80,
                        useNativeDriver: true,
                    }),
                ]),
            ]);
        });

        Animated.parallel(animations).start();
    }, [itemCount, staggerDelay, duration, bounceHeight]);

    // Executa animação toda vez que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            animateIn();

            // Cleanup: animação de saída quando perde foco
            return () => {
                Animated.timing(exitOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }).start();
            };
        }, [animateIn])
    );

    // Retorna o estilo para cada item
    const getItemStyle = useCallback((index: number) => {
        if (index >= itemCount) return {};

        return {
            opacity: Animated.multiply(exitOpacity, opacityAnims[index]),
            transform: [
                { translateY: translateAnims[index] },
                { scale: scaleAnims[index] },
            ],
        };
    }, [itemCount]);

    // Container style com exit opacity
    const containerStyle = {
        opacity: exitOpacity,
    };

    return {
        getItemStyle,
        containerStyle,
        animateIn,
        resetAnimations,
    };
};
