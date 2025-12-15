import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SetType } from '../components/SetTypeModal';
import {
    createExercise,
    createSet,
    finishWorkoutBatch,
    deleteWorkout,
    getLastPerformance,
    createWorkoutBatch,
    getLastPerformanceBatch,
    getPRsBatch,
    SetPR,
    FinishSetData,
} from '../api';

// Helper para pegar data/hora local (não UTC)
const getLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return {
        date: `${year}-${month}-${day}`,
        datetime: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`,
    };
};

interface WorkoutSet {
    id: string;
    dbId?: number;          // ID no banco de dados
    kg: string;
    reps: string;
    rir: string;
    completed: boolean;
    type: SetType;
    prev: string;
    prData?: {              // PR data para esta série
        weight: number;
        reps: number;
        rir: number | null;
    };
    targetReps?: string;    // Reps do plano (placeholder)
    targetRir?: string;     // RIR do plano (placeholder)
    notes?: string;
}

interface WorkoutExercise {
    id: string;
    dbId?: number;          // ID no banco de dados
    name: string;
    sets: WorkoutSet[];
    notes?: string;
}

interface WorkoutContextData {
    isActive: boolean;
    isMinimized: boolean;
    workoutName: string;
    workoutId: number | null;  // ID do treino no banco
    duration: number;
    exercises: WorkoutExercise[];
    // Modal de treino ativo
    showActiveModal: boolean;
    pendingTemplate: any | null;
    requestStartWorkout: (template?: any) => void;  // Mostra modal se treino ativo
    confirmStartNew: () => Promise<void>;           // Cancela atual e inicia novo
    resumeWorkout: () => void;                      // Retoma treino atual
    dismissModal: () => void;                       // Fecha modal
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
}

const WorkoutContext = createContext<WorkoutContextData>({} as WorkoutContextData);

// Converte SetType da UI para o banco
function mapSetTypeToDb(type: SetType): string {
    return type || 'N';
}

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [isActive, setIsActive] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [workoutName, setWorkoutName] = useState('');
    const [workoutId, setWorkoutId] = useState<number | null>(null);
    const [duration, setDuration] = useState(0);
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

    // Estado do modal de treino ativo
    const [showActiveModal, setShowActiveModal] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState<any | null>(null);

    // Referência para debounce de updates
    const updateTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Timestamp de quando o treino começou (para calcular duração real)
    const startedAtRef = useRef<number | null>(null);

    // Flag para evitar criar treino duplicado enquanto um está sendo criado
    const isCreatingWorkoutRef = useRef(false);

    // Atualiza duration baseado no timestamp real (funciona mesmo em background)
    const updateDuration = useCallback(() => {
        if (startedAtRef.current) {
            const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
            setDuration(elapsed);
        }
    }, []);

    // Timer que atualiza a UI a cada segundo
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            // Atualiza imediatamente ao ativar
            updateDuration();
            timer = setInterval(updateDuration, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive, updateDuration]);

    // Recalcula duração quando o app volta do background
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && isActive) {
                // App voltou ao foco - recalcula duração baseado no timestamp
                updateDuration();
            }
        });

        return () => subscription.remove();
    }, [isActive, updateDuration]);

    // Busca última performance do exercício no banco
    const getLastStats = async (exerciseName: string): Promise<string> => {
        try {
            const lastPerf = await getLastPerformance(exerciseName);
            if (lastPerf) {
                const weightStr = lastPerf.weight_type === 'per_side'
                    ? `${lastPerf.weight}x2`
                    : `${lastPerf.weight}`;
                return `${weightStr}kg x ${lastPerf.reps}`;
            }
        } catch (error) {
            console.error('[WorkoutContext] Error getting last stats:', error);
        }
        return '-';
    };

    // Função que UI chama - mostra modal se treino ativo
    const requestStartWorkout = (template?: any) => {
        if (isActive) {
            // Treino já ativo - mostra modal
            setPendingTemplate(template || null);
            setShowActiveModal(true);
        } else {
            // Nenhum treino ativo - inicia direto
            startWorkout(template);
        }
    };

    // Cancela treino atual e inicia novo
    const confirmStartNew = async () => {
        setShowActiveModal(false);
        await cancelWorkout();
        await startWorkout(pendingTemplate);
        setPendingTemplate(null);
    };

    // Retoma treino atual (abre bottom sheet)
    const resumeWorkout = () => {
        setShowActiveModal(false);
        setPendingTemplate(null);
        maximizeWorkout();
    };

    // Fecha modal sem ação
    const dismissModal = () => {
        setShowActiveModal(false);
        setPendingTemplate(null);
    };

    const startWorkout = async (template?: any) => {
        // Impede múltiplos cliques enquanto está criando
        if (isCreatingWorkoutRef.current) {
            console.log('[WorkoutContext] Already creating workout, ignoring');
            return;
        }

        isCreatingWorkoutRef.current = true;

        try {
            const { date, datetime } = getLocalDateTime();
            const workoutNameStr = template?.nome || 'Quick Workout';

            // Prepara exercícios para batch (inclui reps e rir do template)
            const exercisesData = template?.exercicios?.map((ex: any) => ({
                templateId: ex.id,
                name: ex.nome,
                numSets: typeof ex.series === 'number' ? ex.series : 3,
                targetReps: ex.reps,   // ex: "6-8" ou "10-12"
                targetRir: ex.rir,     // ex: 1 ou 0
            })) || [];

            // 1. Cria tudo de uma vez (1 chamada HTTP!)
            const batchResult = await createWorkoutBatch({
                date,
                name: workoutNameStr,
                template_id: template?.id,
                started_at: datetime,
                exercises: exercisesData,
            });

            // 2. Busca PRs por série de todos exercícios (1 chamada HTTP!)
            const exerciseNames = exercisesData.map((e: any) => e.name);
            const prsData = exerciseNames.length > 0
                ? await getPRsBatch(exerciseNames)
                : {};

            // 3. Monta estado local
            const initialExercises: WorkoutExercise[] = batchResult.exercises.map((dbEx) => {
                const exercisePRs = prsData[dbEx.name] || [];

                // Busca dados do template para este exercício
                const templateEx = exercisesData.find((e: any) => e.templateId === dbEx.templateId);
                const targetReps = templateEx?.targetReps?.toString() || '';
                const targetRir = templateEx?.targetRir !== undefined ? templateEx.targetRir.toString() : '';

                const sets: WorkoutSet[] = dbEx.sets.map((dbSet, setIndex) => {
                    // Busca PR específico para esta posição de série
                    const setPR = exercisePRs.find(pr => pr.order_index === setIndex);

                    // Formata prev para exibição (mantém compatibilidade)
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
                        id: Math.random().toString(),
                        dbId: dbSet.dbId,
                        kg: '',
                        reps: '',
                        rir: '',
                        completed: false,
                        type: 'N' as SetType,
                        prev: prevStats,
                        prData,
                        targetReps,
                        targetRir,
                    };
                });

                return {
                    id: dbEx.templateId,
                    dbId: dbEx.dbId,
                    name: dbEx.name,
                    sets,
                };
            });

            setWorkoutId(batchResult.workoutId);
            setWorkoutName(workoutNameStr);
            setExercises(initialExercises);
            setDuration(0);
            startedAtRef.current = Date.now();
            setIsActive(true);
            setIsMinimized(false);

            console.log(`[WorkoutContext] Started workout #${batchResult.workoutId} (batch)`);
        } catch (error) {
            console.error('[WorkoutContext] Error starting workout:', error);
        } finally {
            isCreatingWorkoutRef.current = false;
        }
    };

    const minimizeWorkout = () => setIsMinimized(true);
    const maximizeWorkout = () => setIsMinimized(false);

    const finishWorkout = async () => {
        if (workoutId) {
            try {
                // Coleta todos os dados das séries para enviar em batch
                const allSets: FinishSetData[] = [];

                for (const exercise of exercises) {
                    for (const set of exercise.sets) {
                        if (set.dbId) {
                            allSets.push({
                                id: set.dbId,
                                weight: set.kg ? parseFloat(set.kg) : null,
                                reps: set.reps ? parseInt(set.reps, 10) : null,
                                rir: set.rir ? parseFloat(set.rir) : null,
                                completed: set.completed,
                                set_type: set.type || 'N',
                            });
                        }
                    }
                }

                // Envia tudo de uma vez
                await finishWorkoutBatch(workoutId, duration, allSets);
                console.log(`[WorkoutContext] Finished workout #${workoutId} with ${allSets.length} sets`);
            } catch (error) {
                console.error('[WorkoutContext] Error finishing workout:', error);
            }
        }

        startedAtRef.current = null; // Limpa timestamp
        setIsActive(false);
        setIsMinimized(false);
        setWorkoutId(null);
        setExercises([]); // Limpa exercícios ao finalizar
    };

    const cancelWorkout = async () => {
        if (workoutId) {
            try {
                await deleteWorkout(workoutId);
                console.log(`[WorkoutContext] Cancelled workout #${workoutId}`);
            } catch (error) {
                console.error('[WorkoutContext] Error cancelling workout:', error);
            }
        }

        startedAtRef.current = null; // Limpa timestamp
        setIsActive(false);
        setIsMinimized(false);
        setWorkoutId(null);
        setExercises([]); // Limpa exercícios ao cancelar
    };

    const addExercise = async (exerciseName: string, numSets: number = 3) => {
        if (!workoutId) return;

        try {
            const newOrderIndex = exercises.length;

            // Cria exercício no banco
            const exerciseDbId = await createExercise({
                workout_id: workoutId,
                exercise_name: exerciseName,
                order_index: newOrderIndex,
            });

            // Busca última performance
            const prevStats = await getLastStats(exerciseName);

            // Cria as séries
            const sets: WorkoutSet[] = [];
            for (let j = 0; j < numSets; j++) {
                const setDbId = await createSet({
                    exercise_id: exerciseDbId,
                    order_index: j,
                    set_type: 'N',
                    weight_type: 'total',
                    completed: false,
                });

                sets.push({
                    id: Math.random().toString(),
                    dbId: setDbId,
                    kg: '',
                    reps: '',
                    rir: '',
                    completed: false,
                    type: 'N' as SetType,
                    prev: prevStats,
                });
            }

            const newExercise: WorkoutExercise = {
                id: Math.random().toString(),
                dbId: exerciseDbId,
                name: exerciseName,
                sets,
            };

            setExercises(prev => [...prev, newExercise]);
            console.log(`[WorkoutContext] Added exercise: ${exerciseName}`);
        } catch (error) {
            console.error('[WorkoutContext] Error adding exercise:', error);
        }
    };

    const addSet = async (exerciseId: string) => {
        const exercise = exercises.find(ex => ex.id === exerciseId);
        if (!exercise || !exercise.dbId) return;

        try {
            const lastSet = exercise.sets[exercise.sets.length - 1];
            const newOrderIndex = exercise.sets.length;

            const setDbId = await createSet({
                exercise_id: exercise.dbId,
                order_index: newOrderIndex,
                set_type: 'N',
                weight_type: 'total',
                completed: false,
            });

            const newSet: WorkoutSet = {
                id: Math.random().toString(),
                dbId: setDbId,
                kg: lastSet ? lastSet.kg : '',
                reps: lastSet ? lastSet.reps : '',
                rir: '',
                completed: false,
                type: 'N' as SetType,
                prev: '-',
            };

            setExercises(prev => prev.map(ex => {
                if (ex.id !== exerciseId) return ex;
                return { ...ex, sets: [...ex.sets, newSet] };
            }));
        } catch (error) {
            console.error('[WorkoutContext] Error adding set:', error);
        }
    };

    // Atualiza estado local apenas - salva no servidor ao finalizar treino
    const updateSet = useCallback((exerciseId: string, setId: string, field: 'kg' | 'reps' | 'rir', value: string) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
            };
        }));
    }, []);

    // Apenas estado local - sem request
    const toggleSet = useCallback((exerciseId: string, setId: string) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => {
                    if (s.id !== setId) return s;
                    return { ...s, completed: !s.completed };
                })
            };
        }));
    }, []);

    // Apenas estado local - sem request
    const changeSetType = useCallback((exerciseId: string, setId: string, type: SetType) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => {
                    if (s.id !== setId) return s;
                    return { ...s, type };
                })
            };
        }));
    }, []);

    // Preenche campos com dados do PR (clicou no "Anterior")
    const fillFromPR = useCallback((exerciseId: string, setId: string) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => {
                    if (s.id !== setId || !s.prData) return s;
                    return {
                        ...s,
                        kg: String(s.prData.weight),
                        reps: String(s.prData.reps),
                        rir: s.prData.rir !== null ? String(s.prData.rir) : '',
                    };
                })
            };
        }));
    }, []);

    return (
        <WorkoutContext.Provider value={{
            isActive,
            isMinimized,
            workoutName,
            workoutId,
            duration,
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
            fillFromPR
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkout = () => useContext(WorkoutContext);
