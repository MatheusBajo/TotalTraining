import { PlanoTreino, TemplateTreino } from '../types';

export const upperA: TemplateTreino = {
    id: 'upper-a',
    nome: 'Upper A',
    dia: 'Segunda',
    focoPrincipal: 'Push (Peito superior + Tríceps)',
    aquecimento: '5min bike/esteira + rotação de ombros + 2x12 flexão leve',
    volumeTotal: 20,
    tempoEstimado: '55-65min',
    exercicios: [
        {
            id: '1',
            nome: 'Supino inclinado halteres',
            grupoMuscular: 'Peito',
            series: 4,
            reps: '6-8',
            rir: 2,
            descanso: '2-3min',
            notas: 'Foco peito superior. Banco 30-45°'
        },
        {
            id: '2',
            nome: 'Paralelas com peso',
            grupoMuscular: 'Peito/Tríceps',
            series: 4,
            reps: '5-6',
            rir: 2,
            descanso: '3min',
            notas: 'Inclinar tronco pra frente = mais peitoral. Descer até sentir alongamento'
        },
        {
            id: '3',
            nome: 'Desenvolvimento halteres',
            grupoMuscular: 'Ombros',
            series: 3,
            reps: '8-10',
            rir: 2,
            descanso: '2min',
            notas: 'Neutro ou levemente rotacionado'
        },
        {
            id: '4',
            nome: 'Tríceps pulley corda',
            grupoMuscular: 'Tríceps',
            series: 3,
            reps: '10-12',
            rir: 2,
            descanso: '90s',
            notas: 'Abrir a corda no final, squeeze'
        },
        {
            id: '5',
            nome: 'Tríceps coice',
            grupoMuscular: 'Tríceps',
            series: 3,
            reps: '10-12',
            rir: 2,
            descanso: '90s',
            notas: 'Ombro em extensão = cabeça longa'
        },
        {
            id: '6',
            nome: 'Elevação lateral',
            grupoMuscular: 'Ombros',
            series: 3,
            reps: '12-15',
            rir: 2,
            descanso: '60s',
            notas: 'Levemente inclinado pra frente'
        }
    ]
};

export const lower: TemplateTreino = {
    id: 'lower',
    nome: 'Lower',
    dia: 'Terça',
    focoPrincipal: 'Força + Potência',
    aquecimento: '5min bike + mobilidade de quadril + agachamento só com barra 2x10',
    volumeTotal: 20,
    tempoEstimado: '60-70min',
    exercicios: [
        {
            id: '1',
            nome: 'Box jump',
            grupoMuscular: 'Pernas',
            series: 3,
            reps: '4',
            descanso: '30s',
            notas: 'ANTES do agachamento. Explosão máxima, descer pisando'
        },
        {
            id: '2',
            nome: 'Agachamento livre',
            grupoMuscular: 'Quadríceps',
            series: 4,
            reps: '5',
            rir: 3,
            descanso: '3-4min',
            notas: 'Profundo. Intenção explosiva na subida'
        },
        {
            id: '3',
            nome: 'Leg press 45°',
            grupoMuscular: 'Quadríceps',
            series: 3,
            reps: '8-10',
            rir: 2,
            descanso: '2min',
            notas: 'Pés mais altos = mais posterior'
        },
        {
            id: '4',
            nome: 'Stiff',
            grupoMuscular: 'Posterior',
            series: 3,
            reps: '8-10',
            rir: 2,
            descanso: '2min',
            notas: 'Joelho levemente flexionado, coluna neutra'
        },
        {
            id: '5',
            nome: 'Mesa flexora',
            grupoMuscular: 'Posterior',
            series: 3,
            reps: '10-12',
            rir: 2,
            descanso: '90s',
            notas: 'Controlar excêntrico (3s descendo)'
        },
        {
            id: '6',
            nome: 'Panturrilha em pé',
            grupoMuscular: 'Panturrilha',
            series: 4,
            reps: '12-15',
            rir: 2,
            descanso: '60s',
            notas: 'Pausa embaixo (alongado)'
        }
    ]
};

export const upperB: TemplateTreino = {
    id: 'upper-b',
    nome: 'Upper B',
    dia: 'Quinta',
    focoPrincipal: 'Pull (Costas + Braquial + Trapézio)',
    aquecimento: '5min + 2x8 barra fixa sem peso + face pull leve',
    volumeTotal: 21,
    tempoEstimado: '55-65min',
    exercicios: [
        {
            id: '1',
            nome: 'Barra fixa com peso',
            grupoMuscular: 'Costas',
            series: 4,
            reps: '5-6',
            rir: 2,
            descanso: '3min',
            notas: 'Pegada pronada, média-aberta. Progressão de força'
        },
        {
            id: '2',
            nome: 'Remada curvada',
            grupoMuscular: 'Costas',
            series: 4,
            reps: '6-8',
            rir: 2,
            descanso: '2-3min',
            notas: 'Puxar pro umbigo, squeeze nas escápulas'
        },
        {
            id: '3',
            nome: 'Pullover haltere',
            grupoMuscular: 'Costas/Serrátil',
            series: 3,
            reps: '10-12',
            rir: 2,
            descanso: '90s',
            notas: 'Lat + serrátil. Amplitude grande'
        },
        {
            id: '4',
            nome: 'Encolhimento halteres',
            grupoMuscular: 'Trapézio',
            series: 3,
            reps: '10-12',
            rir: 2,
            descanso: '90s',
            notas: 'Segurar 2s no topo'
        },
        {
            id: '5',
            nome: 'Rosca martelo',
            grupoMuscular: 'Bíceps/Braquial',
            series: 4,
            reps: '8-10',
            rir: 2,
            descanso: '90s',
            notas: 'Braquial. Sem balançar'
        },
        {
            id: '6',
            nome: 'Rosca inversa',
            grupoMuscular: 'Antebraço',
            series: 3,
            reps: '12-15',
            rir: 2,
            descanso: '60s',
            notas: 'Se o pulso permitir. Senão, trocar por wrist curl neutro'
        }
    ]
};

export const upperC: TemplateTreino = {
    id: 'upper-c',
    nome: 'Upper C',
    dia: 'Sexta',
    focoPrincipal: 'Volume complementar + Serrátil',
    aquecimento: '5min + rotações + flexão 2x15',
    volumeTotal: 18,
    tempoEstimado: '45-55min',
    exercicios: [
        {
            id: '1',
            nome: 'Supino inclinado máquina',
            grupoMuscular: 'Peito',
            series: 3,
            reps: '8-10',
            rir: 2,
            descanso: '2min',
            notas: 'Mais volume pro peito superior'
        },
        {
            id: '2',
            nome: 'Crucifixo inclinado',
            grupoMuscular: 'Peito',
            series: 3,
            reps: '10-12',
            rir: 2,
            descanso: '90s',
            notas: 'Alongamento profundo embaixo'
        },
        {
            id: '3',
            nome: 'Paralelas',
            grupoMuscular: 'Tríceps',
            series: 3,
            reps: '8-10',
            rir: 2,
            descanso: '2min',
            notas: 'Volume extra tríceps (peso corporal ou leve)'
        },
        {
            id: '4',
            nome: 'Tríceps pulley unilateral',
            grupoMuscular: 'Tríceps',
            series: 3,
            reps: '12-15',
            rir: 2,
            descanso: '60s',
            notas: 'Do jeito que você faz sem dor'
        },
        {
            id: '5',
            nome: 'Face pull',
            grupoMuscular: 'Ombros/Costas',
            series: 3,
            reps: '15-20',
            rir: 2,
            descanso: '60s',
            notas: 'Rotação externa no final'
        },
        {
            id: '6',
            nome: 'Serrátil push-up',
            grupoMuscular: 'Serrátil',
            series: 3,
            reps: '12-15',
            rir: 2,
            descanso: '60s',
            notas: 'Protração escapular no final'
        }
    ]
};

export const planoAtual: PlanoTreino = {
    id: 'powerbuilding-funcional',
    nome: 'Powerbuilding Funcional',
    descricao: 'Programa focado em força + hipertrofia com prioridade em tríceps, peito superior e costas',
    criadoEm: 'Dezembro 2025',
    proximaRevisao: '8-12 semanas',
    estruturaSemanal: [
        { dia: 'Segunda', treino: 'Upper A', focoPrincipal: 'Push (Peito superior + Tríceps)' },
        { dia: 'Terça', treino: 'Lower', focoPrincipal: 'Força + Potência' },
        { dia: 'Quarta', treino: 'Descanso', focoPrincipal: '—' },
        { dia: 'Quinta', treino: 'Upper B', focoPrincipal: 'Pull (Costas + Braquial + Trapézio)' },
        { dia: 'Sexta', treino: 'Upper C', focoPrincipal: 'Volume complementar + Serrátil' },
        { dia: 'Sábado', treino: 'Futebol', focoPrincipal: '(ou treino de reposição)' }
    ],
    templates: [upperA, lower, upperB, upperC],
    volumeSemanal: [
        { grupo: 'Peito (total)', series: 14, status: 'Bom' },
        { grupo: 'Peito superior', series: 10, status: 'Priorizado' },
        { grupo: 'Tríceps', series: 16, status: 'Priorizado' },
        { grupo: 'Ombro lateral', series: 3, status: 'Manutenção' },
        { grupo: 'Costas (lat)', series: 11, status: 'Bom' },
        { grupo: 'Trapézio', series: 3, status: 'Adequado' },
        { grupo: 'Bíceps/Braquial', series: 7, status: 'Bom' },
        { grupo: 'Quadríceps', series: 7, status: 'Manutenção' },
        { grupo: 'Posterior', series: 9, status: 'Bom' },
        { grupo: 'Panturrilha', series: 4, status: 'Manutenção' },
        { grupo: 'Serrátil', series: 6, status: 'Incluído' }
    ],
    regrasProgressao: [
        'Começou com 6 reps? Tenta chegar em 8 mantendo o RIR',
        'Chegou em 8 reps com RIR 2? Sobe 2.5-5kg e volta pra 6 reps',
        'Barra Fixa: progride 2.5kg quando fizer 6 reps com RIR 2 por 2 sessões',
        'Agachamento: 5 reps com RIR 3 = progride 2.5kg na semana seguinte'
    ]
};
