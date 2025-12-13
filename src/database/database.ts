import * as SQLite from 'expo-sqlite';
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  CREATE_TABLES_SQL,
  DROP_TABLES_SQL,
  WorkoutRecord,
  ExerciseRecord,
  SetRecord,
  SetType,
  WeightType,
} from './schema';

let db: SQLite.SQLiteDatabase | null = null;

// Inicializa o banco de dados
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // Verifica versão do schema ANTES de habilitar foreign keys
  const versionResult = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const currentVersion = versionResult?.user_version ?? 0;

  console.log(`[Database] Current version: ${currentVersion}, Target version: ${DATABASE_VERSION}`);

  if (currentVersion < DATABASE_VERSION) {
    console.log('[Database] Schema outdated, recreating tables...');
    // Desabilita foreign keys para poder dropar
    await db.execAsync('PRAGMA foreign_keys = OFF;');
    // Drop todas as tabelas antigas
    await db.execAsync(DROP_TABLES_SQL);
    // Cria as tabelas novas
    await db.execAsync(CREATE_TABLES_SQL);
    // Atualiza a versão
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
    console.log('[Database] Schema updated successfully');
  } else {
    // Garante que as tabelas existem
    await db.execAsync(CREATE_TABLES_SQL);
  }

  // Habilita foreign keys após setup
  await db.execAsync('PRAGMA foreign_keys = ON;');

  console.log('[Database] Initialized successfully');
  return db;
}

// Força reset do banco (útil para desenvolvimento)
export async function resetDatabase(): Promise<void> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  console.log('[Database] Resetting database...');
  await db.execAsync('PRAGMA foreign_keys = OFF;');
  await db.execAsync(DROP_TABLES_SQL);
  await db.execAsync(CREATE_TABLES_SQL);
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
  await db.execAsync('PRAGMA foreign_keys = ON;');
  console.log('[Database] Reset complete');
}

// Retorna a instância do banco
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// ============================================
// WORKOUTS
// ============================================

export async function createWorkout(data: {
  date: string;
  name: string;
  template_id?: string;
  started_at?: string;
  notes?: string;
}): Promise<number> {
  const database = getDatabase();
  const result = await database.runAsync(
    `INSERT INTO workouts (date, name, template_id, started_at, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [data.date, data.name, data.template_id ?? null, data.started_at ?? null, data.notes ?? null]
  );
  return result.lastInsertRowId;
}

export async function updateWorkout(
  id: number,
  data: Partial<Omit<WorkoutRecord, 'id' | 'created_at'>>
): Promise<void> {
  const database = getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  await database.runAsync(
    `UPDATE workouts SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function finishWorkout(id: number, duration_seconds: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync(
    `UPDATE workouts
     SET finished_at = datetime('now'),
         duration_seconds = ?,
         updated_at = datetime('now')
     WHERE id = ?`,
    [duration_seconds, id]
  );
}

export async function deleteWorkout(id: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync('DELETE FROM workouts WHERE id = ?', [id]);
}

export async function getWorkoutById(id: number): Promise<WorkoutRecord | null> {
  const database = getDatabase();
  return await database.getFirstAsync<WorkoutRecord>(
    'SELECT * FROM workouts WHERE id = ?',
    [id]
  );
}

export async function getWorkoutsByDateRange(
  startDate: string,
  endDate: string
): Promise<WorkoutRecord[]> {
  const database = getDatabase();
  return await database.getAllAsync<WorkoutRecord>(
    'SELECT * FROM workouts WHERE date BETWEEN ? AND ? ORDER BY date DESC',
    [startDate, endDate]
  );
}

export async function getAllWorkouts(): Promise<WorkoutRecord[]> {
  const database = getDatabase();
  return await database.getAllAsync<WorkoutRecord>(
    'SELECT * FROM workouts ORDER BY date DESC'
  );
}

export async function getRecentWorkouts(limit: number = 10): Promise<WorkoutRecord[]> {
  const database = getDatabase();
  return await database.getAllAsync<WorkoutRecord>(
    'SELECT * FROM workouts ORDER BY date DESC LIMIT ?',
    [limit]
  );
}

// ============================================
// EXERCISES
// ============================================

export async function createExercise(data: {
  workout_id: number;
  exercise_name: string;
  order_index: number;
  notes?: string;
}): Promise<number> {
  const database = getDatabase();
  const result = await database.runAsync(
    `INSERT INTO exercises (workout_id, exercise_name, order_index, notes)
     VALUES (?, ?, ?, ?)`,
    [data.workout_id, data.exercise_name, data.order_index, data.notes ?? null]
  );
  return result.lastInsertRowId;
}

export async function getExercisesByWorkout(workout_id: number): Promise<ExerciseRecord[]> {
  const database = getDatabase();
  return await database.getAllAsync<ExerciseRecord>(
    'SELECT * FROM exercises WHERE workout_id = ? ORDER BY order_index',
    [workout_id]
  );
}

export async function deleteExercise(id: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
}

// ============================================
// SETS
// ============================================

export async function createSet(data: {
  exercise_id: number;
  order_index: number;
  set_type?: SetType;
  weight?: number;
  weight_type?: WeightType;
  reps?: number;
  time_seconds?: number;
  rir?: number;
  rpe?: number;
  completed?: boolean;
  notes?: string;
}): Promise<number> {
  const database = getDatabase();
  const result = await database.runAsync(
    `INSERT INTO sets (exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.exercise_id,
      data.order_index,
      data.set_type ?? 'N',
      data.weight ?? null,
      data.weight_type ?? 'total',
      data.reps ?? null,
      data.time_seconds ?? null,
      data.rir ?? null,
      data.rpe ?? null,
      data.completed ? 1 : 0,
      data.notes ?? null,
    ]
  );
  return result.lastInsertRowId;
}

export async function updateSet(
  id: number,
  data: Partial<Omit<SetRecord, 'id' | 'exercise_id' | 'created_at'>>
): Promise<void> {
  const database = getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      // Converte boolean para integer
      values.push(key === 'completed' ? (value ? 1 : 0) : value);
    }
  });

  if (fields.length === 0) return;

  values.push(id);

  await database.runAsync(
    `UPDATE sets SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function toggleSetCompleted(id: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync(
    'UPDATE sets SET completed = NOT completed WHERE id = ?',
    [id]
  );
}

export async function getSetsByExercise(exercise_id: number): Promise<SetRecord[]> {
  const database = getDatabase();
  return await database.getAllAsync<SetRecord>(
    'SELECT * FROM sets WHERE exercise_id = ? ORDER BY order_index',
    [exercise_id]
  );
}

export async function deleteSet(id: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync('DELETE FROM sets WHERE id = ?', [id]);
}

// ============================================
// QUERIES ÚTEIS
// ============================================

// Busca histórico de um exercício específico
export async function getExerciseHistory(
  exerciseName: string,
  limit: number = 10
): Promise<
  Array<{
    date: string;
    workout_name: string;
    sets: SetRecord[];
  }>
> {
  const database = getDatabase();

  // Busca exercícios com esse nome
  const exercises = await database.getAllAsync<ExerciseRecord & { date: string; workout_name: string }>(
    `SELECT e.*, w.date, w.name as workout_name
     FROM exercises e
     JOIN workouts w ON e.workout_id = w.id
     WHERE e.exercise_name = ?
     ORDER BY w.date DESC
     LIMIT ?`,
    [exerciseName, limit]
  );

  // Busca as séries de cada exercício
  const result = await Promise.all(
    exercises.map(async (exercise) => ({
      date: exercise.date,
      workout_name: exercise.workout_name,
      sets: await getSetsByExercise(exercise.id),
    }))
  );

  return result;
}

// Busca a última performance de um exercício (case-insensitive)
export async function getLastPerformance(
  exerciseName: string
): Promise<{ weight: number; reps: number; weight_type: WeightType } | null> {
  const database = getDatabase();

  const result = await database.getFirstAsync<{
    weight: number;
    reps: number;
    weight_type: WeightType;
  }>(
    `SELECT s.weight, s.reps, s.weight_type
     FROM sets s
     JOIN exercises e ON s.exercise_id = e.id
     JOIN workouts w ON e.workout_id = w.id
     WHERE LOWER(e.exercise_name) = LOWER(?)
       AND s.completed = 1
       AND s.weight IS NOT NULL
       AND s.reps IS NOT NULL
     ORDER BY w.date DESC, e.order_index DESC, s.order_index DESC
     LIMIT 1`,
    [exerciseName]
  );

  return result;
}

// Busca treino completo com exercícios e séries
export async function getFullWorkout(workoutId: number): Promise<{
  workout: WorkoutRecord;
  exercises: Array<ExerciseRecord & { sets: SetRecord[] }>;
} | null> {
  const workout = await getWorkoutById(workoutId);
  if (!workout) return null;

  const exercises = await getExercisesByWorkout(workoutId);
  const exercisesWithSets = await Promise.all(
    exercises.map(async (exercise) => ({
      ...exercise,
      sets: await getSetsByExercise(exercise.id),
    }))
  );

  return { workout, exercises: exercisesWithSets };
}

// Conta treinos por período
export async function getWorkoutStats(startDate: string, endDate: string): Promise<{
  total_workouts: number;
  total_exercises: number;
  total_sets: number;
}> {
  const database = getDatabase();

  const result = await database.getFirstAsync<{
    total_workouts: number;
    total_exercises: number;
    total_sets: number;
  }>(
    `SELECT
       COUNT(DISTINCT w.id) as total_workouts,
       COUNT(DISTINCT e.id) as total_exercises,
       COUNT(s.id) as total_sets
     FROM workouts w
     LEFT JOIN exercises e ON e.workout_id = w.id
     LEFT JOIN sets s ON s.exercise_id = e.id
     WHERE w.date BETWEEN ? AND ?`,
    [startDate, endDate]
  );

  return result ?? { total_workouts: 0, total_exercises: 0, total_sets: 0 };
}

// Debug: mostra estatísticas do banco
export async function debugDatabase(): Promise<void> {
  const database = getDatabase();

  const workouts = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM workouts'
  );
  const exercises = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercises'
  );
  const sets = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sets'
  );
  const completedSets = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sets WHERE completed = 1'
  );

  console.log('=== DATABASE DEBUG ===');
  console.log(`Workouts: ${workouts?.count ?? 0}`);
  console.log(`Exercises: ${exercises?.count ?? 0}`);
  console.log(`Sets: ${sets?.count ?? 0}`);
  console.log(`Completed sets: ${completedSets?.count ?? 0}`);

  // Mostra alguns exercícios únicos
  const uniqueExercises = await database.getAllAsync<{ exercise_name: string }>(
    'SELECT DISTINCT exercise_name FROM exercises ORDER BY exercise_name LIMIT 20'
  );
  console.log('Sample exercises:', uniqueExercises.map(e => e.exercise_name));
  console.log('======================');
}
