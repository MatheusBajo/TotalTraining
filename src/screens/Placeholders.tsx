import { View, Text, ScrollView, TouchableOpacity, Animated, Alert, TextInput, SectionList, Image } from 'react-native';
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useTheme } from '../theme';
import * as Progress from 'react-native-progress';
import { currentUser } from '../data';
import { TrendUp, Fire, Barbell, Timer, Trophy, MagnifyingGlass, FunnelSimple, SignOut, UserMinus, ArrowsClockwise } from 'phosphor-react-native';
import { useAuth } from '../context/AuthContext';
import { useScreenAnimation } from '../hooks';
import { getUserStats, UserStats, getExerciseDBPriority, getExerciseDBTargets, getExerciseImageUrl, ExerciseDBPriority } from '../api';
import { useFocusEffect } from '@react-navigation/native';
import { triggerSync } from '../db/syncService';

const PlaceholderScreen = ({ name }: { name: string }) => {
    const { theme } = useTheme();

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1 items-center justify-center">
            <Text style={{ color: theme.text }} className="text-xl">{name}</Text>
        </View>
    );
};

// Traduz músculo alvo (target) para português
const getTargetLabel = (target: string) => {
    const translations: Record<string, string> = {
        'pectorals': 'Peito',
        'lats': 'Dorsais',
        'delts': 'Deltoides',
        'biceps': 'Bíceps',
        'triceps': 'Tríceps',
        'forearms': 'Antebraços',
        'abs': 'Abdômen',
        'quads': 'Quadríceps',
        'hamstrings': 'Posterior',
        'glutes': 'Glúteos',
        'calves': 'Panturrilha',
        'traps': 'Trapézio',
        'upper back': 'Costas Superior',
        'spine': 'Coluna',
        'serratus anterior': 'Serrátil',
        'levator scapulae': 'Elevador Escápula',
        'cardiovascular system': 'Cardio',
        'adductors': 'Adutores',
        'abductors': 'Abdutores',
    };
    return translations[target?.toLowerCase()] || target || '';
};

// Componente de item de exercício (ExerciseDB com GIFs)
const ExerciseItem = ({ exercise, theme }: { exercise: ExerciseDBPriority; theme: any }) => {
    const imageUrl = exercise.localImage ? getExerciseImageUrl(exercise.localImage) : null;
    const displayName = exercise.name_pt || exercise.name;
    const displayEquipment = exercise.equipment_pt || exercise.equipment;

    return (
        <TouchableOpacity
            style={{ backgroundColor: theme.surface, borderBottomColor: theme.borderSubtle }}
            className="flex-row items-center px-4 py-3 border-b"
            activeOpacity={0.7}
        >
            {/* Imagem GIF ou placeholder */}
            <View
                style={{ backgroundColor: theme.field }}
                className="w-14 h-14 rounded-lg mr-3 overflow-hidden items-center justify-center"
            >
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 56, height: 56 }}
                        resizeMode="cover"
                    />
                ) : (
                    <Text style={{ color: theme.textSecondary }} className="text-2xl font-bold">
                        {displayName.charAt(0).toUpperCase()}
                    </Text>
                )}
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text style={{ color: theme.text }} className="font-semibold text-base" numberOfLines={1}>
                    {displayName}
                </Text>
                <Text style={{ color: theme.textSecondary }} className="text-sm" numberOfLines={1}>
                    {getTargetLabel(exercise.target)} • {displayEquipment}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export const ExercisesScreen = () => {
    const { theme } = useTheme();
    const sectionListRef = useRef<SectionList>(null);
    const [exercises, setExercises] = useState<ExerciseDBPriority[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
    const [targets, setTargets] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Carrega exercícios do ExerciseDB com GIFs
    const loadExercises = useCallback(async () => {
        setLoading(true);
        try {
            const results = await getExerciseDBPriority({
                q: searchQuery || undefined,
                target: selectedTarget || undefined,
                limit: 100,
            });
            setExercises(results);
        } catch (error) {
            console.error('[ExercisesScreen] Error loading exercises:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedTarget]);

    // Carrega filtros ao montar
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const targetList = await getExerciseDBTargets();
                setTargets(targetList);
            } catch (error) {
                console.error('[ExercisesScreen] Error loading filters:', error);
            }
        };
        loadFilters();
    }, []);

    // Recarrega quando filtros mudam
    useEffect(() => {
        loadExercises();
    }, [loadExercises]);

    // Agrupa exercícios por letra (usando nome em português)
    const sections = useMemo(() => {
        const grouped: Record<string, ExerciseDBPriority[]> = {};

        exercises.forEach(ex => {
            const displayName = ex.name_pt || ex.name;
            const letter = displayName.charAt(0).toUpperCase();
            if (!grouped[letter]) {
                grouped[letter] = [];
            }
            grouped[letter].push(ex);
        });

        return Object.keys(grouped)
            .sort()
            .map(letter => ({
                title: letter,
                data: grouped[letter].sort((a, b) => {
                    const nameA = a.name_pt || a.name;
                    const nameB = b.name_pt || b.name;
                    return nameA.localeCompare(nameB);
                }),
            }));
    }, [exercises]);

    // Letras disponíveis para o índice
    const availableLetters = useMemo(() => sections.map(s => s.title), [sections]);

    // Scroll para letra
    const scrollToLetter = useCallback((letter: string) => {
        const sectionIndex = sections.findIndex(s => s.title === letter);
        if (sectionIndex >= 0 && sectionListRef.current) {
            sectionListRef.current.scrollToLocation({
                sectionIndex,
                itemIndex: 0,
                viewOffset: 50,
                animated: true,
            });
        }
    }, [sections]);

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1">
            {/* Header */}
            <View className="px-4 pt-16 pb-2">
                <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity>
                        <Text style={{ color: theme.primary }} className="text-base font-semibold">Novo</Text>
                    </TouchableOpacity>
                    <Text style={{ color: theme.text }} className="text-lg font-bold">Exercícios</Text>
                    <TouchableOpacity>
                        <Text style={{ color: theme.primary }} className="text-xl">•••</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View
                    style={{ backgroundColor: theme.field }}
                    className="flex-row items-center px-3 py-2 rounded-lg mb-3"
                >
                    <MagnifyingGlass size={20} color={theme.textSecondary} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Pesquisar exercício..."
                        placeholderTextColor={theme.textSecondary}
                        style={{ color: theme.text }}
                        className="flex-1 ml-2 text-base"
                    />
                </View>

                {/* Filter Button */}
                <View className="flex-row mb-2">
                    <TouchableOpacity
                        onPress={() => setShowFilters(!showFilters)}
                        style={{ backgroundColor: selectedTarget ? theme.primary : theme.field }}
                        className="flex-1 mr-2 py-2 px-3 rounded-lg"
                    >
                        <Text
                            style={{ color: selectedTarget ? '#fff' : theme.text }}
                            className="text-center text-sm font-medium"
                        >
                            {selectedTarget ? getTargetLabel(selectedTarget) : 'Qualquer músculo'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowFilters(!showFilters)}
                        style={{ backgroundColor: theme.field }}
                        className="py-2 px-3 rounded-lg"
                    >
                        <FunnelSimple size={20} color={theme.text} />
                    </TouchableOpacity>
                </View>

                {/* Filtros expandidos */}
                {showFilters && (
                    <View className="mb-2">
                        <Text style={{ color: theme.textSecondary }} className="text-xs mb-2">MÚSCULO ALVO:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity
                                onPress={() => setSelectedTarget(null)}
                                style={{ backgroundColor: !selectedTarget ? theme.primary : theme.field }}
                                className="px-3 py-1 rounded-full mr-2"
                            >
                                <Text style={{ color: !selectedTarget ? '#fff' : theme.text }} className="text-sm">
                                    Todos
                                </Text>
                            </TouchableOpacity>
                            {targets.map(target => (
                                <TouchableOpacity
                                    key={target}
                                    onPress={() => setSelectedTarget(target === selectedTarget ? null : target)}
                                    style={{ backgroundColor: selectedTarget === target ? theme.primary : theme.field }}
                                    className="px-3 py-1 rounded-full mr-2"
                                >
                                    <Text style={{ color: selectedTarget === target ? '#fff' : theme.text }} className="text-sm">
                                        {getTargetLabel(target)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* Exercise List */}
            <View className="flex-1 flex-row">
                <SectionList
                    ref={sectionListRef}
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ExerciseItem exercise={item} theme={theme} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ backgroundColor: theme.background }} className="px-4 py-2">
                            <Text style={{ color: theme.textSecondary }} className="text-sm font-bold">
                                {title}
                            </Text>
                        </View>
                    )}
                    stickySectionHeadersEnabled={true}
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    onScrollToIndexFailed={() => {}}
                    ListEmptyComponent={
                        <View className="items-center py-8">
                            <Text style={{ color: theme.textSecondary }}>
                                {loading ? 'Carregando...' : 'Nenhum exercício encontrado'}
                            </Text>
                        </View>
                    }
                />

                {/* Índice alfabético lateral */}
                {availableLetters.length > 0 && (
                    <View className="absolute right-0 top-0 bottom-0 justify-center pr-1">
                        {availableLetters.map(letter => (
                            <TouchableOpacity
                                key={letter}
                                onPress={() => scrollToLetter(letter)}
                                className="py-0.5 px-1"
                            >
                                <Text style={{ color: theme.primary }} className="text-xs font-bold">
                                    {letter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

export const StoreScreen = () => <PlaceholderScreen name="Store" />;

// ==================== ANIMATED COMPONENTS ====================

import ReAnimated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    withRepeat,
    interpolate,
    Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { CoreHaptics } from 'expo-core-haptics';
import { useDev } from '../context/DevContext';

// Número animado que conta de 0 até o valor final com haptics SINCRONIZADOS
// OTIMIZADO: Usa Reanimated para rodar no UI thread, não bloqueia JS
const AnimatedNumber = ({
    value,
    duration = 1200,
    delay = 0,
    suffix = '',
    prefix = '',
    style,
    decimals = 0,
    enableHaptics = false,
    hapticSteps = 8,
    animationKey = 0,
}: {
    value: number;
    duration?: number;
    delay?: number;
    suffix?: string;
    prefix?: string;
    style?: any;
    decimals?: number;
    enableHaptics?: boolean;
    hapticSteps?: number;
    animationKey?: number;
}) => {
    const animatedValue = useSharedValue(0);
    const lastHapticStep = useRef(-1);
    const [displayValue, setDisplayValue] = useState(0);
    const isAnimating = useRef(false);

    useEffect(() => {
        // Reset
        animatedValue.value = 0;
        lastHapticStep.current = -1;
        isAnimating.current = true;
        setDisplayValue(0);

        if (value === 0) {
            isAnimating.current = false;
            return;
        }

        // Anima no UI thread (visual smooth)
        animatedValue.value = withDelay(
            delay,
            withTiming(value, {
                duration,
                easing: Easing.out(Easing.cubic),
            })
        );

        // Estratégia adaptativa: max 30 steps para não travar JS thread
        // Valores pequenos (<=30): 1 step por número (conta 0,1,2,3...)
        // Valores grandes (>30): 30 steps distribuídos
        const MAX_STEPS = 30;
        const intValue = Math.round(value);
        const totalSteps = Math.min(intValue, MAX_STEPS);
        const stepInterval = duration / totalSteps;

        const timeouts: NodeJS.Timeout[] = [];
        for (let i = 1; i <= totalSteps; i++) {
            const stepTime = delay + (stepInterval * i);

            // Valor: conta exata para pequenos, distribuído para grandes
            const displayVal = intValue <= MAX_STEPS
                ? i
                : Math.round((i / totalSteps) * intValue);

            const timeout = setTimeout(() => {
                if (isAnimating.current) {
                    setDisplayValue(displayVal);

                    // Haptics nos pontos proporcionais
                    if (enableHaptics && CoreHaptics.isSupported()) {
                        const progress = i / totalSteps;
                        const hapticStep = Math.floor(progress * hapticSteps);
                        if (hapticStep > lastHapticStep.current) {
                            lastHapticStep.current = hapticStep;
                            const sharpness = 0.1 + (progress * 0.7);
                            const intensity = 0.8 - (progress * 0.2);
                            CoreHaptics.tap.custom(intensity, sharpness);
                        }
                    }
                }
            }, stepTime);
            timeouts.push(timeout);
        }

        // Valor final (garante precisão para decimais)
        const finalTimeout = setTimeout(() => {
            isAnimating.current = false;
            setDisplayValue(value);
            if (enableHaptics && value > 0 && CoreHaptics.isSupported()) {
                CoreHaptics.patterns.success();
            }
        }, duration + delay + 50);
        timeouts.push(finalTimeout);

        return () => {
            isAnimating.current = false;
            timeouts.forEach(t => clearTimeout(t));
        };
    }, [value, duration, delay, enableHaptics, hapticSteps, animationKey]);

    const formattedValue = decimals > 0
        ? displayValue.toFixed(decimals)
        : Math.round(displayValue).toLocaleString();

    return (
        <Text style={style}>
            {prefix}{formattedValue}{suffix}
        </Text>
    );
};

// Progress circle animado com haptics SINCRONIZADOS
// OTIMIZADO: Atualiza menos vezes para não bloquear JS thread
const AnimatedProgressCircle = ({
    progress,
    size = 70,
    thickness = 6,
    color,
    unfilledColor,
    delay = 0,
    duration = 1000,
    theme,
    enableHaptics = true,
    hapticSteps = 6,
    animationKey = 0,
}: {
    progress: number;
    size?: number;
    thickness?: number;
    color: string;
    unfilledColor: string;
    delay?: number;
    duration?: number;
    theme: any;
    enableHaptics?: boolean;
    hapticSteps?: number;
    animationKey?: number;
}) => {
    const [currentProgress, setCurrentProgress] = useState(0);
    const lastHapticStep = useRef(-1);
    const isAnimating = useRef(false);

    useEffect(() => {
        // Reset imediato
        setCurrentProgress(0);
        lastHapticStep.current = -1;
        isAnimating.current = true;

        if (progress === 0) {
            isAnimating.current = false;
            return;
        }

        // 20 steps = porcentagem sobe ~4% por step (suave) sem sobrecarregar JS
        const updateSteps = 20;
        const stepDuration = duration / updateSteps;
        const timeouts: NodeJS.Timeout[] = [];

        for (let i = 1; i <= updateSteps; i++) {
            const timeout = setTimeout(() => {
                if (isAnimating.current) {
                    const animProgress = i / updateSteps;
                    const currentValue = progress * animProgress;
                    setCurrentProgress(currentValue);

                    // Haptics
                    if (enableHaptics && progress > 0 && CoreHaptics.isSupported()) {
                        const hapticStep = Math.floor(animProgress * hapticSteps);
                        if (hapticStep > lastHapticStep.current) {
                            lastHapticStep.current = hapticStep;
                            const sharpness = 0.1 + (animProgress * 0.6);
                            const baseIntensity = 0.5 + (progress * 0.3);
                            const intensity = baseIntensity - (animProgress * 0.15);
                            CoreHaptics.tap.custom(intensity, sharpness);
                        }
                    }
                }
            }, delay + (stepDuration * i));
            timeouts.push(timeout);
        }

        // Valor final
        const finalTimeout = setTimeout(() => {
            isAnimating.current = false;
            setCurrentProgress(progress);

            if (enableHaptics && progress > 0 && CoreHaptics.isSupported()) {
                if (progress >= 1) {
                    CoreHaptics.patterns.goalComplete();
                } else {
                    CoreHaptics.patterns.success();
                }
            }
        }, duration + delay + 50);
        timeouts.push(finalTimeout);

        return () => {
            isAnimating.current = false;
            timeouts.forEach(t => clearTimeout(t));
        };
    }, [progress, duration, delay, enableHaptics, hapticSteps, animationKey]);

    return (
        <Progress.Circle
            size={size}
            progress={currentProgress}
            thickness={thickness}
            color={color}
            unfilledColor={unfilledColor}
            borderWidth={0}
            showsText
            formatText={() => `${Math.round(currentProgress * 100)}%`}
            textStyle={{ color: theme.text, fontSize: 14, fontWeight: 'bold' }}
        />
    );
};

// Card de streak com efeito glow quando ativo
const StreakCard = ({
    streak,
    theme,
    animationDelay = 0,
    animationKey = 0,
}: {
    streak: UserStats['streak'];
    theme: any;
    animationDelay?: number;
    animationKey?: number;
}) => {
    const glowOpacity = useSharedValue(0);
    const fireScale = useSharedValue(0.8);
    const fireRotation = useSharedValue(0);

    const hasStreak = streak.current > 0;

    useEffect(() => {
        // Reset
        glowOpacity.value = 0;
        fireScale.value = 0.8;
        fireRotation.value = 0;

        if (hasStreak) {
            // Glow pulsante
            glowOpacity.value = withDelay(
                animationDelay,
                withRepeat(
                    withSequence(
                        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                )
            );

            // Fire scale in (suave, sem bounce)
            fireScale.value = withDelay(
                animationDelay,
                withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
            );

            // Subtle rotation
            fireRotation.value = withDelay(
                animationDelay,
                withRepeat(
                    withSequence(
                        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                )
            );

            // Haptic: streak fire pattern (celebração de fogo)
            if (CoreHaptics.isSupported()) {
                setTimeout(() => {
                    CoreHaptics.patterns.streakFire();
                }, animationDelay);
            }
        }
    }, [hasStreak, animationDelay, animationKey]);

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const fireStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: fireScale.value },
            { rotate: `${fireRotation.value}deg` },
        ],
    }));

    // Estado vazio
    if (!hasStreak) {
        return (
            <View style={{ backgroundColor: theme.surface }} className="flex-1 ml-2 p-4 rounded-xl items-center">
                <View className="items-center justify-center h-[70px]">
                    <Fire size={32} color={theme.textSecondary + '40'} weight="regular" />
                    <View className="flex-row mt-2">
                        <View style={{ backgroundColor: theme.textSecondary + '30' }} className="w-2 h-2 rounded-full mx-0.5" />
                        <View style={{ backgroundColor: theme.textSecondary + '30' }} className="w-2 h-2 rounded-full mx-0.5" />
                        <View style={{ backgroundColor: theme.textSecondary + '30' }} className="w-2 h-2 rounded-full mx-0.5" />
                    </View>
                </View>
                <Text style={{ color: theme.textSecondary }} className="text-xs mt-2">Streak</Text>
                <Text style={{ color: theme.textSecondary }} className="font-medium text-sm">
                    Comece a treinar!
                </Text>
            </View>
        );
    }

    const isRecord = streak.current >= streak.best && streak.current > 0;
    const fireColor = streak.atRisk ? '#fbbf24' : isRecord ? '#eab308' : '#f97316';
    const glowColor = streak.atRisk ? 'rgba(251, 191, 36, 0.4)' : isRecord ? 'rgba(234, 179, 8, 0.4)' : 'rgba(249, 115, 22, 0.4)';

    return (
        <View style={{ backgroundColor: theme.surface }} className="flex-1 ml-2 rounded-xl overflow-hidden">
            {/* Glow effect background */}
            <ReAnimated.View
                style={[
                    {
                        position: 'absolute',
                        top: -20,
                        left: -20,
                        right: -20,
                        bottom: -20,
                        backgroundColor: glowColor,
                        borderRadius: 40,
                    },
                    glowStyle,
                ]}
            />

            <View className="p-4 items-center">
                <View className="items-center justify-center h-[70px]">
                    <ReAnimated.View style={fireStyle}>
                        <Fire size={32} color={fireColor} weight="fill" />
                    </ReAnimated.View>
                    <AnimatedNumber
                        value={streak.current}
                        duration={800}
                        delay={animationDelay + 200}
                        style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', marginTop: 4 }}
                        enableHaptics={true}
                        hapticSteps={5}
                        animationKey={animationKey}
                    />
                </View>
                <Text style={{ color: theme.textSecondary }} className="text-xs mt-2">
                    {streak.atRisk ? 'Streak em risco!' : isRecord ? 'Recorde!' : 'Streak'}
                </Text>
                <Text style={{ color: theme.text }} className="font-bold">
                    {streak.trainedToday ? 'treinou hoje' : 'dias seguidos'}
                </Text>
                {streak.best > streak.current && streak.best > 0 && (
                    <Text style={{ color: theme.textSecondary }} className="text-xs mt-1">
                        Recorde: {streak.best}
                    </Text>
                )}
            </View>
        </View>
    );
};

// Card de meta semanal com estado vazio
const WeeklyGoalCard = ({
    metaSemanal,
    theme,
    animationDelay = 0,
    animationKey = 0,
}: {
    metaSemanal: UserStats['metaSemanal'];
    theme: any;
    animationDelay?: number;
    animationKey?: number;
}) => {
    const progress = metaSemanal.meta > 0 ? metaSemanal.atual / metaSemanal.meta : 0;
    const isEmpty = metaSemanal.atual === 0;

    if (isEmpty) {
        return (
            <View style={{ backgroundColor: theme.surface }} className="flex-1 mr-2 p-4 rounded-xl items-center">
                <View className="items-center justify-center h-[70px]">
                    <Progress.Circle
                        size={70}
                        progress={0}
                        thickness={6}
                        color={theme.primary + '30'}
                        unfilledColor={theme.field}
                        borderWidth={0}
                        showsText
                        formatText={() => '—'}
                        textStyle={{ color: theme.textSecondary, fontSize: 18, fontWeight: 'bold' }}
                    />
                </View>
                <Text style={{ color: theme.textSecondary }} className="text-xs mt-2">Meta semanal</Text>
                <View className="flex-row items-center">
                    <View style={{ backgroundColor: theme.textSecondary + '30' }} className="w-1.5 h-1.5 rounded-full mx-0.5" />
                    <Text style={{ color: theme.textSecondary }} className="font-medium mx-1">/</Text>
                    <Text style={{ color: theme.textSecondary }} className="font-medium">{metaSemanal.meta}</Text>
                    <Text style={{ color: theme.textSecondary }} className="font-medium ml-1">treinos</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: theme.surface }} className="flex-1 mr-2 p-4 rounded-xl items-center">
            <AnimatedProgressCircle
                progress={progress}
                size={70}
                thickness={6}
                color={theme.primary}
                unfilledColor={theme.field}
                delay={animationDelay}
                duration={1200}
                theme={theme}
                animationKey={animationKey}
            />
            <Text style={{ color: theme.textSecondary }} className="text-xs mt-2">Meta semanal</Text>
            <View className="flex-row items-center">
                <AnimatedNumber
                    value={metaSemanal.atual}
                    duration={800}
                    delay={animationDelay + 400}
                    style={{ color: theme.text, fontWeight: 'bold' }}
                    enableHaptics={false}
                    animationKey={animationKey}
                />
                <Text style={{ color: theme.text }} className="font-bold">/{metaSemanal.meta} treinos</Text>
            </View>
        </View>
    );
};

// Stat row com animação e haptics opcionais
const AnimatedStatRow = ({
    icon,
    label,
    value,
    isNumber = false,
    delay = 0,
    theme,
    hasBorder = true,
    enableHaptics = false,
    suffix = '',
    hapticSteps = 8,
    animationKey = 0,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    isNumber?: boolean;
    delay?: number;
    theme: any;
    hasBorder?: boolean;
    enableHaptics?: boolean;
    suffix?: string;
    hapticSteps?: number;
    animationKey?: number;
}) => {
    const isEmpty = value === 0 || value === '0' || value === '0h 0min';

    return (
        <View
            className={`flex-row justify-between py-3 ${hasBorder ? 'border-b' : ''}`}
            style={hasBorder ? { borderColor: theme.borderSubtle } : {}}
        >
            <View className="flex-row items-center">
                {icon}
                <Text style={{ color: theme.textSecondary }} className="ml-2">{label}</Text>
            </View>
            {isEmpty ? (
                <View className="flex-row items-center">
                    <View style={{ backgroundColor: theme.textSecondary + '30' }} className="w-2 h-2 rounded-full mx-0.5" />
                    <View style={{ backgroundColor: theme.textSecondary + '30' }} className="w-2 h-2 rounded-full mx-0.5" />
                    <View style={{ backgroundColor: theme.textSecondary + '30' }} className="w-2 h-2 rounded-full mx-0.5" />
                </View>
            ) : isNumber ? (
                <AnimatedNumber
                    value={typeof value === 'number' ? value : parseFloat(value)}
                    duration={1000}
                    delay={delay}
                    suffix={suffix}
                    style={{ color: theme.text, fontWeight: 'bold' }}
                    enableHaptics={enableHaptics}
                    hapticSteps={hapticSteps}
                    animationKey={animationKey}
                />
            ) : (
                <Text style={{ color: theme.text }} className="font-bold">{value}</Text>
            )}
        </View>
    );
};

// Dados padrão (vazios)
const emptyStats: UserStats = {
    totalTreinos: 0,
    tempoTotal: '0h 0min',
    volumeTotal: 0,
    streak: {
        current: 0,
        best: 0,
        trainedToday: false,
        atRisk: false,
        freezesAvailable: 1
    },
    metaSemanal: { atual: 0, meta: 4 },
    progressao: []
};

// Dados mockados para testar animações
const mockStats: UserStats = {
    totalTreinos: 47,
    tempoTotal: '32h 15min',
    volumeTotal: 128450,
    streak: {
        current: 12,
        best: 15,
        trainedToday: true,
        atRisk: false,
        freezesAvailable: 2
    },
    metaSemanal: { atual: 3, meta: 4 },
    progressao: [
        { exercicio: 'Supino Reto', cargaInicial: 60, cargaAtual: 80, evolucao: 20 },
        { exercicio: 'Agachamento', cargaInicial: 80, cargaAtual: 110, evolucao: 30 },
        { exercicio: 'Levantamento Terra', cargaInicial: 100, cargaAtual: 140, evolucao: 40 },
    ]
};

export const ProfileScreen = () => {
    const { theme } = useTheme();
    const { user, signOut, deleteAccount } = useAuth();
    const { useMockData, toggleMockData: toggleMock } = useDev();
    const [stats, setStats] = useState<UserStats>(emptyStats); // Começa vazio
    const [loading, setLoading] = useState(true);
    const [animationKey, setAnimationKey] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    // Toggle entre dados vazios e mockados (global)
    const toggleMockData = () => {
        CoreHaptics.tap.rigid(); // Clique mecânico de switch
        toggleMock();
        // Atualiza direto sem delay
        setStats(!useMockData ? mockStats : emptyStats);
        setAnimationKey(prev => prev + 1);
    };

    const handleLogout = () => {
        CoreHaptics.tap.medium();
        Alert.alert(
            'Sair da conta',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                        } catch (error: any) {
                            Alert.alert('Erro', error.message);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        CoreHaptics.patterns.warning(); // 2 taps de aviso
        Alert.alert(
            'Excluir conta',
            'Tem certeza que deseja excluir sua conta?\n\nTodos os seus treinos serão apagados permanentemente. Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAccount();
                            Alert.alert('Conta excluída', 'Seus dados foram removidos.');
                        } catch (error: any) {
                            Alert.alert('Erro', error.message);
                        }
                    }
                }
            ]
        );
    };

    // DEBUG: Forçar sync manualmente
    const [isSyncing, setIsSyncing] = useState(false);
    const handleForceSync = async () => {
        CoreHaptics.tap.medium();
        setIsSyncing(true);
        try {
            await triggerSync();
            CoreHaptics.patterns.success();
            Alert.alert('Sync completo', 'Sincronização concluída com sucesso!');
        } catch (error: any) {
            CoreHaptics.patterns.error();
            Alert.alert('Erro no Sync', error.message || 'Erro desconhecido');
        } finally {
            setIsSyncing(false);
        }
    };

    // Carrega stats do banco (ou mock se ativado)
    const loadStats = useCallback(async () => {
        setLoading(true);

        if (useMockData) {
            setStats(mockStats);
            setAnimationKey(prev => prev + 1);
            setLoading(false);
            return;
        }

        try {
            const data = await getUserStats(true);
            setStats(data);
            setAnimationKey(prev => prev + 1);
        } catch (error) {
            console.error('[ProfileScreen] Error loading stats:', error);
            // Mantém os stats anteriores em caso de erro
        } finally {
            setLoading(false);
        }
    }, [useMockData]);

    // Recarrega quando a tela ganha foco e volta ao topo
    useFocusEffect(
        useCallback(() => {
            loadStats();
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [loadStats])
    );

    const { getItemStyle } = useScreenAnimation({
        itemCount: 7,
        staggerDelay: 80,
        duration: 450,
        bounceHeight: 12,
    });

    return (
        <ScrollView
            ref={scrollViewRef}
            style={{ backgroundColor: theme.background }}
            className="flex-1 px-5 pt-16"
            showsVerticalScrollIndicator={false}
        >
            {/* Toggle Mock Data - DEV */}
            <TouchableOpacity
                onPress={toggleMockData}
                style={{
                    backgroundColor: useMockData ? theme.primary : theme.surface,
                    position: 'absolute',
                    top: 16,
                    right: 0,
                    zIndex: 10,
                }}
                className="px-3 py-1.5 rounded-full"
            >
                <Text style={{ color: useMockData ? '#fff' : theme.textSecondary }} className="text-xs font-medium">
                    {useMockData ? '✨ Mock' : '📭 Vazio'}
                </Text>
            </TouchableOpacity>

            {/* Header do perfil */}
            <Animated.View style={getItemStyle(0)} className="items-center mb-6">
                <View
                    style={{ backgroundColor: theme.primary }}
                    className="w-20 h-20 rounded-full items-center justify-center mb-3"
                >
                    <Text className="text-white text-3xl font-bold">
                        {currentUser.nome.charAt(0)}
                    </Text>
                </View>
                <Text style={{ color: theme.text }} className="text-2xl font-bold">
                    {currentUser.nome}
                </Text>
                <Text style={{ color: theme.textSecondary }}>
                    {currentUser.peso}kg → {currentUser.pesoMeta}kg
                </Text>
                <View
                    style={{ backgroundColor: theme.surface }}
                    className="px-3 py-1 rounded-full mt-2"
                >
                    <Text style={{ color: theme.primary }} className="text-sm font-medium">
                        {currentUser.nivel.charAt(0).toUpperCase() + currentUser.nivel.slice(1)}
                    </Text>
                </View>
            </Animated.View>

            {/* Stats Cards - Meta semanal e Streak */}
            <Animated.View style={getItemStyle(1)} className="flex-row justify-between mb-4">
                <WeeklyGoalCard
                    metaSemanal={stats.metaSemanal}
                    theme={theme}
                    animationDelay={200}
                    animationKey={animationKey}
                />
                <StreakCard
                    streak={stats.streak}
                    theme={theme}
                    animationDelay={400}
                    animationKey={animationKey}
                />
            </Animated.View>

            {/* Estatísticas gerais */}
            <Animated.View style={[getItemStyle(2), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-4">
                <Text style={{ color: theme.text }} className="font-bold text-lg mb-3">Estatísticas</Text>

                <AnimatedStatRow
                    icon={<Barbell size={20} color={theme.textSecondary} />}
                    label="Total de treinos"
                    value={stats.totalTreinos}
                    isNumber={true}
                    delay={600}
                    theme={theme}
                    animationKey={animationKey}
                />
                <AnimatedStatRow
                    icon={<Timer size={20} color={theme.textSecondary} />}
                    label="Tempo total"
                    value={stats.tempoTotal}
                    delay={700}
                    theme={theme}
                    animationKey={animationKey}
                />
                <AnimatedStatRow
                    icon={<Trophy size={20} color={theme.textSecondary} />}
                    label="Volume total"
                    value={stats.volumeTotal}
                    isNumber={true}
                    delay={800}
                    theme={theme}
                    hasBorder={false}
                    enableHaptics={true}
                    suffix=" kg"
                    animationKey={animationKey}
                />
            </Animated.View>

            {/* Progressão */}
            {stats.progressao.length > 0 && (
                <Animated.View style={[getItemStyle(3), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-4">
                    <View className="flex-row items-center mb-3">
                        <TrendUp size={20} color={theme.primary} />
                        <Text style={{ color: theme.text }} className="font-bold text-lg ml-2">Progressão</Text>
                    </View>

                    {stats.progressao.map((prog, index) => (
                        <View
                            key={index}
                            className="flex-row justify-between items-center py-2"
                            style={index < stats.progressao.length - 1 ? { borderBottomWidth: 1, borderColor: theme.borderSubtle } : {}}
                        >
                            <Text style={{ color: theme.text }} className="flex-1">{prog.exercicio}</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-sm">
                                {prog.cargaInicial}kg → {prog.cargaAtual}kg
                            </Text>
                            <View
                                style={{ backgroundColor: prog.evolucao >= 0 ? '#22c55e20' : '#ef444420' }}
                                className="ml-2 px-2 py-0.5 rounded"
                            >
                                <Text style={{ color: prog.evolucao >= 0 ? '#22c55e' : '#ef4444' }} className="text-xs font-bold">
                                    {prog.evolucao >= 0 ? '+' : ''}{prog.evolucao}kg
                                </Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>
            )}

            {/* Prioridades musculares */}
            <Animated.View style={[getItemStyle(4), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-4">
                <Text style={{ color: theme.text }} className="font-bold text-lg mb-3">Prioridades</Text>
                <View className="flex-row flex-wrap">
                    {currentUser.prioridadesMusculares.map((prioridade, index) => (
                        <View
                            key={index}
                            style={{ backgroundColor: theme.primary + '20' }}
                            className="px-3 py-1.5 rounded-full mr-2 mb-2"
                        >
                            <Text style={{ color: theme.primary }} className="text-sm">
                                {prioridade}
                            </Text>
                        </View>
                    ))}
                </View>
            </Animated.View>

            {/* Conta */}
            <Animated.View style={[getItemStyle(5), { backgroundColor: theme.surface }]} className="p-4 rounded-xl mb-4">
                <Text style={{ color: theme.text }} className="font-bold text-lg mb-3">Conta</Text>

                {user?.email && (
                    <Text style={{ color: theme.textSecondary }} className="text-sm mb-4">
                        {user.email}
                    </Text>
                )}

                {/* DEBUG: Botão de Sync */}
                <TouchableOpacity
                    onPress={handleForceSync}
                    disabled={isSyncing}
                    className="flex-row items-center py-3 border-b"
                    style={{ borderColor: theme.borderSubtle, opacity: isSyncing ? 0.5 : 1 }}
                >
                    <ArrowsClockwise size={20} color={theme.primary} weight={isSyncing ? 'bold' : 'regular'} />
                    <Text style={{ color: theme.primary }} className="ml-3 flex-1">
                        {isSyncing ? 'Sincronizando...' : 'Forçar Sync (Debug)'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center py-3 border-b"
                    style={{ borderColor: theme.borderSubtle }}
                >
                    <SignOut size={20} color={theme.textSecondary} />
                    <Text style={{ color: theme.text }} className="ml-3 flex-1">Sair da conta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleDeleteAccount}
                    className="flex-row items-center py-3"
                >
                    <UserMinus size={20} color="#ef4444" />
                    <Text style={{ color: '#ef4444' }} className="ml-3 flex-1">Excluir conta</Text>
                </TouchableOpacity>
            </Animated.View>

            <View className="h-32" />
        </ScrollView>
    );
};
