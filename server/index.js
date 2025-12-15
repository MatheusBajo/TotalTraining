const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'totaltraining.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
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
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Tabela de exercícios do treino
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER NOT NULL,
  exercise_name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
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
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_exercises_workout ON exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_sets_exercise ON sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(exercise_name);
`);

console.log(`[DB] Database initialized at ${dbPath}`);

// ==================== WORKOUTS ====================

// GET /api/workouts - Lista todos os treinos
app.get('/api/workouts', (req, res) => {
  try {
    const workouts = db.prepare(`
      SELECT * FROM workouts
      ORDER BY date DESC, id DESC
    `).all();
    res.json(workouts);
  } catch (error) {
    console.error('[GET /api/workouts]', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/workouts/:id - Busca um treino completo
app.get('/api/workouts/:id', (req, res) => {
  try {
    const { id } = req.params;

    const workout = db.prepare('SELECT * FROM workouts WHERE id = ?').get(id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const exercises = db.prepare(`
      SELECT * FROM exercises
      WHERE workout_id = ?
      ORDER BY order_index
    `).all(id);

    // Busca sets para cada exercício
    const exercisesWithSets = exercises.map(ex => {
      const sets = db.prepare(`
        SELECT * FROM sets
        WHERE exercise_id = ?
        ORDER BY order_index
      `).all(ex.id);
      return { ...ex, sets };
    });

    res.json({ workout, exercises: exercisesWithSets });
  } catch (error) {
    console.error('[GET /api/workouts/:id]', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/workouts - Cria um novo treino
app.post('/api/workouts', (req, res) => {
  try {
    const { date, name, template_id, started_at, notes } = req.body;

    const result = db.prepare(`
      INSERT INTO workouts (date, name, template_id, started_at, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(date, name, template_id, started_at, notes);

    console.log(`[POST /api/workouts] Created workout #${result.lastInsertRowid}`);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error('[POST /api/workouts]', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/workouts/:id/finish - Finaliza um treino
app.put('/api/workouts/:id/finish', (req, res) => {
  try {
    const { id } = req.params;
    const { duration_seconds } = req.body;

    // Pega datetime local
    const now = new Date();
    const finished_at = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    db.prepare(`
      UPDATE workouts
      SET finished_at = ?, duration_seconds = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(finished_at, duration_seconds, id);

    console.log(`[PUT /api/workouts/${id}/finish] Finished with duration ${duration_seconds}s`);
    res.json({ success: true });
  } catch (error) {
    console.error('[PUT /api/workouts/:id/finish]', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/workouts/:id - Deleta um treino
app.delete('/api/workouts/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM workouts WHERE id = ?').run(id);
    console.log(`[DELETE /api/workouts/${id}] Deleted`);
    res.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/workouts/:id]', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/workouts/:id/finish-batch - Finaliza treino com todos os dados das séries
app.put('/api/workouts/:id/finish-batch', (req, res) => {
  try {
    const { id } = req.params;
    const { duration_seconds, sets } = req.body;

    // Pega datetime local
    const now = new Date();
    const finished_at = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Usa transação para garantir atomicidade
    db.transaction(() => {
      // 1. Atualiza o workout
      db.prepare(`
        UPDATE workouts
        SET finished_at = ?, duration_seconds = ?, updated_at = datetime('now', 'localtime')
        WHERE id = ?
      `).run(finished_at, duration_seconds, id);

      // 2. Atualiza todas as séries
      const updateSet = db.prepare(`
        UPDATE sets
        SET weight = ?, reps = ?, rir = ?, completed = ?, set_type = ?
        WHERE id = ?
      `);

      for (const set of sets) {
        updateSet.run(
          set.weight ?? null,
          set.reps ?? null,
          set.rir ?? null,
          set.completed ? 1 : 0,
          set.set_type || 'N',
          set.id
        );
      }
    })();

    console.log(`[PUT /api/workouts/${id}/finish-batch] Finished with ${sets.length} sets, duration ${duration_seconds}s`);
    res.json({ success: true });
  } catch (error) {
    console.error('[PUT /api/workouts/:id/finish-batch]', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== EXERCISES ====================

// GET /api/workouts/:id/exercises - Lista exercícios de um treino
app.get('/api/workouts/:id/exercises', (req, res) => {
  try {
    const { id } = req.params;
    const exercises = db.prepare(`
      SELECT * FROM exercises
      WHERE workout_id = ?
      ORDER BY order_index
    `).all(id);
    res.json(exercises);
  } catch (error) {
    console.error('[GET /api/workouts/:id/exercises]', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/exercises - Cria um exercício
app.post('/api/exercises', (req, res) => {
  try {
    const { workout_id, exercise_name, order_index, notes } = req.body;

    const result = db.prepare(`
      INSERT INTO exercises (workout_id, exercise_name, order_index, notes)
      VALUES (?, ?, ?, ?)
    `).run(workout_id, exercise_name, order_index, notes);

    console.log(`[POST /api/exercises] Created exercise #${result.lastInsertRowid}: ${exercise_name}`);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error('[POST /api/exercises]', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SETS ====================

// POST /api/sets - Cria uma série
app.post('/api/sets', (req, res) => {
  try {
    const { exercise_id, order_index, set_type, weight_type, completed } = req.body;

    const result = db.prepare(`
      INSERT INTO sets (exercise_id, order_index, set_type, weight_type, completed)
      VALUES (?, ?, ?, ?, ?)
    `).run(exercise_id, order_index, set_type || 'N', weight_type || 'total', completed ? 1 : 0);

    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error('[POST /api/sets]', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/sets/:id - Atualiza uma série
app.put('/api/sets/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Monta query dinamicamente
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.json({ success: true });
    }

    const setClause = fields.map(f => `${f} = ?`).join(', ');

    db.prepare(`UPDATE sets SET ${setClause} WHERE id = ?`).run(...values, id);
    res.json({ success: true });
  } catch (error) {
    console.error('[PUT /api/sets/:id]', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== LAST PERFORMANCE ====================

// GET /api/last-performance/:exerciseName - Busca última performance
app.get('/api/last-performance/:exerciseName', (req, res) => {
  try {
    const { exerciseName } = req.params;

    const result = db.prepare(`
      SELECT s.weight, s.reps, s.weight_type
      FROM sets s
      JOIN exercises e ON s.exercise_id = e.id
      JOIN workouts w ON e.workout_id = w.id
      WHERE LOWER(e.exercise_name) = LOWER(?)
        AND s.completed = 1
        AND s.weight IS NOT NULL
        AND s.reps IS NOT NULL
      ORDER BY w.date DESC, w.id DESC, e.order_index DESC, s.order_index DESC
      LIMIT 1
    `).get(exerciseName);

    res.json(result || null);
  } catch (error) {
    console.error('[GET /api/last-performance]', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== BATCH CREATE WORKOUT ====================
// Cria treino + exercícios + séries em uma única chamada

app.post('/api/workouts/batch', (req, res) => {
  try {
    const { date, name, template_id, started_at, exercises } = req.body;

    // Usa transação para garantir atomicidade
    const result = db.transaction(() => {
      // 1. Cria o workout
      const workoutResult = db.prepare(`
        INSERT INTO workouts (date, name, template_id, started_at)
        VALUES (?, ?, ?, ?)
      `).run(date, name, template_id, started_at);

      const workoutId = workoutResult.lastInsertRowid;

      // 2. Cria exercícios e séries
      const exercisesWithIds = [];

      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];

        const exerciseResult = db.prepare(`
          INSERT INTO exercises (workout_id, exercise_name, order_index)
          VALUES (?, ?, ?)
        `).run(workoutId, ex.name, i);

        const exerciseId = exerciseResult.lastInsertRowid;

        // Cria séries para este exercício
        const setsWithIds = [];
        for (let j = 0; j < ex.numSets; j++) {
          const setResult = db.prepare(`
            INSERT INTO sets (exercise_id, order_index, set_type, weight_type, completed)
            VALUES (?, ?, 'N', 'total', 0)
          `).run(exerciseId, j);

          setsWithIds.push({ orderIndex: j, dbId: setResult.lastInsertRowid });
        }

        exercisesWithIds.push({
          templateId: ex.templateId,
          name: ex.name,
          dbId: exerciseId,
          sets: setsWithIds
        });
      }

      return { workoutId, exercises: exercisesWithIds };
    })();

    console.log(`[POST /api/workouts/batch] Created workout #${result.workoutId} with ${exercises.length} exercises`);
    res.json(result);
  } catch (error) {
    console.error('[POST /api/workouts/batch]', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== BATCH LAST PERFORMANCE ====================
// Busca última performance de múltiplos exercícios em uma única chamada

app.post('/api/last-performance/batch', (req, res) => {
  try {
    const { exerciseNames } = req.body;

    const results = {};

    for (const name of exerciseNames) {
      const result = db.prepare(`
        SELECT s.weight, s.reps, s.weight_type
        FROM sets s
        JOIN exercises e ON s.exercise_id = e.id
        JOIN workouts w ON e.workout_id = w.id
        WHERE LOWER(e.exercise_name) = LOWER(?)
          AND s.completed = 1
          AND s.weight IS NOT NULL
          AND s.reps IS NOT NULL
        ORDER BY w.date DESC, w.id DESC, e.order_index DESC, s.order_index DESC
        LIMIT 1
      `).get(name);

      results[name] = result || null;
    }

    res.json(results);
  } catch (error) {
    console.error('[POST /api/last-performance/batch]', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbPath
  });
});

// ==================== STATISTICS ====================

// GET /api/stats - Retorna estatísticas reais do banco
app.get('/api/stats', (req, res) => {
  try {
    // Total de treinos finalizados
    const totalWorkouts = db.prepare(`
      SELECT COUNT(*) as count FROM workouts WHERE finished_at IS NOT NULL
    `).get();

    // Tempo total (soma de duration_seconds)
    const totalTime = db.prepare(`
      SELECT COALESCE(SUM(duration_seconds), 0) as total FROM workouts WHERE finished_at IS NOT NULL
    `).get();

    // Volume total (soma de weight * reps)
    const totalVolume = db.prepare(`
      SELECT COALESCE(SUM(
        CASE
          WHEN s.weight_type = 'per_side' THEN s.weight * 2 * s.reps
          ELSE s.weight * s.reps
        END
      ), 0) as total
      FROM sets s
      JOIN exercises e ON s.exercise_id = e.id
      JOIN workouts w ON e.workout_id = w.id
      WHERE s.completed = 1 AND s.weight IS NOT NULL AND s.reps IS NOT NULL
        AND w.finished_at IS NOT NULL
    `).get();

    // Streak (dias consecutivos - conta treinos nos últimos 14 dias)
    const recentWorkouts = db.prepare(`
      SELECT DISTINCT date FROM workouts
      WHERE finished_at IS NOT NULL
      ORDER BY date DESC
      LIMIT 14
    `).all();

    let streak = 0;
    if (recentWorkouts.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < recentWorkouts.length; i++) {
        const workoutDate = new Date(recentWorkouts[i].date);
        workoutDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);

        // Se o treino é do dia esperado ou anterior (permite gaps de 1 dia)
        const diffDays = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= i + 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    // Meta semanal (treinos esta semana)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Domingo
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyWorkouts = db.prepare(`
      SELECT COUNT(*) as count FROM workouts
      WHERE finished_at IS NOT NULL AND date >= ?
    `).get(startOfWeek.toISOString().split('T')[0]);

    // Progressão (primeiro e último peso de exercícios principais)
    const progressionExercises = ['Supino', 'Agachamento', 'Barra Fixa', 'RDL', 'Desenvolvimento'];
    const progression = [];

    for (const exerciseName of progressionExercises) {
      // Primeiro registro
      const first = db.prepare(`
        SELECT s.weight, s.weight_type, w.date
        FROM sets s
        JOIN exercises e ON s.exercise_id = e.id
        JOIN workouts w ON e.workout_id = w.id
        WHERE LOWER(e.exercise_name) LIKE LOWER(?)
          AND s.completed = 1 AND s.weight IS NOT NULL AND s.weight > 0
        ORDER BY w.date ASC, s.order_index ASC
        LIMIT 1
      `).get(`%${exerciseName}%`);

      // Último registro (melhor peso)
      const best = db.prepare(`
        SELECT MAX(CASE WHEN s.weight_type = 'per_side' THEN s.weight * 2 ELSE s.weight END) as weight
        FROM sets s
        JOIN exercises e ON s.exercise_id = e.id
        JOIN workouts w ON e.workout_id = w.id
        WHERE LOWER(e.exercise_name) LIKE LOWER(?)
          AND s.completed = 1 AND s.weight IS NOT NULL
      `).get(`%${exerciseName}%`);

      if (first && best && first.weight > 0) {
        const initialWeight = first.weight_type === 'per_side' ? first.weight * 2 : first.weight;
        const currentWeight = best.weight || initialWeight;
        // Calcula evolução como % do ganho em relação ao peso atual
        // Ex: 10kg -> 46kg = (46-10)/46 = 78% de ganho
        const evolution = currentWeight > 0 ? Math.round(((currentWeight - initialWeight) / currentWeight) * 100) : 0;

        progression.push({
          exercicio: exerciseName,
          cargaInicial: Math.round(initialWeight),
          cargaAtual: Math.round(currentWeight),
          evolucao: evolution
        });
      }
    }

    // Formata tempo total
    const totalMinutes = Math.floor(totalTime.total / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const tempoFormatado = `${hours}h ${minutes}min`;

    res.json({
      totalTreinos: totalWorkouts.count,
      tempoTotal: tempoFormatado,
      volumeTotal: Math.round(totalVolume.total),
      streak: streak,
      metaSemanal: {
        atual: weeklyWorkouts.count,
        meta: 4 // Meta fixa de 4 treinos por semana
      },
      progressao: progression
    });
  } catch (error) {
    console.error('[GET /api/stats]', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PERSONAL RECORDS ====================

// GET /api/pr/:exerciseName - Busca PRs de um exercício (por série)
app.get('/api/pr/:exerciseName', (req, res) => {
  try {
    const { exerciseName } = req.params;

    // Busca todos os PRs ordenados por ordem da série
    // PR = maior peso com pelo menos X reps para cada posição de série
    const prs = db.prepare(`
      SELECT
        s.order_index,
        MAX(CASE WHEN s.weight_type = 'per_side' THEN s.weight * 2 ELSE s.weight END) as weight,
        s.reps,
        s.rir
      FROM sets s
      JOIN exercises e ON s.exercise_id = e.id
      JOIN workouts w ON e.workout_id = w.id
      WHERE LOWER(e.exercise_name) = LOWER(?)
        AND s.completed = 1
        AND s.weight IS NOT NULL
        AND s.reps IS NOT NULL
      GROUP BY s.order_index
      ORDER BY s.order_index ASC
    `).all(exerciseName);

    // Também busca o PR absoluto (melhor de todas as séries)
    const absolutePr = db.prepare(`
      SELECT
        MAX(CASE WHEN s.weight_type = 'per_side' THEN s.weight * 2 ELSE s.weight END) as weight,
        s.reps,
        s.rir,
        w.date
      FROM sets s
      JOIN exercises e ON s.exercise_id = e.id
      JOIN workouts w ON e.workout_id = w.id
      WHERE LOWER(e.exercise_name) = LOWER(?)
        AND s.completed = 1
        AND s.weight IS NOT NULL
        AND s.reps IS NOT NULL
      ORDER BY (CASE WHEN s.weight_type = 'per_side' THEN s.weight * 2 ELSE s.weight END) DESC
      LIMIT 1
    `).get(exerciseName);

    res.json({
      bySet: prs,
      absolute: absolutePr
    });
  } catch (error) {
    console.error('[GET /api/pr]', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pr/batch - Busca PRs de múltiplos exercícios
app.post('/api/pr/batch', (req, res) => {
  try {
    const { exercises } = req.body; // Array de nomes de exercícios

    const result = {};

    for (const exerciseName of exercises) {
      // Busca o melhor peso para cada posição de série
      // Usa subquery para pegar o peso máximo e depois busca reps e rir desse registro
      const prs = db.prepare(`
        WITH max_weights AS (
          SELECT
            s.order_index,
            MAX(CASE WHEN s.weight_type = 'per_side' THEN s.weight * 2 ELSE s.weight END) as max_weight
          FROM sets s
          JOIN exercises e ON s.exercise_id = e.id
          JOIN workouts w ON e.workout_id = w.id
          WHERE LOWER(e.exercise_name) = LOWER(?)
            AND s.completed = 1
            AND s.weight IS NOT NULL
            AND s.reps IS NOT NULL
          GROUP BY s.order_index
        )
        SELECT
          mw.order_index,
          mw.max_weight as weight,
          s.reps,
          s.rir
        FROM max_weights mw
        JOIN sets s ON s.order_index = mw.order_index
          AND (CASE WHEN s.weight_type = 'per_side' THEN s.weight * 2 ELSE s.weight END) = mw.max_weight
        JOIN exercises e ON s.exercise_id = e.id
        WHERE LOWER(e.exercise_name) = LOWER(?)
          AND s.completed = 1
        ORDER BY mw.order_index ASC
      `).all(exerciseName, exerciseName);

      // Remove duplicatas (pode haver múltiplos registros com mesmo peso máximo)
      const uniquePrs = [];
      const seenIndexes = new Set();
      for (const pr of prs) {
        if (!seenIndexes.has(pr.order_index)) {
          seenIndexes.add(pr.order_index);
          uniquePrs.push(pr);
        }
      }

      result[exerciseName] = uniquePrs;
    }

    res.json(result);
  } catch (error) {
    console.error('[POST /api/pr/batch]', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== NGROK URL ====================
// Endpoint para descobrir a URL pública do ngrok automaticamente
// O ngrok expõe uma API local em http://localhost:4040/api/tunnels

let cachedNgrokUrl = null;
let lastNgrokCheck = 0;
const NGROK_CACHE_MS = 30000; // Cache por 30 segundos

app.get('/api/ngrok-url', async (req, res) => {
  try {
    const now = Date.now();

    // Usa cache se ainda válido
    if (cachedNgrokUrl && (now - lastNgrokCheck) < NGROK_CACHE_MS) {
      return res.json({ url: cachedNgrokUrl, cached: true });
    }

    // Consulta a API do ngrok
    const ngrokResponse = await fetch('http://localhost:4040/api/tunnels');
    const data = await ngrokResponse.json();

    // Procura o tunnel HTTPS para a porta 3001
    const tunnel = data.tunnels?.find(t =>
      t.public_url?.startsWith('https') &&
      t.config?.addr?.includes(PORT.toString())
    );

    if (tunnel) {
      cachedNgrokUrl = tunnel.public_url;
      lastNgrokCheck = now;
      console.log(`[ngrok] Found public URL: ${cachedNgrokUrl}`);
      return res.json({ url: cachedNgrokUrl, cached: false });
    }

    // Não encontrou tunnel
    res.json({ url: null, error: 'No ngrok tunnel found for this port' });
  } catch (error) {
    // ngrok não está rodando
    res.json({ url: null, error: 'ngrok not running' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🏋️ TotalTraining Server running on port ${PORT}`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
  console.log(`\n   Use ngrok to expose: ngrok http ${PORT}\n`);
});
