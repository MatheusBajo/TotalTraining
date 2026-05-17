const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const USER_ID = process.argv[2] || 'SEU_USER_ID_AQUI';

// Escape SQL strings
const esc = (v) => v === null || v === undefined ? 'NULL' : "'" + String(v).replace(/'/g, "''") + "'";
const num = (v) => v === null || v === undefined ? 'NULL' : v;
const bool = (v) => v ? 'true' : 'false';

const dbPath = path.join(__dirname, '..', 'totaltraining.db');
const db = new Database(dbPath);

const workouts = db.prepare('SELECT * FROM workouts WHERE finished_at IS NOT NULL ORDER BY id').all();
const exercises = db.prepare(`SELECT e.* FROM exercises e JOIN workouts w ON e.workout_id = w.id WHERE w.finished_at IS NOT NULL ORDER BY e.id`).all();
const sets = db.prepare(`SELECT s.* FROM sets s JOIN exercises e ON s.exercise_id = e.id JOIN workouts w ON e.workout_id = w.id WHERE w.finished_at IS NOT NULL ORDER BY s.id`).all();

let sql = `-- ==========================================
-- MIGRATION SCRIPT - SQLite to Supabase
-- Gerado em: ${new Date().toISOString()}
-- ==========================================
-- IMPORTANTE: Substitua SEU_USER_ID_AQUI pelo seu UUID do Supabase!
-- ==========================================

-- Estatísticas:
-- Workouts: ${workouts.length}
-- Exercises: ${exercises.length}
-- Sets: ${sets.length}

-- ========== LIMPAR DADOS EXISTENTES ==========
-- (deleta na ordem correta por causa das foreign keys)

DELETE FROM sets;
DELETE FROM exercises;
DELETE FROM workouts;

-- ========== WORKOUTS ==========

`;

for (const w of workouts) {
    sql += `INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (${w.id}, '${USER_ID}', ${esc(w.date)}, ${esc(w.name)}, ${esc(w.template_id)}, ${esc(w.started_at)}, ${esc(w.finished_at)}, ${num(w.duration_seconds)}, ${esc(w.notes)}, ${esc(w.created_at)}, ${esc(w.updated_at || w.created_at)});\n`;
}

sql += `
-- ========== EXERCISES ==========

`;

for (const e of exercises) {
    sql += `INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (${e.id}, ${e.workout_id}, ${esc(e.exercise_name)}, ${e.order_index}, ${esc(e.notes)}, ${esc(e.created_at)});\n`;
}

sql += `
-- ========== SETS ==========

`;

for (const s of sets) {
    sql += `INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (${s.id}, ${s.exercise_id}, ${s.order_index}, ${esc(s.set_type || 'N')}, ${num(s.weight)}, ${esc(s.weight_type || 'total')}, ${num(s.reps)}, ${num(s.time_seconds)}, ${num(s.rir)}, ${num(s.rpe)}, ${bool(s.completed)}, ${esc(s.notes)}, ${esc(s.created_at)});\n`;
}

sql += `
-- ========== RESET SEQUENCES ==========
-- Garante que os próximos IDs sejam corretos

SELECT setval('workouts_id_seq', (SELECT COALESCE(MAX(id), 1) FROM workouts));
SELECT setval('exercises_id_seq', (SELECT COALESCE(MAX(id), 1) FROM exercises));
SELECT setval('sets_id_seq', (SELECT COALESCE(MAX(id), 1) FROM sets));

-- FIM DA MIGRAÇÃO
`;

const outputPath = path.join(__dirname, '..', '..', 'supabase-migration.sql');
fs.writeFileSync(outputPath, sql);

console.log(`✅ SQL gerado em: ${outputPath}`);
console.log(`   Workouts: ${workouts.length}`);
console.log(`   Exercises: ${exercises.length}`);
console.log(`   Sets: ${sets.length}`);
console.log('');
console.log('O script agora LIMPA as tabelas antes de inserir!');

db.close();
