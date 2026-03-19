import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SetType } from '../components/SetTypeModal';
import { CoreHaptics } from 'expo-core-haptics';
import { supabase } from '../lib/supabase';
import {
    initDatabase,
    createLocalWorkout,
    getLocalWorkout,
    updateLocalWorkout,
    deleteLocalWorkout,
    createLocalExercise,
    getExercisesByWorkout,
    updateLocalExercise,
    deleteLocalExercise,
    createLocalSet,
    getSetsByExercise,
    updateLocalSet,
    deleteLocalSet,
    getWorkoutWithExercisesAndSets,
    getPRsBatchLocal,
    getLocalDateTime,
    LocalWorkout,
    LocalExercise,
    LocalSet,
} from '../db';
import { triggerSync } from '../db/syncService';

// ==================== TYPES ====================

interface WorkoutSet {
    id: string;           // ID local (string para compatibilidade)
    localId: number;      // ID no SQLite local
    remoteId?: number;    // ID no Supabase (se sincronizado)
    kg: string;
    reps: string;
    rir: string;
    completed: boolean;
    type: SetType;
    prev: string;
    prData?: {
        weight: number;
        reps: number;
        rir: number | null;
    };
    targetReps?: string;
    targetRir?: string;
    notes?: string;
}

interface WorkoutExercise {
    id: string;           // ID local (string para compatibilidade)
    localId: number;      // ID no SQLite local
    remoteId?: number;    // ID no Supabase (se sincronizado)
    name: string;
    sets: WorkoutSet[];
    notes?: string;
    supersetWith?: number; // localId do exercício com que está em superset
}

// ==================== SEPARATE CONTEXTS ====================

// 1. Timer Context - updates every second (isolated re-renders)
interface WorkoutTimerContextData {
    duration: number;
    startedAt: number | null;
}

// 2. Meta Context - workout metadata (NO exercises - avoids re-renders on keystroke)
interface WorkoutMetaContextData {
    isActive: boolean;
    isMinimized: boolean;
    isLoading: boolean;
    workoutName: string;
    workoutId: number | null;
    showActiveModal: boolean;
    pendingTemplate: any | null;
}

// 3. Exercises Context - only exercises array (isolated re-renders on set updates)
interface WorkoutExercisesContextData {
    exercises: WorkoutExercise[];
}

// Legacy State Context - combines meta + exercises (for backwards compatibility)
interface WorkoutStateContextData {
    isActive: boolean;
    isMinimized: boolean;
    isLoading: boolean;
    workoutName: string;
    workoutId: number | null;
    exercises: WorkoutExercise[];
    showActiveModal: boolean;
    pendingTemplate: any | null;
}

// 4. Actions Context - stable functions (never change reference)
interface WorkoutActionsContextData {
    requestStartWorkout: (template?: any) => void;
    confirmStartNew: () => Promise<void>;
    resumeWorkout: () => void;
    dismissModal: () => void;
    startWorkout: (template?: any) => Promise<void>;
    minimizeWorkout: () => void;
    maximizeWorkout: () => void;
    finishWorkout: () => Promise<void>;
    cancelWorkout: () => Promise<void>;
    addExercise: (exerciseName: string, numSets?: number) => Promise<void>;
    addSet: (exerciseId: string) => Promise<void>;
    updateSet: (exerciseId: string, setId: string, field: 'kg' | 'reps' | 'rir', value: string) => void;
    toggleSet: (exerciseId: string, setId: string) => void;
    changeSetType: (exerciseId: string, setId: string, type: SetType) => void;
    fillFromPR: (exerciseId: string, setId: string) => void;
    replaceExercise: (exerciseId: string, newExerciseName: string) => Promise<void>;
    removeExercise: (exerciseId: string) => Promise<void>;
    removeSet: (exerciseId: string, setId: string) => Promise<void>;
    toggleSuperset: (exerciseId: string) => void;
    getStartedAt: () => number | null;
    updateWorkoutName: (name: string) => void;
}

// Create separate contexts
const WorkoutTimerContext = createContext<WorkoutTimerContextData>({
    duration: 0,
    startedAt: null,
});

const WorkoutMetaContext = createContext<WorkoutMetaContextData>({
    isActive: false,
    isMinimized: false,
    isLoading: false,
    workoutName: '',
    workoutId: null,
    showActiveModal: false,
    pendingTemplate: null,
});

const WorkoutExercisesContext = createContext<WorkoutExercisesContextData>({
    exercises: [],
});

const WorkoutStateContext = createContext<WorkoutStateContextData>({
    isActive: false,
    isMinimized: false,
    isLoading: false,
    workoutName: '',
    workoutId: null,
    exercises: [],
    showActiveModal: false,
    pendingTemplate: null,
});

const WorkoutActionsContext = createContext<WorkoutActionsContextData>({} as WorkoutActionsContextData);

// Legacy context for backwards compatibility (combines all)
interface WorkoutContextData extends WorkoutTimerContextData, WorkoutStateContextData, WorkoutActionsContextData {}
const WorkoutContext = createContext<WorkoutContextData>({} as WorkoutContextData);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [isActive, setIsActive] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [workoutName, setWorkoutName] = useState('');
    const [workoutId, setWorkoutId] = useState<number | null>(null);
    const [duration, setDuration] = useState(0);
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

    // Estado do modal de treino ativo
    const [showActiveModal, setShowActiveModal] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState<any | null>(null);

    // Timestamp de quando o treino começou
    const startedAtRef = useRef<number | null>(null);

    // Flag para evitar criar treino duplicado
    const isCreatingWorkoutRef = useRef(false);

    // User ID do Supabase
    const userIdRef = useRef<string | null>(null);

    // Refs para acessar estado atual nas callbacks (evita dependências)
    const exercisesRef = useRef<WorkoutExercise[]>([]);
    const workoutIdRef = useRef<number | null>(null);

    // Mantém refs sincronizados
    useEffect(() => {
        exercisesRef.current = exercises;
    }, [exercises]);

    useEffect(() => {
        workoutIdRef.current = workoutId;
    }, [workoutId]);

    // Carrega user ID ao montar e restaura treino ativo
    useEffect(() => {
        const loadUserAndRestoreWorkout = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            userIdRef.current = user?.id || null;

            // Restaura treino ativo se existir
            if (user?.id) {
                await restoreActiveWorkout(user.id);
            }
        };
        loadUserAndRestoreWorkout();

        // Escuta mudanças de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            userIdRef.current = session?.user?.id || null;
        });

        return () => subscription.unsubscribe();
    }, []);

    // Restaura treino ativo (não finalizado) do banco local
    const restoreActiveWorkout = async (userId: string) => {
        try {
            const { getDatabase } = await import('../db/database');
            const db = getDatabase();

            // Busca treino ativo (started_at não nulo, finished_at nulo)
            const activeWorkout = await db.getFirstAsync<LocalWorkout>(
                `SELECT * FROM workouts
                 WHERE user_id = ? AND started_at IS NOT NULL AND finished_at IS NULL
                 AND (sync_action IS NULL OR sync_action != 'delete')
                 ORDER BY id DESC LIMIT 1`,
                [userId]
            );

            if (!activeWorkout) {
                console.log('[WorkoutContext] No active workout to restore');
                return;
            }

            // Valida idade do treino — não restaurar treinos abandonados há mais de 12h
            const startedAtMs = activeWorkout.started_at ? new Date(activeWorkout.started_at).getTime() : 0;
            const ageHours = (Date.now() - startedAtMs) / (1000 * 60 * 60);
            if (ageHours > 12) {
                console.warn(`[WorkoutContext] Stale workout #${activeWorkout.id} (${ageHours.toFixed(1)}h old), auto-canceling`);
                await deleteLocalWorkout(activeWorkout.id);
                return;
            }

            console.log(`[WorkoutContext] Restoring active workout #${activeWorkout.id}`);

            // Busca exercícios
            const exercisesFromDb = await getExercisesByWorkout(activeWorkout.id);

            // Busca PRs para todos os exercícios de uma vez
            const exerciseNames = exercisesFromDb.map(ex => ex.exercise_name);
            const prsData = exerciseNames.length > 0
                ? await getPRsBatchLocal(userId, exerciseNames)
                : {};

            // Busca sets de cada exercício
            const restoredExercises: WorkoutExercise[] = [];
            for (const ex of exercisesFromDb) {
                const sets = await getSetsByExercise(ex.id);
                const exercisePRs = prsData[ex.exercise_name] || [];

                const workoutSets: WorkoutSet[] = sets.map((s, idx) => {
                    // Busca PR para esta série pelo order_index
                    const setPR = exercisePRs.find(pr => pr.order_index === s.order_index);
                    let prevStats = '-';
                    let prData: WorkoutSet['prData'] = undefined;

                    if (setPR) {
                        const rirStr = setPR.rir !== null ? ` @ ${setPR.rir}` : '';
                        prevStats = `${setPR.weight}kg x ${setPR.reps}${rirStr}`;
                        prData = {
                            weight: setPR.weight,
                            reps: setPR.reps,
                            rir: setPR.rir,
                        };
                    }

                    return {
                        id: `set-${s.id}`,
                        localId: s.id,
                        remoteId: s.remote_id || undefined,
                        kg: s.weight?.toString() || '',
                        reps: s.reps?.toString() || '',
                        rir: s.rir?.toString() || '',
                        completed: s.completed,
                        type: (s.set_type || 'N') as SetType,
                        prev: prevStats,
                        prData,
                        // targetReps e targetRir não são salvos no DB, vêm do template
                        // Na restauração, usamos o PR como referência se disponível
                        targetReps: prData?.reps?.toString(),
                        targetRir: prData?.rir?.toString(),
                    };
                });

                restoredExercises.push({
                    id: `ex-${ex.id}`,
                    localId: ex.id,
                    remoteId: ex.remote_id || undefined,
                    name: ex.exercise_name,
                    sets: workoutSets,
                    supersetWith: ex.superset_with || undefined,
                });
            }

            // Calcula duração desde o início
            const startedAt = activeWorkout.started_at ? new Date(activeWorkout.started_at).getTime() : Date.now();
            startedAtRef.current = startedAt;

            // Restaura estado
            setWorkoutId(activeWorkout.id);
            setWorkoutName(activeWorkout.name);
            setExercises(restoredExercises);
            setDuration(Math.floor((Date.now() - startedAt) / 1000));
            setIsActive(true);
            setIsMinimized(true); // Começa minimizado

            console.log(`[WorkoutContext] Restored workout "${activeWorkout.name}" with ${restoredExercises.length} exercises`);

        } catch (error) {
            console.error('[WorkoutContext] Error restoring active workout:', error);
        }
    };

    // Timer que atualiza a duração
    const updateDuration = useCallback(() => {
        if (startedAtRef.current) {
            const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
            setDuration(elapsed);
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            updateDuration();
            timer = setInterval(updateDuration, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive, updateDuration]);

    // Recalcula duração quando app volta do background
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && isActive) {
                updateDuration();
            }
        });
        return () => subscription.remove();
    }, [isActive, updateDuration]);

    // ==================== MODAL HANDLERS ====================

    const requestStartWorkout = useCallback((template?: any) => {
        if (isActive) {
            setPendingTemplate(template || null);
            setShowActiveModal(true);
        } else {
            startWorkoutInternal(template);
        }
    }, [isActive]);

    const confirmStartNew = useCallback(async () => {
        setShowActiveModal(false);
        await cancelWorkoutInternal();
        await startWorkoutInternal(pendingTemplate);
        setPendingTemplate(null);
    }, [pendingTemplate]);

    const resumeWorkout = useCallback(() => {
        setShowActiveModal(false);
        setPendingTemplate(null);
        setIsMinimized(false);
    }, []);

    const dismissModal = useCallback(() => {
        setShowActiveModal(false);
        setPendingTemplate(null);
    }, []);

    // ==================== START WORKOUT (LOCAL-FIRST) ====================

    const startWorkoutInternal = async (template?: any) => {
        if (isCreatingWorkoutRef.current) {
            console.log('[WorkoutContext] Already creating workout, ignoring');
            return;
        }

        // Se o userIdRef ainda não foi carregado, tenta buscar agora
        if (!userIdRef.current) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.id) {
                    userIdRef.current = user.id;
                }
            } catch (e) {
                console.error('[WorkoutContext] Failed to fetch user:', e);
            }
        }

        if (!userIdRef.current) {
            console.error('[WorkoutContext] No user ID — not authenticated');
            return;
        }

        isCreatingWorkoutRef.current = true;
        setIsLoading(true);

        try {
            const { date, datetime } = getLocalDateTime();
            const workoutNameStr = template?.nome || 'Quick Workout';

            // 1. Cria workout LOCAL (instantâneo!)
            const localWorkoutId = await createLocalWorkout({
                user_id: userIdRef.current,
                date,
                name: workoutNameStr,
                template_id: template?.id,
                started_at: datetime,
            });

            // 2. Prepara exercícios do template
            const exercisesData = template?.exercicios?.map((ex: any) => ({
                templateId: ex.id,
                name: ex.nome,
                numSets: typeof ex.series === 'number' ? ex.series : 3,
                targetReps: ex.reps,
                targetRir: ex.rir,
                notas: ex.notas,
            })) || [];

            // 3. Busca PRs locais (instantâneo!)
            const exerciseNames = exercisesData.map((e: any) => e.name);
            const prsData = exerciseNames.length > 0
                ? await getPRsBatchLocal(userIdRef.current, exerciseNames)
                : {};

            // 4. Cria exercícios e sets LOCAL
            const initialExercises: WorkoutExercise[] = [];
            // Mapa de templateId -> localId para resolver supersets depois
            const templateIdToLocalId: Record<string, number> = {};

            for (let i = 0; i < exercisesData.length; i++) {
                const exData = exercisesData[i];

                const localExerciseId = await createLocalExercise({
                    workout_id: localWorkoutId,
                    exercise_name: exData.name,
                    order_index: i,
                });

                // Guarda mapeamento templateId -> localId
                if (exData.templateId) {
                    templateIdToLocalId[exData.templateId] = localExerciseId;
                }

                const exercisePRs = prsData[exData.name] || [];
                const targetReps = exData.targetReps?.toString() || '';
                const targetRir = exData.targetRir !== undefined ? exData.targetRir.toString() : '';

                const sets: WorkoutSet[] = [];
                for (let j = 0; j < exData.numSets; j++) {
                    const localSetId = await createLocalSet({
                        exercise_id: localExerciseId,
                        order_index: j,
                        set_type: 'N',
                        weight_type: 'total',
                    });

                    // Busca PR para esta série
                    const setPR = exercisePRs.find(pr => pr.order_index === j);
                    let prevStats = '-';
                    let prData: WorkoutSet['prData'] = undefined;

                    if (setPR) {
                        prevStats = `${setPR.weight}kg x ${setPR.reps}`;
                        prData = {
                            weight: setPR.weight,
                            reps: setPR.reps,
                            rir: setPR.rir,
                        };
                    }

                    sets.push({
                        id: `set-${localSetId}`,
                        localId: localSetId,
                        kg: '',
                        reps: '',
                        rir: '',
                        completed: false,
                        type: 'N' as SetType,
                        prev: prevStats,
                        prData,
                        targetReps,
                        targetRir,
                    });
                }

                initialExercises.push({
                    id: `ex-${localExerciseId}`,
                    localId: localExerciseId,
                    name: exData.name,
                    sets,
                    notes: exData.notas,
                    // supersetWith será preenchido depois
                });
            }

            // 5. Detecta e salva supersets baseado no templateId (ex: "1a" + "1b" = superset)
            for (let i = 0; i < exercisesData.length; i++) {
                const currentTemplateId = exercisesData[i].templateId;
                if (!currentTemplateId) continue;

                // Verifica se é parte de superset (termina com letra: 1a, 1b, 2a, 2b, etc.)
                const match = currentTemplateId.match(/^(\d+)([a-z])$/);
                if (!match) continue;

                const groupNumber = match[1];
                const letter = match[2];

                // Se termina com 'a', procura o 'b' correspondente
                if (letter === 'a') {
                    const partnerTemplateId = `${groupNumber}b`;
                    const partnerLocalId = templateIdToLocalId[partnerTemplateId];

                    if (partnerLocalId) {
                        const currentLocalId = templateIdToLocalId[currentTemplateId];

                        // Salva no banco
                        await updateLocalExercise(currentLocalId, { superset_with: partnerLocalId });
                        await updateLocalExercise(partnerLocalId, { superset_with: currentLocalId });

                        // Atualiza no estado
                        const currentExIdx = initialExercises.findIndex(ex => ex.localId === currentLocalId);
                        const partnerExIdx = initialExercises.findIndex(ex => ex.localId === partnerLocalId);

                        if (currentExIdx !== -1) {
                            initialExercises[currentExIdx].supersetWith = partnerLocalId;
                        }
                        if (partnerExIdx !== -1) {
                            initialExercises[partnerExIdx].supersetWith = currentLocalId;
                        }

                        console.log(`[WorkoutContext] Created superset: ${currentTemplateId} <-> ${partnerTemplateId}`);
                    }
                }
            }

            // 6. Atualiza estado
            setWorkoutId(localWorkoutId);
            setWorkoutName(workoutNameStr);
            setExercises(initialExercises);
            setDuration(0);
            startedAtRef.current = Date.now();
            setIsActive(true);
            setIsMinimized(false);

            // Haptic: sucesso!
            if (CoreHaptics.isSupported()) {
                CoreHaptics.patterns.success();
            }

            console.log(`[WorkoutContext] Started workout #${localWorkoutId} (local-first)`);

        } catch (error) {
            console.error('[WorkoutContext] Error starting workout:', error);
        } finally {
            isCreatingWorkoutRef.current = false;
            setIsLoading(false);
        }
    };

    // Wrapper estável para startWorkout
    const startWorkout = useCallback(async (template?: any) => {
        await startWorkoutInternal(template);
    }, []);

    // ==================== MINIMIZE/MAXIMIZE ====================

    const minimizeWorkout = useCallback(() => setIsMinimized(true), []);
    const maximizeWorkout = useCallback(() => setIsMinimized(false), []);
    const getStartedAt = useCallback(() => startedAtRef.current, []);
    const updateWorkoutName = useCallback((name: string) => {
        setWorkoutName(name);
        if (workoutIdRef.current) {
            updateLocalWorkout(workoutIdRef.current, { name }).catch(err =>
                console.error('[WorkoutContext] Error updating workout name:', err)
            );
        }
    }, []);

    // ==================== FINISH WORKOUT ====================

    const finishWorkoutInternal = async () => {
        const currentWorkoutId = workoutIdRef.current;
        const currentExercises = exercisesRef.current;

        if (!currentWorkoutId) return;

        try {
            const now = new Date().toISOString();

            // 1. Atualiza workout LOCAL
            await updateLocalWorkout(currentWorkoutId, {
                finished_at: now,
                duration_seconds: duration,
            });

            // 2. Atualiza todas as séries LOCAL (try/catch individual para não crashar se set foi deletado)
            for (const exercise of currentExercises) {
                for (const set of exercise.sets) {
                    try {
                        await updateLocalSet(set.localId, {
                            weight: set.kg ? parseFloat(set.kg) : null,
                            reps: set.reps ? parseInt(set.reps, 10) : null,
                            rir: set.rir ? parseFloat(set.rir) : null,
                            completed: set.completed,
                            set_type: set.type || 'N',
                        });
                    } catch (setError) {
                        console.warn(`[WorkoutContext] Skipping set ${set.localId} (may have been deleted):`, setError);
                    }
                }
            }

            console.log(`[WorkoutContext] Finished workout #${currentWorkoutId}`);

            // 3. Dispara sync
            triggerSync();

        } catch (error) {
            console.error('[WorkoutContext] Error finishing workout:', error);
        }

        // Reset estado
        startedAtRef.current = null;
        setIsActive(false);
        setIsMinimized(false);
        setWorkoutId(null);
        setExercises([]);
    };

    const finishWorkout = useCallback(async () => {
        await finishWorkoutInternal();
    }, [duration]);

    // ==================== CANCEL WORKOUT ====================

    const cancelWorkoutInternal = async () => {
        const currentWorkoutId = workoutIdRef.current;

        if (currentWorkoutId) {
            try {
                await deleteLocalWorkout(currentWorkoutId);
                console.log(`[WorkoutContext] Cancelled workout #${currentWorkoutId}`);
                triggerSync();
            } catch (error) {
                console.error('[WorkoutContext] Error cancelling workout:', error);
            }
        }

        startedAtRef.current = null;
        setIsActive(false);
        setIsMinimized(false);
        setWorkoutId(null);
        setExercises([]);
    };

    const cancelWorkout = useCallback(async () => {
        await cancelWorkoutInternal();
    }, []);

    // ==================== ADD EXERCISE ====================

    const addExercise = useCallback(async (exerciseName: string, numSets: number = 3) => {
        const currentWorkoutId = workoutIdRef.current;
        const currentExercises = exercisesRef.current;

        if (!currentWorkoutId || !userIdRef.current) return;

        try {
            const newOrderIndex = currentExercises.length;

            const localExerciseId = await createLocalExercise({
                workout_id: currentWorkoutId,
                exercise_name: exerciseName,
                order_index: newOrderIndex,
            });

            // Busca PRs locais
            const prsData = await getPRsBatchLocal(userIdRef.current, [exerciseName]);
            const exercisePRs = prsData[exerciseName] || [];

            const sets: WorkoutSet[] = [];
            for (let j = 0; j < numSets; j++) {
                const localSetId = await createLocalSet({
                    exercise_id: localExerciseId,
                    order_index: j,
                    set_type: 'N',
                    weight_type: 'total',
                });

                const setPR = exercisePRs.find(pr => pr.order_index === j);
                let prevStats = '-';
                let prData: WorkoutSet['prData'] = undefined;

                if (setPR) {
                    prevStats = `${setPR.weight}kg x ${setPR.reps}`;
                    prData = {
                        weight: setPR.weight,
                        reps: setPR.reps,
                        rir: setPR.rir,
                    };
                }

                sets.push({
                    id: `set-${localSetId}`,
                    localId: localSetId,
                    kg: '',
                    reps: '',
                    rir: '',
                    completed: false,
                    type: 'N' as SetType,
                    prev: prevStats,
                    prData,
                });
            }

            const newExercise: WorkoutExercise = {
                id: `ex-${localExerciseId}`,
                localId: localExerciseId,
                name: exerciseName,
                sets,
            };

            setExercises(prev => [...prev, newExercise]);

            console.log(`[WorkoutContext] Added exercise: ${exerciseName}`);

        } catch (error) {
            console.error('[WorkoutContext] Error adding exercise:', error);
        }
    }, []);

    // ==================== ADD SET ====================

    const addSet = useCallback(async (exerciseId: string) => {
        const currentExercises = exercisesRef.current;
        const exercise = currentExercises.find(ex => ex.id === exerciseId);
        if (!exercise || !userIdRef.current) return;

        try {
            const lastSet = exercise.sets[exercise.sets.length - 1];
            const newOrderIndex = exercise.sets.length;

            const localSetId = await createLocalSet({
                exercise_id: exercise.localId,
                order_index: newOrderIndex,
                set_type: 'N',
                weight_type: 'total',
            });

            // Busca PRs para este exercício e pega o do índice correto
            const prsData = await getPRsBatchLocal(userIdRef.current, [exercise.name]);
            const exercisePRs = prsData[exercise.name] || [];
            const setPR = exercisePRs.find(pr => pr.order_index === newOrderIndex);

            let prevStats = '-';
            let prData: WorkoutSet['prData'] = undefined;

            if (setPR) {
                prevStats = `${setPR.weight}kg x ${setPR.reps}`;
                prData = {
                    weight: setPR.weight,
                    reps: setPR.reps,
                    rir: setPR.rir,
                };
            }

            const newSet: WorkoutSet = {
                id: `set-${localSetId}`,
                localId: localSetId,
                kg: lastSet?.kg || '',
                reps: lastSet?.reps || '',
                rir: '',
                completed: false,
                type: 'N' as SetType,
                prev: prevStats,
                prData,
            };

            setExercises(prev => prev.map(ex => {
                if (ex.id !== exerciseId) return ex;
                return { ...ex, sets: [...ex.sets, newSet] };
            }));

        } catch (error) {
            console.error('[WorkoutContext] Error adding set:', error);
        }
    }, []);

    // ==================== UPDATE SET (instantâneo, sync depois) ====================

    // Debounce para atualização do DB (evita muitas escritas por tecla)
    const dbUpdateTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Ref para armazenar dados do set para o debounce (evita render desnecessário)
    const pendingUpdates = useRef<Map<string, { localId: number; field: string; value: string }>>(new Map());

    // OTIMIZADO: updateSet agora usa índices para evitar iteração completa
    const updateSet = useCallback((exerciseId: string, setId: string, field: 'kg' | 'reps' | 'rir', value: string) => {
        // 1. Atualiza estado INSTANTANEAMENTE (UI responsiva)
        // OTIMIZAÇÃO: Encontra índices primeiro, depois atualiza apenas o necessário
        setExercises(prev => {
            const exIndex = prev.findIndex(ex => ex.id === exerciseId);
            if (exIndex === -1) return prev;

            const exercise = prev[exIndex];
            const setIndex = exercise.sets.findIndex(s => s.id === setId);
            if (setIndex === -1) return prev;

            const set = exercise.sets[setIndex];

            // Guarda localId para o debounce
            pendingUpdates.current.set(`${setId}-${field}`, {
                localId: set.localId,
                field,
                value,
            });

            // Auto-marca como Falha (F) quando RIR é 0
            let newType = set.type;
            if (field === 'rir' && value === '0' && set.type !== 'F') {
                newType = 'F' as SetType;
                updateLocalSet(set.localId, { set_type: 'F' }).catch(console.error);
            }

            // Cria novo array apenas para o exercício modificado
            const newSets = [...exercise.sets];
            newSets[setIndex] = { ...set, [field]: value, type: newType };

            const newExercises = [...prev];
            newExercises[exIndex] = { ...exercise, sets: newSets };

            return newExercises;
        });

        // 2. Debounce a escrita no DB (300ms após última tecla)
        const timerKey = `${setId}-${field}`;
        const existingTimer = dbUpdateTimers.current.get(timerKey);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
            // Usa o ref para pegar os dados (não causa re-render)
            const pendingData = pendingUpdates.current.get(timerKey);
            if (pendingData) {
                const updateData: any = {};
                if (pendingData.field === 'kg') updateData.weight = pendingData.value ? parseFloat(pendingData.value) : null;
                if (pendingData.field === 'reps') updateData.reps = pendingData.value ? parseInt(pendingData.value, 10) : null;
                if (pendingData.field === 'rir') updateData.rir = pendingData.value ? parseFloat(pendingData.value) : null;
                updateLocalSet(pendingData.localId, updateData).catch(console.error);
                pendingUpdates.current.delete(timerKey);
            }
            dbUpdateTimers.current.delete(timerKey);
        }, 300);

        dbUpdateTimers.current.set(timerKey, timer);
    }, []);

    // ==================== TOGGLE SET ====================
    // OTIMIZADO: Usa índices para evitar iteração completa

    const toggleSet = useCallback((exerciseId: string, setId: string) => {
        setExercises(prev => {
            const exIndex = prev.findIndex(ex => ex.id === exerciseId);
            if (exIndex === -1) return prev;

            const exercise = prev[exIndex];
            const setIndex = exercise.sets.findIndex(s => s.id === setId);
            if (setIndex === -1) return prev;

            const set = exercise.sets[setIndex];
            const newCompleted = !set.completed;
            updateLocalSet(set.localId, { completed: newCompleted }).catch(console.error);

            const newSets = [...exercise.sets];
            newSets[setIndex] = { ...set, completed: newCompleted };

            const newExercises = [...prev];
            newExercises[exIndex] = { ...exercise, sets: newSets };

            return newExercises;
        });
    }, []);

    // ==================== CHANGE SET TYPE ====================
    // OTIMIZADO: Usa índices para evitar iteração completa

    const changeSetType = useCallback((exerciseId: string, setId: string, type: SetType) => {
        setExercises(prev => {
            const exIndex = prev.findIndex(ex => ex.id === exerciseId);
            if (exIndex === -1) return prev;

            const exercise = prev[exIndex];
            const setIndex = exercise.sets.findIndex(s => s.id === setId);
            if (setIndex === -1) return prev;

            const set = exercise.sets[setIndex];
            updateLocalSet(set.localId, { set_type: type }).catch(console.error);

            const newSets = [...exercise.sets];
            newSets[setIndex] = { ...set, type };

            const newExercises = [...prev];
            newExercises[exIndex] = { ...exercise, sets: newSets };

            return newExercises;
        });
    }, []);

    // ==================== FILL FROM PR ====================
    // OTIMIZADO: Usa índices para evitar iteração completa

    const fillFromPR = useCallback((exerciseId: string, setId: string) => {
        setExercises(prev => {
            const exIndex = prev.findIndex(ex => ex.id === exerciseId);
            if (exIndex === -1) return prev;

            const exercise = prev[exIndex];
            const setIndex = exercise.sets.findIndex(s => s.id === setId);
            if (setIndex === -1) return prev;

            const set = exercise.sets[setIndex];
            if (!set.prData) return prev;

            const newKg = String(set.prData.weight);
            const newReps = String(set.prData.reps);
            const newRir = set.prData.rir !== null ? String(set.prData.rir) : '';

            // Atualiza DB
            updateLocalSet(set.localId, {
                weight: set.prData.weight,
                reps: set.prData.reps,
                rir: set.prData.rir,
            }).catch(console.error);

            const newSets = [...exercise.sets];
            newSets[setIndex] = {
                ...set,
                kg: newKg,
                reps: newReps,
                rir: newRir,
            };

            const newExercises = [...prev];
            newExercises[exIndex] = { ...exercise, sets: newSets };

            return newExercises;
        });
    }, []);

    // ==================== REPLACE EXERCISE ====================

    const replaceExercise = useCallback(async (exerciseId: string, newExerciseName: string) => {
        const currentExercises = exercisesRef.current;
        const exercise = currentExercises.find(ex => ex.id === exerciseId);
        if (!exercise || !userIdRef.current) return;

        try {
            await updateLocalExercise(exercise.localId, { exercise_name: newExerciseName });

            // Busca novos PRs
            const prsData = await getPRsBatchLocal(userIdRef.current, [newExerciseName]);
            const exercisePRs = prsData[newExerciseName] || [];

            setExercises(prev => prev.map(ex => {
                if (ex.id !== exerciseId) return ex;
                return {
                    ...ex,
                    name: newExerciseName,
                    sets: ex.sets.map((s, idx) => {
                        const setPR = exercisePRs.find(pr => pr.order_index === idx);
                        let prevStats = '-';
                        let prData: WorkoutSet['prData'] = undefined;

                        if (setPR) {
                            prevStats = `${setPR.weight}kg x ${setPR.reps}`;
                            prData = {
                                weight: setPR.weight,
                                reps: setPR.reps,
                                rir: setPR.rir,
                            };
                        }

                        return {
                            ...s,
                            prev: prevStats,
                            prData,
                            kg: '',
                            reps: '',
                            rir: '',
                            completed: false,
                        };
                    })
                };
            }));

            console.log(`[WorkoutContext] Replaced exercise to: ${newExerciseName}`);

        } catch (error) {
            console.error('[WorkoutContext] Error replacing exercise:', error);
        }
    }, []);

    // ==================== REMOVE EXERCISE ====================

    const removeExercise = useCallback(async (exerciseId: string) => {
        const currentExercises = exercisesRef.current;
        const exercise = currentExercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        try {
            await deleteLocalExercise(exercise.localId);

            // Atualiza ref IMEDIATAMENTE para evitar race condition com finishWorkout
            exercisesRef.current = exercisesRef.current.filter(ex => ex.id !== exerciseId);

            setExercises(prev => prev.filter(ex => ex.id !== exerciseId));

            console.log(`[WorkoutContext] Removed exercise: ${exercise.name}`);

        } catch (error) {
            console.error('[WorkoutContext] Error removing exercise:', error);
        }
    }, []);

    // ==================== REMOVE SET ====================

    const removeSet = useCallback(async (exerciseId: string, setId: string) => {
        const currentExercises = exercisesRef.current;
        const exercise = currentExercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        const set = exercise.sets.find(s => s.id === setId);
        if (!set) return;

        try {
            await deleteLocalSet(set.localId);

            // Atualiza ref IMEDIATAMENTE para evitar race condition com finishWorkout
            exercisesRef.current = exercisesRef.current.map(ex => {
                if (ex.id !== exerciseId) return ex;
                return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
            });

            setExercises(prev => prev.map(ex => {
                if (ex.id !== exerciseId) return ex;
                return {
                    ...ex,
                    sets: ex.sets.filter(s => s.id !== setId)
                };
            }));

            console.log(`[WorkoutContext] Removed set from: ${exercise.name}`);

        } catch (error) {
            console.error('[WorkoutContext] Error removing set:', error);
        }
    }, []);

    // ==================== TOGGLE SUPERSET ====================

    const toggleSuperset = useCallback((exerciseId: string) => {
        const currentExercises = exercisesRef.current;
        const exerciseIndex = currentExercises.findIndex(ex => ex.id === exerciseId);
        if (exerciseIndex === -1) return;

        const currentExercise = currentExercises[exerciseIndex];
        const nextExercise = currentExercises[exerciseIndex + 1];

        // Se não tem próximo exercício, não pode criar superset
        if (!nextExercise) {
            console.log('[WorkoutContext] No next exercise to create superset');
            return;
        }

        // Se já tem superset com o próximo, remove o link
        if (currentExercise.supersetWith === nextExercise.localId) {
            console.log(`[WorkoutContext] Removing superset: ${currentExercise.name} <-> ${nextExercise.name}`);

            // Remove link do exercício atual
            updateLocalExercise(currentExercise.localId, { superset_with: null }).catch(console.error);
            // Remove link do próximo exercício
            updateLocalExercise(nextExercise.localId, { superset_with: null }).catch(console.error);

            setExercises(prev => prev.map(ex => {
                if (ex.id === exerciseId || ex.id === nextExercise.id) {
                    return { ...ex, supersetWith: undefined };
                }
                return ex;
            }));
        } else {
            // Cria novo superset
            console.log(`[WorkoutContext] Creating superset: ${currentExercise.name} <-> ${nextExercise.name}`);

            // Liga os dois exercícios
            updateLocalExercise(currentExercise.localId, { superset_with: nextExercise.localId }).catch(console.error);
            updateLocalExercise(nextExercise.localId, { superset_with: currentExercise.localId }).catch(console.error);

            setExercises(prev => prev.map(ex => {
                if (ex.id === exerciseId) {
                    return { ...ex, supersetWith: nextExercise.localId };
                }
                if (ex.id === nextExercise.id) {
                    return { ...ex, supersetWith: currentExercise.localId };
                }
                return ex;
            }));
        }
    }, []);

    // ==================== MEMOIZED CONTEXT VALUES ====================

    // Timer context - only duration and startedAt (updates every second)
    const timerValue = useMemo(() => ({
        duration,
        startedAt: startedAtRef.current,
    }), [duration]);

    // Meta context - workout metadata WITHOUT exercises (does NOT update on keystrokes)
    const metaValue = useMemo(() => ({
        isActive,
        isMinimized,
        isLoading,
        workoutName,
        workoutId,
        showActiveModal,
        pendingTemplate,
    }), [isActive, isMinimized, isLoading, workoutName, workoutId, showActiveModal, pendingTemplate]);

    // Exercises context - ONLY exercises array (updates on set changes)
    const exercisesValue = useMemo(() => ({
        exercises,
    }), [exercises]);

    // Legacy state context - combines meta + exercises (for backwards compatibility)
    const stateValue = useMemo(() => ({
        ...metaValue,
        exercises,
    }), [metaValue, exercises]);

    // Actions context - stable functions (never updates)
    const actionsValue = useMemo(() => ({
        requestStartWorkout,
        confirmStartNew,
        resumeWorkout,
        dismissModal,
        startWorkout,
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
        getStartedAt,
        updateWorkoutName,
    }), [
        requestStartWorkout,
        confirmStartNew,
        resumeWorkout,
        dismissModal,
        startWorkout,
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
        getStartedAt,
        updateWorkoutName,
    ]);

    // Legacy combined value for backwards compatibility
    const legacyValue = useMemo(() => ({
        ...timerValue,
        ...stateValue,
        ...actionsValue,
    }), [timerValue, stateValue, actionsValue]);

    // ==================== RENDER WITH NESTED PROVIDERS ====================

    return (
        <WorkoutActionsContext.Provider value={actionsValue}>
            <WorkoutExercisesContext.Provider value={exercisesValue}>
                <WorkoutMetaContext.Provider value={metaValue}>
                    <WorkoutStateContext.Provider value={stateValue}>
                        <WorkoutTimerContext.Provider value={timerValue}>
                            <WorkoutContext.Provider value={legacyValue}>
                                {children}
                            </WorkoutContext.Provider>
                        </WorkoutTimerContext.Provider>
                    </WorkoutStateContext.Provider>
                </WorkoutMetaContext.Provider>
            </WorkoutExercisesContext.Provider>
        </WorkoutActionsContext.Provider>
    );
};

// ==================== HOOKS ====================

// Legacy hook - returns everything (causes re-renders on timer updates)
export const useWorkout = () => useContext(WorkoutContext);

// New optimized hooks - use these for better performance!

// Only subscribes to timer updates (duration) - use in components that show the timer
export const useWorkoutTimer = () => useContext(WorkoutTimerContext);

// Only subscribes to metadata (isActive, isMinimized, workoutName, etc.) - does NOT re-render on exercise/set changes
export const useWorkoutMeta = () => useContext(WorkoutMetaContext);

// Only subscribes to exercises array - re-renders only when exercises change
export const useWorkoutExercises = () => useContext(WorkoutExercisesContext);

// Legacy: subscribes to state updates (exercises + meta combined) - use useWorkoutMeta() or useWorkoutExercises() instead
export const useWorkoutState = () => useContext(WorkoutStateContext);

// Only subscribes to actions (never re-renders) - use when you only need functions
export const useWorkoutActions = () => useContext(WorkoutActionsContext);
