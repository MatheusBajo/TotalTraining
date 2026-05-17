import { PlanoTreino, TemplateTreino } from '../types';

// TREINO A — Perna + Empurrar + Ombro
export const treinoA: TemplateTreino = {
    id: 'treino-a',
    nome: 'Treino A',
    dia: 'Segunda/Quarta/Sexta',
    focoPrincipal: 'Perna + Empurrar + Ombro',
    aquecimento: '5min + mobilidade de quadril e ombros',
    volumeTotal: 18,
    tempoEstimado: '50-60min',
    exercicios: [
        {
            id: '1',
            nome: 'Agachamento Livre',
            grupoMuscular: 'Quadríceps/Glúteos',
            series: 3,
            reps: '6-8',
            descanso: '2-3min',
            notas: 'Composto principal',
        },
        {
            id: '2',
            nome: 'Barra Fixa (Peso)',
            grupoMuscular: 'Costas/Bíceps',
            series: 3,
            reps: '4-6',
            descanso: '2-3min',
            notas: 'Largura dorsal',
        },
        {
            id: '3',
            nome: 'Tríceps Polia Corda',
            grupoMuscular: 'Tríceps',
            series: 3,
            reps: '12-15',
            descanso: '60-90s',
            notas: 'Substitui paralelas com peso (cotovelo)',
        },
        {
            id: '4',
            nome: 'Elevação Lateral Halter',
            grupoMuscular: 'Ombros',
            series: 3,
            reps: '12-15',
            descanso: '60-90s',
            notas: 'Largura do ombro',
        },
        {
            id: '5',
            nome: 'Encolhimento Halter',
            grupoMuscular: 'Trapézio',
            series: 3,
            reps: '10-12',
            descanso: '60s',
            notas: 'Trapézio, pega pesado',
        },
        {
            id: '6',
            nome: 'Panturrilha em Pé (cinta)',
            grupoMuscular: 'Panturrilha',
            series: 3,
            reps: '15-20',
            descanso: '45-60s',
            notas: 'Até falha, ROM completo no step',
        },
    ]
};

// TREINO B — Posterior + Peito + Costas
export const treinoB: TemplateTreino = {
    id: 'treino-b',
    nome: 'Treino B',
    dia: 'Terça/Quinta',
    focoPrincipal: 'Posterior + Peito + Costas',
    aquecimento: '5min + mobilidade de quadril',
    volumeTotal: 21,
    tempoEstimado: '55-65min',
    exercicios: [
        {
            id: '1',
            nome: 'RDL (Stiff)',
            grupoMuscular: 'Posterior/Quadril',
            series: 3,
            reps: '6-8',
            descanso: '2-3min',
            notas: 'Posterior alongado',
        },
        {
            id: '2',
            nome: 'Supino Inclinado Halter',
            grupoMuscular: 'Peito Superior',
            series: 3,
            reps: '8-10',
            descanso: '2-3min',
            notas: 'Peitoral superior + tríceps',
        },
        {
            id: '3',
            nome: 'Mesa Flexora',
            grupoMuscular: 'Posterior',
            series: 3,
            reps: '10-12',
            descanso: '60-90s',
            notas: 'Posterior encurtado',
        },
        {
            id: '4',
            nome: 'Remada',
            grupoMuscular: 'Costas',
            series: 3,
            reps: '8-10',
            descanso: '90s',
            notas: 'Espessura costas',
        },
        {
            id: '5',
            nome: 'Peck Deck',
            grupoMuscular: 'Peito',
            series: 3,
            reps: '10-12',
            descanso: '60-90s',
            notas: 'Isolamento peitoral',
            alternativas: ['Peck Deck', 'Crucifixo Máquina'],
        },
        {
            id: '6',
            nome: 'Rosca Martelo',
            grupoMuscular: 'Bíceps/Antebraço',
            series: 3,
            reps: '10-12',
            descanso: '60-90s',
            notas: 'Bíceps + braquial (seguro pro punho)',
            alternativas: ['Rosca Martelo', 'Rosca Direta'],
        },
        {
            id: '7',
            nome: 'Panturrilha em Pé (cinta)',
            grupoMuscular: 'Panturrilha',
            series: 3,
            reps: '15-20',
            descanso: '45-60s',
            notas: 'Até falha, todo treino',
        },
    ]
};

export const planoAtual: PlanoTreino = {
    id: 'ab-2026-updated',
    nome: 'A/B 2.0 — Atualizado',
    objetivo: 'Hipertrofia com eficiência — sem supersets, descanso adequado',
    descricao: 'Programa A/B alternado, 4-5x por semana.',
    criadoEm: 'Março 2026',
    proximaRevisao: '8-12 semanas',
    estruturaSemanal: [
        { dia: 'Segunda', treino: 'Treino A', focoPrincipal: 'Perna + Empurrar + Ombro' },
        { dia: 'Terça', treino: 'Treino B', focoPrincipal: 'Posterior + Peito + Costas' },
        { dia: 'Quarta', treino: 'Treino A', focoPrincipal: 'Perna + Empurrar + Ombro' },
        { dia: 'Quinta', treino: 'Treino B', focoPrincipal: 'Posterior + Peito + Costas' },
        { dia: 'Sexta', treino: 'Treino A', focoPrincipal: 'Perna + Empurrar + Ombro' },
        { dia: 'Sábado', treino: 'Descanso', focoPrincipal: '' },
        { dia: 'Domingo', treino: 'Descanso', focoPrincipal: '' }
    ],
    templates: [treinoA, treinoB],
    volumeSemanal: [
        { grupo: 'Quadríceps', series: 9, status: 'Via Agachamento (3x/sem)' },
        { grupo: 'Posterior', series: 12, status: 'RDL + Flexora (2x/sem)' },
        { grupo: 'Peito', series: 12, status: 'Supino + Peck Deck (2x/sem)' },
        { grupo: 'Costas', series: 15, status: 'Barra Fixa + Remada (4-5x/sem)' },
        { grupo: 'Ombros (lateral)', series: 9, status: 'Elevação Lateral (3x/sem)' },
        { grupo: 'Tríceps', series: 9, status: 'Polia Corda (3x/sem)' },
        { grupo: 'Bíceps/Braquial', series: 6, status: 'Rosca Martelo (2x/sem)' },
        { grupo: 'Trapézio', series: 9, status: 'Encolhimento (3x/sem)' },
        { grupo: 'Panturrilha', series: 15, status: 'Todo treino (5x/sem)' },
    ],
    regrasProgressao: [
        'A/B alternado: A-B-A-B-A ou B-A-B-A-B',
        'Sem supersets — descanso adequado entre séries',
        'RIR 0-2 dependendo do exercício',
        'Chegou no topo das reps? Sobe peso',
        'Panturrilha até falha todo treino',
    ]
};

// Exports antigos para compatibilidade
export const upperA = treinoA;
export const lower = treinoB;
export const upperB = treinoA;
export const upperC = treinoB;
