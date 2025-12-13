import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { useTheme } from '../theme';
import { MagnifyingGlass, Plus, X } from 'phosphor-react-native';

// Lista de exercícios (plano atual + histórico)
const COMMON_EXERCISES = [
    // === PLANO ATUAL ===
    // Segunda - Push
    'Supino inclinado halter',
    'Paralelas',
    'Elevação lateral',
    'Coice inclinado',
    'Pushdown corda unilateral',
    // Terça - Lower Quad
    'Agachamento narrow',
    'Búlgaro',
    'RDL',
    'Leg press pés juntos',
    'Leg curl em pé',
    'Panturrilha em pé',
    // Quinta - Pull
    'Barra fixa com peso',
    'Remada cavalinho',
    'Development',
    'Rosca martelo',
    'Encolhimento halter unilateral',
    'Remada inclinada 45°',
    // Sexta/Sáb - Posterior
    'Flexora deitado',
    'Reverse curl',
    "Farmer's walk snatch grip",
    'Panturrilha sentado',
    'Neck curl',
    'Neck extension',

    // === HISTÓRICO ===
    // Peito
    'Supino Reto',
    'Supino com Halteres',
    'Supino Inclinado Halteres',
    'Supino Inclinado 30°',
    'Peck Deck',
    'Crossover na Polia Baixa',
    // Costas
    'Barra Fixa',
    'Pull-Up (Barra Fixa)',
    'Remada Baixa',
    'Remada Baixa na Polia',
    'Remada Máquina',
    'Remada Máquina com Peito Apoiado',
    // Ombros
    'Desenvolvimento',
    'Desenvolvimento com Halteres',
    'Desenvolvimento Máquina (Ombros)',
    'Desenvolvimento Militar',
    'Elevação Lateral no Banco',
    'Face Pull',
    // Bíceps
    'Rosca Direta com Barra W',
    'Rosca Martelo Banco Inclinado',
    'Rosca no Banco Inclinado',
    'Rosca Halter',
    // Tríceps
    'Tríceps na Corda (Polia Alta)',
    'Extensão de Tríceps na Polia',
    'Tríceps Unilateral EZ',
    'Mergulho na Paralela',
    // Pernas
    'Agachamento Livre',
    'Agachamento',
    'Leg Press',
    'Leg Press 45°',
    'Cadeira Extensora',
    'Mesa Flexora',
    'Stiff',
    'Stiff com Halteres',
    // Panturrilha
    'Panturrilha Em Pé',
    'Panturrilha no Smith Machine',
    // Core/Outros
    'Prancha Carregada',
    'Rosca Inversa',
];

interface AddExerciseModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (exerciseName: string) => void;
}

export const AddExerciseModal = ({ visible, onClose, onAdd }: AddExerciseModalProps) => {
    const { theme } = useTheme();
    const [search, setSearch] = useState('');

    const filteredExercises = search.trim()
        ? COMMON_EXERCISES.filter(ex =>
            ex.toLowerCase().includes(search.toLowerCase())
        )
        : COMMON_EXERCISES;

    const handleAdd = (name: string) => {
        onAdd(name);
        setSearch('');
        onClose();
    };

    const handleAddCustom = () => {
        if (search.trim()) {
            handleAdd(search.trim());
        }
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end bg-black/50">
                    <TouchableWithoutFeedback>
                        <View
                            style={{ backgroundColor: theme.surface, maxHeight: '80%' }}
                            className="rounded-t-3xl"
                        >
                            {/* Header */}
                            <View className="flex-row justify-between items-center p-4 border-b" style={{ borderColor: theme.borderSubtle }}>
                                <Text style={{ color: theme.text }} className="text-xl font-bold">
                                    Adicionar Exercício
                                </Text>
                                <TouchableOpacity onPress={onClose}>
                                    <X size={24} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Search */}
                            <View className="px-4 py-3">
                                <View
                                    className="flex-row items-center px-4 py-3 rounded-xl"
                                    style={{ backgroundColor: theme.background }}
                                >
                                    <MagnifyingGlass size={20} color={theme.textSecondary} />
                                    <TextInput
                                        value={search}
                                        onChangeText={setSearch}
                                        placeholder="Buscar ou criar exercício..."
                                        placeholderTextColor={theme.textSecondary}
                                        style={{ color: theme.text, flex: 1, marginLeft: 12 }}
                                        autoFocus
                                    />
                                </View>

                                {/* Botão para criar exercício customizado */}
                                {search.trim() && !filteredExercises.some(ex => ex.toLowerCase() === search.toLowerCase()) && (
                                    <TouchableOpacity
                                        onPress={handleAddCustom}
                                        className="flex-row items-center mt-3 p-3 rounded-xl"
                                        style={{ backgroundColor: theme.primary + '20' }}
                                    >
                                        <Plus size={20} color={theme.primary} />
                                        <Text style={{ color: theme.primary }} className="ml-2 font-bold">
                                            Criar "{search.trim()}"
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Lista de exercícios */}
                            <FlatList
                                data={filteredExercises}
                                keyExtractor={(item) => item}
                                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleAdd(item)}
                                        className="py-4 border-b"
                                        style={{ borderColor: theme.borderSubtle }}
                                    >
                                        <Text style={{ color: theme.text }} className="text-base">
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View className="py-8 items-center">
                                        <Text style={{ color: theme.textSecondary }}>
                                            Nenhum exercício encontrado
                                        </Text>
                                    </View>
                                }
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
