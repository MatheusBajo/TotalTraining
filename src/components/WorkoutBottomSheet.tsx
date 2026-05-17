import React, { useCallback, useMemo, useRef, useEffect, useState, memo } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, Modal, TextInput, Pressable } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedReaction,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useWorkoutTimer, useWorkoutMeta, useWorkoutExercises, useWorkoutActions } from '../context/WorkoutContext';
import { useSheetAnimation } from '../context/SheetAnimationContext';
import { CalendarBlank, Clock, Play } from 'phosphor-react-native';
import { ExerciseCard } from './ExerciseCard';
import { AddExerciseModal } from './AddExerciseModal';
import { FinishWorkoutModal } from './FinishWorkoutModal';
import { ExercisePickerModal } from './ExercisePickerModal';
import { useHapticPatterns, useRestTimer } from '../hooks';
import { KeyboardProvider, useKeyboard } from '../context/KeyboardContext';
import { CustomKeyboard } from './CustomKeyboard';
import { ActionDropdown } from './ActionDropdown';
import { RestTimerButton } from './RestTimerButton';
import { RestTimerPicker } from './RestTimerPicker';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { RestFinishedModal } from './RestFinishedModal';
import { CancelWorkoutModal } from './CancelWorkoutModal';
import * as Clipboard from 'expo-clipboard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINI_PLAYER_HEIGHT = 70;
const TAB_BAR_HEIGHT = 60;
const KEYBOARD_HEIGHT = 60 * 4 + 24 + 12;

// ========== FUNÇÕES UTILITÁRIAS (fora do componente) ==========
const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
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

// ========== TIMER COMPONENTS (isolados para evitar re-render do handle) ==========

// Timer do header - re-renderiza independentemente a cada segundo
const HeaderTimer = memo(({ style }: { style?: any }) => {
    const { duration } = useWorkoutTimer();
    return (
        <Text style={style}>
            {formatTime(duration)}
        </Text>
    );
});

// Timer do mini player - re-renderiza independentemente a cada segundo
const MiniPlayerTimer = memo(({ style }: { style?: any }) => {
    const { duration } = useWorkoutTimer();
    return (
        <Text style={style}>
            {formatTime(duration)}
        </Text>
    );
});

// Timer do conteúdo (meta info) - re-renderiza independentemente a cada segundo
const ContentDurationTimer = memo(({ prefix, style }: { prefix?: string; style?: any }) => {
    const { duration } = useWorkoutTimer();
    return (
        <Text style={style}>
            {prefix}{formatTime(duration)}
        </Text>
    );
});

// ========== STICKY DURATION TIMER (aparece no header ao scrollar pra baixo) ==========
// Mostra o tempo de treino no centro do header sticky com opacidade baseada no scroll.
// Auto-contido: usa useWorkoutTimer() internamente, sem causar re-render no parent.
const StickyDurationTimer = memo(({
    scrollY,
    color,
}: {
    scrollY: { value: number };
    color: string;
}) => {
    const { duration } = useWorkoutTimer();

    const opacityStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 80], [0, 1], Extrapolation.CLAMP),
    }));

    return (
        <Animated.View style={[styles.headerTimerAbsolute, opacityStyle]}>
            <Text style={[styles.headerTimerText, { color }]}>
                {formatTime(duration)}
            </Text>
        </Animated.View>
    );
});

// ========== HEADER DO WORKOUT (meta info) ==========
const WorkoutHeader = memo(({
    theme,
    workoutName,
    dateText,
    startTimeText,
    workoutMenuOptions,
}: {
    theme: any;
    workoutName: string;
    dateText: string;
    startTimeText: string;
    workoutMenuOptions: any[];
}) => (
    <View>
        {/* Título + Menu */}
        <View style={[styles.titleRow, styles.contentPadding]}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{workoutName}</Text>
            <View style={styles.titleMenuButton}>
                <ActionDropdown
                    options={workoutMenuOptions}
                    iconSize={22}
                    iconColor={theme.textSecondary}
                    anchor="right"
                />
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
            <ContentDurationTimer prefix="Duração: " style={[styles.metaText, { color: theme.textSecondary }]} />
        </View>
    </View>
));

// ========== FOOTER DO WORKOUT (botões de ação) ==========
const WorkoutFooter = memo(({
    theme,
    onAddExercise,
    onCancel,
}: {
    theme: any;
    onAddExercise: () => void;
    onCancel: () => void;
}) => (
    <View style={styles.contentPadding}>
        <TouchableOpacity
            onPress={onAddExercise}
            style={[styles.addExerciseButton, { backgroundColor: theme.primary + '20' }]}
        >
            <Text style={[styles.addExerciseText, { color: theme.primary }]}>+ Adicionar Exercício</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar Treino</Text>
        </TouchableOpacity>
    </View>
));

// ========== TIPO PARA EXERCÍCIOS COM INFO DE SUPERSET ==========
interface ExerciseWithSupersetInfo {
    id: string;
    localId: number;
    name: string;
    sets: any[];
    notes?: string;
    alternativas?: string[];
    supersetWith?: number;
    // Info pré-calculada de superset
    _source: any; // Referência original do exercício para cache comparison
    _isSuperset: boolean;
    _supersetPosition?: 'first' | 'last' | 'middle';
    _linkedWithNext: boolean;
    _canToggleSuperset: boolean;
}

// ========== WORKOUT CONTENT COM FLATLIST (usa KeyboardContext) ==========
const WorkoutContent = memo(({
    theme,
    insets,
    workoutName,
    startedAt,
    exercises,
    isActive,
    handleAddSet,
    handleUpdateSet,
    handleToggleSet,
    handleChangeSetType,
    handleFillFromPR,
    handleRemoveSet,
    handleToggleSuperset,
    handleRemoveExercise,
    handleUpdateNotes,
    handleSwitchAlternative,
    handleAddExercise,
    handleCancel,
    handleShowExercisePicker,
    handleOpenExerciseDetail,
    workoutMenuOptions,
    scrollY,
}: any) => {
    const { isVisible: isKeyboardVisible, setScrollRef } = useKeyboard();
    const flatListRef = useRef<any>(null);

    // Registra ref do FlatList para auto-scroll
    const setFlatListRef = useCallback((ref: any) => {
        flatListRef.current = ref;
        if (ref) {
            const wrapper = {
                _ref: ref,
                _currentOffset: 0,
                scrollToOffset(opts: { offset: number; animated?: boolean }) {
                    ref.scrollToOffset?.(opts);
                    // Atualiza offset imediatamente para evitar stale value em chamadas subsequentes
                    this._currentOffset = opts.offset;
                },
            };
            scrollWrapperRef.current = wrapper;
            setScrollRef(wrapper);
        } else {
            scrollWrapperRef.current = null;
            setScrollRef(null);
        }
    }, [setScrollRef]);

    const dateText = useMemo(() => formatDate(), []);
    const startTimeText = useMemo(() => formatStartTime(startedAt), [startedAt]);
    const paddingBottom = isKeyboardVisible ? KEYBOARD_HEIGHT + insets.bottom + 20 : 60;

    // Scroll handler para rastrear posição (usado para opacidade do countdown no header + auto-scroll)
    const scrollWrapperRef = useRef<any>(null);
    const handleScroll = useCallback((event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        scrollY.value = y;
        // Atualiza offset no wrapper para auto-scroll calcular posição correta
        if (scrollWrapperRef.current) scrollWrapperRef.current._currentOffset = y;
    }, [scrollY]);

    // Cache ref para evitar recriar objetos de exercícios que não mudaram
    const supersetCacheRef = useRef<Map<string, ExerciseWithSupersetInfo>>(new Map());

    // PRÉ-CALCULA info de superset com CACHE por exercício
    // Quando apenas 1 set muda, só o exercício correspondente gera novo objeto.
    // Os demais mantém a mesma referência = FlatList NEM RODA o comparator do memo.
    const exercisesWithSupersetInfo = useMemo((): ExerciseWithSupersetInfo[] => {
        const newCache = new Map<string, ExerciseWithSupersetInfo>();

        const result = exercises.map((ex: any, index: number) => {
            const prevEx = exercises[index - 1];
            const nextEx = exercises[index + 1];

            // Está em superset se tem link com exercício anterior ou próximo
            const linkedWithPrev = prevEx && ex.supersetWith === prevEx.localId;
            const linkedWithNext = nextEx && ex.supersetWith === nextEx.localId;
            const isSuperset = linkedWithPrev || linkedWithNext;

            let supersetPosition: 'first' | 'last' | 'middle' | undefined;
            if (isSuperset) {
                if (!linkedWithPrev && linkedWithNext) supersetPosition = 'first';
                else if (linkedWithPrev && !linkedWithNext) supersetPosition = 'last';
                else if (linkedWithPrev && linkedWithNext) supersetPosition = 'middle';
                else supersetPosition = 'first';
            }

            const canToggleSuperset = nextEx !== undefined;

            // Verifica cache: se o exercício source E as propriedades de superset são iguais, reutiliza
            const cached = supersetCacheRef.current.get(ex.id);
            if (
                cached &&
                cached._source === ex &&
                cached._isSuperset === isSuperset &&
                cached._supersetPosition === supersetPosition &&
                cached._linkedWithNext === linkedWithNext &&
                cached._canToggleSuperset === canToggleSuperset
            ) {
                newCache.set(ex.id, cached);
                return cached;
            }

            const newItem: ExerciseWithSupersetInfo = {
                ...ex,
                _source: ex, // Referência original para comparação no cache
                _isSuperset: isSuperset,
                _supersetPosition: supersetPosition,
                _linkedWithNext: linkedWithNext,
                _canToggleSuperset: canToggleSuperset,
            };
            newCache.set(ex.id, newItem);
            return newItem;
        });

        supersetCacheRef.current = newCache;
        return result;
    }, [exercises]);

    // Render item para FlatList - NÃO depende mais de exercises!
    const renderExerciseItem = useCallback(({ item }: { item: ExerciseWithSupersetInfo }) => {
        return (
            <ExerciseCard
                exerciseId={item.id}
                name={item.name}
                sets={item.sets}
                onAddSet={handleAddSet}
                onUpdateSet={handleUpdateSet}
                onToggleSet={handleToggleSet}
                onChangeSetType={handleChangeSetType}
                onFillFromPR={handleFillFromPR}
                onShowExercisePicker={handleShowExercisePicker}
                onOpenExerciseDetail={handleOpenExerciseDetail}
                onRemoveSet={handleRemoveSet}
                onToggleSuperset={item._canToggleSuperset ? handleToggleSuperset : undefined}
                onRemoveExercise={handleRemoveExercise}
                onUpdateNotes={handleUpdateNotes}
                notes={item.notes}
                alternativas={item.alternativas}
                onSwitchAlternative={handleSwitchAlternative}
                isSuperset={item._isSuperset}
                supersetPosition={item._supersetPosition}
                isSupersetLinkedWithNext={item._linkedWithNext}
            />
        );
    }, [handleAddSet, handleUpdateSet, handleToggleSet, handleChangeSetType, handleFillFromPR, handleShowExercisePicker, handleOpenExerciseDetail, handleRemoveSet, handleToggleSuperset, handleRemoveExercise, handleUpdateNotes, handleSwitchAlternative]);

    // Key extractor
    const keyExtractor = useCallback((item: any) => item.id, []);

    // Header component
    const ListHeader = useMemo(() => (
        <WorkoutHeader
            theme={theme}
            workoutName={workoutName}
            dateText={dateText}
            startTimeText={startTimeText}
            workoutMenuOptions={workoutMenuOptions}
        />
    ), [theme, workoutName, dateText, startTimeText, workoutMenuOptions]);

    // Footer component
    const ListFooter = useMemo(() => (
        <WorkoutFooter
            theme={theme}
            onAddExercise={handleAddExercise}
            onCancel={handleCancel}
        />
    ), [theme, handleAddExercise, handleCancel]);

    return (
        <BottomSheetFlatList
            ref={setFlatListRef}
            data={exercisesWithSupersetInfo}
            renderItem={renderExerciseItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom }]}
            bounces={true}
            keyboardShouldPersistTaps="always"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            // Otimizações de performance - ajustadas para melhor FPS
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={11}
            initialNumToRender={5}
            updateCellsBatchingPeriod={50}
        />
    );
});

// ========== MAIN COMPONENT ==========
export const WorkoutBottomSheet = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { animatedIndex, animatedPosition } = useSheetAnimation();

    // Separate context hooks for optimal re-renders
    // NOTA: Os timers são isolados em HeaderTimer, MiniPlayerTimer e ContentDurationTimer
    // NÃO usar useWorkoutTimer() aqui — causa re-render 1x/segundo e lag no Perfil
    const { isActive, isMinimized, workoutName } = useWorkoutMeta(); // Meta only - no re-render on set updates
    const { exercises } = useWorkoutExercises(); // Exercises only - isolated re-renders
    const {
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
        removeExercise,
        removeSet,
        toggleSuperset,
        updateExerciseNotes,
        switchAlternative,
        getStartedAt,
        updateWorkoutName,
    } = useWorkoutActions(); // Stable functions (never re-render)

    // Captura startedAt uma vez quando treino inicia (sem subscription ao timer)
    const startedAtRef = useRef<number | null>(null);
    useEffect(() => {
        if (isActive) {
            startedAtRef.current = getStartedAt();
        } else {
            startedAtRef.current = null;
        }
    }, [isActive, getStartedAt]);

    // Controla montagem do WorkoutContent sob demanda:
    // - Desmontado quando minimizado (zero custo JS → Perfil a 60fps)
    // - Montado via onAnimate ANTES da animação de abertura (sem flash cinza)
    // - Desmontado via onChange DEPOIS da animação de fechamento
    const [contentReady, setContentReady] = useState(!isMinimized);

    const [showAddExercise, setShowAddExercise] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);
    // ExercisePickerModal: uma única instância gerenciada aqui (em vez de N instâncias dentro de cada ExerciseCard)
    const [exercisePickerForId, setExercisePickerForId] = useState<string | null>(null);
    // ExerciseDetailModal: id do exercício cujos detalhes estão sendo visualizados
    const [exerciseDetailForId, setExerciseDetailForId] = useState<string | null>(null);
    // Modal "Acabou o descanso!"
    const [showRestFinished, setShowRestFinished] = useState(false);
    // Modal de cancelar treino
    const [showCancelModal, setShowCancelModal] = useState(false);
    const haptics = useHapticPatterns();

    // Rest timer
    const restTimer = useRestTimer();
    const scrollY = useSharedValue(0);

    // Limpa o rest timer quando o treino finaliza/cancela
    // Evita o botão ficar azul ou no meio de uma contagem ao reabrir
    useEffect(() => {
        if (!isActive) {
            restTimer.resetTimer();
        }
    }, [isActive, restTimer.resetTimer]);

    const timerButtonRef = useRef<View>(null);
    const [timerButtonPos, setTimerButtonPos] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    const handleTimerButtonPress = useCallback(() => {
        timerButtonRef.current?.measureInWindow((x, y, width, height) => {
            setTimerButtonPos({ x, y, width, height });
            restTimer.showPicker();
        });
    }, [restTimer.showPicker]);

    const handleTimerPickerSelect = useCallback((seconds: number) => {
        restTimer.setRestDuration(seconds);
        restTimer.startTimer();
    }, [restTimer.setRestDuration, restTimer.startTimer]);

    // Quando o timer de descanso termina: mostra modal "Acabou o descanso!"
    const handleRestTimerFinish = useCallback(() => {
        restTimer.onTimerFinish();
        setShowRestFinished(true);
    }, [restTimer.onTimerFinish]);

    // ========== CALLBACKS MEMOIZADOS ==========
    const handleToggleSet = useCallback((exerciseId: string, setId: string) => {
        // Verifica se o set está sendo completado (não descompletado)
        const exercise = exercises.find((ex: any) => ex.id === exerciseId);
        const set = exercise?.sets.find((s: any) => s.id === setId);
        const isCompleting = set && !set.completed;

        toggleSet(exerciseId, setId);

        // Auto-trigger rest timer quando completa um set
        if (isCompleting) {
            setTimeout(() => {
                restTimer.startTimer();
            }, 700); // delay para a animação do SetRow terminar
        }
    }, [toggleSet, exercises, restTimer]);

    // ExercisePickerModal: abre o picker para um exercício específico
    const handleShowExercisePicker = useCallback((exerciseId: string) => {
        setExercisePickerForId(exerciseId);
    }, []);

    const handleCloseExercisePicker = useCallback(() => {
        setExercisePickerForId(null);
    }, []);

    const handlePickerSelectExercise = useCallback((newName: string) => {
        if (exercisePickerForId) {
            replaceExercise(exercisePickerForId, newName);
        }
        setExercisePickerForId(null);
    }, [exercisePickerForId, replaceExercise]);

    // Nome do exercício atual para o picker
    const pickerCurrentExerciseName = useMemo(() => {
        if (!exercisePickerForId) return '';
        const ex = exercises.find((e: any) => e.id === exercisePickerForId);
        return ex?.name || '';
    }, [exercisePickerForId, exercises]);

    // ExerciseDetailModal
    const handleOpenExerciseDetail = useCallback((exerciseId: string) => {
        setExerciseDetailForId(exerciseId);
    }, []);

    const handleCloseExerciseDetail = useCallback(() => {
        setExerciseDetailForId(null);
    }, []);

    const exerciseDetailName = useMemo(() => {
        if (!exerciseDetailForId) return '';
        const ex = exercises.find((e: any) => e.id === exerciseDetailForId);
        return ex?.name || '';
    }, [exerciseDetailForId, exercises]);

    const handleAddExercise = useCallback(() => {
        setShowAddExercise(true);
    }, []);

    const handleCancel = useCallback(() => {
        setShowCancelModal(true);
    }, []);

    const handleConfirmCancel = useCallback(() => {
        setShowCancelModal(false);
        haptics.finishWorkout();
        cancelWorkout();
    }, [haptics, cancelWorkout]);

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

    const handleToggleSuperset = useCallback((exerciseId: string) => {
        toggleSuperset(exerciseId);
    }, [toggleSuperset]);

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
        // Calcula duração no momento do export usando getStartedAt()
        const currentStartedAt = getStartedAt();
        const currentDuration = currentStartedAt
            ? Math.floor((Date.now() - currentStartedAt) / 1000)
            : 0;

        const exportData = {
            nome: workoutName,
            data: new Date().toISOString().split('T')[0],
            duracao: formatTime(currentDuration),
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
    }, [workoutName, getStartedAt, exercises]);

    // Estado para o modal de renomear treino
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [renameText, setRenameText] = useState('');

    const handleEditWorkoutName = useCallback(() => {
        setRenameText(workoutName);
        setShowRenameModal(true);
    }, [workoutName]);

    const handleConfirmRename = useCallback(() => {
        if (renameText.trim()) {
            updateWorkoutName(renameText.trim());
        }
        setShowRenameModal(false);
    }, [renameText, updateWorkoutName]);

    const workoutMenuOptions = useMemo(() => [
        {
            id: 'edit-name',
            label: 'Editar nome',
            icon: 'edit' as const,
            onPress: handleEditWorkoutName,
        },
        {
            id: 'adjust-time',
            label: 'Ajustar horário',
            icon: 'settings' as const,
            onPress: () => {
                Alert.alert('Em breve', 'Ajuste de horário será implementado em breve!');
            },
        },
        {
            id: 'add-note',
            label: 'Adicionar nota',
            icon: 'note' as const,
            onPress: () => {
                Alert.alert('Em breve', 'Notas de treino serão implementadas em breve!');
            },
        },
        {
            id: 'export',
            label: 'Exportar JSON',
            icon: 'export' as const,
            onPress: exportWorkoutJson,
        },
    ], [handleEditWorkoutName, exportWorkoutJson]);

    // ========== EFFECTS ==========
    // Reage a isActive E isMinimized para controlar o sheet corretamente
    useEffect(() => {
        if (!isActive) {
            bottomSheetRef.current?.close();
        } else if (isMinimized) {
            // Quando minimizado, vai para o snap point 0 (mini player)
            // Isso mantém o sheet visível mas pequeno, permitindo a animação do MiniPlayer funcionar
            bottomSheetRef.current?.snapToIndex(0);
        } else {
            // Quando não minimizado (isActive=true, isMinimized=false), abre expandido
            bottomSheetRef.current?.snapToIndex(1);
        }
    }, [isActive, isMinimized]);

    // Detecta qualquer movimento do sheet (drag ou programático) para montar conteúdo
    // Dispara na UI thread via animatedPosition — funciona pra tap E drag
    const mountContent = useCallback(() => {
        setContentReady(true);
    }, []);

    useAnimatedReaction(
        () => animatedPosition.value,
        (pos, prevPos) => {
            // Se o sheet começou a se mover pra cima a partir da posição minimizada
            if (prevPos !== null && pos < prevPos && prevPos >= minimizedPosition - 5) {
                runOnJS(mountContent)();
            }
        },
        [minimizedPosition]
    );

    // Dispara DEPOIS da animação terminar — desmonta quando já está invisível
    const handleSheetChanges = useCallback((index: number) => {
        if (index === 0) {
            minimizeWorkout();
            setContentReady(false);
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
            pointerEvents: opacity > 0.1 ? 'auto' : 'none',
        };
    });

    // ========== STICKY DURATION TIMER — tempo de treino no header ao scrollar ==========
    const stickyDurationElement = useMemo(() => (
        <StickyDurationTimer scrollY={scrollY} color={theme.primary} />
    ), [scrollY, theme.primary]);

    // ========== REST TIMER — renderizado no handle sem causar re-mount ==========
    // O RestTimerButton é pesado (tem intervalRef, state, animações).
    // Pra evitar que re-criação do renderHandle cause re-mount, renderizamos
    // ele FORA do useCallback e o referenciamos via ref.
    const restTimerButtonElement = useMemo(() => (
        <RestTimerButton
            isActive={restTimer.isTimerVisible}
            initialSeconds={restTimer.restDuration}
            onFinish={handleRestTimerFinish}
            onDismiss={restTimer.dismissTimer}
            onPress={handleTimerButtonPress}
            primaryColor={theme.primary}
            fieldColor={theme.field}
            textColor={theme.text}
        />
    ), [restTimer.isTimerVisible, restTimer.restDuration, handleRestTimerFinish, restTimer.dismissTimer, handleTimerButtonPress, theme.primary, theme.field, theme.text]);

    // ========== RENDER HANDLE ==========
    // NOTA: Não inclui 'duration' nas deps! Os componentes HeaderTimer e MiniPlayerTimer
    // se subscrevem independentemente ao timer, evitando re-render do handle inteiro.
    const renderHandle = useCallback(() => (
        <View style={[styles.handleContainer, { backgroundColor: theme.surface }]}>
            <View style={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]} />

            {/* Header expandido */}
            <Animated.View style={expandedStyle}>
                <View style={styles.stickyHeader}>
                    <View style={styles.headerRow}>
                        <View ref={timerButtonRef} collapsable={false}>
                            {restTimerButtonElement}
                        </View>

                        {/* Tempo de treino no centro — aparece ao scrollar pra baixo */}
                        {stickyDurationElement}

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
                    <MiniPlayerTimer style={[styles.miniTimer, { color: theme.primary }]} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    ), [theme, expandedStyle, miniPlayerStyle, workoutName, handleFinish, restTimerButtonElement, stickyDurationElement]);

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
                    enableContentPanningGesture={true}
                >
                    <Animated.View style={[styles.expandedContainer, expandedStyle]}>
                        {contentReady && (
                            <WorkoutContent
                                theme={theme}
                                insets={insets}
                                workoutName={workoutName}
                                startedAt={startedAtRef.current}
                                exercises={exercises}
                                isActive={isActive}
                                handleAddSet={addSet}
                                handleUpdateSet={updateSet}
                                handleToggleSet={handleToggleSet}
                                handleChangeSetType={changeSetType}
                                handleFillFromPR={fillFromPR}
                                handleRemoveSet={removeSet}
                                handleToggleSuperset={handleToggleSuperset}
                                handleRemoveExercise={removeExercise}
                                handleUpdateNotes={updateExerciseNotes}
                                handleSwitchAlternative={switchAlternative}
                                handleAddExercise={handleAddExercise}
                                handleCancel={handleCancel}
                                handleShowExercisePicker={handleShowExercisePicker}
                                handleOpenExerciseDetail={handleOpenExerciseDetail}
                                workoutMenuOptions={workoutMenuOptions}
                                scrollY={scrollY}
                            />
                        )}
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

                {/* Exercise Picker Modal - FORA do BottomSheet para evitar bug de overlay */}
                <ExercisePickerModal
                    visible={exercisePickerForId !== null}
                    onClose={handleCloseExercisePicker}
                    onSelect={handlePickerSelectExercise}
                    currentExerciseName={pickerCurrentExerciseName}
                />

                {/* Exercise Detail Modal */}
                <ExerciseDetailModal
                    visible={exerciseDetailForId !== null}
                    exerciseName={exerciseDetailName}
                    onClose={handleCloseExerciseDetail}
                />

                {/* Modal de renomear treino */}
                <Modal
                    visible={showRenameModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowRenameModal(false)}
                    statusBarTranslucent
                >
                    <Pressable
                        style={styles.renameBackdrop}
                        onPress={() => setShowRenameModal(false)}
                    >
                        <Pressable style={[styles.renameContainer, { backgroundColor: theme.surface }]}>
                            <Text style={[styles.renameTitle, { color: theme.text }]}>Editar Nome</Text>
                            <TextInput
                                style={[styles.renameInput, { color: theme.text, backgroundColor: theme.field, borderColor: theme.primary }]}
                                value={renameText}
                                onChangeText={setRenameText}
                                autoFocus
                                selectTextOnFocus
                                maxLength={50}
                                placeholderTextColor={theme.textSecondary}
                                placeholder="Nome do treino"
                                onSubmitEditing={handleConfirmRename}
                                returnKeyType="done"
                            />
                            <View style={styles.renameButtons}>
                                <TouchableOpacity
                                    onPress={() => setShowRenameModal(false)}
                                    style={styles.renameCancelBtn}
                                >
                                    <Text style={[styles.renameCancelText, { color: theme.textSecondary }]}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleConfirmRename}
                                    style={[styles.renameSaveBtn, { backgroundColor: theme.primary }]}
                                >
                                    <Text style={styles.renameSaveText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>

                {/* Rest Timer Picker */}
                <RestTimerPicker
                    visible={restTimer.isPickerVisible}
                    currentDuration={restTimer.restDuration}
                    onSelect={handleTimerPickerSelect}
                    onClose={restTimer.closePicker}
                    anchorPosition={timerButtonPos ?? undefined}
                />

                {/* Modal "Acabou o descanso!" */}
                <RestFinishedModal
                    visible={showRestFinished}
                    onDismiss={() => setShowRestFinished(false)}
                />

                {/* Modal de cancelar treino */}
                <CancelWorkoutModal
                    visible={showCancelModal}
                    onCancel={handleConfirmCancel}
                    onDismiss={() => setShowCancelModal(false)}
                />
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
    titleMenuButton: {
        marginLeft: 8,
        padding: 4,
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
    // Rename modal
    renameBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    renameContainer: {
        width: '100%',
        borderRadius: 16,
        padding: 20,
    },
    renameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    renameInput: {
        fontSize: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1.5,
        marginBottom: 20,
    },
    renameButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    renameCancelBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    renameCancelText: {
        fontSize: 15,
        fontWeight: '600',
    },
    renameSaveBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    renameSaveText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
