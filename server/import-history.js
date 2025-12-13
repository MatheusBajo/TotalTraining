const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'totaltraining.db');
const db = new Database(dbPath);

// Dados históricos para importar
const historicalData = {
  "treinos": [
    {
      "data": "2024-02-01",
      "treino": "Upper Body",
      "exercicios": [
        {
          "nome": "Supino com Halteres",
          "series": [
            {"carga": 10, "reps": 12},
            {"carga": 12, "reps": 12},
            {"carga": 14, "reps": 12}
          ]
        },
        {
          "nome": "Crossover na Polia Baixa",
          "series": [
            {"carga": 10, "reps": 12},
            {"carga": 12, "reps": 12},
            {"carga": 12, "reps": 14}
          ]
        },
        {
          "nome": "Barra Fixa",
          "series": [
            {"reps": 10},
            {"reps": 9},
            {"reps": 7}
          ]
        },
        {
          "nome": "Remada Baixa na Polia",
          "series": [
            {"carga": 10, "reps": 12},
            {"carga": 20, "reps": 12},
            {"carga": 40, "reps": 12}
          ]
        },
        {
          "nome": "Desenvolvimento com Halteres",
          "series": [
            {"carga": 6, "reps": 12},
            {"carga": 7, "reps": 10},
            {"carga": 8, "reps": 14}
          ]
        },
        {
          "nome": "Elevação Lateral",
          "series": [
            {"carga": 5, "reps": 10},
            {"carga": 6, "reps": 12},
            {"carga": 6, "reps": 15}
          ]
        },
        {
          "nome": "Rosca Direta com Barra W",
          "series": [
            {"carga": 6, "reps": 12},
            {"carga": 10, "reps": 11},
            {"carga": 10, "reps": 12}
          ]
        },
        {
          "nome": "Rosca Martelo",
          "series": [
            {"carga": 5, "reps": 12},
            {"carga": 6, "reps": 12},
            {"carga": 6, "reps": 12}
          ]
        },
        {
          "nome": "Tríceps na Corda (Polia Alta)",
          "series": [
            {"carga": 15, "reps": 11},
            {"carga": 20, "reps": 12},
            {"carga": 10, "reps": 15}
          ]
        }
      ]
    },
    {
      "data": "2024-02-02",
      "treino": "Lower Body",
      "exercicios": [
        {
          "nome": "Agachamento Livre",
          "series": [
            {"carga": 10, "reps": 12},
            {"carga": 20, "reps": 12},
            {"carga": 30, "reps": 12},
            {"carga": 30, "reps": 12}
          ]
        },
        {
          "nome": "Leg Press 45°",
          "series": [
            {"carga": 90, "reps": 11},
            {"carga": 90, "reps": 11},
            {"carga": 100, "reps": 9}
          ]
        },
        {
          "nome": "Cadeira Extensora",
          "series": [
            {"carga": 15, "reps": 12},
            {"carga": 20, "reps": 12},
            {"carga": 30, "reps": 12}
          ]
        },
        {
          "nome": "Mesa Flexora",
          "series": [
            {"carga": 40, "reps": 12},
            {"carga": 50, "reps": 10},
            {"carga": 50, "reps": 12}
          ]
        },
        {
          "nome": "Stiff com Halteres",
          "series": [
            {"carga": 10, "reps": 12},
            {"carga": 15, "reps": 12},
            {"carga": 17, "reps": 10}
          ]
        },
        {
          "nome": "Panturrilha no Smith Machine",
          "series": [
            {"carga": 10, "reps": 20},
            {"carga": 15, "reps": 15},
            {"carga": 20, "reps": 16}
          ]
        }
      ]
    },
    {
      "data": "2025-02-04",
      "treino": "Full Body B",
      "exercicios": [
        {
          "nome": "Peck Deck (Máquina Peitoral)",
          "series": [
            {"carga": 50, "reps": 12},
            {"carga": 50, "reps": 12},
            {"carga": 50, "reps": 12}
          ]
        },
        {
          "nome": "Remada Máquina com Peito Apoiado",
          "series": [
            {"carga": 10, "reps": 12},
            {"carga": 20, "reps": 12},
            {"carga": 25, "reps": 12}
          ]
        },
        {
          "nome": "Leg Press",
          "series": [
            {"carga": 40, "reps": 12},
            {"carga": 50, "reps": 12},
            {"carga": 60, "reps": 12}
          ]
        },
        {
          "nome": "Desenvolvimento Máquina (Ombros)",
          "series": [
            {"carga": 5, "reps": 12},
            {"carga": 10, "reps": 12},
            {"carga": 13, "reps": 11}
          ]
        },
        {
          "nome": "Rosca Martelo Banco Inclinado",
          "series": [
            {"carga": 5, "reps": 12},
            {"carga": 6, "reps": 12},
            {"carga": 7, "reps": 15}
          ]
        },
        {
          "nome": "Extensão de Tríceps na Polia",
          "series": [
            {"carga": 20, "reps": 12},
            {"carga": 30, "reps": 12},
            {"carga": 30, "reps": 10}
          ]
        },
        {
          "nome": "Panturrilha (Gêmeos)",
          "series": [
            {"carga": 10, "reps": 15},
            {"carga": 10, "reps": 10}
          ]
        }
      ]
    },
    {
      "data": "2025-02-06",
      "treino": "Full Body A",
      "exercicios": [
        {
          "nome": "Supino com Halteres",
          "series": [
            {"carga": 12, "reps": 12},
            {"carga": 14, "reps": 12},
            {"carga": 16, "reps": 12}
          ]
        },
        {
          "nome": "Barra Fixa",
          "series": [
            {"carga": 6, "reps": 10},
            {"carga": 6, "reps": 10},
            {"reps": 13}
          ]
        },
        {
          "nome": "Agachamento Livre",
          "series": [
            {"carga": 15, "reps": 12},
            {"carga": 18, "reps": 10},
            {"carga": 20, "reps": 12}
          ]
        },
        {
          "nome": "Elevação Lateral no Banco",
          "series": [
            {"carga": 6, "reps": 12},
            {"carga": 7, "reps": 12},
            {"carga": 8, "reps": 10}
          ]
        },
        {
          "nome": "Rosca no Banco Inclinado",
          "series": [
            {"carga": 6, "reps": 12},
            {"carga": 7, "reps": 12},
            {"carga": 8, "reps": 12}
          ]
        },
        {
          "nome": "Mergulho na Paralela",
          "series": [
            {"reps": 12},
            {"carga": 2, "reps": 10}
          ]
        },
        {
          "nome": "Antebraço (Rosca Inversa)",
          "series": [
            {"carga": 5, "reps": 10},
            {"carga": 5, "reps": 10}
          ]
        }
      ]
    },
    {
      "data": "2025-02-10",
      "treino": "Full Body A",
      "exercicios": [
        {
          "nome": "Supino com Halteres",
          "series": [
            {"carga": 16, "reps": 12},
            {"carga": 16, "reps": 10},
            {"carga": 16, "reps": 10}
          ]
        },
        {
          "nome": "Barra Fixa",
          "series": [
            {"carga": 6, "reps": 10},
            {"carga": 6, "reps": 10},
            {"reps": 13}
          ]
        },
        {
          "nome": "Agachamento Livre",
          "series": [
            {"carga": 15, "reps": 12},
            {"carga": 18, "reps": 10},
            {"carga": 20, "reps": 12}
          ]
        },
        {
          "nome": "Elevação Lateral no Banco",
          "series": [
            {"carga": 6, "reps": 12},
            {"carga": 7, "reps": 12},
            {"carga": 8, "reps": 10}
          ]
        },
        {
          "nome": "Rosca Martelo no Banco Inclinado",
          "series": [
            {"carga": 6, "reps": 12},
            {"carga": 7, "reps": 12},
            {"carga": 8, "reps": 12}
          ]
        },
        {
          "nome": "Mergulho na Paralela",
          "series": [
            {"reps": 12},
            {"carga": 2, "reps": 10}
          ]
        },
        {
          "nome": "Antebraço (Rosca Inversa)",
          "series": [
            {"carga": 5, "reps": 10},
            {"carga": 5, "reps": 10}
          ]
        }
      ]
    },
    {
      "data": "2025-06-16",
      "treino": "Força/Volume",
      "exercicios": [
        {
          "nome": "Supino Reto",
          "series": [
            {"carga": 15, "reps": 6, "rir": 3, "per_side": true},
            {"carga": 18, "reps": 6, "rir": 2, "per_side": true},
            {"carga": 19, "reps": 6, "rir": 0, "per_side": true}
          ]
        },
        {
          "nome": "Agachamento",
          "series": [
            {"carga": 20, "reps": 5, "rir": 4, "per_side": true},
            {"carga": 25, "reps": 5, "rir": 1, "per_side": true},
            {"carga": 25, "reps": 6, "rir": 0, "per_side": true}
          ]
        },
        {
          "nome": "Barra Fixa",
          "series": [
            {"carga": 20, "reps": 5, "rir": 1},
            {"carga": 15, "reps": 6, "rir": 2},
            {"carga": 20, "reps": 6, "rir": 0}
          ]
        },
        {
          "nome": "Desenvolvimento",
          "series": [
            {"carga": 20, "reps": 8, "rir": 1, "per_side": true},
            {"carga": 15, "reps": 8, "rir": 3, "per_side": true},
            {"carga": 15, "reps": 8, "rir": 3, "per_side": true}
          ]
        },
        {
          "nome": "Panturrilha Em Pé",
          "series": [
            {"carga": 20, "reps": 18, "rir": 0},
            {"carga": 20, "reps": 18, "rir": 0},
            {"carga": 20, "reps": 18, "rir": 0}
          ]
        }
      ]
    },
    {
      "data": "2025-06-18",
      "treino": "Volume/Acessórios",
      "exercicios": [
        {
          "nome": "RDL",
          "series": [
            {"carga": 20, "reps": 6, "rir": 4, "per_side": true},
            {"carga": 22, "reps": 9, "rir": 3, "per_side": true},
            {"carga": 25, "reps": 10, "rir": 3, "per_side": true},
            {"carga": 30, "reps": 8, "rir": 1, "per_side": true}
          ]
        },
        {
          "nome": "Supino Inclinado Halter",
          "series": [
            {"carga": 16, "reps": 8, "rir": 2},
            {"carga": 20, "reps": 6, "rir": 2},
            {"carga": 22, "reps": 7, "rir": 0},
            {"carga": 22, "reps": 7, "rir": 0}
          ]
        },
        {
          "nome": "Desenvolvimento",
          "series": [
            {"carga": 7, "reps": 8},
            {"carga": 10, "reps": 8, "rir": 5},
            {"carga": 15, "reps": 8, "rir": 3},
            {"carga": 20, "reps": 8, "rir": 0}
          ]
        },
        {
          "nome": "Remada Máquina",
          "series": [
            {"carga": 30, "reps": 12, "rir": 6},
            {"carga": 40, "reps": 11, "rir": 2},
            {"carga": 44, "reps": 12, "rir": 0},
            {"carga": 40, "reps": 4, "rir": 0}
          ]
        },
        {
          "nome": "Elevação Lateral",
          "series": [
            {"carga": 7, "reps": 15},
            {"carga": 4, "reps": 10},
            {"carga": 8, "reps": 14},
            {"carga": 4, "reps": 10}
          ]
        },
        {
          "nome": "Rosca Direta Barra W",
          "series": [
            {"carga": 7.5, "reps": 12, "rir": 2, "per_side": true},
            {"carga": 10, "reps": 11, "rir": 0, "per_side": true},
            {"carga": 10, "reps": 11, "rir": 0, "per_side": true}
          ]
        },
        {
          "nome": "Tríceps Unilateral EZ",
          "series": [
            {"carga": 15, "reps": 12, "rir": 1},
            {"carga": 15, "reps": 12, "rir": 1}
          ]
        },
        {
          "nome": "Panturrilha Em Pé",
          "series": [
            {"carga": 20, "reps": 18, "rir": 0},
            {"carga": 20, "reps": 18, "rir": 0},
            {"carga": 20, "reps": 18, "rir": 0}
          ]
        }
      ]
    },
    {
      "data": "2025-06-21",
      "treino": "Força",
      "exercicios": [
        {
          "nome": "Supino Reto",
          "series": [
            {"carga": 20, "reps": 5, "rir": 1, "per_side": true},
            {"carga": 20, "reps": 5, "rir": 1, "per_side": true},
            {"carga": 21, "reps": 6, "rir": 0, "per_side": true}
          ]
        },
        {
          "nome": "Agachamento",
          "series": [
            {"carga": 20, "reps": 5, "rir": 4, "per_side": true},
            {"carga": 25, "reps": 5, "rir": 1, "per_side": true},
            {"carga": 25, "reps": 5, "rir": 1, "per_side": true}
          ]
        },
        {
          "nome": "Barra Fixa",
          "series": [
            {"carga": 20, "reps": 5, "rir": 3},
            {"carga": 30, "reps": 3, "rir": 0}
          ]
        },
        {
          "nome": "Rosca Halter",
          "series": [
            {"carga": 8, "reps": 10, "rir": 0},
            {"carga": 8, "reps": 11, "rir": 0},
            {"carga": 8, "reps": 10, "rir": 0}
          ]
        }
      ]
    },
    {
      "data": "2025-06-23",
      "treino": "Acessórios",
      "exercicios": [
        {
          "nome": "Tríceps Unilateral EZ",
          "series": [
            {"carga": 15, "reps": 10, "rir": 3}
          ]
        },
        {
          "nome": "Paralelas",
          "series": [
            {"carga": 20, "reps": 8, "rir": 2},
            {"carga": 20, "reps": 6, "rir": 1}
          ]
        }
      ]
    },
    {
      "data": "2025-06-24",
      "treino": "Volume Completo",
      "exercicios": [
        {
          "nome": "RDL",
          "series": [
            {"carga": 20, "reps": 8, "per_side": true},
            {"carga": 30, "reps": 8, "per_side": true},
            {"carga": 45, "reps": 8, "rir": 2, "per_side": true},
            {"carga": 45, "reps": 8, "rir": 2, "per_side": true},
            {"carga": 45, "reps": 8, "rir": 2, "per_side": true}
          ]
        },
        {
          "nome": "Supino Inclinado Halter",
          "series": [
            {"carga": 16, "reps": 10},
            {"carga": 22, "reps": 8, "rir": 1},
            {"carga": 22, "reps": 8, "rir": 1},
            {"carga": 22, "reps": 8, "rir": 1}
          ]
        },
        {
          "nome": "Desenvolvimento",
          "series": [
            {"carga": 20, "reps": 8, "rir": 1, "per_side": true},
            {"carga": 20, "reps": 8, "rir": 1, "per_side": true},
            {"carga": 20, "reps": 8, "rir": 1, "per_side": true}
          ]
        },
        {
          "nome": "Remada Baixa",
          "series": [
            {"carga": 45, "reps": 10, "rir": 2},
            {"carga": 45, "reps": 10, "rir": 2},
            {"carga": 45, "reps": 10, "rir": 1}
          ]
        },
        {
          "nome": "Elevação Lateral",
          "series": [
            {"carga": 8, "reps": 12},
            {"carga": 4, "reps": 10},
            {"carga": 8, "reps": 10},
            {"carga": 4, "reps": 10}
          ]
        },
        {
          "nome": "Rosca Halter",
          "series": [
            {"carga": 8, "reps": 10, "rir": 0},
            {"carga": 8, "reps": 10, "rir": 0},
            {"carga": 8, "reps": 10, "rir": 0}
          ]
        },
        {
          "nome": "Extensão Unilateral EZ",
          "series": [
            {"carga": 17, "reps": 12, "rir": 1},
            {"carga": 17, "reps": 12, "rir": 1},
            {"carga": 17, "reps": 12, "rir": 1}
          ]
        },
        {
          "nome": "Panturrilha Em Pé",
          "series": [
            {"carga": 25, "reps": 15, "rir": 0},
            {"carga": 25, "reps": 15, "rir": 0},
            {"carga": 25, "reps": 20, "rir": 0}
          ]
        }
      ]
    },
    {
      "data": "2025-06-25",
      "treino": "Força + Desenvolvimento",
      "exercicios": [
        {
          "nome": "Agachamento",
          "series": [
            {"carga": 20, "reps": 5, "rir": 3, "per_side": true},
            {"carga": 25, "reps": 5, "rir": 1, "per_side": true},
            {"carga": 25, "reps": 5, "rir": 0, "per_side": true}
          ]
        },
        {
          "nome": "Supino Reto",
          "series": [
            {"carga": 20, "reps": 5, "rir": 3, "per_side": true},
            {"carga": 22, "reps": 5, "rir": 1, "per_side": true},
            {"carga": 23, "reps": 4, "rir": 0, "per_side": true}
          ]
        },
        {
          "nome": "Desenvolvimento",
          "series": [
            {"carga": 15, "reps": 7, "rir": 4, "per_side": true},
            {"carga": 20, "reps": 8, "rir": 4, "per_side": true},
            {"carga": 25, "reps": 6, "rir": 1, "per_side": true},
            {"carga": 30, "reps": 5, "rir": 0, "per_side": true}
          ]
        },
        {
          "nome": "Panturrilha Em Pé",
          "series": [
            {"carga": 20, "reps": 15},
            {"carga": 25, "reps": 15, "rir": 0},
            {"carga": 25, "reps": 15, "rir": 0}
          ]
        }
      ]
    },
    {
      "data": "2025-07-01",
      "treino": "Volume/Acessórios",
      "exercicios": [
        {
          "nome": "RDL",
          "series": [
            {"carga": 20, "reps": 6, "rir": 4, "per_side": true},
            {"carga": 22, "reps": 9, "rir": 3, "per_side": true},
            {"carga": 25, "reps": 10, "rir": 3, "per_side": true},
            {"carga": 30, "reps": 8, "rir": 1, "per_side": true},
            {"carga": 32, "reps": 5, "rir": 3, "per_side": true},
            {"carga": 32, "reps": 8, "rir": 2, "per_side": true},
            {"carga": 32, "reps": 4, "per_side": true},
            {"carga": 32, "reps": 8, "rir": 2, "per_side": true}
          ]
        },
        {
          "nome": "Supino Inclinado Halter",
          "series": [
            {"carga": 22, "reps": 8, "rir": 2},
            {"carga": 22, "reps": 7, "rir": 0},
            {"carga": 20, "reps": 9, "rir": 0}
          ]
        },
        {
          "nome": "Remada Baixa",
          "series": [
            {"carga": 44, "reps": 10, "rir": 1},
            {"carga": 42, "reps": 10, "rir": 3}
          ]
        },
        {
          "nome": "Elevação Lateral",
          "series": [
            {"carga": 8, "reps": 15, "rir": 0},
            {"carga": 8, "reps": 13, "rir": 1},
            {"carga": 8, "reps": 13},
            {"carga": 4, "reps": 5}
          ]
        },
        {
          "nome": "Paralelas",
          "series": [
            {"carga": 20, "reps": 8, "rir": 2}
          ]
        },
        {
          "nome": "Panturrilha Em Pé",
          "series": [
            {"carga": 20, "reps": 15, "rir": 0},
            {"carga": 20, "reps": 15, "rir": 0},
            {"carga": 20, "reps": 20, "rir": 0}
          ]
        }
      ]
    },
    {
      "data": "2025-07-02",
      "treino": "Força Completa",
      "exercicios": [
        {
          "nome": "Agachamento",
          "series": [
            {"carga": 25, "reps": 5, "rir": 2, "per_side": true},
            {"carga": 25, "reps": 5, "rir": 3, "per_side": true},
            {"carga": 30, "reps": 5, "rir": 1, "per_side": true}
          ]
        },
        {
          "nome": "Supino Reto",
          "series": [
            {"carga": 10, "reps": 5, "per_side": true},
            {"carga": 20, "reps": 5, "rir": 3, "per_side": true},
            {"carga": 22, "reps": 5, "rir": 1, "per_side": true},
            {"carga": 23, "reps": 4, "rir": 0, "per_side": true}
          ]
        },
        {
          "nome": "Barra Fixa",
          "series": [
            {"carga": 20, "reps": 5, "rir": 3},
            {"carga": 25, "reps": 6, "rir": 0},
            {"carga": 22, "reps": 5, "rir": 0}
          ]
        },
        {
          "nome": "Desenvolvimento",
          "series": [
            {"carga": 22, "reps": 7, "rir": 2, "per_side": true},
            {"carga": 22, "reps": 6, "rir": 2, "per_side": true},
            {"carga": 22, "reps": 6, "rir": 2, "per_side": true}
          ]
        },
        {
          "nome": "Panturrilha Em Pé",
          "series": [
            {"carga": 25, "reps": 15, "rir": 0},
            {"carga": 25, "reps": 21, "rir": 0}
          ]
        }
      ]
    },
    {
      "data": "2025-07-07",
      "treino": "Volume",
      "exercicios": [
        {
          "nome": "RDL",
          "series": [
            {"carga": 35, "reps": 8, "rir": 2, "per_side": true},
            {"carga": 35, "reps": 8, "rir": 3, "per_side": true},
            {"carga": 35, "reps": 8, "rir": 2, "per_side": true}
          ]
        },
        {
          "nome": "Supino Inclinado",
          "series": [
            {"carga": 22, "reps": 6, "rir": 1},
            {"carga": 20, "reps": 8, "rir": 1}
          ]
        },
        {
          "nome": "Remada Baixa",
          "series": [
            {"carga": 44, "reps": 10, "rir": 1},
            {"carga": 42, "reps": 10, "rir": 3}
          ]
        },
        {
          "nome": "Elevação Lateral",
          "series": [
            {"carga": 8, "reps": 15, "rir": 2},
            {"carga": 8, "reps": 15, "rir": 2}
          ]
        },
        {
          "nome": "Paralelas",
          "series": [
            {"carga": 20, "reps": 8, "rir": 2},
            {"carga": 20, "reps": 7, "rir": 1}
          ]
        },
        {
          "nome": "Panturrilha Em Pé",
          "series": [
            {"carga": 20, "reps": 15, "rir": 0},
            {"carga": 20, "reps": 15, "rir": 0},
            {"carga": 20, "reps": 20, "rir": 0}
          ]
        }
      ]
    },
    {
      "data": "2025-07-14",
      "treino": "Força",
      "exercicios": [
        {
          "nome": "Supino Reto",
          "series": [
            {"carga": 22, "reps": 4, "rir": 0, "per_side": true},
            {"carga": 22, "reps": 5, "rir": 0, "per_side": true},
            {"carga": 20, "reps": 5, "rir": 1, "per_side": true}
          ]
        },
        {
          "nome": "Desenvolvimento",
          "series": [
            {"carga": 20, "reps": 8, "rir": 1, "per_side": true},
            {"carga": 20, "reps": 8, "rir": 1, "per_side": true},
            {"carga": 20, "reps": 8, "rir": 1, "per_side": true}
          ]
        },
        {
          "nome": "Barra Fixa",
          "series": [
            {"carga": 20, "reps": 6, "rir": 2},
            {"carga": 25, "reps": 5, "rir": 1}
          ]
        }
      ]
    },
    {
      "data": "2025-08-18",
      "treino": "Upper Power",
      "exercicios": [
        {
          "nome": "Supino Inclinado 30°",
          "series": [
            {"carga": 10, "reps": 8},
            {"carga": 20, "reps": 5, "rir": 1},
            {"carga": 20, "reps": 5, "rir": 0},
            {"carga": 15, "reps": 13, "rir": 0}
          ]
        },
        {
          "nome": "Barra Fixa",
          "series": [
            {"reps": 10},
            {"carga": 20, "reps": 6, "rir": 1},
            {"carga": 25, "reps": 5, "rir": 0}
          ]
        },
        {
          "nome": "Desenvolvimento Militar",
          "series": [
            {"carga": 15, "reps": 8, "rir": 1}
          ]
        }
      ]
    },
    {
      "data": "2025-08-23",
      "treino": "Push",
      "exercicios": [
        {
          "nome": "Supino Inclinado Halteres",
          "series": [
            {"carga": 10, "reps": 10},
            {"carga": 15, "reps": 8, "rir": 3},
            {"carga": 20, "reps": 8, "rir": 2},
            {"carga": 22, "reps": 6, "rir": 1}
          ]
        },
        {
          "nome": "Paralelas",
          "series": [
            {"carga": 25, "reps": 6, "rir": 1},
            {"carga": 20, "reps": 9, "rir": 1},
            {"carga": 20, "reps": 16, "rir": 0}
          ]
        },
        {
          "nome": "Desenvolvimento Halteres",
          "series": [
            {"carga": 12, "reps": 8, "rir": 3},
            {"carga": 12, "reps": 10, "rir": 2},
            {"carga": 14, "reps": 6, "rir": 0}
          ]
        },
        {
          "nome": "Peck Deck",
          "series": [
            {"carga": 60, "reps": 8, "rir": 2},
            {"carga": 50, "reps": 12, "rir": 2}
          ]
        }
      ]
    },
    {
      "data": "2025-12-11",
      "treino": "Lower",
      "exercicios": [
        {
          "nome": "Agachamento livre",
          "series": [
            {"carga": 2, "reps": 8, "rir": 5},
            {"carga": 30, "reps": 6, "rir": 2},
            {"carga": 30, "reps": 6, "rir": 2},
            {"carga": 30, "reps": 8, "rir": 0}
          ]
        },
        {
          "nome": "Stiff",
          "series": [
            {"carga": 20, "reps": 6, "rir": 4},
            {"carga": 20, "reps": 8, "rir": 3},
            {"carga": 25, "reps": 8, "rir": 3},
            {"carga": 25, "reps": 8, "rir": 2}
          ]
        }
      ]
    }
  ]
};

// Função para limpar o banco
function clearDatabase() {
  console.log('🗑️  Limpando banco de dados...');
  db.exec('DELETE FROM sets');
  db.exec('DELETE FROM exercises');
  db.exec('DELETE FROM workouts');
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('workouts', 'exercises', 'sets')");
  console.log('✅ Banco limpo!');
}

// Função para importar os dados
function importData() {
  console.log('📥 Importando dados históricos...');

  const insertWorkout = db.prepare(`
    INSERT INTO workouts (date, name, template_id, started_at, finished_at, duration_seconds, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertExercise = db.prepare(`
    INSERT INTO exercises (workout_id, exercise_name, order_index, notes)
    VALUES (?, ?, ?, ?)
  `);

  const insertSet = db.prepare(`
    INSERT INTO sets (exercise_id, order_index, weight, weight_type, reps, rir, set_type, time_seconds, completed, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalWorkouts = 0;
  let totalExercises = 0;
  let totalSets = 0;

  for (const treino of historicalData.treinos) {
    // Pula treinos sem exercícios reais
    if (!treino.exercicios || treino.exercicios.length === 0) continue;

    const startedAt = `${treino.data}T12:00:00`;
    const finishedAt = `${treino.data}T13:00:00`;

    const workoutResult = insertWorkout.run(
      treino.data,
      treino.treino,
      null,
      startedAt,
      finishedAt,
      3600, // 1 hora default
      treino.observacao || null
    );

    const workoutId = workoutResult.lastInsertRowid;
    totalWorkouts++;

    treino.exercicios.forEach((exercicio, exIndex) => {
      // Pula exercícios que são só templates (sem séries reais)
      if (!exercicio.series || !Array.isArray(exercicio.series) || exercicio.series.length === 0) return;
      if (typeof exercicio.series[0] === 'string') return; // É um template, não dados reais

      const exerciseResult = insertExercise.run(
        workoutId,
        exercicio.nome,
        exIndex,
        exercicio.observacao || null
      );

      const exerciseId = exerciseResult.lastInsertRowid;
      totalExercises++;

      exercicio.series.forEach((serie, setIndex) => {
        // Pula séries sem dados
        if (typeof serie === 'string') return;
        if (serie.reps === 'A DEFINIR' || serie.carga === 'PULADO') return;

        // Extrai peso (pode ser carga, halter_kg, pino_kg, placas_lado_kg, etc)
        let weight = serie.carga || serie.halter_kg || serie.pino_kg || serie.peso_kg || serie.peso_extra_kg || null;
        if (serie.placas_lado_kg) {
          weight = serie.placas_lado_kg;
        }

        // Tipo de peso
        let weightType = 'total';
        if (serie.per_side || serie.placas_lado_kg) {
          weightType = 'per_side';
        }

        // Reps (pode ser número ou string como "falha")
        let reps = serie.reps;
        if (typeof reps === 'string') {
          // Tenta extrair número
          const match = reps.match(/\d+/);
          reps = match ? parseInt(match[0]) : null;
        }

        // RIR
        const rir = serie.rir !== undefined ? serie.rir : (serie.RIR !== undefined ? serie.RIR : null);

        // Tempo (para exercícios isométricos)
        const timeSeconds = serie.tempo_seg || null;

        insertSet.run(
          exerciseId,
          setIndex,
          weight,
          weightType,
          reps,
          rir,
          'N', // tipo normal
          typeof timeSeconds === 'number' ? timeSeconds : null,
          1, // completed
          serie.observacao || null
        );

        totalSets++;
      });
    });
  }

  console.log(`✅ Importação concluída!`);
  console.log(`   📊 ${totalWorkouts} treinos`);
  console.log(`   💪 ${totalExercises} exercícios`);
  console.log(`   🔢 ${totalSets} séries`);
}

// Executa
try {
  clearDatabase();
  importData();
  console.log('\n🎉 Pronto! Dados históricos importados com sucesso.');
} catch (error) {
  console.error('❌ Erro:', error);
} finally {
  db.close();
}
