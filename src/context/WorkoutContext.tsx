import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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

interface WorkoutContextData {
    isActive: boolean;
    isMinimized: boolean;
    isLoading: boolean;   // Para skeleton
    workoutName: string;
    workoutId: number | null;  // ID local do treino
    duration: number;
    startedAt: number | null;
    exercises: WorkoutExercise[];
    // Modal de treino ativo
    showActiveModal: boolean;
    pendingTemplate: any | null;
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
}

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

    const requestStartWorkout = (template?: any) => {
        if (isActive) {
            setPendingTemplate(template || null);
            setShowActiveModal(true);
        } else {
            startWorkout(template);
        }
    };

    const confirmStartNew = async () => {
        setShowActiveModal(false);
        await cancelWorkout();
        await startWorkout(pendingTemplate);
        setPendingTemplate(null);
    };

    const resumeWorkout = () => {
        setShowActiveModal(false);
        setPendingTemplate(null);
        maximizeWorkout();
    };

    const dismissModal = () => {
        setShowActiveModal(false);
        setPendingTemplate(null);
    };

    // ==================== START WORKOUT (LOCAL-FIRST) ====================

    const startWorkout = async (template?: any) => {
        if (isCreatingWorkoutRef.current) {
            console.log('[WorkoutContext] Already creating workout, ignoring');
            return;
        }

        if (!userIdRef.current) {
            console.error('[WorkoutContext] No user ID');
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

    // ==================== MINIMIZE/MAXIMIZE ====================

    const minimizeWorkout = () => setIsMinimized(true);
    const maximizeWorkout = () => setIsMinimized(false);

    // ==================== FINISH WORKOUT ====================

    const finishWorkout = async () => {
        if (!workoutId) return;

        try {
            const now = new Date().toISOString();

            // 1. Atualiza workout LOCAL
            await updateLocalWorkout(workoutId, {
                finished_at: now,
                duration_seconds: duration,
            });

            // 2. Atualiza todas as séries LOCAL
            for (const exercise of exercises) {
                for (const set of exercise.sets) {
                    await updateLocalSet(set.localId, {
                        weight: set.kg ? parseFloat(set.kg) : null,
                        reps: set.reps ? parseInt(set.reps, 10) : null,
                        rir: set.rir ? parseFloat(set.rir) : null,
                        completed: set.completed,
                        set_type: set.type || 'N',
                    });
                }
            }

            console.log(`[WorkoutContext] Finished workout #${workoutId}`);

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

    // ==================== CANCEL WORKOUT ====================

    const cancelWorkout = async () => {
        if (workoutId) {
            try {
                await deleteLocalWorkout(workoutId);
                console.log(`[WorkoutContext] Cancelled workout #${workoutId}`);
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

    // ==================== ADD EXERCISE ====================

    const addExercise = async (exerciseName: string, numSets: number = 3) => {
        if (!workoutId || !userIdRef.current) return;

        try {
            const newOrderIndex = exercises.length;

            const localExerciseId = await createLocalExercise({
                workout_id: workoutId,
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
    };

    // ==================== ADD SET ====================

    const addSet = async (exerciseId: string) => {
        const exercise = exercises.find(ex => ex.id === exerciseId);
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
    };

    // ==================== UPDATE SET (instantâneo, sync depois) ====================

    // Debounce para atualização do DB (evita muitas escritas por tecla)
    const dbUpdateTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

    const updateSet = useCallback((exerciseId: string, setId: string, field: 'kg' | 'reps' | 'rir', value: string) => {
        // 1. Atualiza estado INSTANTANEAMENTE (UI responsiva)
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => {
                    if (s.id !== setId) return s;
                    return { ...s, [field]: value };
                })
            };
        }));

        // 2. Debounce a escrita no DB (300ms após última tecla)
        const timerKey = `${setId}-${field}`;
        const existingTimer = dbUpdateTimers.current.get(timerKey);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
            // Busca o set atual para pegar localId
            setExercises(current => {
                const exercise = current.find(ex => ex.id === exerciseId);
                const set = exercise?.sets.find(s => s.id === setId);
                if (set) {
                    const updateData: any = {};
                    if (field === 'kg') updateData.weight = value ? parseFloat(value) : null;
                    if (field === 'reps') updateData.reps = value ? parseInt(value, 10) : null;
                    if (field === 'rir') updateData.rir = value ? parseFloat(value) : null;
                    updateLocalSet(set.localId, updateData).catch(console.error);
                }
                return current; // Não muda o estado, só lê
            });
            dbUpdateTimers.current.delete(timerKey);
        }, 300);

        dbUpdateTimers.current.set(timerKey, timer);
    }, []);

    // ==================== TOGGLE SET ====================

    const toggleSet = useCallback((exerciseId: string, setId: string) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => {
                    if (s.id !== setId) return s;

                    const newCompleted = !s.completed;
                    updateLocalSet(s.localId, { completed: newCompleted }).catch(console.error);

                    return { ...s, completed: newCompleted };
                })
            };
        }));
    }, []);

    // ==================== CHANGE SET TYPE ====================

    const changeSetType = useCallback((exerciseId: string, setId: string, type: SetType) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => {
                    if (s.id !== setId) return s;

                    updateLocalSet(s.localId, { set_type: type }).catch(console.error);

                    return { ...s, type };
                })
            };
        }));
    }, []);

    // ==================== FILL FROM PR ====================

    const fillFromPR = useCallback((exerciseId: string, setId: string) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => {
                    if (s.id !== setId || !s.prData) return s;

                    const newKg = String(s.prData.weight);
                    const newReps = String(s.prData.reps);
                    const newRir = s.prData.rir !== null ? String(s.prData.rir) : '';

                    // Atualiza DB
                    updateLocalSet(s.localId, {
                        weight: s.prData.weight,
                        reps: s.prData.reps,
                        rir: s.prData.rir,
                    }).catch(console.error);

                    return {
                        ...s,
                        kg: newKg,
                        reps: newReps,
                        rir: newRir,
                    };
                })
            };
        }));
    }, []);

    // ==================== REPLACE EXERCISE ====================

    const replaceExercise = async (exerciseId: string, newExerciseName: string) => {
        const exercise = exercises.find(ex => ex.id === exerciseId);
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
    };

    // ==================== REMOVE EXERCISE ====================

    const removeExercise = async (exerciseId: string) => {
        const exercise = exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        try {
            await deleteLocalExercise(exercise.localId);
            setExercises(prev => prev.filter(ex => ex.id !== exerciseId));

            console.log(`[WorkoutContext] Removed exercise: ${exercise.name}`);

        } catch (error) {
            console.error('[WorkoutContext] Error removing exercise:', error);
        }
    };

    // ==================== REMOVE SET ====================

    const removeSet = async (exerciseId: string, setId: string) => {
        const exercise = exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        const set = exercise.sets.find(s => s.id === setId);
        if (!set) return;

        try {
            await deleteLocalSet(set.localId);

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
    };

    // ==================== TOGGLE SUPERSET ====================

    const toggleSuperset = useCallback((exerciseId: string) => {
        const exerciseIndex = exercises.findIndex(ex => ex.id === exerciseId);
        if (exerciseIndex === -1) return;

        const currentExercise = exercises[exerciseIndex];
        const nextExercise = exercises[exerciseIndex + 1];

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
    }, [exercises]);

    // ==================== CONTEXT VALUE ====================

    return (
        <WorkoutContext.Provider value={{
            isActive,
            isMinimized,
            isLoading,
            workoutName,
            workoutId,
            duration,
            startedAt: startedAtRef.current,
            exercises,
            // Modal
            showActiveModal,
            pendingTemplate,
            requestStartWorkout,
            confirmStartNew,
            resumeWorkout,
            dismissModal,
            // Workout actions
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
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkout = () => useContext(WorkoutContext);
