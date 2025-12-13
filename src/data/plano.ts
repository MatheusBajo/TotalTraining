import { PlanoTreino, TemplateTreino } from '../types';

export const segunda: TemplateTreino = {
    id: 'segunda',
    nome: 'Segunda - Push',
    dia: 'Segunda',
    focoPrincipal: 'Peito/Tríceps/Ombro',
    aquecimento: '5min esteira + rotação de ombros',
    volumeTotal: 16,
    tempoEstimado: '50-60min',
    exercicios: [
        {
            id: '1',
            nome: 'Supino inclinado halter',
            grupoMuscular: 'Peito',
            series: 4,
            reps: '6-8',
            rir: 1,
            descanso: '2-3min',
            notas: 'Foco peito superior. Banco 30°'
        },
        {
            id: '2',
            nome: 'Paralelas',
            grupoMuscular: 'Peito/Tríceps',
            series: 3,
            reps: '6-8',
            rir: 1,
            descanso: '2-3min',
            notas: 'Inclinar tronco pra frente = mais peitoral'
        },
        {
            id: '3',
            nome: 'Elevação lateral',
            grupoMuscular: 'Ombros',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '60-90s',
            notas: 'Levemente inclinado pra frente'
        },
        {
            id: '4',
            nome: 'Coice inclinado',
            grupoMuscular: 'Tríceps',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '60-90s',
            notas: 'Banco +30°. Cabeça longa do tríceps'
        },
        {
            id: '5',
            nome: 'Pushdown corda unilateral',
            grupoMuscular: 'Tríceps',
            series: 3,
            reps: '10-12',
            rir: 0,
            descanso: '60s',
            notas: 'Última série até falha'
        }
    ]
};

export const terca: TemplateTreino = {
    id: 'terca',
    nome: 'Terça - Lower Quad',
    dia: 'Terça',
    focoPrincipal: 'Lower Quad Focus',
    aquecimento: '5min bike + mobilidade de quadril',
    volumeTotal: 19,
    tempoEstimado: '55-65min',
    exercicios: [
        {
            id: '1',
            nome: 'Agachamento narrow',
            grupoMuscular: 'Quadríceps',
            series: 5,
            reps: '6-8',
            rir: 1,
            descanso: '3-4min',
            notas: 'Pés mais juntos. Profundo'
        },
        {
            id: '2',
            nome: 'Búlgaro',
            grupoMuscular: 'Quadríceps/Glúteo',
            series: 4,
            reps: '8-10',
            rir: 2,
            descanso: '90s cada perna',
            notas: 'Por perna. Joelho da frente não passa do pé'
        },
        {
            id: '3',
            nome: 'RDL',
            grupoMuscular: 'Posterior',
            series: 4,
            reps: '8-10',
            rir: 1,
            descanso: '2min',
            notas: 'Romanian Deadlift. Joelho levemente flexionado'
        },
        {
            id: '4a',
            nome: 'Leg press pés juntos',
            grupoMuscular: 'Quadríceps',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '0s',
            notas: 'SUPERSET com Leg curl. Pés baixos e juntos'
        },
        {
            id: '4b',
            nome: 'Leg curl em pé',
            grupoMuscular: 'Posterior',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '90s',
            notas: 'SUPERSET. Controlar excêntrico'
        },
        {
            id: '5',
            nome: 'Panturrilha em pé',
            grupoMuscular: 'Panturrilha',
            series: 3,
            reps: '10-12',
            rir: 0,
            descanso: '60s',
            notas: 'Pausa embaixo (alongado). Até falha'
        }
    ]
};

export const quinta: TemplateTreino = {
    id: 'quinta',
    nome: 'Quinta - Pull',
    dia: 'Quinta',
    focoPrincipal: 'Pull/Ombro/Peito',
    aquecimento: '5min + 2x8 barra fixa sem peso',
    volumeTotal: 21,
    tempoEstimado: '60-70min',
    exercicios: [
        {
            id: '1',
            nome: 'Barra fixa com peso',
            grupoMuscular: 'Costas',
            series: 4,
            reps: '3-5',
            rir: 1,
            descanso: '3min',
            notas: '+25-30kg. Pegada pronada, média-aberta'
        },
        {
            id: '2',
            nome: 'Remada cavalinho',
            grupoMuscular: 'Costas',
            series: 3,
            reps: '6-8',
            rir: 1,
            descanso: '2-3min',
            notas: 'T-bar row. Puxar pro umbigo'
        },
        {
            id: '3',
            nome: 'Supino inclinado halter',
            grupoMuscular: 'Peito',
            series: 3,
            reps: '8-10',
            rir: 1,
            descanso: '2min',
            notas: 'Volume extra peito superior'
        },
        {
            id: '4a',
            nome: 'Development',
            grupoMuscular: 'Ombros',
            series: 3,
            reps: '8-10',
            rir: 1,
            descanso: '0s',
            notas: 'SUPERSET com Rosca martelo'
        },
        {
            id: '4b',
            nome: 'Rosca martelo',
            grupoMuscular: 'Bíceps/Braquial',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '90s',
            notas: 'SUPERSET. Sem balançar'
        },
        {
            id: '5a',
            nome: 'Encolhimento halter unilateral',
            grupoMuscular: 'Trapézio',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '0s',
            notas: 'SUPERSET com Elevação lateral'
        },
        {
            id: '5b',
            nome: 'Elevação lateral',
            grupoMuscular: 'Ombros',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '60s',
            notas: 'SUPERSET. Levemente inclinado'
        },
        {
            id: '6',
            nome: 'Remada inclinada 45°',
            grupoMuscular: 'Costas',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '90s',
            notas: 'Peito apoiado no banco inclinado'
        }
    ]
};

export const sextaSab: TemplateTreino = {
    id: 'sexta-sab',
    nome: 'Sexta/Sáb - Posterior',
    dia: 'Sexta',
    focoPrincipal: 'Lower Posterior + Arms',
    aquecimento: '5min + mobilidade de quadril',
    volumeTotal: 22,
    tempoEstimado: '55-65min',
    exercicios: [
        {
            id: '1',
            nome: 'RDL',
            grupoMuscular: 'Posterior',
            series: 4,
            reps: '8-10',
            rir: 1,
            descanso: '2-3min',
            notas: 'Romanian Deadlift. Principal do dia'
        },
        {
            id: '2',
            nome: 'Leg curl em pé',
            grupoMuscular: 'Posterior',
            series: 4,
            reps: '10-12',
            rir: 1,
            descanso: '90s',
            notas: 'Unilateral se possível'
        },
        {
            id: '3',
            nome: 'Flexora deitado',
            grupoMuscular: 'Posterior',
            series: 3,
            reps: '10-12',
            rir: 0,
            descanso: '90s',
            notas: 'Até falha. Controlar excêntrico'
        },
        {
            id: '4',
            nome: 'Coice inclinado',
            grupoMuscular: 'Tríceps',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '60-90s',
            notas: 'Banco +30°'
        },
        {
            id: '5',
            nome: 'Reverse curl',
            grupoMuscular: 'Antebraço',
            series: 3,
            reps: '10-12',
            rir: 1,
            descanso: '60s',
            notas: 'Rosca inversa. Pegada pronada'
        },
        {
            id: '6a',
            nome: "Farmer's walk snatch grip",
            grupoMuscular: 'Trapézio/Core',
            series: 3,
            reps: '40s',
            descanso: '0s',
            notas: 'SUPERSET com Panturrilha. Pegada larga'
        },
        {
            id: '6b',
            nome: 'Panturrilha sentado',
            grupoMuscular: 'Panturrilha',
            series: 3,
            reps: '10-12',
            rir: 0,
            descanso: '60s',
            notas: 'SUPERSET. Até falha'
        },
        {
            id: '7a',
            nome: 'Neck curl',
            grupoMuscular: 'Pescoço',
            series: 2,
            reps: '10-12',
            rir: 0,
            descanso: '0s',
            notas: 'SUPERSET com Neck extension. Deitado'
        },
        {
            id: '7b',
            nome: 'Neck extension',
            grupoMuscular: 'Pescoço',
            series: 2,
            reps: '10-12',
            rir: 0,
            descanso: '60s',
            notas: 'SUPERSET. De bruços'
        }
    ]
};

export const planoAtual: PlanoTreino = {
    id: 'hypertrophy-2025',
    nome: 'Hipertrofia 2025',
    descricao: 'Programa focado em hipertrofia com RIR baixo e supersets para densidade',
    criadoEm: 'Dezembro 2025',
    proximaRevisao: '8-12 semanas',
    estruturaSemanal: [
        { dia: 'Segunda', treino: 'Push', focoPrincipal: 'Peito/Tríceps/Ombro' },
        { dia: 'Terça', treino: 'Lower Quad', focoPrincipal: 'Quadríceps + Posterior' },
        { dia: 'Quarta', treino: 'Descanso', focoPrincipal: '—' },
        { dia: 'Quinta', treino: 'Pull', focoPrincipal: 'Costas/Bíceps/Ombro/Peito' },
        { dia: 'Sexta/Sáb', treino: 'Posterior', focoPrincipal: 'Posterior + Arms' }
    ],
    templates: [segunda, terca, quinta, sextaSab],
    volumeSemanal: [
        { grupo: 'Peito', series: 10, status: 'Bom' },
        { grupo: 'Costas', series: 13, status: 'Bom' },
        { grupo: 'Ombros (lateral)', series: 9, status: 'Priorizado' },
        { grupo: 'Tríceps', series: 12, status: 'Priorizado' },
        { grupo: 'Bíceps/Braquial', series: 6, status: 'Manutenção' },
        { grupo: 'Quadríceps', series: 12, status: 'Bom' },
        { grupo: 'Posterior', series: 14, status: 'Priorizado' },
        { grupo: 'Panturrilha', series: 6, status: 'Manutenção' },
        { grupo: 'Trapézio', series: 6, status: 'Incluído' },
        { grupo: 'Antebraço', series: 3, status: 'Incluído' },
        { grupo: 'Pescoço', series: 4, status: 'Incluído' }
    ],
    regrasProgressao: [
        'RIR 1 = quase falha. Deixar 1 rep no tanque',
        'RIR 0 = falha técnica. Última série do exercício',
        'Supersets: fazer A, imediatamente B, descansar',
        'Chegou no topo das reps com RIR 1? Sobe peso',
        'Farmer\'s walk: aumentar tempo ou peso quando ficar fácil'
    ]
};

// Exports antigos para compatibilidade
export const upperA = segunda;
export const lower = terca;
export const upperB = quinta;
export const upperC = sextaSab;
