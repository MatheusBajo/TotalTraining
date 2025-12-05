// Tipos para o usuário
export interface User {
    id: string;
    nome: string;
    idade: number;
    peso: number;
    pesoMeta: number;
    nivel: 'iniciante' | 'intermediario' | 'avancado';
    objetivos: string[];
    prioridadesMusculares: string[];
    restricoes: string[];
    disponibilidade: string[];
    criadoEm: string;
}

// Tipos para exercícios
export interface Serie {
    carga?: number | string;
    reps: number | string;
    rir?: number;
    observacao?: string;
    dropSet?: string;
    restPause?: number;
    tempo?: number; // para isométricos como prancha
}

export interface Exercicio {
    id: string;
    nome: string;
    grupoMuscular: string;
    series: Serie[] | number;
    reps?: string;
    rir?: number;
    descanso?: string;
    notas?: string;
}

// Tipos para treino registrado (histórico)
export interface TreinoRegistrado {
    id: string;
    data: string;
    treino: string;
    horarioInicio?: string;
    horarioFim?: string;
    exercicios: {
        nome: string;
        series: Serie[];
        observacao?: string;
    }[];
    observacoes?: string;
    duracao?: number; // em minutos
}

// Tipos para template de treino (plano)
export interface TemplateTreino {
    id: string;
    nome: string;
    dia: string;
    focoPrincipal: string;
    aquecimento: string;
    exercicios: Exercicio[];
    volumeTotal: number;
    tempoEstimado: string;
}

// Tipos para o plano completo
export interface PlanoTreino {
    id: string;
    nome: string;
    descricao: string;
    criadoEm: string;
    proximaRevisao: string;
    estruturaSemanal: {
        dia: string;
        treino: string;
        focoPrincipal: string;
    }[];
    templates: TemplateTreino[];
    volumeSemanal: {
        grupo: string;
        series: number;
        status: string;
    }[];
    regrasProgressao: string[];
}

// Tipos para estatísticas
export interface Estatisticas {
    totalTreinos: number;
    tempoTotal: string;
    volumeTotal: number;
    streak: number;
    metaSemanal: {
        atual: number;
        meta: number;
    };
    exerciciosFavoritos: {
        nome: string;
        vezesExecutado: number;
    }[];
    progressao: {
        exercicio: string;
        cargaInicial: number;
        cargaAtual: number;
        evolucao: number;
    }[];
}
