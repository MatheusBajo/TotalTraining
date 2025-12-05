import { User, Estatisticas } from '../types';

export const currentUser: User = {
    id: '1',
    nome: 'Matheus',
    idade: 18,
    peso: 57,
    pesoMeta: 70,
    nivel: 'intermediario',
    objetivos: [
        'Ganhar massa muscular',
        'Chegar aos 70kg mantendo definição',
        'Aumentar força nos compostos'
    ],
    prioridadesMusculares: [
        'Tríceps (cabeça longa)',
        'Peito superior',
        'Lat (largura/V-taper)',
        'Braquial',
        'Trapézio',
        'Serrátil'
    ],
    restricoes: [
        'Cotovelo acima da cabeça (francês, testa)',
        'Supinação com carga (rosca direta)',
        'Perna pesada na sexta (futebol sábado)'
    ],
    disponibilidade: ['Segunda', 'Terça', 'Quinta', 'Sexta'],
    criadoEm: '2025-12-01'
};

export const userStats: Estatisticas = {
    totalTreinos: 18,
    tempoTotal: '24h 30min',
    volumeTotal: 45250, // kg
    streak: 4,
    metaSemanal: {
        atual: 3,
        meta: 4
    },
    exerciciosFavoritos: [
        { nome: 'Supino Inclinado', vezesExecutado: 12 },
        { nome: 'Barra Fixa', vezesExecutado: 11 },
        { nome: 'Agachamento', vezesExecutado: 10 },
        { nome: 'RDL', vezesExecutado: 8 },
        { nome: 'Desenvolvimento', vezesExecutado: 8 }
    ],
    progressao: [
        { exercicio: 'Supino Reto', cargaInicial: 30, cargaAtual: 46, evolucao: 53 },
        { exercicio: 'Agachamento', cargaInicial: 40, cargaAtual: 60, evolucao: 50 },
        { exercicio: 'Barra Fixa', cargaInicial: 0, cargaAtual: 30, evolucao: 100 },
        { exercicio: 'RDL', cargaInicial: 40, cargaAtual: 70, evolucao: 75 },
        { exercicio: 'Desenvolvimento', cargaInicial: 20, cargaAtual: 44, evolucao: 120 }
    ]
};
