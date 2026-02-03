import { PlanoTreino, TemplateTreino } from '../types';

// TREINO A 2.0 - Perna + Empurrar + Ombro Lateral
export const treinoA: TemplateTreino = {
    id: 'treino-a',
    nome: 'Treino A',
    dia: 'Segunda/Quinta',
    focoPrincipal: 'Perna + Empurrar + Ombro Lateral',
    aquecimento: '5min + mobilidade de quadril e ombros',
    volumeTotal: 14,
    tempoEstimado: '50-60min',
    exercicios: [
        {
            id: '1a',
            nome: 'Agachamento Livre',
            grupoMuscular: 'Quadríceps/Glúteos',
            series: 3,
            reps: '6-8',
            rir: 2,
            descanso: '0s',
            notas: 'SUPERSET com Barra Fixa. Carga de "medo" (30kg+). Base sólida.'
        },
        {
            id: '1b',
            nome: 'Barra Fixa (Peso)',
            grupoMuscular: 'Costas/Bíceps',
            series: 3,
            reps: '4-6',
            rir: 2,
            descanso: '2-3min',
            notas: 'SUPERSET. Costas e bíceps. Pegada pronada.'
        },
        {
            id: '2a',
            nome: 'Paralelas (Peso)',
            grupoMuscular: 'Peito/Tríceps',
            series: 3,
            reps: '6-8',
            rir: 2,
            descanso: '0s',
            notas: 'SUPERSET com Elevação Lateral. Peito inferior e tríceps.'
        },
        {
            id: '2b',
            nome: 'Elevação Lateral',
            grupoMuscular: 'Ombros',
            series: 3,
            reps: '12-15',
            rir: 1,
            descanso: '90s',
            notas: 'SUPERSET. Ombro lateral fresco enquanto peito/tríceps descansa.'
        },
        {
            id: '3',
            nome: 'Coice Inclinado',
            grupoMuscular: 'Tríceps',
            series: 2,
            reps: '10-12',
            rir: 1,
            descanso: '60-90s',
            notas: 'Finalizador de tríceps. Banco +30°, cabeça longa.'
        }
    ]
};

// TREINO B 2.0 - Posterior Isolado + Upper + Antebraço
export const treinoB: TemplateTreino = {
    id: 'treino-b',
    nome: 'Treino B',
    dia: 'Terça/Sexta',
    focoPrincipal: 'Posterior Isolado + Upper + Antebraço',
    aquecimento: '5min + mobilidade de quadril',
    volumeTotal: 15,
    tempoEstimado: '55-65min',
    exercicios: [
        {
            id: '1a',
            nome: 'RDL (Stiff)',
            grupoMuscular: 'Posterior/Quadril',
            series: 3,
            reps: '6-8',
            rir: 2,
            descanso: '0s',
            notas: 'SUPERSET com Supino. Cadeia posterior pesada.'
        },
        {
            id: '1b',
            nome: 'Supino Inclinado Halter',
            grupoMuscular: 'Peito Superior',
            series: 3,
            reps: '8-10',
            rir: 2,
            descanso: '2-3min',
            notas: 'SUPERSET. Banco 30°. Foco peito superior.'
        },
        {
            id: '2a',
            nome: 'Mesa Flexora (Leg Curl)',
            grupoMuscular: 'Posterior',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '0s',
            notas: 'SUPERSET com Remada. Essencial para posterior isolado.'
        },
        {
            id: '2b',
            nome: 'Remada (Máquina/Curvada)',
            grupoMuscular: 'Costas',
            series: 3,
            reps: '8-10',
            rir: 2,
            descanso: '90s',
            notas: 'SUPERSET. Espessura. Puxar pro umbigo.'
        },
        {
            id: '3a',
            nome: 'Pullover (Polia/Halter)',
            grupoMuscular: 'Costas/Serrátil',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '0s',
            notas: 'SUPERSET com Rosca Martelo. Para o Front Lever.'
        },
        {
            id: '3b',
            nome: 'Rosca Martelo',
            grupoMuscular: 'Bíceps/Antebraço',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '60-90s',
            notas: 'SUPERSET. Bíceps + antebraço. Sem balançar.'
        }
    ]
};

export const planoAtual: PlanoTreino = {
    id: 'fullbody-ab-2025',
    nome: 'A/B 2.0',
    objetivo: 'Hipertrofia com eficiência - supersets para densidade',
    descricao: 'Programa A/B alternado. Semana 1: A-B-A-B-A (3A, 2B). Semana 2: B-A-B-A-B (3B, 2A).',
    criadoEm: 'Dezembro 2025',
    proximaRevisao: '8-12 semanas',
    estruturaSemanal: [
        { dia: 'Segunda', treino: 'Treino A', focoPrincipal: 'Perna + Empurrar' },
        { dia: 'Terça', treino: 'Treino B', focoPrincipal: 'Posterior + Upper' },
        { dia: 'Quarta', treino: 'Treino A', focoPrincipal: 'Perna + Empurrar' },
        { dia: 'Quinta', treino: 'Treino B', focoPrincipal: 'Posterior + Upper' },
        { dia: 'Sexta', treino: 'Treino A', focoPrincipal: 'Perna + Empurrar' },
        { dia: 'Sábado', treino: 'Descanso', focoPrincipal: '' },
        { dia: 'Domingo', treino: 'Descanso', focoPrincipal: '' }
    ],
    templates: [treinoA, treinoB],
    volumeSemanal: [
        { grupo: 'Quadríceps', series: 9, status: 'Via Agachamento (média 2.5x/sem)' },
        { grupo: 'Posterior', series: 15, status: 'RDL + Flexora (média 2.5x/sem)' },
        { grupo: 'Peito', series: 15, status: 'Paralelas + Supino' },
        { grupo: 'Costas', series: 15, status: 'Barra + Remada + Pullover' },
        { grupo: 'Ombros (lateral)', series: 8, status: 'Elevação Lateral' },
        { grupo: 'Tríceps', series: 13, status: 'Paralelas + Coice' },
        { grupo: 'Bíceps/Braquial', series: 15, status: 'Barra Fixa + Rosca Martelo' },
        { grupo: 'Antebraço', series: 8, status: 'Via Rosca Martelo' }
    ],
    regrasProgressao: [
        'Semana 1: A-B-A-B-A (foco em Perna+Empurrar)',
        'Semana 2: B-A-B-A-B (foco em Posterior+Upper)',
        'RIR 1-2 = quase falha. Deixar 1-2 reps no tanque',
        'Supersets: fazer A, imediatamente B, descansar',
        'Chegou no topo das reps com RIR 2? Sobe peso'
    ]
};

// Exports antigos para compatibilidade
export const upperA = treinoA;
export const lower = treinoB;
export const upperB = treinoA;
export const upperC = treinoB;
