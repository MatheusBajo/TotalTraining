import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import React, { useEffect, useCallback, useState, useRef, memo } from 'react';
import { Plus, Swap, Calendar, Lightning, Play, Timer, ArrowRight, Barbell, Bug } from 'phosphor-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planoAtual, currentUser, treinoA, treinoB } from '../../data';
import { usePressAnimation } from '../../hooks';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { OptionsDropdown } from '../../components/OptionsDropdown';
import { useWorkoutTimer, useWorkoutMeta, useWorkoutActions } from '../../context/WorkoutContext';
import { CoreHaptics } from 'expo-core-haptics';
import { getLastFinishedWorkout } from '../../api';
import { getDatabase } from '../../db/database';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';

// DEBUG: Função para mostrar exercícios do SQLite com superset_with
const debugSupersets = async () => {
    try {
        const db = getDatabase();

        // Busca o treino ativo (não finalizado)
        const activeWorkout = await db.getFirstAsync<{ id: number; name: string }>(
            `SELECT id, name FROM workouts WHERE finished_at IS NULL ORDER BY id DESC LIMIT 1`
        );

        if (!activeWorkout) {
            Alert.alert('Debug Superset', 'Nenhum treino ativo encontrado.\n\nInicie um treino primeiro para testar os supersets.');
            return;
        }

        // Busca exercícios do treino ativo
        const exercises = await db.getAllAsync<{
            id: number;
            exercise_name: string;
            order_index: number;
            superset_with: number | null;
        }>(
            `SELECT id, exercise_name, order_index, superset_with FROM exercises WHERE workout_id = ? ORDER BY order_index`,
            [activeWorkout.id]
        );

        if (exercises.length === 0) {
            Alert.alert('Debug Superset', `Treino "${activeWorkout.name}" (ID: ${activeWorkout.id})\n\nNenhum exercício encontrado.`);
            return;
        }

        // Formata a saída
        let output = `TREINO: ${activeWorkout.name} (ID: ${activeWorkout.id})\n\n`;
        output += `EXERCÍCIOS (${exercises.length}):\n`;
        output += '─'.repeat(30) + '\n';

        exercises.forEach((ex, idx) => {
            const supersetInfo = ex.superset_with !== null
                ? `🔗 SUPERSET → #${ex.superset_with}`
                : '(sem superset)';

            output += `${idx + 1}. [ID: ${ex.id}] ${ex.exercise_name}\n`;
            output += `   superset_with: ${supersetInfo}\n`;
            if (idx < exercises.length - 1) output += '\n';
        });

        // Verifica se os links são bidirecionais
        output += '\n' + '─'.repeat(30) + '\n';
        output += 'VALIDAÇÃO DOS LINKS:\n';

        let validLinks = 0;
        let invalidLinks = 0;

        exercises.forEach(ex => {
            if (ex.superset_with !== null) {
                const partner = exercises.find(e => e.id === ex.superset_with);
                if (partner && partner.superset_with === ex.id) {
                    validLinks++;
                    output += `✅ ${ex.id} ↔ ${ex.superset_with} (bidirecional)\n`;
                } else {
                    invalidLinks++;
                    output += `❌ ${ex.id} → ${ex.superset_with} (unidirecional!)\n`;
                }
            }
        });

        if (validLinks === 0 && invalidLinks === 0) {
            output += '⚠️ Nenhum superset configurado\n';
        }

        Alert.alert('Debug Superset - SQLite', output);

    } catch (error) {
        Alert.alert('Erro', `Falha ao ler banco: ${error}`);
    }
};

// Função para exportar plano completo como JSON
const exportPlanAsJson = async () => {
    const exportData = {
        nome: planoAtual.nome,
        objetivo: planoAtual.objetivo,
        frequenciaSemanal: planoAtual.frequenciaSemanal,
        estruturaSemanal: planoAtual.estruturaSemanal,
        templates: planoAtual.templates.map(template => ({
            nome: template.nome,
            dia: template.dia,
            focoPrincipal: template.focoPrincipal,
            volumeTotal: template.volumeTotal,
            tempoEstimado: template.tempoEstimado,
            exercicios: template.exercicios.map(ex => ({
                nome: ex.nome,
                series: ex.series,
                reps: ex.reps,
                descanso: ex.descanso,
                observacao: ex.observacao || null,
            })),
        })),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    await Clipboard.setStringAsync(jsonString);

    Alert.alert(
        'Plano Exportado!',
        `"${planoAtual.nome}" copiado para a área de transferência.\n\nInclui ${planoAtual.templates.length} templates de treino.`,
        [{ text: 'OK' }]
    );
};

// Função para exportar template como JSON
const exportTemplateAsJson = async (template: typeof planoAtual.templates[0]) => {
    const exportData = {
        nome: template.nome,
        dia: template.dia,
        focoPrincipal: template.focoPrincipal,
        volumeTotal: template.volumeTotal,
        tempoEstimado: template.tempoEstimado,
        exercicios: template.exercicios.map(ex => ({
            nome: ex.nome,
            series: ex.series,
            reps: ex.reps,
            descanso: ex.descanso,
            observacao: ex.observacao || null,
        })),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    await Clipboard.setStringAsync(jsonString);

    Alert.alert(
        'Exportado!',
        `Template "${template.nome}" copiado para a área de transferência.`,
        [{ text: 'OK' }]
    );
};

// Componente de texto animado letra por letra com haptics
const AnimatedText = ({
    text,
    style,
    delay = 0,
    letterDelay = 30,
    animationKey,
    enableHaptics = true,
}: {
    text: string;
    style?: any;
    delay?: number;
    letterDelay?: number;
    animationKey: number;
    enableHaptics?: boolean;
}) => {
    // Dispara haptics quando cada letra COMEÇA a aparecer (em sync com a animação)
    useEffect(() => {
        if (!enableHaptics || !CoreHaptics.isSupported()) return;

        const visibleLetters = text.split('').filter(l => l !== ' ');
        const timeouts: NodeJS.Timeout[] = [];

        visibleLetters.forEach((_, index) => {
            // Calcula o delay real considerando apenas letras visíveis
            let actualIndex = 0;
            let visibleCount = 0;
            for (let i = 0; i < text.length; i++) {
                if (text[i] !== ' ') {
                    if (visibleCount === index) {
                        actualIndex = i;
                        break;
                    }
                    visibleCount++;
                }
            }

            // Haptic dispara NO INÍCIO da animação de cada letra (sem delay adicional)
            const hapticDelay = delay + actualIndex * letterDelay;

            const timeout = setTimeout(() => {
                // Intensidade progressiva: começa suave, aumenta no meio, suaviza no fim
                const progress = index / visibleLetters.length;
                const intensity = 0.3 + Math.sin(progress * Math.PI) * 0.4; // 0.3 a 0.7
                const sharpness = 0.2 + progress * 0.5; // Fica mais agudo conforme progride

                CoreHaptics.tap.custom(intensity, sharpness);
            }, hapticDelay);

            timeouts.push(timeout);
        });

        return () => {
            timeouts.forEach(t => clearTimeout(t));
        };
    }, [animationKey, text, delay, letterDelay, enableHaptics]);

    // Cada letra tem sua própria animação
    const letters = text.split('').map((letter, index) => {
        const opacity = useSharedValue(0);
        const translateY = useSharedValue(10);

        useEffect(() => {
            // Reset
            opacity.value = 0;
            translateY.value = 10;

            // Anima com delay por letra
            const letterDelayMs = delay + index * letterDelay;
            opacity.value = withDelay(letterDelayMs, withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) }));
            translateY.value = withDelay(letterDelayMs, withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) }));
        }, [animationKey]);

        const letterStyle = useAnimatedStyle(() => ({
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        }));

        return (
            <Animated.Text key={`${animationKey}-${index}`} style={[style, letterStyle]}>
                {letter}
            </Animated.Text>
        );
    });

    return <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{letters}</View>;
};

// Card de sugestão inteligente baseado no último treino (compacto)
const SmartWorkoutSuggestion = ({
    delay = 0,
    animationKey,
    onSelectWorkout,
}: {
    delay?: number;
    animationKey: number;
    onSelectWorkout: (template: typeof treinoA) => void;
}) => {
    const { theme } = useTheme();
    const { onPressIn, onPressOut, animatedStyle: pressStyle } = usePressAnimation();
    const [suggestedWorkout, setSuggestedWorkout] = useState<typeof treinoA | null>(null);
    const [lastWorkoutName, setLastWorkoutName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Animações
    const cardOpacity = useSharedValue(0);
    const cardTranslateY = useSharedValue(12);
    const glowOpacity = useSharedValue(0);

    // Busca o último treino e sugere o próximo
    useEffect(() => {
        const fetchLastWorkout = async () => {
            setLoading(true);
            try {
                const lastWorkout = await getLastFinishedWorkout();

                if (lastWorkout) {
                    setLastWorkoutName(lastWorkout.name);

                    // Lógica A/B: se último foi A, sugere B e vice-versa
                    const wasA = lastWorkout.name?.toLowerCase().includes('treino a') ||
                                 lastWorkout.name?.toLowerCase().includes('a');
                    const wasB = lastWorkout.name?.toLowerCase().includes('treino b') ||
                                 lastWorkout.name?.toLowerCase().includes('b');

                    if (wasA) {
                        setSuggestedWorkout(treinoB);
                    } else if (wasB) {
                        setSuggestedWorkout(treinoA);
                    } else {
                        setSuggestedWorkout(treinoA);
                    }
                } else {
                    setSuggestedWorkout(treinoA);
                    setLastWorkoutName(null);
                }
            } catch (error) {
                console.error('[SmartWorkout] Error:', error);
                setSuggestedWorkout(treinoA);
            } finally {
                setLoading(false);
            }
        };

        fetchLastWorkout();
    }, [animationKey]);

    // Animação de entrada + glow pulsante
    useEffect(() => {
        cardOpacity.value = 0;
        cardTranslateY.value = 12;
        glowOpacity.value = 0;

        cardOpacity.value = withDelay(delay, withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) }));
        cardTranslateY.value = withDelay(delay, withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) }));

        // Glow pulsante começa após o card aparecer
        glowOpacity.value = withDelay(delay + 300, withRepeat(
            withSequence(
                withTiming(0.7, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        ));
    }, [animationKey]);

    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [{ translateY: cardTranslateY.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const handlePress = () => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.medium();
        }
        if (suggestedWorkout) {
            onSelectWorkout(suggestedWorkout);
        }
    };

    if (loading || !suggestedWorkout) {
        return null;
    }

    return (
        <Animated.View style={[pressStyle, cardStyle, styles.suggestionContainer]}>
            {/* Blur glow effect */}
            <Animated.View style={[styles.suggestionGlow, glowStyle]}>
                <BlurView
                    intensity={Platform.OS === 'ios' ? 40 : 15}
                    tint="default"
                    style={[styles.suggestionBlur, { backgroundColor: theme.primary + '60' }]}
                />
            </Animated.View>

            <TouchableOpacity
                style={[styles.suggestionCard, { backgroundColor: theme.primary }]}
                onPress={handlePress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
            >
                <View style={styles.suggestionContent}>
                    <View style={[styles.suggestionIconWrapper, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Barbell size={18} color="#fff" weight="bold" />
                    </View>
                    <View style={styles.suggestionTextWrapper}>
                        <Text style={[styles.suggestionTitle, { color: '#fff' }]}>
                            {suggestedWorkout.nome}
                        </Text>
                        <Text style={[styles.suggestionSubtitle, { color: 'rgba(255,255,255,0.75)' }]} numberOfLines={1}>
                            {lastWorkoutName ? `Último: ${lastWorkoutName}` : suggestedWorkout.focoPrincipal}
                        </Text>
                    </View>
                    <ArrowRight size={18} color="rgba(255,255,255,0.8)" weight="bold" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Timer isolado para evitar re-render do TodayWorkoutCard a cada segundo
const TodayWorkoutTimer = memo(({ style }: { style?: any }) => {
    const { duration } = useWorkoutTimer();
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    return <Text style={style}>{formatTime(duration)}</Text>;
});

// Card principal de treino com glow quando ativo
const TodayWorkoutCard = ({
    delay = 0,
    animationKey,
}: {
    delay?: number;
    animationKey: number;
}) => {
    const { theme } = useTheme();
    // Timer agora é isolado no componente TodayWorkoutTimer para evitar re-renders
    const { isActive, workoutName } = useWorkoutMeta();
    const { requestStartWorkout } = useWorkoutActions();
    const { onPressIn, onPressOut, animatedStyle: pressStyle } = usePressAnimation();

    // Animações
    const cardOpacity = useSharedValue(0);
    const cardTranslateY = useSharedValue(15);
    const glowOpacity = useSharedValue(0);

    // Pega o treino de hoje
    const hoje = new Date();
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaHoje = diasSemana[hoje.getDay()];

    const proximoTreino = planoAtual.estruturaSemanal.find(
        dia => dia.dia === diaHoje && dia.treino !== 'Descanso' && dia.treino !== 'Futebol'
    ) || planoAtual.estruturaSemanal.find(
        dia => dia.treino !== 'Descanso' && dia.treino !== 'Futebol'
    );

    const template = planoAtual.templates.find(t => t.nome === proximoTreino?.treino);

    useEffect(() => {
        // Reset animações
        cardOpacity.value = 0;
        cardTranslateY.value = 18;

        // Animação de entrada
        cardOpacity.value = withDelay(delay, withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }));
        cardTranslateY.value = withDelay(delay, withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) }));
    }, [animationKey]);

    // Glow separado - depende de isActive
    useEffect(() => {
        if (isActive) {
            glowOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        } else {
            cancelAnimation(glowOpacity);
            glowOpacity.value = withTiming(0, { duration: 300 });
        }
    }, [isActive]);

    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [
            { translateY: cardTranslateY.value },
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const handlePress = () => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.medium();
        }
        requestStartWorkout(template);
    };

    if (!template) return null;

    // Se tem treino ativo, mostra ele
    if (isActive) {
        return (
            <Animated.View style={[pressStyle, cardStyle, styles.cardContainer]}>
                {/* Glow effect */}
                <Animated.View style={[styles.glowEffect, { backgroundColor: theme.primary }, glowStyle]} />

                <TouchableOpacity
                    style={[styles.todayCard, { backgroundColor: theme.primary }]}
                    onPress={handlePress}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={1}
                >
                    <View style={styles.activeIndicator}>
                        <View style={[styles.activeDot, { backgroundColor: '#fff' }]} />
                        <Text style={styles.activeText}>TREINO EM ANDAMENTO</Text>
                    </View>

                    <Text style={styles.cardTitle}>{workoutName}</Text>

                    <View style={styles.timerRow}>
                        <Timer size={18} color="#fff" weight="bold" />
                        <TodayWorkoutTimer style={styles.timerText} />
                    </View>

                    <View style={styles.cardFooter}>
                        <Text style={styles.cardAction}>Toque para continuar →</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    // Card normal de treino do dia
    return (
        <Animated.View style={[pressStyle, cardStyle, styles.cardContainer]}>
            <TouchableOpacity
                style={[styles.todayCard, { backgroundColor: theme.primary }]}
                onPress={handlePress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
            >
                <View style={styles.todayHeader}>
                    <Lightning size={20} color="#fff" weight="fill" />
                    <Text style={styles.todayLabel}>Treino de hoje</Text>
                </View>

                <Text style={styles.cardTitle}>{template.nome}</Text>
                <Text style={styles.cardSubtitle}>{template.focoPrincipal}</Text>

                <View style={styles.cardMeta}>
                    <Text style={styles.cardMetaText}>
                        {template.exercicios.length} exercícios • {template.volumeTotal} séries
                    </Text>
                    <Text style={styles.cardMetaText}>~{template.tempoEstimado}</Text>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.startButton}>
                        <Play size={16} color={theme.primary} weight="fill" />
                        <Text style={[styles.startButtonText, { color: theme.primary }]}>Iniciar</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Card de template do plano
const PlanTemplateCard = ({
    template,
    onPress,
    delay = 0,
    animationKey,
}: {
    template: typeof planoAtual.templates[0];
    onPress?: () => void;
    delay?: number;
    animationKey: number;
}) => {
    const { theme } = useTheme();
    const { onPressIn, onPressOut, animatedStyle: pressStyle } = usePressAnimation();

    const cardOpacity = useSharedValue(0);
    const cardTranslateY = useSharedValue(15);

    useEffect(() => {
        // Reset
        cardOpacity.value = 0;
        cardTranslateY.value = 15;

        // Anima
        cardOpacity.value = withDelay(delay, withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }));
        cardTranslateY.value = withDelay(delay, withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) }));
    }, [animationKey]);

    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [{ translateY: cardTranslateY.value }],
    }));

    const templateOptions = [
        {
            id: 'export',
            label: 'Exportar JSON',
            icon: 'export' as const,
            onPress: () => exportTemplateAsJson(template),
        },
    ];

    const exerciciosText = template.exercicios.slice(0, 3).map(e => e.nome).join(', ');

    return (
        <Animated.View style={[pressStyle, cardStyle]}>
            <TouchableOpacity
                style={[styles.templateCard, { backgroundColor: theme.surface }]}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
            >
                <View style={styles.templateHeader}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.templateTitleRow}>
                            <Text style={[styles.templateTitle, { color: theme.text }]}>{template.nome}</Text>
                            <View style={[styles.dayBadge, { backgroundColor: theme.primary + '20' }]}>
                                <Text style={[styles.dayBadgeText, { color: theme.primary }]}>{template.dia}</Text>
                            </View>
                        </View>
                        <Text style={[styles.templateFocus, { color: theme.textSecondary }]}>{template.focoPrincipal}</Text>
                    </View>
                    <OptionsDropdown options={templateOptions} />
                </View>

                <Text style={[styles.templateExercises, { color: theme.textSecondary }]} numberOfLines={1}>
                    {exerciciosText}{template.exercicios.length > 3 ? '...' : ''}
                </Text>

                <View style={styles.templateFooter}>
                    <Text style={[styles.templateMeta, { color: theme.textSecondary }]}>
                        {template.exercicios.length} exercícios • {template.volumeTotal} séries
                    </Text>
                    <Text style={[styles.templateMeta, { color: theme.textSecondary }]}>
                        ~{template.tempoEstimado}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Seção da semana animada
const WeekSection = ({ delay = 0, animationKey }: { delay?: number; animationKey: number }) => {
    const { theme } = useTheme();

    const sectionOpacity = useSharedValue(0);
    const sectionTranslateY = useSharedValue(15);

    useEffect(() => {
        // Reset
        sectionOpacity.value = 0;
        sectionTranslateY.value = 15;

        // Anima
        sectionOpacity.value = withDelay(delay, withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }));
        sectionTranslateY.value = withDelay(delay, withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) }));
    }, [animationKey]);

    const sectionStyle = useAnimatedStyle(() => ({
        opacity: sectionOpacity.value,
        transform: [{ translateY: sectionTranslateY.value }],
    }));

    return (
        <Animated.View style={[sectionStyle, styles.weekSection]}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                    <Calendar size={20} color={theme.text} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Sua semana</Text>
                </View>
                <OptionsDropdown
                    options={[
                        {
                            id: 'export-all',
                            label: 'Exportar como JSON',
                            icon: 'export',
                            onPress: exportPlanAsJson,
                        },
                    ]}
                    iconSize={20}
                />
            </View>

            <View style={[styles.weekCard, { backgroundColor: theme.surface }]}>
                {planoAtual.estruturaSemanal.map((dia, index) => (
                    <View
                        key={index}
                        style={[
                            styles.weekRow,
                            index < planoAtual.estruturaSemanal.length - 1 && {
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderColor: theme.borderSubtle
                            }
                        ]}
                    >
                        <Text style={[styles.weekDay, { color: theme.textSecondary }]}>{dia.dia}</Text>
                        <Text style={[
                            styles.weekWorkout,
                            { color: dia.treino === 'Descanso' ? theme.textSecondary : theme.text }
                        ]}>
                            {dia.treino}
                        </Text>
                        {dia.treino !== 'Descanso' && dia.treino !== 'Futebol' && (
                            <Text style={[styles.weekFocus, { color: theme.textSecondary }]}>
                                {dia.focoPrincipal.split(' ')[0]}
                            </Text>
                        )}
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};

// Botão treino vazio animado
const EmptyWorkoutButton = ({ delay = 0, animationKey }: { delay?: number; animationKey: number }) => {
    const { theme } = useTheme();
    const { requestStartWorkout } = useWorkoutActions(); // Only needs actions, never re-renders

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(12);

    useEffect(() => {
        opacity.value = 0;
        translateY.value = 12;

        opacity.value = withDelay(delay, withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) }));
        translateY.value = withDelay(delay, withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) }));
    }, [animationKey]);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const handlePress = () => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.light();
        }
        requestStartWorkout();
    };

    return (
        <Animated.View style={[style, styles.emptyWorkoutContainer]}>
            <TouchableOpacity
                onPress={handlePress}
                style={[styles.emptyWorkoutButton, { backgroundColor: theme.surface, borderColor: theme.borderDashed }]}
            >
                <Plus size={20} color={theme.textSecondary} weight="bold" />
                <Text style={[styles.emptyWorkoutText, { color: theme.textSecondary }]}>Treino vazio</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Cabeçalho de templates animado
const TemplatesHeader = ({ delay = 0, animationKey }: { delay?: number; animationKey: number }) => {
    const { theme } = useTheme();

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(12);

    useEffect(() => {
        opacity.value = 0;
        translateY.value = 12;

        opacity.value = withDelay(delay, withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) }));
        translateY.value = withDelay(delay, withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) }));
    }, [animationKey]);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={[style, styles.templatesHeader]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Treinos ({planoAtual.templates.length})
            </Text>
            <TouchableOpacity style={[styles.newButton, { backgroundColor: theme.surface }]}>
                <Plus size={16} color={theme.primary} weight="bold" />
                <Text style={[styles.newButtonText, { color: theme.primary }]}>Novo</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const HomeScreen = () => {
    const { theme, toggleTheme } = useTheme();
    const { requestStartWorkout } = useWorkoutActions(); // Only needs actions, never re-renders on timer
    const { isActive } = useWorkoutMeta();
    const scrollRef = useRef<Animated.ScrollView>(null);

    // Key que muda quando a tela ganha foco - força reset das animações
    const [animationKey, setAnimationKey] = useState(0);

    // Shared values para header e greeting
    const headerOpacity = useSharedValue(0);
    const headerTranslateY = useSharedValue(-20);
    const greetingOpacity = useSharedValue(0);
    const greetingTranslateY = useSharedValue(15);

    // Scroll to top quando treino é iniciado
    useEffect(() => {
        if (isActive) {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
        }
    }, [isActive]);

    // Reset animações quando tela ganha foco
    useFocusEffect(
        useCallback(() => {
            // Incrementa key para forçar re-render dos componentes filhos
            setAnimationKey(prev => prev + 1);

            // Reset header
            headerOpacity.value = 0;
            headerTranslateY.value = -20;
            greetingOpacity.value = 0;
            greetingTranslateY.value = 15;

            // Anima header
            headerOpacity.value = withDelay(50, withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }));
            headerTranslateY.value = withDelay(50, withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) }));

            // Anima greeting
            greetingOpacity.value = withDelay(100, withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) }));
            greetingTranslateY.value = withDelay(100, withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) }));
        }, [])
    );

    const headerStyle = useAnimatedStyle(() => ({
        opacity: headerOpacity.value,
        transform: [{ translateY: headerTranslateY.value }],
    }));

    const greetingStyle = useAnimatedStyle(() => ({
        opacity: greetingOpacity.value,
        transform: [{ translateY: greetingTranslateY.value }],
    }));

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            {/* Fixed Header */}
            <Animated.View style={[styles.header, headerStyle, { backgroundColor: theme.background }]}>
                <Text style={[styles.planName, { color: theme.primary }]}>
                    {planoAtual.nome}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                        onPress={debugSupersets}
                        style={[styles.themeButton, { backgroundColor: theme.surface }]}
                    >
                        <Bug size={24} color={theme.primary} weight="bold" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={toggleTheme}
                        style={[styles.themeButton, { backgroundColor: theme.surface }]}
                    >
                        <Swap size={24} color={theme.primary} weight="bold" />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Animated.ScrollView
                ref={scrollRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Saudação animada */}
                <View style={styles.greetingContainer}>
                    <Animated.Text style={[styles.greeting, { color: theme.textSecondary }, greetingStyle]}>
                        Olá, {currentUser.nome}!
                    </Animated.Text>
                    <AnimatedText
                        text="Iniciar treino"
                        style={[styles.screenTitle, { color: theme.text }]}
                        delay={100}
                        letterDelay={20}
                        animationKey={animationKey}
                    />
                </View>

                {/* Card de sugestão inteligente */}
                <SmartWorkoutSuggestion
                    delay={180}
                    animationKey={animationKey}
                    onSelectWorkout={(template) => requestStartWorkout(template)}
                />

                {/* Card principal de treino */}
                <TodayWorkoutCard delay={230} animationKey={animationKey} />

                {/* Treino vazio */}
                <EmptyWorkoutButton delay={280} animationKey={animationKey} />

                {/* Semana */}
                <WeekSection delay={330} animationKey={animationKey} />

                {/* Templates */}
                <TemplatesHeader delay={380} animationKey={animationKey} />

                {planoAtual.templates.map((template, index) => (
                    <PlanTemplateCard
                        key={template.nome}
                        template={template}
                        delay={420 + index * 50}
                        animationKey={animationKey}
                        onPress={() => {
                            if (CoreHaptics.isSupported()) {
                                CoreHaptics.tap.light();
                            }
                            requestStartWorkout(template);
                        }}
                    />
                ))}

                <View style={styles.bottomSpacer} />
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    planName: {
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    themeButton: {
        padding: 8,
        borderRadius: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    greetingContainer: {
        marginBottom: 20,
    },
    greeting: {
        fontSize: 16,
        marginBottom: 4,
    },
    screenTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },

    // Card de sugestão inteligente (compacto)
    suggestionContainer: {
        marginBottom: 12,
        position: 'relative',
    },
    suggestionGlow: {
        position: 'absolute',
        top: -6,
        left: -6,
        right: -6,
        bottom: -6,
        borderRadius: 18,
        overflow: 'hidden',
        zIndex: -1,
    },
    suggestionBlur: {
        flex: 1,
        borderRadius: 18,
    },
    suggestionCard: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    suggestionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    suggestionIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    suggestionTextWrapper: {
        marginLeft: 10,
        flex: 1,
    },
    suggestionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    suggestionSubtitle: {
        fontSize: 12,
        marginTop: 1,
    },

    // Card de treino do dia
    cardContainer: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'visible',
    },
    glowEffect: {
        position: 'absolute',
        top: -8,
        left: -8,
        right: -8,
        bottom: -8,
        borderRadius: 24,
        zIndex: -1,
    },
    todayCard: {
        padding: 20,
        borderRadius: 16,
    },
    todayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    todayLabel: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
        marginBottom: 12,
    },
    cardMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    cardMetaText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
    },
    cardFooter: {
        alignItems: 'flex-start',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    startButtonText: {
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 15,
    },
    cardAction: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '600',
    },

    // Treino ativo
    activeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    activeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    timerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },

    // Treino vazio
    emptyWorkoutContainer: {
        marginBottom: 24,
    },
    emptyWorkoutButton: {
        height: 52,
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyWorkoutText: {
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 15,
    },

    // Semana
    weekSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 8,
    },
    weekCard: {
        borderRadius: 12,
        padding: 12,
    },
    weekRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    weekDay: {
        width: 80,
        fontSize: 14,
    },
    weekWorkout: {
        flex: 1,
        fontWeight: '500',
        fontSize: 14,
    },
    weekFocus: {
        fontSize: 12,
    },

    // Templates
    templatesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    newButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    newButtonText: {
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 14,
    },
    templateCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    templateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    templateTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    templateTitle: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    dayBadge: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    dayBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    templateFocus: {
        fontSize: 14,
    },
    templateExercises: {
        fontSize: 13,
        marginBottom: 8,
    },
    templateFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    templateMeta: {
        fontSize: 12,
    },

    bottomSpacer: {
        height: 120,
    },
});
