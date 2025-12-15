import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useWorkout } from '../context/WorkoutContext';
import { useSheetAnimation } from '../context/SheetAnimationContext';
import { Timer, DotsThree, CalendarBlank, Clock } from 'phosphor-react-native';
import { ExerciseCard } from './ExerciseCard';
import { AddExerciseModal } from './AddExerciseModal';
import { FinishWorkoutModal } from './FinishWorkoutModal';
import { useHapticPatterns } from '../hooks';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINI_PLAYER_HEIGHT = 70;
const TAB_BAR_HEIGHT = 60;

export const WorkoutBottomSheet = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { animatedIndex, animatedPosition } = useSheetAnimation();

    const {
        isActive,
        isMinimized,
        workoutName,
        duration,
        exercises,
        minimizeWorkout,
        maximizeWorkout,
        finishWorkout,
        cancelWorkout,
        addExercise,
        addSet,
        updateSet,
        toggleSet,
        changeSetType,
        fillFromPR
    } = useWorkout();

    const [showAddExercise, setShowAddExercise] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const haptics = useHapticPatterns();

    // Wrapper para chamar haptic ao completar set
    const handleToggleSet = useCallback((exerciseId: string, setId: string) => {
        // Encontra o set para ver se vai completar ou descompletar
        const exercise = exercises.find(ex => ex.id === exerciseId);
        const set = exercise?.sets.find(s => s.id === setId);

        // Só toca haptic quando está COMPLETANDO (não descomplentando)
        if (set && !set.completed) {
            haptics.completeSet();
        }

        toggleSet(exerciseId, setId);
    }, [exercises, toggleSet, haptics]);

    const navbarHeight = TAB_BAR_HEIGHT + insets.bottom;

    const snapPoints = useMemo(() => [
        MINI_PLAYER_HEIGHT + navbarHeight + 10,
        SCREEN_HEIGHT * 0.92
    ], [navbarHeight]);

    const expandedPosition = SCREEN_HEIGHT - snapPoints[1];
    const minimizedPosition = SCREEN_HEIGHT - snapPoints[0];

    useEffect(() => {
        if (isActive) {
            bottomSheetRef.current?.snapToIndex(1);
        } else {
            bottomSheetRef.current?.close();
        }
    }, [isActive]);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === 0) {
            minimizeWorkout();
        } else if (index === 1) {
            maximizeWorkout();
        }
    }, [minimizeWorkout, maximizeWorkout]);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setIsScrolled(scrollY > 10);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = () => {
        const now = new Date();
        return now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Verifica se tem algum dado preenchido
    const hasData = exercises.some(ex =>
        ex.sets.some(s => s.kg || s.reps || s.completed)
    );

    // Verifica se tem séries não completas (mas com dados)
    const hasIncomplete = exercises.some(ex =>
        ex.sets.some(s => (s.kg || s.reps) && !s.completed)
    );

    const handleFinish = () => {
        setShowFinishModal(true);
    };

    const handleConfirmFinish = () => {
        setShowFinishModal(false);
        haptics.finishWorkout(); // Fanfarra de celebração!
        finishWorkout();
    };

    const handleDiscardWorkout = () => {
        setShowFinishModal(false);
        cancelWorkout();
    };

    const handleCancel = () => {
        Alert.alert('Cancelar Treino', 'Tem certeza que deseja cancelar?', [
            { text: 'Não', style: 'cancel' },
            { text: 'Sim', style: 'destructive', onPress: cancelWorkout }
        ]);
    };

    // Mini-player style
    const miniPlayerStyle = useAnimatedStyle(() => {
        const pos = animatedPosition.value;
        const opacity = interpolate(
            pos,
            [expandedPosition, expandedPosition + 200, minimizedPosition],
            [0, 0.3, 1],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        };
    });

    // Expanded content style
    const expandedStyle = useAnimatedStyle(() => {
        const pos = animatedPosition.value;
        const opacity = interpolate(
            pos,
            [expandedPosition, expandedPosition + 150, minimizedPosition],
            [1, 0, 0],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        };
    });

    // Handle customizado que inclui o header (arrastável)
    const renderHandle = useCallback(() => (
        <View style={[styles.handleContainer, { backgroundColor: theme.surface }]}>
            {/* Indicador de arrastar */}
            <View style={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]} />

            {/* Header com botões (expandido) */}
            <Animated.View style={expandedStyle}>
                <View style={[
                    styles.stickyHeader,
                    {
                        borderBottomColor: isScrolled ? theme.textSecondary + '40' : 'transparent',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }
                ]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => bottomSheetRef.current?.snapToIndex(0)}
                            style={[styles.timerButton, { backgroundColor: theme.field }]}
                        >
                            <Timer size={20} color={theme.text} />
                        </TouchableOpacity>

                        {isScrolled && (
                            <View style={styles.headerTimerAbsolute}>
                                <Text style={[styles.headerTimerText, { color: theme.primary }]}>
                                    {formatTime(duration)}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
                            <Text style={styles.finishText}>Terminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>

            {/* Mini player content (minimizado) */}
            <Animated.View style={[styles.miniPlayerInHandle, miniPlayerStyle]}>
                <TouchableOpacity
                    onPress={() => bottomSheetRef.current?.snapToIndex(1)}
                    style={styles.miniPlayerTouchable}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.miniTitle, { color: theme.text }]}>{workoutName}</Text>
                    <Text style={[styles.miniTimer, { color: theme.primary }]}>{formatTime(duration)}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    ), [theme, isScrolled, duration, expandedStyle, miniPlayerStyle, workoutName]);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
            backgroundStyle={{ backgroundColor: theme.surface }}
            style={styles.sheetShadow}
            handleComponent={renderHandle}
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            overDragResistanceFactor={10}
            enableContentPanningGesture={false}
        >
            {/* ===== CONTEÚDO EXPANDIDO ===== */}
            <Animated.View style={[styles.expandedContainer, expandedStyle]}>
                <BottomSheetScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    bounces={true}
                    overScrollMode="always"
                >
                    {/* Título + Menu */}
                    <View style={[styles.titleRow, styles.contentPadding]}>
                        <Text style={[styles.title, { color: theme.text }]}>{workoutName}</Text>
                        <TouchableOpacity style={[styles.menuButton, { backgroundColor: theme.primary }]}>
                            <DotsThree size={20} color="#fff" weight="bold" />
                        </TouchableOpacity>
                    </View>

                    {/* Data e Hora */}
                    <View style={[styles.metaRow, styles.contentPadding]}>
                        <CalendarBlank size={16} color={theme.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>{formatDate()}</Text>
                    </View>
                    <View style={[styles.metaRow, styles.contentPadding]}>
                        <Clock size={16} color={theme.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>{formatTime(duration)}</Text>
                    </View>

                    {/* Exercícios */}
                    <View style={styles.exercisesContainer}>
                        {exercises.map((ex, index) => {
                            // Detecta se é superset baseado no ID (4a/4b, 5a/5b, etc)
                            const isSuperset = /[a-z]$/.test(ex.id);
                            let supersetPosition: 'first' | 'last' | 'middle' | undefined;

                            if (isSuperset) {
                                const baseId = ex.id.slice(0, -1);
                                const prevEx = exercises[index - 1];
                                const nextEx = exercises[index + 1];

                                const prevIsPartner = prevEx && prevEx.id.slice(0, -1) === baseId;
                                const nextIsPartner = nextEx && nextEx.id.slice(0, -1) === baseId;

                                if (!prevIsPartner && nextIsPartner) {
                                    supersetPosition = 'first';
                                } else if (prevIsPartner && !nextIsPartner) {
                                    supersetPosition = 'last';
                                } else if (prevIsPartner && nextIsPartner) {
                                    supersetPosition = 'middle';
                                } else {
                                    supersetPosition = 'first';
                                }
                            }

                            return (
                                <ExerciseCard
                                    key={ex.id}
                                    exerciseId={ex.id}
                                    name={ex.name}
                                    sets={ex.sets}
                                    onAddSet={addSet}
                                    onUpdateSet={updateSet}
                                    onToggleSet={handleToggleSet}
                                    onChangeSetType={changeSetType}
                                    onFillFromPR={fillFromPR}
                                    isSuperset={isSuperset}
                                    supersetPosition={supersetPosition}
                                />
                            );
                        })}
                    </View>

                    {/* Botões de ação */}
                    <View style={styles.contentPadding}>
                        <TouchableOpacity
                            onPress={() => setShowAddExercise(true)}
                            style={[styles.addExerciseButton, { backgroundColor: theme.primary + '20' }]}
                        >
                            <Text style={[styles.addExerciseText, { color: theme.primary }]}>+ Adicionar Exercício</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancelar Treino</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 60 }} />
                </BottomSheetScrollView>
            </Animated.View>

            <AddExerciseModal
                visible={showAddExercise}
                onClose={() => setShowAddExercise(false)}
                onAdd={(name) => addExercise(name)}
            />

            <FinishWorkoutModal
                visible={showFinishModal}
                hasData={hasData}
                hasIncomplete={hasIncomplete}
                onFinish={handleConfirmFinish}
                onFinishAnyway={handleConfirmFinish}
                onCancel={() => setShowFinishModal(false)}
                onDiscardWorkout={handleDiscardWorkout}
            />
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    // Shadow-md para o sheet ficar em cima da página
    sheetShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 6,
    },

    // Handle customizado (arrastável)
    handleContainer: {
        paddingTop: 12,
    },
    handleIndicator: {
        width: 36,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 8,
    },

    // Mini-player dentro do handle
    miniPlayerInHandle: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        height: MINI_PLAYER_HEIGHT - 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniPlayerTouchable: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    miniTimer: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },

    // Conteúdo expandido
    expandedContainer: {
        flex: 1,
    },

    // Header fixo
    stickyHeader: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTimerAbsolute: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
    },
    headerTimerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timerButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    finishButton: {
        backgroundColor: '#22c55e',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    finishText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Scroll content - sem padding para o verde ir até as pontas
    scrollContent: {
        paddingHorizontal: 0,
    },
    // Padding padrão do conteúdo
    contentPadding: {
        paddingHorizontal: 16,
    },

    // Título
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
    },
    menuButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },

    // Meta (data/hora)
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    metaText: {
        fontSize: 14,
        marginLeft: 8,
    },

    // Exercícios
    exercisesContainer: {
        marginTop: 20,
    },

    // Botões
    addExerciseButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    addExerciseText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#fee2e2',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    cancelText: {
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
