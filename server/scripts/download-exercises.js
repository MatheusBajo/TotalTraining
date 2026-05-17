const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'ea21daa673msh5442d80f1a6daa8p189758jsn36f673e9f54e';
const API_HOST = 'exercisedb.p.rapidapi.com';

// Exercícios prioritários (os mais usados em treinos)
const PRIORITY_EXERCISES = [
  // Peito
  '0025', // barbell bench press
  '0047', // barbell incline bench press
  '0033', // barbell decline bench press
  '0289', // dumbbell bench press
  '0291', // dumbbell decline bench press
  '0295', // dumbbell incline bench press
  '0251', // chest dip
  '0169', // cable incline bench press
  '0153', // cable crossover

  // Costas
  '0652', // pull-up
  '0579', // lat pulldown
  '0027', // barbell bent over row
  '0293', // dumbbell bent over row
  '0298', // dumbbell one arm row
  '0609', // machine seated row
  '0246', // chin-up

  // Ombro
  '0081', // barbell shoulder press
  '0306', // dumbbell lateral raise
  '0312', // dumbbell shoulder press
  '0314', // dumbbell front raise
  '0016', // assisted shoulder press

  // Bíceps
  '0031', // barbell curl
  '0294', // dumbbell curl
  '0285', // dumbbell alternate biceps curl
  '0619', // machine biceps curl
  '0253', // concentration curl

  // Tríceps
  '0813', // triceps dip bench
  '0085', // barbell skull crusher
  '0350', // dumbbell triceps extension
  '0162', // cable triceps pushdown
  '0159', // cable overhead triceps extension

  // Perna
  '0043', // barbell full squat
  '0048', // barbell lunge
  '0116', // barbell stiff leg deadlift
  '0032', // barbell deadlift
  '0059', // barbell lying leg curl
  '0587', // leg extension
  '0585', // leg curl
  '0588', // leg press
  '0396', // hack squat

  // Abdômen
  '0001', // 3/4 sit-up
  '0003', // air bike
  '0461', // hanging leg raise
  '0274', // crunch
];

const IMAGES_DIR = path.join(__dirname, '..', 'data', 'images');
const DATA_FILE = path.join(__dirname, '..', 'data', 'exercisedb-priority.json');

// Garante que o diretório existe
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function fetchExercise(id) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      path: `/exercises/exercise/${id}`,
      method: 'GET',
      headers: {
        'x-rapidapi-host': API_HOST,
        'x-rapidapi-key': API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function downloadImage(exerciseId, resolution = 360) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      path: `/image?exerciseId=${exerciseId}&resolution=${resolution}`,
      method: 'GET',
      headers: {
        'x-rapidapi-host': API_HOST,
        'x-rapidapi-key': API_KEY
      }
    };

    const req = https.request(options, (res) => {
      const imagePath = path.join(IMAGES_DIR, `${exerciseId}.gif`);
      const fileStream = fs.createWriteStream(imagePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(imagePath);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Baixando exercícios prioritários do ExerciseDB...\n');

  const exercises = [];
  let downloaded = 0;
  let errors = 0;

  for (const id of PRIORITY_EXERCISES) {
    try {
      console.log(`[${downloaded + 1}/${PRIORITY_EXERCISES.length}] Baixando exercício ${id}...`);

      // Busca dados do exercício
      const exercise = await fetchExercise(id);

      if (exercise && exercise.name) {
        // Baixa a imagem
        const imagePath = await downloadImage(id);

        // Adiciona caminho da imagem local
        exercise.localImage = `${id}.gif`;
        exercises.push(exercise);

        console.log(`  ✓ ${exercise.name}`);
        downloaded++;
      } else {
        console.log(`  ✗ Exercício ${id} não encontrado`);
        errors++;
      }

      // Aguarda um pouco pra não sobrecarregar a API
      await sleep(200);

    } catch (error) {
      console.log(`  ✗ Erro ao baixar ${id}: ${error.message}`);
      errors++;
    }
  }

  // Salva o JSON com os exercícios
  fs.writeFileSync(DATA_FILE, JSON.stringify(exercises, null, 2));

  console.log(`\n========================================`);
  console.log(`Download concluído!`);
  console.log(`  Baixados: ${downloaded}`);
  console.log(`  Erros: ${errors}`);
  console.log(`  Arquivo: ${DATA_FILE}`);
  console.log(`  Imagens: ${IMAGES_DIR}`);
}

main().catch(console.error);
