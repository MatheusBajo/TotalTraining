import { View, Text, TouchableOpacity, Animated } from 'react-native';
import React, { useRef } from 'react';
import { Plus, DotsThree, Swap, Calendar, Lightning } from 'phosphor-react-native';
import { useTheme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planoAtual, currentUser } from '../../data';
import { usePressAnimation, useScreenAnimation } from '../../hooks';
import { useNavigation } from '@react-navigation/native';

const HEADER_SCROLL_DISTANCE = 50;

// Componente para card de template do plano com animação
const PlanTemplateCard = ({
    template,
    onPress,
    animatedStyle,
}: {
    template: typeof planoAtual.templates[0];
    onPress?: () => void;
    animatedStyle?: any;
}) => {
    const { theme } = useTheme();
    const { onPressIn, onPressOut, animatedStyle: pressStyle } = usePressAnimation();
    const exerciciosText = template.exercicios.slice(0, 3).map(e => e.nome).join(', ');

    return (
        <Animated.View style={[animatedStyle, pressStyle]}>
            <TouchableOpacity
                style={{ backgroundColor: theme.surface}}
                className="p-4 rounded-xl mb-3"
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
            >
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <Text style={{ color: theme.text }} className="font-bold text-lg">{template.nome}</Text>
                            <View style={{ backgroundColor: theme.primary + '20' }} className="ml-2 px-2 py-0.5 rounded">
                                <Text style={{ color: theme.primary }} className="text-xs">{template.dia}</Text>
                            </View>
                        </View>
                        <Text style={{ color: theme.textSecondary }} className="text-sm">{template.focoPrincipal}</Text>
                    </View>
                    <TouchableOpacity>
                        <DotsThree size={24} color={theme.primary} weight="bold" />
                    </TouchableOpacity>
                </View>

                <Text style={{ color: theme.textSecondary }} className="text-sm mb-2" numberOfLines={1}>
                    {exerciciosText}{template.exercicios.length > 3 && '...'}
                </Text>

                <View className="flex-row justify-between">
                    <Text style={{ color: theme.textSecondary }} className="text-xs">
                        {template.exercicios.length} exercícios • {template.volumeTotal} séries
                    </Text>
                    <Text style={{ color: theme.textSecondary }} className="text-xs">
                        ~{template.tempoEstimado}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Componente para próximo treino sugerido com animação
const NextWorkoutCard = ({ animatedStyle }: { animatedStyle?: any }) => {
    const { theme } = useTheme();
    const { requestStartWorkout } = useWorkout();
    const { onPressIn, onPressOut, animatedStyle: pressStyle } = usePressAnimation();
    const hoje = new Date();
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaHoje = diasSemana[hoje.getDay()];

    const proximoTreino = planoAtual.estruturaSemanal.find(
        dia => dia.dia === diaHoje && dia.treino !== 'Descanso' && dia.treino !== 'Futebol'
    ) || planoAtual.estruturaSemanal.find(
        dia => dia.treino !== 'Descanso' && dia.treino !== 'Futebol'
    );

    const template = planoAtual.templates.find(t => t.nome === proximoTreino?.treino);

    if (!template) return null;

    return (
        <Animated.View style={[animatedStyle, pressStyle]}>
            <TouchableOpacity
                style={{ backgroundColor: theme.primary }}
                className="p-4 rounded-xl mb-6"
                onPress={() => requestStartWorkout(template)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
            >
                <View className="flex-row items-center mb-2">
                    <Lightning size={20} color="#fff" weight="fill" />
                    <Text className="text-white font-bold ml-2">Treino de hoje</Text>
                </View>
                <Text className="text-white text-2xl font-bold mb-1">{template.nome}</Text>
                <Text className="text-white/80 mb-2">{template.focoPrincipal}</Text>
                <View className="flex-row justify-between">
                    <Text className="text-white/70 text-sm">
                        {template.exercicios.length} exercícios • {template.volumeTotal} séries
                    </Text>
                    <Text className="text-white/70 text-sm">~{template.tempoEstimado}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

import { useWorkout } from '../../context/WorkoutContext';

export const HomeScreen = () => {
    const { theme, toggleTheme } = useTheme();
    const navigation = useNavigation();
    const { requestStartWorkout } = useWorkout();
    const scrollY = useRef(new Animated.Value(0)).current;

    // Nova animação com bounce e cascade
    const { getItemStyle } = useScreenAnimation({
        itemCount: 10,
        staggerDelay: 70,
        duration: 450,
        bounceHeight: 12,
    });

    const titleOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const titleTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -20],
        extrapolate: 'clamp',
    });

    const collapsedTitleOpacity = scrollY.interpolate({
        inputRange: [HEADER_SCROLL_DISTANCE - 20, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }} edges={['top']}>
            {/* Fixed Header */}
            <View style={{ backgroundColor: theme.background }} className="px-5 pb-3 pt-2">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                        <Text style={{ color: theme.primary }} className="font-bold text-sm uppercase">
                            {planoAtual.nome}
                        </Text>
                        <Animated.Text
                            style={{ color: theme.text, opacity: collapsedTitleOpacity }}
                            className="font-bold text-lg"
                        >
                            Iniciar treino
                        </Animated.Text>
                    </View>
                    <TouchableOpacity
                        onPress={toggleTheme}
                        style={{ backgroundColor: theme.surface }}
                        className="p-2 rounded-lg"
                    >
                        <Swap size={24} color={theme.primary} weight="bold" />
                    </TouchableOpacity>
                </View>
            </View>

            <Animated.ScrollView
                className="flex-1 px-5"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {/* Saudação */}
                <Animated.View
                    style={getItemStyle(0)}
                    className="mb-4"
                >
                    <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }}>
                        <Text style={{ color: theme.textSecondary }} className="text-base">
                            Olá, {currentUser.nome}!
                        </Text>
                        <Text style={{ color: theme.text }} className="font-bold text-3xl">
                            Iniciar treino
                        </Text>
                    </Animated.View>
                </Animated.View>

                {/* Próximo treino */}
                <NextWorkoutCard animatedStyle={getItemStyle(1)} />

                {/* Quick Start */}
                <Animated.View style={getItemStyle(2)} className="mb-6">
                    <TouchableOpacity
                        onPress={() => requestStartWorkout()}
                        style={{ backgroundColor: theme.surface, borderColor: theme.borderDashed }}
                        className="h-14 rounded-xl border border-dashed items-center justify-center flex-row"
                    >
                        <Plus size={20} color={theme.primary} weight="bold" />
                        <Text style={{ color: theme.primary }} className="font-bold ml-2">Treino vazio</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Estrutura da semana */}
                <Animated.View style={getItemStyle(3)} className="mb-6">
                    <View className="flex-row items-center mb-3">
                        <Calendar size={20} color={theme.text} />
                        <Text style={{ color: theme.text }} className="font-bold text-lg ml-2">Sua semana</Text>
                    </View>

                    <View style={{ backgroundColor: theme.surface }} className="rounded-xl p-3">
                        {planoAtual.estruturaSemanal.map((dia, index) => (
                            <View
                                key={index}
                                className="flex-row justify-between items-center py-2"
                                style={index < planoAtual.estruturaSemanal.length - 1 ? { borderBottomWidth: 1, borderColor: theme.borderSubtle } : {}}
                            >
                                <Text style={{ color: theme.textSecondary }} className="w-20">{dia.dia}</Text>
                                <Text style={{ color: dia.treino === 'Descanso' ? theme.textSecondary : theme.text }} className="font-medium flex-1">
                                    {dia.treino}
                                </Text>
                                {dia.treino !== 'Descanso' && dia.treino !== 'Futebol' && (
                                    <Text style={{ color: theme.textSecondary }} className="text-xs">
                                        {dia.focoPrincipal.split(' ')[0]}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Templates do plano */}
                <Animated.View style={getItemStyle(4)} className="mb-3">
                    <View className="flex-row justify-between items-center">
                        <Text style={{ color: theme.text }} className="font-bold text-lg">
                            Treinos ({planoAtual.templates.length})
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: theme.surface }} className="flex-row items-center px-3 py-1.5 rounded-md">
                            <Plus size={16} color={theme.primary} weight="bold" />
                            <Text style={{ color: theme.primary }} className="font-bold ml-1">Novo</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {planoAtual.templates.map((template, index) => (
                    <PlanTemplateCard
                        key={index}
                        template={template}
                        animatedStyle={getItemStyle(5 + index)}
                        onPress={() => requestStartWorkout(template)}
                    />
                ))}

                <View className="h-32" />
            </Animated.ScrollView>
        </SafeAreaView>
    );
};
