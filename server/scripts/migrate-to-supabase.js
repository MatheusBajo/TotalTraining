/**
 * Script para migrar dados do SQLite local para o Supabase
 *
 * Uso: node migrate-to-supabase.js <USER_ID>
 *
 * O USER_ID é o UUID do usuário no Supabase Auth
 */

const Database = require('better-sqlite3');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Configuração do Supabase
const SUPABASE_URL = 'https://zryedrsytfjkacrfwrun.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Precisa da service key para bypass RLS

if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_KEY não definida!');
    console.log('');
    console.log('Para obter a service key:');
    console.log('1. Acesse https://supabase.com/dashboard');
    console.log('2. Vá em Settings > API');
    console.log('3. Copie a "service_role" key (NÃO a anon key)');
    console.log('');
    console.log('Execute assim:');
    console.log('SUPABASE_SERVICE_KEY=sua_key node migrate-to-supabase.js <USER_ID>');
    process.exit(1);
}

const userId = process.argv[2];
if (!userId) {
    console.error('❌ USER_ID não fornecido!');
    console.log('');
    console.log('Uso: SUPABASE_SERVICE_KEY=key node migrate-to-supabase.js <USER_ID>');
    console.log('');
    console.log('Para encontrar seu USER_ID:');
    console.log('1. Acesse o Supabase Dashboard');
    console.log('2. Vá em Authentication > Users');
    console.log('3. Copie o UUID do seu usuário');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Abre banco SQLite
const dbPath = path.join(__dirname, '..', 'totaltraining.db');
const db = new Database(dbPath);

async function migrate() {
    console.log('🚀 Iniciando migração para Supabase...');
    console.log(`📁 Banco SQLite: ${dbPath}`);
    console.log(`👤 User ID: ${userId}`);
    console.log('');

    // Mapa para guardar IDs antigos -> novos
    const workoutIdMap = new Map();
    const exerciseIdMap = new Map();

    try {
        // 1. Busca todos os workouts do SQLite
        const workouts = db.prepare(`
            SELECT * FROM workouts
            WHERE finished_at IS NOT NULL
            ORDER BY date ASC
        `).all();

        console.log(`📊 Encontrados ${workouts.length} treinos finalizados`);

        // 2. Insere workouts no Supabase
        for (const workout of workouts) {
            const { data, error } = await supabase
                .from('workouts')
                .insert({
                    user_id: userId,
                    date: workout.date,
                    name: workout.name,
                    template_id: workout.template_id,
                    started_at: workout.started_at,
                    finished_at: workout.finished_at,
                    duration_seconds: workout.duration_seconds,
                    notes: workout.notes,
                    created_at: workout.created_at,
                    updated_at: workout.updated_at || workout.created_at,
                })
                .select('id')
                .single();

            if (error) {
                console.error(`❌ Erro ao inserir workout ${workout.id}:`, error.message);
                continue;
            }

            workoutIdMap.set(workout.id, data.id);
            process.stdout.write(`\r✅ Workouts: ${workoutIdMap.size}/${workouts.length}`);
        }
        console.log('');

        // 3. Busca todos os exercícios
        const exercises = db.prepare(`
            SELECT e.* FROM exercises e
            JOIN workouts w ON e.workout_id = w.id
            WHERE w.finished_at IS NOT NULL
            ORDER BY e.id ASC
        `).all();

        console.log(`📊 Encontrados ${exercises.length} exercícios`);

        // 4. Insere exercícios no Supabase
        for (const exercise of exercises) {
            const newWorkoutId = workoutIdMap.get(exercise.workout_id);
            if (!newWorkoutId) continue;

            const { data, error } = await supabase
                .from('exercises')
                .insert({
                    workout_id: newWorkoutId,
                    exercise_name: exercise.exercise_name,
                    order_index: exercise.order_index,
                    notes: exercise.notes,
                    created_at: exercise.created_at,
                })
                .select('id')
                .single();

            if (error) {
                console.error(`❌ Erro ao inserir exercise ${exercise.id}:`, error.message);
                continue;
            }

            exerciseIdMap.set(exercise.id, data.id);
            process.stdout.write(`\r✅ Exercícios: ${exerciseIdMap.size}/${exercises.length}`);
        }
        console.log('');

        // 5. Busca todos os sets
        const sets = db.prepare(`
            SELECT s.* FROM sets s
            JOIN exercises e ON s.exercise_id = e.id
            JOIN workouts w ON e.workout_id = w.id
            WHERE w.finished_at IS NOT NULL
            ORDER BY s.id ASC
        `).all();

        console.log(`📊 Encontradas ${sets.length} séries`);

        // 6. Insere sets no Supabase (em batch para performance)
        let setsInserted = 0;
        const BATCH_SIZE = 50;

        for (let i = 0; i < sets.length; i += BATCH_SIZE) {
            const batch = sets.slice(i, i + BATCH_SIZE);
            const setsToInsert = batch
                .filter(set => exerciseIdMap.has(set.exercise_id))
                .map(set => ({
                    exercise_id: exerciseIdMap.get(set.exercise_id),
                    order_index: set.order_index,
                    set_type: set.set_type || 'N',
                    weight: set.weight,
                    weight_type: set.weight_type || 'total',
                    reps: set.reps,
                    time_seconds: set.time_seconds,
                    rir: set.rir,
                    rpe: set.rpe,
                    completed: set.completed === 1,
                    notes: set.notes,
                    created_at: set.created_at,
                }));

            if (setsToInsert.length > 0) {
                const { error } = await supabase
                    .from('sets')
                    .insert(setsToInsert);

                if (error) {
                    console.error(`❌ Erro ao inserir batch de sets:`, error.message);
                } else {
                    setsInserted += setsToInsert.length;
                }
            }

            process.stdout.write(`\r✅ Séries: ${setsInserted}/${sets.length}`);
        }
        console.log('');

        // Resumo
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('✅ MIGRAÇÃO CONCLUÍDA!');
        console.log('═══════════════════════════════════════');
        console.log(`   Workouts: ${workoutIdMap.size}`);
        console.log(`   Exercícios: ${exerciseIdMap.size}`);
        console.log(`   Séries: ${setsInserted}`);
        console.log('═══════════════════════════════════════');

    } catch (error) {
        console.error('❌ Erro durante migração:', error);
    } finally {
        db.close();
    }
}

migrate();
