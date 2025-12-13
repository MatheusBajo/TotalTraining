// Schema do banco de dados TotalTraining
// Baseado na análise do treinos.json

export const DATABASE_NAME = 'totaltraining.db';
export const DATABASE_VERSION = 1;

// Tipos de série
export type SetType = 'N' | 'W' | 'D' | 'F' | 'R' | 'S';
// N = Normal
// W = Warmup (aquecimento)
// D = Drop Set
// F = Failure (falha)
// R = Rest-Pause
// S = Superset

// Tipos de peso (para normalizar as diferentes formas do JSON)
export type WeightType =
  | 'total'           // peso total (halteres, máquinas)
  | 'per_side'        // placas por lado (barra)
  | 'extra'           // peso extra (paralelas, barra fixa)
  | 'bodyweight';     // só peso corporal

export interface WorkoutRecord {
  id: number;
  date: string;              // ISO date YYYY-MM-DD
  name: string;              // nome do treino
  template_id?: string;      // referência ao template (se aplicável)
  started_at?: string;       // ISO datetime
  finished_at?: string;      // ISO datetime
  duration_seconds?: number; // duração em segundos
  notes?: string;            // observações gerais
  created_at: string;
  updated_at: string;
}

export interface ExerciseRecord {
  id: number;
  workout_id: number;
  exercise_name: string;     // nome do exercício
  order_index: number;       // ordem no treino
  notes?: string;            // observações do exercício
  created_at: string;
}

export interface SetRecord {
  id: number;
  exercise_id: number;
  order_index: number;       // ordem da série
  set_type: SetType;         // tipo da série
  weight?: number;           // peso em kg
  weight_type: WeightType;   // como interpretar o peso
  reps?: number;             // repetições (null se for tempo)
  time_seconds?: number;     // tempo em segundos (para isométricos)
  rir?: number;              // Reps in Reserve (0-10, permite decimais)
  rpe?: number;              // RPE alternativo (1-10)
  completed: boolean;        // se a série foi completada
  notes?: string;            // observações da série
  created_at: string;
}

// SQL para criar as tabelas
export const CREATE_TABLES_SQL = `
-- Tabela de treinos realizados
CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  name TEXT NOT NULL,
  template_id TEXT,
  started_at TEXT,
  finished_at TEXT,
  duration_seconds INTEGER,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de exercícios do treino
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER NOT NULL,
  exercise_name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Tabela de séries
CREATE TABLE IF NOT EXISTS sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  set_type TEXT NOT NULL DEFAULT 'N',
  weight REAL,
  weight_type TEXT NOT NULL DEFAULT 'total',
  reps INTEGER,
  time_seconds INTEGER,
  rir REAL,
  rpe REAL,
  completed INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_exercises_workout ON exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_sets_exercise ON sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(exercise_name);
`;

// SQL para limpar o banco (útil para desenvolvimento)
export const DROP_TABLES_SQL = `
DROP TABLE IF EXISTS sets;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS workouts;
`;
