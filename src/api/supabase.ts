// API Client usando Supabase
import { supabase } from '../lib/supabase';

// ==================== TYPES ====================

export interface WorkoutRecord {
    id: number;
    user_id: string;
    date: string;
    name: string;
    template_id?: string;
    started_at?: string;
    finished_at?: string;
    duration_seconds?: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface ExerciseRecord {
    id: number;
    workout_id: number;
    exercise_name: string;
    order_index: number;
    notes?: string;
    created_at: string;
}

export interface SetRecord {
    id: number;
    exercise_id: number;
    order_index: number;
    set_type: string;
    weight?: number;
    weight_type: string;
    reps?: number;
    time_seconds?: number;
    rir?: number;
    rpe?: number;
    completed: boolean;
    notes?: string;
    created_at: string;
}

export interface ExerciseWithSets extends ExerciseRecord {
    sets: SetRecord[];
}

export interface FullWorkout {
    workout: WorkoutRecord;
    exercises: ExerciseWithSets[];
}

export interface LastPerformance {
    weight: number;
    reps: number;
    weight_type: string;
}

// ==================== AUTH ====================

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function deleteAccount() {
    // Primeiro deleta todos os dados do usuário (cascade vai cuidar de exercises e sets)
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Deleta workouts do usuário (RLS garante que só deleta os dele)
    const { error: deleteError } = await supabase
        .from('workouts')
        .delete()
        .eq('user_id', user.id);

    if (deleteError) throw deleteError;

    // Faz logout (não podemos deletar o usuário do auth via client SDK)
    await signOut();
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
}

// ==================== WORKOUTS ====================

export async function getAllWorkouts(): Promise<WorkoutRecord[]> {
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('date', { ascending: false })
        .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getFullWorkout(workoutId: number): Promise<FullWorkout | null> {
    // Busca o workout
    const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();

    if (workoutError || !workout) return null;

    // Busca os exercícios
    const { data: exercises, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('workout_id', workoutId)
        .order('order_index');

    if (exercisesError) throw exercisesError;

    // Busca os sets para cada exercício
    const exercisesWithSets: ExerciseWithSets[] = [];
    for (const ex of exercises || []) {
        const { data: sets, error: setsError } = await supabase
            .from('sets')
            .select('*')
            .eq('exercise_id', ex.id)
            .order('order_index');

        if (setsError) throw setsError;
        exercisesWithSets.push({ ...ex, sets: sets || [] });
    }

    return { workout, exercises: exercisesWithSets };
}

export async function createWorkout(data: {
    date: string;
    name: string;
    template_id?: string;
    started_at?: string;
    notes?: string;
}): Promise<number> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data: result, error } = await supabase
        .from('workouts')
        .insert({ ...data, user_id: user.id })
        .select('id')
        .single();

    if (error) throw error;
    return result.id;
}

export async function finishWorkout(workoutId: number, durationSeconds: number): Promise<void> {
    const now = new Date();
    const finished_at = now.toISOString();

    const { error } = await supabase
        .from('workouts')
        .update({
            finished_at,
            duration_seconds: durationSeconds,
            updated_at: finished_at,
        })
        .eq('id', workoutId);

    if (error) throw error;
}

export interface FinishSetData {
    id: number;
    weight: number | null;
    reps: number | null;
    rir: number | null;
    completed: boolean;
    set_type: string;
}

export async function finishWorkoutBatch(
    workoutId: number,
    durationSeconds: number,
    sets: FinishSetData[]
): Promise<void> {
    const now = new Date().toISOString();

    // Atualiza o workout
    const { error: workoutError } = await supabase
        .from('workouts')
        .update({
            finished_at: now,
            duration_seconds: durationSeconds,
            updated_at: now,
        })
        .eq('id', workoutId);

    if (workoutError) throw workoutError;

    // Atualiza todas as séries
    for (const set of sets) {
        const { error: setError } = await supabase
            .from('sets')
            .update({
                weight: set.weight,
                reps: set.reps,
                rir: set.rir,
                completed: set.completed,
                set_type: set.set_type,
            })
            .eq('id', set.id);

        if (setError) throw setError;
    }
}

export async function updateWorkout(
    workoutId: number,
    data: Partial<{
        duration_seconds: number;
        finished_at: string;
        name: string;
        notes: string;
    }>
): Promise<void> {
    const { error } = await supabase
        .from('workouts')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', workoutId);

    if (error) throw error;
}

export async function deleteWorkout(workoutId: number): Promise<void> {
    const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);

    if (error) throw error;
}

// ==================== EXERCISES ====================

export async function getExercisesByWorkout(workoutId: number): Promise<ExerciseRecord[]> {
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('workout_id', workoutId)
        .order('order_index');

    if (error) throw error;
    return data || [];
}

export async function createExercise(data: {
    workout_id: number;
    exercise_name: string;
    order_index: number;
    notes?: string;
}): Promise<number> {
    const { data: result, error } = await supabase
        .from('exercises')
        .insert(data)
        .select('id')
        .single();

    if (error) throw error;
    return result.id;
}

export async function updateExercise(
    exerciseId: number,
    data: Partial<{
        exercise_name: string;
        notes: string;
    }>
): Promise<void> {
    const { error } = await supabase
        .from('exercises')
        .update(data)
        .eq('id', exerciseId);

    if (error) throw error;
}

export async function deleteExercise(exerciseId: number): Promise<void> {
    const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);

    if (error) throw error;
}

// ==================== SETS ====================

export async function createSet(data: {
    exercise_id: number;
    order_index: number;
    set_type?: string;
    weight_type?: string;
    completed?: boolean;
}): Promise<number> {
    const { data: result, error } = await supabase
        .from('sets')
        .insert({
            ...data,
            set_type: data.set_type || 'N',
            weight_type: data.weight_type || 'total',
            completed: data.completed || false,
        })
        .select('id')
        .single();

    if (error) throw error;
    return result.id;
}

export async function updateSet(
    setId: number,
    data: Partial<{
        weight: number | null;
        reps: number | null;
        rir: number | null;
        completed: boolean;
        set_type: string;
    }>
): Promise<void> {
    const { error } = await supabase
        .from('sets')
        .update(data)
        .eq('id', setId);

    if (error) throw error;
}

export async function deleteSet(setId: number): Promise<void> {
    const { error } = await supabase
        .from('sets')
        .delete()
        .eq('id', setId);

    if (error) throw error;
}

// ==================== LAST PERFORMANCE ====================

export async function getLastPerformance(exerciseName: string): Promise<LastPerformance | null> {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('sets')
        .select(`
            weight,
            reps,
            weight_type,
            exercises!inner(exercise_name, workouts!inner(user_id, date, id))
        `)
        .eq('completed', true)
        .not('weight', 'is', null)
        .not('reps', 'is', null)
        .ilike('exercises.exercise_name', exerciseName)
        .eq('exercises.workouts.user_id', user.id)
        .order('exercises.workouts.date', { ascending: false })
        .order('exercises.workouts.id', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) return null;

    return {
        weight: data.weight,
        reps: data.reps,
        weight_type: data.weight_type,
    };
}

export async function getLastPerformanceBatch(exerciseNames: string[]): Promise<Record<string, LastPerformance | null>> {
    const results: Record<string, LastPerformance | null> = {};

    for (const name of exerciseNames) {
        results[name] = await getLastPerformance(name);
    }

    return results;
}

// ==================== BATCH OPERATIONS ====================

export interface BatchExercise {
    templateId: string;
    name: string;
    numSets: number;
}

export interface BatchWorkoutResult {
    workoutId: number;
    exercises: Array<{
        templateId: string;
        name: string;
        dbId: number;
        sets: Array<{ orderIndex: number; dbId: number }>;
    }>;
}

export async function createWorkoutBatch(data: {
    date: string;
    name: string;
    template_id?: string;
    started_at?: string;
    exercises: BatchExercise[];
}): Promise<BatchWorkoutResult> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // 1. Cria o workout
    const { data: workoutResult, error: workoutError } = await supabase
        .from('workouts')
        .insert({
            date: data.date,
            name: data.name,
            template_id: data.template_id,
            started_at: data.started_at,
            user_id: user.id,
        })
        .select('id')
        .single();

    if (workoutError) throw workoutError;
    const workoutId = workoutResult.id;

    // 2. Cria exercícios e séries
    const exercisesWithIds: BatchWorkoutResult['exercises'] = [];

    for (let i = 0; i < data.exercises.length; i++) {
        const ex = data.exercises[i];

        const { data: exerciseResult, error: exerciseError } = await supabase
            .from('exercises')
            .insert({
                workout_id: workoutId,
                exercise_name: ex.name,
                order_index: i,
            })
            .select('id')
            .single();

        if (exerciseError) throw exerciseError;
        const exerciseId = exerciseResult.id;

        // Cria séries para este exercício
        const setsWithIds: Array<{ orderIndex: number; dbId: number }> = [];
        for (let j = 0; j < ex.numSets; j++) {
            const { data: setResult, error: setError } = await supabase
                .from('sets')
                .insert({
                    exercise_id: exerciseId,
                    order_index: j,
                    set_type: 'N',
                    weight_type: 'total',
                    completed: false,
                })
                .select('id')
                .single();

            if (setError) throw setError;
            setsWithIds.push({ orderIndex: j, dbId: setResult.id });
        }

        exercisesWithIds.push({
            templateId: ex.templateId,
            name: ex.name,
            dbId: exerciseId,
            sets: setsWithIds,
        });
    }

    return { workoutId, exercises: exercisesWithIds };
}

// ==================== STATISTICS ====================

export interface StreakData {
    current: number;
    best: number;
    trainedToday: boolean;
    atRisk: boolean;
    freezesAvailable: number;
}

export interface UserStats {
    totalTreinos: number;
    tempoTotal: string;
    volumeTotal: number;
    streak: StreakData;
    metaSemanal: {
        atual: number;
        meta: number;
    };
    progressao: Array<{
        exercicio: string;
        cargaInicial: number;
        cargaAtual: number;
        evolucao: number;
    }>;
}

export async function getUserStats(): Promise<UserStats> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Total de treinos finalizados
    const { count: totalWorkouts } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('finished_at', 'is', null);

    // Todos os workouts para calcular tempo e streak
    const { data: allWorkouts } = await supabase
        .from('workouts')
        .select('date, duration_seconds, finished_at')
        .eq('user_id', user.id)
        .not('finished_at', 'is', null)
        .order('date', { ascending: false });

    // Calcula tempo total
    const totalSeconds = allWorkouts?.reduce((sum, w) => sum + (w.duration_seconds || 0), 0) || 0;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const tempoFormatado = `${hours}h ${minutes}min`;

    // Calcula streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const workoutDates = [...new Set(allWorkouts?.map(w => w.date) || [])];
    const trainedToday = workoutDates.length > 0 && workoutDates[0] === todayStr;

    let streak = 0;
    let freezesUsed = 0;
    const MAX_FREEZES = 1;

    if (workoutDates.length > 0) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (trainedToday || workoutDates[0] === yesterdayStr) {
            const dateSet = new Set(workoutDates);
            let currentDate = new Date(trainedToday ? today : yesterday);

            while (true) {
                const dateStr = currentDate.toISOString().split('T')[0];
                if (dateSet.has(dateStr)) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                } else if (freezesUsed < MAX_FREEZES) {
                    freezesUsed++;
                    currentDate.setDate(currentDate.getDate() - 1);
                    const prevDateStr = currentDate.toISOString().split('T')[0];
                    if (!dateSet.has(prevDateStr)) break;
                } else {
                    break;
                }
            }
        }
    }

    const streakAtRisk = !trainedToday && streak > 0;

    // Meta semanal
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const weeklyCount = workoutDates.filter(d => d >= startOfWeek.toISOString().split('T')[0]).length;

    return {
        totalTreinos: totalWorkouts || 0,
        tempoTotal: tempoFormatado,
        volumeTotal: 0, // Simplificado por enquanto
        streak: {
            current: streak,
            best: streak, // Simplificado
            trainedToday,
            atRisk: streakAtRisk,
            freezesAvailable: MAX_FREEZES - freezesUsed,
        },
        metaSemanal: {
            atual: weeklyCount,
            meta: 4,
        },
        progressao: [], // Simplificado
    };
}

// ==================== PERSONAL RECORDS ====================

export interface SetPR {
    order_index: number;
    weight: number;
    reps: number;
    rir: number | null;
}

export interface ExercisePRs {
    bySet: SetPR[];
    absolute: SetPR | null;
}

export async function getExercisePRs(exerciseName: string): Promise<ExercisePRs> {
    // Simplificado - retorna vazio por enquanto
    return { bySet: [], absolute: null };
}

export async function getPRsBatch(exerciseNames: string[]): Promise<Record<string, SetPR[]>> {
    const result: Record<string, SetPR[]> = {};
    for (const name of exerciseNames) {
        result[name] = [];
    }
    return result;
}

// ==================== HEALTH CHECK ====================

export async function checkServerHealth(): Promise<boolean> {
    try {
        const { error } = await supabase.from('workouts').select('id').limit(1);
        return !error;
    } catch {
        return false;
    }
}

// ==================== COMPATIBILITY ====================
// Funções para manter compatibilidade com o código existente

export async function initializeApi(): Promise<void> {
    // Não precisa fazer nada - Supabase já está configurado
    console.log('[API] Supabase initialized');
}

export function setApiUrl(url: string) {
    // Não usado com Supabase
}

export function getConfiguredApiUrl(): string {
    return 'https://zryedrsytfjkacrfwrun.supabase.co';
}

// ==================== EXERCISE DATABASE ====================
// Dados de exercícios (simplificado - usa dados locais ou API externa futuramente)

export interface ExerciseDBPriority {
    id: string;
    name: string;
    name_pt: string;
    bodyPart: string;
    equipment: string;
    equipment_pt: string;
    target: string;
    secondaryMuscles: string[];
    instructions: string[];
    localImage: string;
}

// Lista básica de exercícios (pode ser expandida)
const EXERCISES_DB: ExerciseDBPriority[] = [
    { id: '1', name: 'Barbell Squat', name_pt: 'Agachamento Livre', bodyPart: 'upper legs', equipment: 'barbell', equipment_pt: 'Barra', target: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], instructions: [], localImage: '' },
    { id: '2', name: 'Pull Up', name_pt: 'Barra Fixa', bodyPart: 'back', equipment: 'body weight', equipment_pt: 'Peso corporal', target: 'lats', secondaryMuscles: ['biceps'], instructions: [], localImage: '' },
    { id: '3', name: 'Dips', name_pt: 'Paralelas', bodyPart: 'chest', equipment: 'body weight', equipment_pt: 'Peso corporal', target: 'pectorals', secondaryMuscles: ['triceps'], instructions: [], localImage: '' },
    { id: '4', name: 'Lateral Raise', name_pt: 'Elevação Lateral', bodyPart: 'shoulders', equipment: 'dumbbell', equipment_pt: 'Halter', target: 'delts', secondaryMuscles: [], instructions: [], localImage: '' },
    { id: '5', name: 'Tricep Kickback', name_pt: 'Coice Inclinado', bodyPart: 'upper arms', equipment: 'dumbbell', equipment_pt: 'Halter', target: 'triceps', secondaryMuscles: [], instructions: [], localImage: '' },
    { id: '6', name: 'Romanian Deadlift', name_pt: 'RDL (Stiff)', bodyPart: 'upper legs', equipment: 'barbell', equipment_pt: 'Barra', target: 'hamstrings', secondaryMuscles: ['glutes'], instructions: [], localImage: '' },
    { id: '7', name: 'Incline Dumbbell Press', name_pt: 'Supino Inclinado Halter', bodyPart: 'chest', equipment: 'dumbbell', equipment_pt: 'Halter', target: 'pectorals', secondaryMuscles: ['triceps', 'delts'], instructions: [], localImage: '' },
    { id: '8', name: 'Lying Leg Curl', name_pt: 'Mesa Flexora (Leg Curl)', bodyPart: 'upper legs', equipment: 'machine', equipment_pt: 'Máquina', target: 'hamstrings', secondaryMuscles: [], instructions: [], localImage: '' },
    { id: '9', name: 'Seated Row', name_pt: 'Remada (Máquina/Curvada)', bodyPart: 'back', equipment: 'machine', equipment_pt: 'Máquina', target: 'lats', secondaryMuscles: ['biceps'], instructions: [], localImage: '' },
    { id: '10', name: 'Pullover', name_pt: 'Pullover (Polia/Halter)', bodyPart: 'back', equipment: 'dumbbell', equipment_pt: 'Halter', target: 'lats', secondaryMuscles: ['chest'], instructions: [], localImage: '' },
    { id: '11', name: 'Hammer Curl', name_pt: 'Rosca Martelo', bodyPart: 'upper arms', equipment: 'dumbbell', equipment_pt: 'Halter', target: 'biceps', secondaryMuscles: ['forearms'], instructions: [], localImage: '' },
];

export async function getExerciseDBPriority(params?: {
    q?: string;
    target?: string;
    limit?: number;
}): Promise<ExerciseDBPriority[]> {
    let results = [...EXERCISES_DB];

    if (params?.q) {
        const searchLower = params.q.toLowerCase();
        results = results.filter(ex =>
            ex.name.toLowerCase().includes(searchLower) ||
            ex.name_pt.toLowerCase().includes(searchLower)
        );
    }

    if (params?.target) {
        const targetLower = params.target.toLowerCase();
        results = results.filter(ex => ex.target.toLowerCase() === targetLower);
    }

    if (params?.limit) {
        results = results.slice(0, params.limit);
    }

    return results;
}

export async function getExerciseDBTargets(): Promise<string[]> {
    const targets = new Set(EXERCISES_DB.map(ex => ex.target));
    return [...targets].sort();
}

export function getExerciseImageUrl(localImage: string): string {
    // Por enquanto retorna vazio - pode ser integrado com CDN futuramente
    return '';
}
