import React, { useCallback, useMemo, useRef, useEffect, useState, memo } from 'react';
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
import { Timer, CalendarBlank, Clock, Play } from 'phosphor-react-native';
import { ExerciseCard } from './ExerciseCard';
import { AddExerciseModal } from './AddExerciseModal';
import { FinishWorkoutModal } from './FinishWorkoutModal';
import { useHapticPatterns } from '../hooks';
import { KeyboardProvider, useKeyboard } from '../context/KeyboardContext';
import { CustomKeyboard } from './CustomKeyboard';
import { OptionsDropdown } from './OptionsDropdown';
import * as Clipboard from 'expo-clipboard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINI_PLAYER_HEIGHT = 70;
const TAB_BAR_HEIGHT = 60;
const KEYBOARD_HEIGHT = 60 * 4 + 24 + 12;

// ========== FUNÇÕES UTILITÁRIAS (fora do componente) ==========
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatStartTime = (startedAt: string | null) => {
    if (!startedAt) return '';
    const date = new Date(startedAt);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// ========== SCROLL CONTENT (componente separado) ==========
const WorkoutScrollContent = memo(({
    children,
    onScroll,
    isKeyboardVisible,
    bottomInset
}: {
    children: React.ReactNode;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    isKeyboardVisible: boolean;
    bottomInset: number;
}) => {
    const paddingBottom = isKeyboardVisible ? KEYBOARD_HEIGHT + bottomInset + 20 : 60;

    return (
        <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom }]}
            onScroll={onScroll}
            scrollEventThrottle={32} // Menos eventos de scroll (era 16)
            bounces={true}
            overScrollMode="always"
            keyboardShouldPersistTaps="always"
        >
            {children}
        </BottomSheetScrollView>
    );
});

// ========== EXERCISE LIST (componente separado e memoizado) ==========
const ExerciseList = memo(({
    exercises,
    isActive,
    onAddSet,
    onUpdateSet,
    onToggleSet,
    onChangeSetType,
    onFillFromPR,
    onReplaceExercise,
    onRemoveSet
}: {
    exercises: any[];
    isActive: boolean;
    onAddSet: (exerciseId: string) => void;
    onUpdateSet: (exerciseId: string, setId: string, field: 'kg' | 'reps' | 'rir', value: string) => void;
    onToggleSet: (exerciseId: string, setId: string) => void;
    onChangeSetType: (exerciseId: string, setId: string, type: any) => void;
    onFillFromPR: (exerciseId: string, setId: string) => void;
    onReplaceExercise: (exerciseId: string, newName: string) => void;
    onRemoveSet: (exerciseId: string, setId: string) => void;
}) => {
    return (
        <View style={styles.exercisesContainer}>
            {exercises.map((ex, index) => {
                // Detecta superset
                const isSuperset = /[a-z]$/.test(ex.id);
                let supersetPosition: 'first' | 'last' | 'middle' | undefined;

                if (isSuperset) {
                    const baseId = ex.id.slice(0, -1);
                    const prevEx = exercises[index - 1];
                    const nextEx = exercises[index + 1];
                    const prevIsPartner = prevEx && prevEx.id.slice(0, -1) === baseId;
                    const nextIsPartner = nextEx && nextEx.id.slice(0, -1) === baseId;

                    if (!prevIsPartner && nextIsPartner) supersetPosition = 'first';
                    else if (prevIsPartner && !nextIsPartner) supersetPosition = 'last';
                    else if (prevIsPartner && nextIsPartner) supersetPosition = 'middle';
                    else supersetPosition = 'first';
                }

                return (
                    <ExerciseCard
                        key={ex.id}
                        exerciseId={ex.id}
                        name={ex.name}
                        sets={ex.sets}
                        onAddSet={onAddSet}
                        onUpdateSet={onUpdateSet}
                        onToggleSet={onToggleSet}
                        onChangeSetType={onChangeSetType}
                        onFillFromPR={onFillFromPR}
                        onReplaceExercise={onReplaceExercise}
                        onRemoveSet={onRemoveSet}
                        isSuperset={isSuperset}
                        supersetPosition={supersetPosition}
                    />
                );
            })}
        </View>
    );
});

// ========== WORKOUT CONTENT (usa KeyboardContext) ==========
const WorkoutContent = memo(({
    theme,
    insets,
    isScrolled,
    duration,
    workoutName,
    startedAt,
    exercises,
    isActive,
    handleScroll,
    handleAddSet,
    handleUpdateSet,
    handleToggleSet,
    handleChangeSetType,
    handleFillFromPR,
    handleReplaceExercise,
    handleRemoveSet,
    handleAddExercise,
    handleCancel,
    workoutMenuOptions,
}: any) => {
    const { isVisible: isKeyboardVisible } = useKeyboard();

    const dateText = useMemo(() => formatDate(), []);
    const startTimeText = useMemo(() => formatStartTime(startedAt), [startedAt]);
    const durationText = useMemo(() => formatTime(duration), [duration]);

    return (
        <WorkoutScrollContent
            onScroll={handleScroll}
            isKeyboardVisible={isKeyboardVisible}
            bottomInset={insets.bottom}
        >
            {/* Título + Menu */}
            <View style={[styles.titleRow, styles.contentPadding]}>
                <Text style={[styles.title, { color: theme.text }]}>{workoutName}</Text>
                <View style={[styles.menuButton, { backgroundColor: theme.primary }]}>
                    <OptionsDropdown options={workoutMenuOptions} iconSize={20} iconColor="#fff" />
                </View>
            </View>

            {/* Meta info */}
            <View style={[styles.metaRow, styles.contentPadding]}>
                <CalendarBlank size={16} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>{dateText}</Text>
            </View>
            <View style={[styles.metaRow, styles.contentPadding]}>
                <Play size={16} color={theme.textSecondary} weight="fill" />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>Início: {startTimeText}</Text>
            </View>
            <View style={[styles.metaRow, styles.contentPadding]}>
                <Clock size={16} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>Duração: {durationText}</Text>
            </View>

            {/* Exercícios */}
            <ExerciseList
                exercises={exercises}
                isActive={isActive}
                onAddSet={handleAddSet}
                onUpdateSet={handleUpdateSet}
                onToggleSet={handleToggleSet}
                onChangeSetType={handleChangeSetType}
                onFillFromPR={handleFillFromPR}
                onReplaceExercise={handleReplaceExercise}
                onRemoveSet={handleRemoveSet}
            />

            {/* Botões de ação */}
            <View style={styles.contentPadding}>
                <TouchableOpacity
                    onPress={handleAddExercise}
                    style={[styles.addExerciseButton, { backgroundColor: theme.primary + '20' }]}
                >
                    <Text style={[styles.addExerciseText, { color: theme.primary }]}>+ Adicionar Exercício</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancelar Treino</Text>
                </TouchableOpacity>
            </View>
        </WorkoutScrollContent>
    );
});

// ========== MAIN COMPONENT ==========
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
        startedAt,
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
        fillFromPR,
        replaceExercise,
        removeSet
    } = useWorkout();

    const [showAddExercise, setShowAddExercise] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const haptics = useHapticPatterns();

    // ========== CALLBACKS MEMOIZADOS ==========
    const handleToggleSet = useCallback((exerciseId: string, setId: string) => {
        // Haptic agora é controlado pelo SetRow para sincronizar com a animação
        toggleSet(exerciseId, setId);
    }, [toggleSet]);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        const shouldBeScrolled = scrollY > 10;
        if (shouldBeScrolled !== isScrolled) {
            setIsScrolled(shouldBeScrolled);
        }
    }, [isScrolled]);

    const handleAddExercise = useCallback(() => {
        setShowAddExercise(true);
    }, []);

    const handleCancel = useCallback(() => {
        Alert.alert('Cancelar Treino', 'Tem certeza que deseja cancelar?', [
            { text: 'Não', style: 'cancel' },
            { text: 'Sim', style: 'destructive', onPress: cancelWorkout }
        ]);
    }, [cancelWorkout]);

    const handleFinish = useCallback(() => {
        setShowFinishModal(true);
    }, []);

    const handleConfirmFinish = useCallback(() => {
        setShowFinishModal(false);
        haptics.finishWorkout();
        finishWorkout();
    }, [haptics, finishWorkout]);

    const handleDiscardWorkout = useCallback(() => {
        setShowFinishModal(false);
        haptics.finishWorkout();
        cancelWorkout();
    }, [haptics, cancelWorkout]);

    // ========== VALORES MEMOIZADOS ==========
    const navbarHeight = TAB_BAR_HEIGHT + insets.bottom;

    const snapPoints = useMemo(() => [
        MINI_PLAYER_HEIGHT + navbarHeight + 10,
        SCREEN_HEIGHT * 0.92
    ], [navbarHeight]);

    const expandedPosition = SCREEN_HEIGHT - snapPoints[1];
    const minimizedPosition = SCREEN_HEIGHT - snapPoints[0];

    const hasData = useMemo(() =>
        exercises.some(ex => ex.sets.some(s => s.kg || s.reps || s.completed)),
        [exercises]
    );

    const hasIncomplete = useMemo(() =>
        exercises.some(ex => ex.sets.some(s => (s.kg || s.reps) && !s.completed)),
        [exercises]
    );

    // Exporta JSON
    const exportWorkoutJson = useCallback(async () => {
        const exportData = {
            nome: workoutName,
            data: new Date().toISOString().split('T')[0],
            duracao: formatTime(duration),
            exercicios: exercises.map(ex => ({
                nome: ex.name,
                series: ex.sets
                    .filter(s => s.completed || s.kg || s.reps)
                    .map((s, idx) => ({
                        numero: idx + 1,
                        tipo: s.type,
                        peso: s.kg ? `${s.kg}kg` : null,
                        reps: s.reps || null,
                        rir: s.rir ?? null,
                        completa: s.completed
                    }))
            })).filter(ex => ex.series.length > 0)
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        await Clipboard.setStringAsync(jsonString);

        Alert.alert(
            'Treino Copiado!',
            'JSON do treino atual copiado para a área de transferência.',
            [{ text: 'OK' }]
        );
    }, [workoutName, duration, exercises]);

    const workoutMenuOptions = useMemo(() => [
        {
            id: 'export',
            label: 'Exportar JSON',
            icon: 'export' as const,
            onPress: exportWorkoutJson,
        },
    ], [exportWorkoutJson]);

    // ========== EFFECTS ==========
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

    // ========== ANIMATED STYLES ==========
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
        };
    });

    // ========== RENDER HANDLE ==========
    const renderHandle = useCallback(() => (
        <View style={[styles.handleContainer, { backgroundColor: theme.surface }]}>
            <View style={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]} />

            {/* Header expandido */}
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

            {/* Mini player */}
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
    ), [theme, isScrolled, duration, expandedStyle, miniPlayerStyle, workoutName, handleFinish]);

    // ========== RENDER ==========
    return (
        <KeyboardProvider>
            <View style={[StyleSheet.absoluteFill, { pointerEvents: 'box-none', zIndex: 999 }]}>
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
                    <Animated.View style={[styles.expandedContainer, expandedStyle]}>
                        <WorkoutContent
                            theme={theme}
                            insets={insets}
                            isScrolled={isScrolled}
                            duration={duration}
                            workoutName={workoutName}
                            startedAt={startedAt}
                            exercises={exercises}
                            isActive={isActive}
                            handleScroll={handleScroll}
                            handleAddSet={addSet}
                            handleUpdateSet={updateSet}
                            handleToggleSet={handleToggleSet}
                            handleChangeSetType={changeSetType}
                            handleFillFromPR={fillFromPR}
                            handleReplaceExercise={replaceExercise}
                            handleRemoveSet={removeSet}
                            handleAddExercise={handleAddExercise}
                            handleCancel={handleCancel}
                            workoutMenuOptions={workoutMenuOptions}
                        />
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

                <CustomKeyboard />
            </View>
        </KeyboardProvider>
    );
};

const styles = StyleSheet.create({
    sheetShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 6,
    },
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
    expandedContainer: {
        flex: 1,
    },
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
    scrollContent: {
        paddingHorizontal: 0,
    },
    contentPadding: {
        paddingHorizontal: 16,
    },
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
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    metaText: {
        fontSize: 14,
        marginLeft: 8,
    },
    exercisesContainer: {
        marginTop: 20,
    },
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
