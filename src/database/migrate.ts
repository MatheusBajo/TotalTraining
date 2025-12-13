import {
  createWorkout,
  createExercise,
  createSet,
  getDatabase,
  initDatabase,
} from './database';
import { SetType, WeightType } from './schema';

// Dados do treinos.json (importados estaticamente para a migração)
import treinosData from '../data/treinos.json';

interface LegacySet {
  carga?: number | string;
  placas_lado_kg?: number;
  halter_kg?: number;
  pino_kg?: number;
  peso_kg?: number;
  peso_extra_kg?: number;
  carga_kg?: number;
  peso_corporal?: boolean;
  reps?: number | string;
  RIR?: number;
  intensidade?: string;
  falha_estimada?: number;
  falha_total?: boolean;
  tempo_seg?: number | string;
  observacao?: string;
  drop_set?: string;
  rest_pause_reps?: number;
  lado?: string;
  pegada?: string;
}

interface LegacyExercise {
  nome: string;
  series: LegacySet[] | number;
  reps?: string[];
  observacao?: string;
}

interface LegacyWorkout {
  data: string;
  treino: string;
  observacao?: string;
  observacoes?: string;
  horario_inicio?: string;
  horario_fim?: string;
  exercicios: LegacyExercise[];
}

// Detecta o tipo de peso baseado nos campos presentes
function detectWeightType(set: LegacySet): { weight: number | null; type: WeightType } {
  if (set.peso_corporal) {
    return { weight: null, type: 'bodyweight' };
  }
  if (set.placas_lado_kg !== undefined) {
    return { weight: set.placas_lado_kg, type: 'per_side' };
  }
  if (set.peso_extra_kg !== undefined) {
    return { weight: set.peso_extra_kg, type: 'extra' };
  }
  if (set.halter_kg !== undefined) {
    return { weight: set.halter_kg, type: 'total' };
  }
  if (set.pino_kg !== undefined) {
    return { weight: set.pino_kg, type: 'total' };
  }
  if (set.peso_kg !== undefined) {
    return { weight: set.peso_kg, type: 'total' };
  }
  if (set.carga_kg !== undefined) {
    return { weight: set.carga_kg, type: 'total' };
  }
  if (set.carga !== undefined && typeof set.carga === 'number') {
    return { weight: set.carga, type: 'total' };
  }
  return { weight: null, type: 'total' };
}

// Detecta o tipo de série baseado nos campos
function detectSetType(set: LegacySet): SetType {
  // Aquecimento
  if (set.observacao?.toLowerCase().includes('aquecimento')) {
    return 'W';
  }
  // Drop set
  if (set.drop_set) {
    return 'D';
  }
  // Rest-pause
  if (set.rest_pause_reps) {
    return 'R';
  }
  // Falha
  if (set.falha_total || set.RIR === 0 || set.intensidade?.toLowerCase().includes('falha')) {
    return 'F';
  }
  // Normal
  return 'N';
}

// Extrai RIR do campo intensidade (dados antigos)
function extractRirFromIntensity(intensity?: string): number | null {
  if (!intensity) return null;

  const lower = intensity.toLowerCase();

  if (lower.includes('falha')) return 0;
  if (lower.includes('quase falha')) return 0.5;
  if (lower.includes('pesado')) return 1;
  if (lower.includes('moderado para leve')) return 4;
  if (lower.includes('moderado')) return 2;
  if (lower.includes('leve')) return 5;

  return null;
}

// Converte reps para número
function parseReps(reps: number | string | undefined): number | null {
  if (reps === undefined || reps === null) return null;
  if (typeof reps === 'number') return reps;

  // Tenta extrair número de strings como "8-10", "falha", etc
  const match = reps.toString().match(/(\d+)/);
  if (match) return parseInt(match[1], 10);

  return null;
}

// Converte tempo para segundos
function parseTime(time: number | string | undefined): number | null {
  if (time === undefined || time === null) return null;
  if (typeof time === 'number') return time;

  // "até falha" ou similar
  if (typeof time === 'string') {
    const match = time.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }

  return null;
}

// Migra todos os dados do JSON para o banco
export async function migrateFromJson(): Promise<{
  workouts: number;
  exercises: number;
  sets: number;
}> {
  await initDatabase();
  const database = getDatabase();

  // Verifica se já existem dados
  const existing = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM workouts'
  );

  if (existing && existing.count > 0) {
    console.log('[Migration] Database already has data, skipping migration');
    return { workouts: 0, exercises: 0, sets: 0 };
  }

  console.log('[Migration] Starting migration from treinos.json...');

  let workoutCount = 0;
  let exerciseCount = 0;
  let setCount = 0;

  const workouts = treinosData.treinos as LegacyWorkout[];

  for (const legacyWorkout of workouts) {
    try {
      // Cria o treino
      const notes = legacyWorkout.observacao || legacyWorkout.observacoes || null;

      // Monta datetime de início se disponível
      let startedAt: string | undefined;
      if (legacyWorkout.horario_inicio) {
        startedAt = `${legacyWorkout.data}T${legacyWorkout.horario_inicio}:00`;
      }

      const workoutId = await createWorkout({
        date: legacyWorkout.data,
        name: legacyWorkout.treino,
        started_at: startedAt,
        notes: notes ?? undefined,
      });

      workoutCount++;

      // Cria os exercícios
      for (let exIndex = 0; exIndex < legacyWorkout.exercicios.length; exIndex++) {
        const legacyExercise = legacyWorkout.exercicios[exIndex];

        const exerciseId = await createExercise({
          workout_id: workoutId,
          exercise_name: legacyExercise.nome,
          order_index: exIndex,
          notes: legacyExercise.observacao,
        });

        exerciseCount++;

        // Verifica se series é array ou número (template)
        if (Array.isArray(legacyExercise.series)) {
          // Cria as séries
          for (let setIndex = 0; setIndex < legacyExercise.series.length; setIndex++) {
            const legacySet = legacyExercise.series[setIndex];

            const { weight, type: weightType } = detectWeightType(legacySet);
            const setType = detectSetType(legacySet);

            // RIR: usa o campo RIR se existir, senão extrai da intensidade
            let rir = legacySet.RIR ?? extractRirFromIntensity(legacySet.intensidade);

            // Monta notes da série
            const noteParts: string[] = [];
            if (legacySet.observacao && !legacySet.observacao.toLowerCase().includes('aquecimento')) {
              noteParts.push(legacySet.observacao);
            }
            if (legacySet.drop_set) {
              noteParts.push(`Drop: ${legacySet.drop_set}`);
            }
            if (legacySet.rest_pause_reps) {
              noteParts.push(`+${legacySet.rest_pause_reps} rest-pause`);
            }
            if (legacySet.lado) {
              noteParts.push(`Lado: ${legacySet.lado}`);
            }
            if (legacySet.pegada) {
              noteParts.push(`Pegada: ${legacySet.pegada}`);
            }
            if (legacySet.intensidade && !legacySet.RIR) {
              // Salva intensidade original se não tinha RIR
              noteParts.push(`[${legacySet.intensidade}]`);
            }

            await createSet({
              exercise_id: exerciseId,
              order_index: setIndex,
              set_type: setType,
              weight: weight ?? undefined,
              weight_type: weightType,
              reps: parseReps(legacySet.reps) ?? undefined,
              time_seconds: parseTime(legacySet.tempo_seg) ?? undefined,
              rir: rir ?? undefined,
              completed: true, // Dados históricos = completados
              notes: noteParts.length > 0 ? noteParts.join(' | ') : undefined,
            });

            setCount++;
          }
        } else if (typeof legacyExercise.series === 'number') {
          // Template sem dados reais - cria séries vazias
          for (let i = 0; i < legacyExercise.series; i++) {
            await createSet({
              exercise_id: exerciseId,
              order_index: i,
              set_type: 'N',
              weight_type: 'total',
              completed: false,
            });
            setCount++;
          }
        }
      }
    } catch (error) {
      console.error(`[Migration] Error migrating workout ${legacyWorkout.data}:`, error);
    }
  }

  console.log(`[Migration] Complete: ${workoutCount} workouts, ${exerciseCount} exercises, ${setCount} sets`);

  return { workouts: workoutCount, exercises: exerciseCount, sets: setCount };
}

// Limpa todos os dados (útil para desenvolvimento)
export async function clearDatabase(): Promise<void> {
  const database = getDatabase();
  await database.execAsync(`
    DELETE FROM sets;
    DELETE FROM exercises;
    DELETE FROM workouts;
  `);
  console.log('[Database] All data cleared');
}
