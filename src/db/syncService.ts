// Sync Service - Sincroniza dados locais com Supabase
import { supabase } from '../lib/supabase';
import {
    getDatabase,
    getPendingSyncItems,
    markAsSynced,
    cleanupDeletedItems,
    getLocalWorkout,
    getExercisesByWorkout,
    getSetsByExercise,
} from './database';
import { LocalWorkout, LocalExercise, LocalSet } from './schema';
import { AppState, AppStateStatus } from 'react-native';

// Estado do sync
let isSyncing = false;
let syncInterval: NodeJS.Timeout | null = null;
let lastSyncTime: number = 0;

const SYNC_INTERVAL_MS = 30000; // 30 segundos
const MIN_SYNC_INTERVAL_MS = 5000; // 5 segundos entre syncs

// Inicia o serviço de sync
export function startSyncService(userId?: string): void {
    if (syncInterval) return;

    console.log('[Sync] Starting sync service for user:', userId);

    // Sync inicial
    triggerSync();

    // Sync periódico
    syncInterval = setInterval(() => {
        triggerSync();
    }, SYNC_INTERVAL_MS);

    // Sync quando app volta ao foco
    AppState.addEventListener('change', handleAppStateChange);
}

// Para o serviço de sync
export function stopSyncService(): void {
    console.log('[Sync] Stopping sync service');

    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
}

// Handler para mudança de estado do app
// REMOVIDO: Sync quando app volta ao foco causava problemas durante treino ativo
// O sync agora só acontece:
// - Periodicamente (a cada 30s)
// - Quando treino é FINALIZADO
// - Quando treino é CANCELADO
function handleAppStateChange(nextState: AppStateStatus): void {
    // Não faz nada - sync periódico já cuida disso
}

// Dispara sync (com debounce)
export async function triggerSync(): Promise<void> {
    // Evita sync muito frequente
    const now = Date.now();
    if (now - lastSyncTime < MIN_SYNC_INTERVAL_MS) {
        return;
    }

    // Evita sync simultâneo
    if (isSyncing) {
        console.log('[Sync] Already syncing, skipping');
        return;
    }

    // Verifica autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.log('[Sync] No user, skipping');
        return;
    }

    isSyncing = true;
    lastSyncTime = now;

    try {
        await performSync(user.id);
    } catch (error) {
        console.error('[Sync] Error during sync:', error);
    } finally {
        isSyncing = false;
    }
}

// Verifica se existe treino ativo (não finalizado)
async function hasActiveWorkout(userId: string): Promise<boolean> {
    const db = getDatabase();
    const active = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM workouts
         WHERE user_id = ? AND started_at IS NOT NULL AND finished_at IS NULL
         AND (sync_action IS NULL OR sync_action != 'delete')`,
        [userId]
    );
    return (active?.count || 0) > 0;
}

// Executa o sync
async function performSync(userId: string): Promise<void> {
    console.log('[Sync] Starting sync...');

    const db = getDatabase();

    // SEGURANÇA: Se tem treino ativo, só faz sync de CREATE/UPDATE, nunca DELETE
    const activeWorkout = await hasActiveWorkout(userId);
    if (activeWorkout) {
        console.log('[Sync] Active workout detected - skipping DELETE operations');
    }

    // 1. Sync workouts pendentes (CREATE/UPDATE apenas se treino ativo)
    const pendingWorkouts = await getPendingSyncItems('workouts') as LocalWorkout[];
    for (const workout of pendingWorkouts) {
        if (workout.sync_action === 'create') {
            await syncCreateWorkout(workout);
        } else if (workout.sync_action === 'update') {
            await syncUpdateWorkout(workout);
        } else if (workout.sync_action === 'delete' && !activeWorkout) {
            // Só deleta se NÃO tem treino ativo
            await syncDeleteWorkout(workout);
        }
    }

    // 2. Sync exercises pendentes
    const pendingExercises = await getPendingSyncItems('exercises') as LocalExercise[];
    for (const exercise of pendingExercises) {
        if (exercise.sync_action === 'create') {
            await syncCreateExercise(exercise);
        } else if (exercise.sync_action === 'update') {
            await syncUpdateExercise(exercise);
        } else if (exercise.sync_action === 'delete' && !activeWorkout) {
            await syncDeleteExercise(exercise);
        }
    }

    // 3. Sync sets pendentes
    const pendingSets = await getPendingSyncItems('sets') as LocalSet[];
    for (const set of pendingSets) {
        if (set.sync_action === 'create') {
            await syncCreateSet(set);
        } else if (set.sync_action === 'update') {
            await syncUpdateSet(set);
        } else if (set.sync_action === 'delete' && !activeWorkout) {
            await syncDeleteSet(set);
        }
    }

    // 4. Limpa itens deletados (só se não tem treino ativo)
    if (!activeWorkout) {
        await cleanupDeletedItems();
    }

    console.log('[Sync] Sync completed');
}

// ==================== WORKOUT SYNC ====================

async function syncCreateWorkout(workout: LocalWorkout): Promise<void> {
    try {
        const { data, error } = await supabase
            .from('workouts')
            .insert({
                user_id: workout.user_id,
                date: workout.date,
                name: workout.name,
                template_id: workout.template_id,
                started_at: workout.started_at,
                finished_at: workout.finished_at,
                duration_seconds: workout.duration_seconds,
                notes: workout.notes,
            })
            .select('id')
            .single();

        if (error) throw error;

        await markAsSynced('workouts', workout.id, data.id);

        // Agora sincroniza os exercícios deste workout
        const exercises = await getExercisesByWorkout(workout.id);
        for (const exercise of exercises) {
            // Atualiza o remote workout_id no exercício local...
            // Na verdade, precisamos criar o exercício no Supabase
            await syncCreateExerciseForWorkout(exercise, data.id);
        }

        console.log(`[Sync] Created workout: local=${workout.id}, remote=${data.id}`);
    } catch (error) {
        console.error(`[Sync] Error creating workout ${workout.id}:`, error);
        await markSyncError('workouts', workout.id, String(error));
    }
}

async function syncCreateExerciseForWorkout(exercise: LocalExercise, remoteWorkoutId: number): Promise<void> {
    try {
        const { data, error } = await supabase
            .from('exercises')
            .insert({
                workout_id: remoteWorkoutId,
                exercise_name: exercise.exercise_name,
                order_index: exercise.order_index,
                notes: exercise.notes,
            })
            .select('id')
            .single();

        if (error) throw error;

        await markAsSynced('exercises', exercise.id, data.id);

        // Sincroniza os sets deste exercício
        const sets = await getSetsByExercise(exercise.id);
        for (const set of sets) {
            await syncCreateSetForExercise(set, data.id);
        }

        console.log(`[Sync] Created exercise: local=${exercise.id}, remote=${data.id}`);
    } catch (error) {
        console.error(`[Sync] Error creating exercise ${exercise.id}:`, error);
        await markSyncError('exercises', exercise.id, String(error));
    }
}

async function syncCreateSetForExercise(set: LocalSet, remoteExerciseId: number): Promise<void> {
    try {
        const { data, error } = await supabase
            .from('sets')
            .insert({
                exercise_id: remoteExerciseId,
                order_index: set.order_index,
                set_type: set.set_type,
                weight: set.weight,
                weight_type: set.weight_type,
                reps: set.reps,
                rir: set.rir,
                completed: set.completed,
                notes: set.notes,
            })
            .select('id')
            .single();

        if (error) throw error;

        await markAsSynced('sets', set.id, data.id);
        console.log(`[Sync] Created set: local=${set.id}, remote=${data.id}`);
    } catch (error) {
        console.error(`[Sync] Error creating set ${set.id}:`, error);
        await markSyncError('sets', set.id, String(error));
    }
}

async function syncUpdateWorkout(workout: LocalWorkout): Promise<void> {
    if (!workout.remote_id) {
        console.log(`[Sync] Workout ${workout.id} has no remote_id, skipping update`);
        return;
    }

    try {
        const { error } = await supabase
            .from('workouts')
            .update({
                name: workout.name,
                finished_at: workout.finished_at,
                duration_seconds: workout.duration_seconds,
                notes: workout.notes,
                updated_at: new Date().toISOString(),
            })
            .eq('id', workout.remote_id);

        if (error) throw error;

        await markAsSynced('workouts', workout.id, workout.remote_id);
        console.log(`[Sync] Updated workout: local=${workout.id}, remote=${workout.remote_id}`);
    } catch (error) {
        console.error(`[Sync] Error updating workout ${workout.id}:`, error);
        await markSyncError('workouts', workout.id, String(error));
    }
}

async function syncDeleteWorkout(workout: LocalWorkout): Promise<void> {
    if (!workout.remote_id) {
        // Se não tem remote_id, deleta local direto
        const db = getDatabase();
        await db.runAsync('DELETE FROM workouts WHERE id = ?', [workout.id]);
        return;
    }

    try {
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', workout.remote_id);

        if (error) throw error;

        // Marca como synced para cleanup remover
        await markAsSynced('workouts', workout.id, workout.remote_id);
        console.log(`[Sync] Deleted workout: remote=${workout.remote_id}`);
    } catch (error) {
        console.error(`[Sync] Error deleting workout ${workout.id}:`, error);
        await markSyncError('workouts', workout.id, String(error));
    }
}

// ==================== EXERCISE SYNC ====================

async function syncCreateExercise(exercise: LocalExercise): Promise<void> {
    // Precisa do remote_id do workout
    const db = getDatabase();
    const workout = await db.getFirstAsync<LocalWorkout>(
        'SELECT * FROM workouts WHERE id = ?',
        [exercise.workout_id]
    );

    if (!workout?.remote_id) {
        console.log(`[Sync] Exercise ${exercise.id} workout not synced yet`);
        return;
    }

    await syncCreateExerciseForWorkout(exercise, workout.remote_id);
}

async function syncUpdateExercise(exercise: LocalExercise): Promise<void> {
    if (!exercise.remote_id) {
        console.log(`[Sync] Exercise ${exercise.id} has no remote_id, skipping update`);
        return;
    }

    try {
        const { error } = await supabase
            .from('exercises')
            .update({
                exercise_name: exercise.exercise_name,
                notes: exercise.notes,
            })
            .eq('id', exercise.remote_id);

        if (error) throw error;

        await markAsSynced('exercises', exercise.id, exercise.remote_id);
        console.log(`[Sync] Updated exercise: local=${exercise.id}, remote=${exercise.remote_id}`);
    } catch (error) {
        console.error(`[Sync] Error updating exercise ${exercise.id}:`, error);
        await markSyncError('exercises', exercise.id, String(error));
    }
}

async function syncDeleteExercise(exercise: LocalExercise): Promise<void> {
    if (!exercise.remote_id) {
        const db = getDatabase();
        await db.runAsync('DELETE FROM exercises WHERE id = ?', [exercise.id]);
        return;
    }

    try {
        const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', exercise.remote_id);

        if (error) throw error;

        await markAsSynced('exercises', exercise.id, exercise.remote_id);
        console.log(`[Sync] Deleted exercise: remote=${exercise.remote_id}`);
    } catch (error) {
        console.error(`[Sync] Error deleting exercise ${exercise.id}:`, error);
        await markSyncError('exercises', exercise.id, String(error));
    }
}

// ==================== SET SYNC ====================

async function syncCreateSet(set: LocalSet): Promise<void> {
    const db = getDatabase();
    const exercise = await db.getFirstAsync<LocalExercise>(
        'SELECT * FROM exercises WHERE id = ?',
        [set.exercise_id]
    );

    if (!exercise?.remote_id) {
        console.log(`[Sync] Set ${set.id} exercise not synced yet`);
        return;
    }

    await syncCreateSetForExercise(set, exercise.remote_id);
}

async function syncUpdateSet(set: LocalSet): Promise<void> {
    if (!set.remote_id) {
        console.log(`[Sync] Set ${set.id} has no remote_id, skipping update`);
        return;
    }

    try {
        const { error } = await supabase
            .from('sets')
            .update({
                weight: set.weight,
                reps: set.reps,
                rir: set.rir,
                completed: set.completed,
                set_type: set.set_type,
                notes: set.notes,
            })
            .eq('id', set.remote_id);

        if (error) throw error;

        await markAsSynced('sets', set.id, set.remote_id);
        console.log(`[Sync] Updated set: local=${set.id}, remote=${set.remote_id}`);
    } catch (error) {
        console.error(`[Sync] Error updating set ${set.id}:`, error);
        await markSyncError('sets', set.id, String(error));
    }
}

async function syncDeleteSet(set: LocalSet): Promise<void> {
    if (!set.remote_id) {
        const db = getDatabase();
        await db.runAsync('DELETE FROM sets WHERE id = ?', [set.id]);
        return;
    }

    try {
        const { error } = await supabase
            .from('sets')
            .delete()
            .eq('id', set.remote_id);

        if (error) throw error;

        await markAsSynced('sets', set.id, set.remote_id);
        console.log(`[Sync] Deleted set: remote=${set.remote_id}`);
    } catch (error) {
        console.error(`[Sync] Error deleting set ${set.id}:`, error);
        await markSyncError('sets', set.id, String(error));
    }
}

// ==================== ERROR HANDLING ====================

async function markSyncError(table: string, localId: number, error: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
        `UPDATE ${table} SET sync_status = 'error' WHERE id = ?`,
        [localId]
    );
}

// ==================== PULL FROM REMOTE ====================

// Puxa dados do Supabase para o local (primeiro login / novo device)
export async function pullFromRemote(userId: string): Promise<void> {
    console.log('[Sync] Pulling data from remote...');

    const db = getDatabase();

    try {
        // 1. Busca todos os workouts do usuário
        const { data: workouts, error: workoutsError } = await supabase
            .from('workouts')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (workoutsError) throw workoutsError;

        for (const remoteWorkout of workouts || []) {
          try {
            // Verifica se já existe localmente
            const existing = await db.getFirstAsync<LocalWorkout>(
                'SELECT id FROM workouts WHERE remote_id = ?',
                [remoteWorkout.id]
            );

            if (existing) continue;

            // Insere workout localmente
            const result = await db.runAsync(
                `INSERT INTO workouts (remote_id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at, sync_status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')`,
                [
                    remoteWorkout.id,
                    remoteWorkout.user_id,
                    remoteWorkout.date,
                    remoteWorkout.name,
                    remoteWorkout.template_id,
                    remoteWorkout.started_at,
                    remoteWorkout.finished_at,
                    remoteWorkout.duration_seconds,
                    remoteWorkout.notes,
                    remoteWorkout.created_at,
                    remoteWorkout.updated_at,
                ]
            );
            const localWorkoutId = result.lastInsertRowId;

            // 2. Busca exercícios deste workout
            const { data: exercises, error: exercisesError } = await supabase
                .from('exercises')
                .select('*')
                .eq('workout_id', remoteWorkout.id)
                .order('order_index');

            if (exercisesError) throw exercisesError;

            for (const remoteExercise of exercises || []) {
                // Verifica se exercício já existe
                const existingExercise = await db.getFirstAsync<LocalExercise>(
                    'SELECT id FROM exercises WHERE remote_id = ?',
                    [remoteExercise.id]
                );

                let localExerciseId: number;

                if (existingExercise) {
                    localExerciseId = existingExercise.id;
                } else {
                    const exerciseResult = await db.runAsync(
                        `INSERT INTO exercises (remote_id, workout_id, exercise_name, order_index, notes, created_at, sync_status)
                         VALUES (?, ?, ?, ?, ?, ?, 'synced')`,
                        [
                            remoteExercise.id,
                            localWorkoutId,
                            remoteExercise.exercise_name,
                            remoteExercise.order_index,
                            remoteExercise.notes,
                            remoteExercise.created_at,
                        ]
                    );
                    localExerciseId = exerciseResult.lastInsertRowId;
                }

                // 3. Busca sets deste exercício
                const { data: sets, error: setsError } = await supabase
                    .from('sets')
                    .select('*')
                    .eq('exercise_id', remoteExercise.id)
                    .order('order_index');

                if (setsError) throw setsError;

                for (const remoteSet of sets || []) {
                    // Verifica se set já existe
                    const existingSet = await db.getFirstAsync<LocalSet>(
                        'SELECT id FROM sets WHERE remote_id = ?',
                        [remoteSet.id]
                    );

                    if (existingSet) continue; // Já existe, pula

                    await db.runAsync(
                        `INSERT INTO sets (remote_id, exercise_id, order_index, set_type, weight, weight_type, reps, rir, completed, notes, created_at, sync_status)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')`,
                        [
                            remoteSet.id,
                            localExerciseId,
                            remoteSet.order_index,
                            remoteSet.set_type,
                            remoteSet.weight,
                            remoteSet.weight_type,
                            remoteSet.reps,
                            remoteSet.rir,
                            remoteSet.completed ? 1 : 0,
                            remoteSet.notes,
                            remoteSet.created_at,
                        ]
                    );
                }
            }
          } catch (workoutError) {
            console.error(`[Sync] Error pulling workout ${remoteWorkout.id}:`, workoutError);
            // Continua com o próximo workout
          }
        }

        console.log(`[Sync] Pulled ${workouts?.length || 0} workouts from remote`);
    } catch (error) {
        console.error('[Sync] Error pulling from remote:', error);
        throw error;
    }
}

// Verifica se precisa fazer pull inicial
export async function needsInitialPull(userId: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM workouts WHERE user_id = ?',
        [userId]
    );
    return (result?.count || 0) === 0;
}
