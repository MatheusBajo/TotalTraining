// Schema do banco de dados SQLite local
// Espelha as tabelas do Supabase para funcionamento offline

export const CREATE_TABLES_SQL = `
-- Tabela de workouts
CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remote_id INTEGER UNIQUE,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    name TEXT NOT NULL,
    template_id TEXT,
    started_at TEXT,
    finished_at TEXT,
    duration_seconds INTEGER,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'pending',
    sync_action TEXT
);

-- Tabela de exercícios
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remote_id INTEGER UNIQUE,
    workout_id INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    superset_with INTEGER,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'pending',
    sync_action TEXT,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
    FOREIGN KEY (superset_with) REFERENCES exercises(id) ON DELETE SET NULL
);

-- Tabela de séries
CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remote_id INTEGER UNIQUE,
    exercise_id INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    set_type TEXT DEFAULT 'N',
    weight REAL,
    weight_type TEXT DEFAULT 'total',
    reps INTEGER,
    time_seconds INTEGER,
    rir REAL,
    rpe REAL,
    completed INTEGER DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'pending',
    sync_action TEXT,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Tabela de PRs (Personal Records) por exercício/série
CREATE TABLE IF NOT EXISTS exercise_prs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER NOT NULL,
    rir REAL,
    workout_date TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, exercise_name, order_index)
);

-- Tabela de sync queue (operações pendentes)
CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    local_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    retries INTEGER DEFAULT 0,
    last_error TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_workouts_user ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_workouts_sync ON workouts(sync_status);
CREATE INDEX IF NOT EXISTS idx_exercises_workout ON exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_sets_exercise ON sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_prs_exercise ON exercise_prs(user_id, exercise_name);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(table_name, action);
`;

// Tipos TypeScript
export interface LocalWorkout {
    id: number;
    remote_id: number | null;
    user_id: string;
    date: string;
    name: string;
    template_id: string | null;
    started_at: string | null;
    finished_at: string | null;
    duration_seconds: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    sync_status: 'synced' | 'pending' | 'error';
    sync_action: 'create' | 'update' | 'delete' | null;
}

export interface LocalExercise {
    id: number;
    remote_id: number | null;
    workout_id: number;
    exercise_name: string;
    order_index: number;
    superset_with: number | null;
    notes: string | null;
    created_at: string;
    sync_status: 'synced' | 'pending' | 'error';
    sync_action: 'create' | 'update' | 'delete' | null;
}

export interface LocalSet {
    id: number;
    remote_id: number | null;
    exercise_id: number;
    order_index: number;
    set_type: string;
    weight: number | null;
    weight_type: string;
    reps: number | null;
    time_seconds: number | null;
    rir: number | null;
    rpe: number | null;
    completed: boolean;
    notes: string | null;
    created_at: string;
    sync_status: 'synced' | 'pending' | 'error';
    sync_action: 'create' | 'update' | 'delete' | null;
}

export interface LocalExercisePR {
    id: number;
    user_id: string;
    exercise_name: string;
    order_index: number;
    weight: number;
    reps: number;
    rir: number | null;
    workout_date: string;
    updated_at: string;
}

export interface SyncQueueItem {
    id: number;
    table_name: string;
    local_id: number;
    action: 'create' | 'update' | 'delete';
    payload: string;
    created_at: string;
    retries: number;
    last_error: string | null;
}
