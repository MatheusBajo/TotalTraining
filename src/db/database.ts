// Database Manager - SQLite local-first
import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL, LocalWorkout, LocalExercise, LocalSet, LocalExercisePR } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

// Inicializa o banco de dados
export async function initDatabase(): Promise<void> {
    if (db) return;

    try {
        db = await SQLite.openDatabaseAsync('totaltraining.db');

        // Habilita foreign keys
        await db.execAsync('PRAGMA foreign_keys = ON;');

        // Cria tabelas
        await db.execAsync(CREATE_TABLES_SQL);

        // Migrations para bancos existentes
        await runMigrations(db);

        // Cleanup: remove treinos abandonados (não finalizados há mais de 24h, SEM remote_id)
        // Treinos com remote_id são gerenciados pelo sync — não deletar aqui
        await db.runAsync(
            `DELETE FROM sets WHERE exercise_id IN (
                SELECT e.id FROM exercises e
                JOIN workouts w ON e.workout_id = w.id
                WHERE w.finished_at IS NULL AND w.started_at IS NOT NULL
                AND w.remote_id IS NULL
                AND datetime(w.started_at) < datetime('now', '-1 day')
            )`
        );
        await db.runAsync(
            `DELETE FROM exercises WHERE workout_id IN (
                SELECT id FROM workouts
                WHERE finished_at IS NULL AND started_at IS NOT NULL
                AND remote_id IS NULL
                AND datetime(started_at) < datetime('now', '-1 day')
            )`
        );
        const cleanup = await db.runAsync(
            `DELETE FROM workouts
             WHERE finished_at IS NULL AND started_at IS NOT NULL
             AND remote_id IS NULL
             AND datetime(started_at) < datetime('now', '-1 day')`
        );
        if (cleanup.changes > 0) {
            console.log(`[DB] Cleaned up ${cleanup.changes} abandoned workout(s)`);
        }

        console.log('[DB] Database initialized successfully');
    } catch (error) {
        console.error('[DB] Error initializing database:', error);
        throw error;
    }
}

// Executa migrations para atualizar schema de bancos existentes
async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
    // Migration 1: Adiciona coluna superset_with na tabela exercises
    try {
        const tableInfo = await database.getAllAsync<{ name: string }>(
            "PRAGMA table_info(exercises)"
        );
        const hasColumn = tableInfo.some(col => col.name === 'superset_with');

        if (!hasColumn) {
            await database.execAsync('ALTER TABLE exercises ADD COLUMN superset_with INTEGER');
            console.log('[DB] Migration: Added superset_with column to exercises');
        }
    } catch (error) {
        console.error('[DB] Migration error:', error);
    }

    // Migration 2: Adiciona coluna alternativas na tabela exercises
    try {
        const tableInfo = await database.getAllAsync<{ name: string }>(
            "PRAGMA table_info(exercises)"
        );
        const hasAlternativas = tableInfo.some(col => col.name === 'alternativas');

        if (!hasAlternativas) {
            await database.execAsync('ALTER TABLE exercises ADD COLUMN alternativas TEXT');
            console.log('[DB] Migration: Added alternativas column to exercises');
        }
    } catch (error) {
        console.error('[DB] Migration 2 error:', error);
    }
}

// Retorna a instância do banco
export function getDatabase(): SQLite.SQLiteDatabase {
    if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return db;
}

// Helper para data/hora local
export function getLocalDateTime() {
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
}

// ==================== WORKOUTS ====================

export async function createLocalWorkout(data: {
    user_id: string;
    date: string;
    name: string;
    template_id?: string;
    started_at?: string;
}): Promise<number> {
    const database = getDatabase();
    const now = getLocalDateTime().datetime;

    const result = await database.runAsync(
        `INSERT INTO workouts (user_id, date, name, template_id, started_at, created_at, updated_at, sync_status, sync_action)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'create')`,
        [data.user_id, data.date, data.name, data.template_id || null, data.started_at || null, now, now]
    );

    return result.lastInsertRowId;
}

export async function getLocalWorkout(id: number): Promise<LocalWorkout | null> {
    const database = getDatabase();
    const result = await database.getFirstAsync<LocalWorkout>(
        'SELECT * FROM workouts WHERE id = ?',
        [id]
    );
    return result || null;
}

export async function getAllLocalWorkouts(userId: string): Promise<LocalWorkout[]> {
    const database = getDatabase();
    const results = await database.getAllAsync<LocalWorkout>(
        `SELECT * FROM workouts
         WHERE user_id = ? AND (sync_action IS NULL OR sync_action != 'delete')
         ORDER BY date DESC, id DESC`,
        [userId]
    );
    return results;
}

export async function updateLocalWorkout(id: number, data: Partial<{
    name: string;
    finished_at: string;
    duration_seconds: number;
    notes: string;
}>): Promise<void> {
    const database = getDatabase();
    const now = getLocalDateTime().datetime;

    const updates: string[] = ['updated_at = ?'];
    const values: any[] = [now];

    if (data.name !== undefined) {
        updates.push('name = ?');
        values.push(data.name);
    }
    if (data.finished_at !== undefined) {
        updates.push('finished_at = ?');
        values.push(data.finished_at);
    }
    if (data.duration_seconds !== undefined) {
        updates.push('duration_seconds = ?');
        values.push(data.duration_seconds);
    }
    if (data.notes !== undefined) {
        updates.push('notes = ?');
        values.push(data.notes);
    }

    // Marca para sync se já estava sincronizado
    updates.push("sync_status = CASE WHEN sync_status = 'synced' THEN 'pending' ELSE sync_status END");
    updates.push("sync_action = CASE WHEN sync_action IS NULL THEN 'update' ELSE sync_action END");

    values.push(id);

    await database.runAsync(
        `UPDATE workouts SET ${updates.join(', ')} WHERE id = ?`,
        values
    );
}

export async function deleteLocalWorkout(id: number): Promise<void> {
    const database = getDatabase();

    const workout = await getLocalWorkout(id);
    if (!workout) return;

    // Treinos NÃO finalizados (cancelados) ou nunca sincronizados → DELETE direto
    // Treinos finalizados com remote_id → marca para sync delete
    if (!workout.finished_at || workout.remote_id === null) {
        await database.runAsync('DELETE FROM sets WHERE exercise_id IN (SELECT id FROM exercises WHERE workout_id = ?)', [id]);
        await database.runAsync('DELETE FROM exercises WHERE workout_id = ?', [id]);
        await database.runAsync('DELETE FROM workouts WHERE id = ?', [id]);
    } else {
        await database.runAsync(
            `UPDATE workouts SET sync_status = 'pending', sync_action = 'delete' WHERE id = ?`,
            [id]
        );
    }
}

// ==================== EXERCISES ====================

export async function createLocalExercise(data: {
    workout_id: number;
    exercise_name: string;
    order_index: number;
}): Promise<number> {
    const database = getDatabase();
    const now = getLocalDateTime().datetime;

    const result = await database.runAsync(
        `INSERT INTO exercises (workout_id, exercise_name, order_index, created_at, sync_status, sync_action)
         VALUES (?, ?, ?, ?, 'pending', 'create')`,
        [data.workout_id, data.exercise_name, data.order_index, now]
    );

    return result.lastInsertRowId;
}

export async function getExercisesByWorkout(workoutId: number): Promise<LocalExercise[]> {
    const database = getDatabase();
    const results = await database.getAllAsync<LocalExercise>(
        `SELECT * FROM exercises
         WHERE workout_id = ? AND (sync_action IS NULL OR sync_action != 'delete')
         ORDER BY order_index`,
        [workoutId]
    );
    return results;
}

export async function updateLocalExercise(id: number, data: Partial<{
    exercise_name: string;
    notes: string;
    superset_with: number | null;
    alternativas: string;
}>): Promise<void> {
    const database = getDatabase();

    const updates: string[] = [];
    const values: any[] = [];

    if (data.exercise_name !== undefined) {
        updates.push('exercise_name = ?');
        values.push(data.exercise_name);
    }
    if (data.notes !== undefined) {
        updates.push('notes = ?');
        values.push(data.notes);
    }
    if (data.superset_with !== undefined) {
        updates.push('superset_with = ?');
        values.push(data.superset_with);
    }
    if (data.alternativas !== undefined) {
        updates.push('alternativas = ?');
        values.push(data.alternativas);
    }

    if (updates.length === 0) return;

    updates.push("sync_status = CASE WHEN sync_status = 'synced' THEN 'pending' ELSE sync_status END");
    updates.push("sync_action = CASE WHEN sync_action IS NULL THEN 'update' ELSE sync_action END");

    values.push(id);

    await database.runAsync(
        `UPDATE exercises SET ${updates.join(', ')} WHERE id = ?`,
        values
    );
}

export async function deleteLocalExercise(id: number): Promise<void> {
    const database = getDatabase();

    const exercise = await database.getFirstAsync<LocalExercise>(
        'SELECT * FROM exercises WHERE id = ?',
        [id]
    );
    if (!exercise) return;

    if (exercise.remote_id === null) {
        await database.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
    } else {
        await database.runAsync(
            `UPDATE exercises SET sync_status = 'pending', sync_action = 'delete' WHERE id = ?`,
            [id]
        );
    }
}

// ==================== SETS ====================

export async function createLocalSet(data: {
    exercise_id: number;
    order_index: number;
    set_type?: string;
    weight_type?: string;
}): Promise<number> {
    const database = getDatabase();
    const now = getLocalDateTime().datetime;

    const result = await database.runAsync(
        `INSERT INTO sets (exercise_id, order_index, set_type, weight_type, completed, created_at, sync_status, sync_action)
         VALUES (?, ?, ?, ?, 0, ?, 'pending', 'create')`,
        [data.exercise_id, data.order_index, data.set_type || 'N', data.weight_type || 'total', now]
    );

    return result.lastInsertRowId;
}

export async function getSetsByExercise(exerciseId: number): Promise<LocalSet[]> {
    const database = getDatabase();
    const results = await database.getAllAsync<any>(
        `SELECT * FROM sets
         WHERE exercise_id = ? AND (sync_action IS NULL OR sync_action != 'delete')
         ORDER BY order_index`,
        [exerciseId]
    );

    // Converte completed de number para boolean
    return results.map(s => ({ ...s, completed: s.completed === 1 }));
}

export async function updateLocalSet(id: number, data: Partial<{
    weight: number | null;
    reps: number | null;
    rir: number | null;
    completed: boolean;
    set_type: string;
}>): Promise<void> {
    const database = getDatabase();

    const updates: string[] = [];
    const values: any[] = [];

    if (data.weight !== undefined) {
        updates.push('weight = ?');
        values.push(data.weight);
    }
    if (data.reps !== undefined) {
        updates.push('reps = ?');
        values.push(data.reps);
    }
    if (data.rir !== undefined) {
        updates.push('rir = ?');
        values.push(data.rir);
    }
    if (data.completed !== undefined) {
        updates.push('completed = ?');
        values.push(data.completed ? 1 : 0);
    }
    if (data.set_type !== undefined) {
        updates.push('set_type = ?');
        values.push(data.set_type);
    }

    if (updates.length === 0) return;

    updates.push("sync_status = CASE WHEN sync_status = 'synced' THEN 'pending' ELSE sync_status END");
    updates.push("sync_action = CASE WHEN sync_action IS NULL THEN 'update' ELSE sync_action END");

    values.push(id);

    await database.runAsync(
        `UPDATE sets SET ${updates.join(', ')} WHERE id = ?`,
        values
    );
}

export async function deleteLocalSet(id: number): Promise<void> {
    const database = getDatabase();

    const set = await database.getFirstAsync<LocalSet>(
        'SELECT * FROM sets WHERE id = ?',
        [id]
    );
    if (!set) return;

    if (set.remote_id === null) {
        await database.runAsync('DELETE FROM sets WHERE id = ?', [id]);
    } else {
        await database.runAsync(
            `UPDATE sets SET sync_status = 'pending', sync_action = 'delete' WHERE id = ?`,
            [id]
        );
    }
}

// ==================== EXERCISE PRs ====================

export async function getExercisePRs(userId: string, exerciseName: string): Promise<LocalExercisePR[]> {
    const database = getDatabase();
    const results = await database.getAllAsync<LocalExercisePR>(
        `SELECT * FROM exercise_prs
         WHERE user_id = ? AND exercise_name = ?
         ORDER BY order_index`,
        [userId, exerciseName]
    );
    return results;
}

export async function upsertExercisePR(data: {
    user_id: string;
    exercise_name: string;
    order_index: number;
    weight: number;
    reps: number;
    rir: number | null;
    workout_date: string;
}): Promise<void> {
    const database = getDatabase();
    const now = getLocalDateTime().datetime;

    await database.runAsync(
        `INSERT INTO exercise_prs (user_id, exercise_name, order_index, weight, reps, rir, workout_date, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, exercise_name, order_index) DO UPDATE SET
         weight = excluded.weight,
         reps = excluded.reps,
         rir = excluded.rir,
         workout_date = excluded.workout_date,
         updated_at = excluded.updated_at`,
        [data.user_id, data.exercise_name, data.order_index, data.weight, data.reps, data.rir, data.workout_date, now]
    );
}

export async function getPRsBatchLocal(userId: string, exerciseNames: string[]): Promise<Record<string, LocalExercisePR[]>> {
    const database = getDatabase();
    const result: Record<string, LocalExercisePR[]> = {};

    for (const name of exerciseNames) {
        // Primeiro tenta a tabela de PRs
        const prs = await getExercisePRs(userId, name);
        if (prs.length > 0) {
            result[name] = prs;
        } else {
            // Se não tem PRs, calcula do histórico de treinos
            result[name] = await calculatePRsFromHistory(userId, name);
        }
    }

    return result;
}

// Calcula PRs a partir do histórico de treinos finalizados
async function calculatePRsFromHistory(userId: string, exerciseName: string): Promise<LocalExercisePR[]> {
    const database = getDatabase();

    // Busca o último treino finalizado com este exercício
    // Nota: não filtra por completed porque queremos o último registro mesmo que não completo
    const lastWorkoutSets = await database.getAllAsync<{
        order_index: number;
        weight: number | null;
        reps: number | null;
        rir: number | null;
        workout_date: string;
    }>(`
        SELECT s.order_index, s.weight, s.reps, s.rir, w.date as workout_date
        FROM sets s
        JOIN exercises e ON s.exercise_id = e.id
        JOIN workouts w ON e.workout_id = w.id
        WHERE w.user_id = ?
          AND e.exercise_name = ?
          AND w.finished_at IS NOT NULL
          AND s.weight IS NOT NULL
          AND s.reps IS NOT NULL
          AND (w.sync_action IS NULL OR w.sync_action != 'delete')
        ORDER BY w.date DESC, w.id DESC, s.order_index ASC
    `, [userId, exerciseName]);

    console.log(`[DB] calculatePRsFromHistory for "${exerciseName}": found ${lastWorkoutSets.length} sets`);

    if (lastWorkoutSets.length === 0) {
        return [];
    }

    // Agrupa por order_index e pega o mais recente de cada
    const prsByIndex: Record<number, LocalExercisePR> = {};
    const seenIndices = new Set<number>();

    for (const set of lastWorkoutSets) {
        // Só pega o primeiro (mais recente) de cada order_index
        if (!seenIndices.has(set.order_index) && set.weight && set.reps) {
            seenIndices.add(set.order_index);
            prsByIndex[set.order_index] = {
                id: 0, // Virtual, não está no DB
                user_id: userId,
                exercise_name: exerciseName,
                order_index: set.order_index,
                weight: set.weight,
                reps: set.reps,
                rir: set.rir,
                workout_date: set.workout_date,
                updated_at: new Date().toISOString(),
            };
        }
    }

    return Object.values(prsByIndex).sort((a, b) => a.order_index - b.order_index);
}

// ==================== SYNC HELPERS ====================

export async function markAsSynced(table: string, localId: number, remoteId: number): Promise<void> {
    const database = getDatabase();
    await database.runAsync(
        `UPDATE ${table} SET remote_id = ?, sync_status = 'synced', sync_action = NULL WHERE id = ?`,
        [remoteId, localId]
    );
}

export async function getPendingSyncItems(table: string): Promise<any[]> {
    const database = getDatabase();
    return database.getAllAsync(
        `SELECT * FROM ${table} WHERE sync_status = 'pending' ORDER BY id`,
    );
}

export async function getWorkoutWithExercisesAndSets(workoutId: number): Promise<{
    workout: LocalWorkout;
    exercises: (LocalExercise & { sets: LocalSet[] })[];
} | null> {
    const workout = await getLocalWorkout(workoutId);
    if (!workout) return null;

    const exercises = await getExercisesByWorkout(workoutId);
    const exercisesWithSets = await Promise.all(
        exercises.map(async (ex) => ({
            ...ex,
            sets: await getSetsByExercise(ex.id),
        }))
    );

    return { workout, exercises: exercisesWithSets };
}

// ==================== LAST WORKOUT (LOCAL) ====================

export async function getLastFinishedWorkoutLocal(userId: string): Promise<LocalWorkout | null> {
    const database = getDatabase();
    const result = await database.getFirstAsync<LocalWorkout>(
        `SELECT * FROM workouts
         WHERE user_id = ? AND finished_at IS NOT NULL AND (sync_action IS NULL OR sync_action != 'delete')
         ORDER BY finished_at DESC
         LIMIT 1`,
        [userId]
    );
    return result || null;
}

// ==================== EXERCISE HISTORY & RECORDS ====================

export interface ExerciseHistoryEntry {
    workoutId: number;
    workoutName: string;
    workoutDate: string;
    sets: {
        orderIndex: number;
        setType: string;
        weight: number | null;
        reps: number | null;
        rir: number | null;
        completed: boolean;
    }[];
}

/**
 * Retorna o histórico de um exercício agrupado por treino/data
 */
export async function getExerciseHistoryLocal(
    userId: string,
    exerciseName: string,
    limit: number = 20
): Promise<ExerciseHistoryEntry[]> {
    const database = getDatabase();

    const rows = await database.getAllAsync<{
        workout_id: number;
        workout_name: string;
        workout_date: string;
        order_index: number;
        set_type: string;
        weight: number | null;
        reps: number | null;
        rir: number | null;
        completed: number;
    }>(
        `SELECT
            w.id as workout_id,
            w.name as workout_name,
            w.date as workout_date,
            s.order_index,
            s.set_type,
            s.weight,
            s.reps,
            s.rir,
            s.completed
        FROM workouts w
        JOIN exercises e ON e.workout_id = w.id
        JOIN sets s ON s.exercise_id = e.id
        WHERE w.user_id = ?
          AND e.exercise_name = ?
          AND w.finished_at IS NOT NULL
          AND (w.sync_action IS NULL OR w.sync_action != 'delete')
          AND (e.sync_action IS NULL OR e.sync_action != 'delete')
          AND (s.sync_action IS NULL OR s.sync_action != 'delete')
        ORDER BY w.date DESC, w.id DESC, s.order_index ASC`,
        [userId, exerciseName]
    );

    // Agrupa por workout
    const grouped = new Map<number, ExerciseHistoryEntry>();
    for (const row of rows) {
        if (!grouped.has(row.workout_id)) {
            grouped.set(row.workout_id, {
                workoutId: row.workout_id,
                workoutName: row.workout_name,
                workoutDate: row.workout_date,
                sets: [],
            });
        }
        grouped.get(row.workout_id)!.sets.push({
            orderIndex: row.order_index,
            setType: row.set_type,
            weight: row.weight,
            reps: row.reps,
            rir: row.rir,
            completed: row.completed === 1,
        });
    }

    return Array.from(grouped.values()).slice(0, limit);
}

export interface ExerciseRecord {
    reps: number;
    weight: number;
    rir: number | null;
    date: string;
}

/**
 * Retorna os melhores PRs por número de repetições
 */
export async function getExerciseRecordsLocal(
    userId: string,
    exerciseName: string
): Promise<ExerciseRecord[]> {
    const database = getDatabase();

    const rows = await database.getAllAsync<{
        reps: number;
        weight: number;
        rir: number | null;
        workout_date: string;
    }>(
        `SELECT
            s.reps,
            MAX(s.weight) as weight,
            s.rir,
            w.date as workout_date
        FROM workouts w
        JOIN exercises e ON e.workout_id = w.id
        JOIN sets s ON s.exercise_id = e.id
        WHERE w.user_id = ?
          AND e.exercise_name = ?
          AND w.finished_at IS NOT NULL
          AND s.weight IS NOT NULL
          AND s.reps IS NOT NULL
          AND s.completed = 1
          AND (w.sync_action IS NULL OR w.sync_action != 'delete')
          AND (e.sync_action IS NULL OR e.sync_action != 'delete')
          AND (s.sync_action IS NULL OR s.sync_action != 'delete')
        GROUP BY s.reps
        ORDER BY s.reps ASC`,
        [userId, exerciseName]
    );

    return rows.map(r => ({
        reps: r.reps,
        weight: r.weight,
        rir: r.rir,
        date: r.workout_date,
    }));
}

// ==================== CLEANUP ====================

export async function cleanupDeletedItems(): Promise<void> {
    const database = getDatabase();

    // Remove itens marcados como deletados que já foram sincronizados
    await database.runAsync(
        `DELETE FROM sets WHERE sync_action = 'delete' AND sync_status = 'synced'`
    );
    await database.runAsync(
        `DELETE FROM exercises WHERE sync_action = 'delete' AND sync_status = 'synced'`
    );
    await database.runAsync(
        `DELETE FROM workouts WHERE sync_action = 'delete' AND sync_status = 'synced'`
    );
}
