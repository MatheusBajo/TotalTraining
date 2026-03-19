import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { MagnifyingGlass, Plus, X } from 'phosphor-react-native';

// Exercícios organizados por categoria
const EXERCISES_BY_CATEGORY: Record<string, string[]> = {
    'Peito': [
        'Supino inclinado halter',
        'Supino Reto',
        'Supino com Halteres',
        'Supino Inclinado Halteres',
        'Supino Inclinado 30°',
        'Paralelas',
        'Peck Deck',
        'Crossover na Polia Baixa',
    ],
    'Costas': [
        'Barra fixa com peso',
        'Barra Fixa',
        'Pull-Up (Barra Fixa)',
        'Remada cavalinho',
        'Remada Baixa',
        'Remada Baixa na Polia',
        'Remada Máquina',
        'Remada Máquina com Peito Apoiado',
        'Remada inclinada 45°',
    ],
    'Ombros': [
        'Development',
        'Desenvolvimento',
        'Desenvolvimento com Halteres',
        'Desenvolvimento Máquina (Ombros)',
        'Desenvolvimento Militar',
        'Elevação lateral',
        'Elevação Lateral no Banco',
        'Face Pull',
        'Encolhimento halter unilateral',
    ],
    'Bíceps': [
        'Rosca martelo',
        'Rosca Direta com Barra W',
        'Rosca Martelo Banco Inclinado',
        'Rosca no Banco Inclinado',
        'Rosca Halter',
        'Rosca Inversa',
        'Reverse curl',
    ],
    'Tríceps': [
        'Coice inclinado',
        'Pushdown corda unilateral',
        'Tríceps na Corda (Polia Alta)',
        'Extensão de Tríceps na Polia',
        'Tríceps Unilateral EZ',
        'Mergulho na Paralela',
    ],
    'Pernas': [
        'Agachamento narrow',
        'Agachamento Livre',
        'Agachamento',
        'Búlgaro',
        'RDL',
        'Leg Press',
        'Leg Press 45°',
        'Leg press pés juntos',
        'Cadeira Extensora',
        'Mesa Flexora',
        'Flexora deitado',
        'Leg curl em pé',
        'Stiff',
        'Stiff com Halteres',
    ],
    'Panturrilha': [
        'Panturrilha em pé',
        'Panturrilha Em Pé',
        'Panturrilha sentado',
        'Panturrilha no Smith Machine',
    ],
    'Outros': [
        "Farmer's walk snatch grip",
        'Neck curl',
        'Neck extension',
        'Prancha Carregada',
    ],
};

const ALL_CATEGORIES = ['Todos', ...Object.keys(EXERCISES_BY_CATEGORY)];

// Lista plana para busca
const ALL_EXERCISES = Object.values(EXERCISES_BY_CATEGORY).flat();

interface AddExerciseModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (exerciseName: string) => void;
}

export const AddExerciseModal = ({ visible, onClose, onAdd }: AddExerciseModalProps) => {
    const { theme } = useTheme();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filteredExercises = useMemo(() => {
        let list: string[];

        if (selectedCategory === 'Todos') {
            list = ALL_EXERCISES;
        } else {
            list = EXERCISES_BY_CATEGORY[selectedCategory] || [];
        }

        if (search.trim()) {
            const query = search.toLowerCase();
            list = list.filter(ex => ex.toLowerCase().includes(query));
        }

        return list;
    }, [search, selectedCategory]);

    const handleAdd = useCallback((name: string) => {
        onAdd(name);
        setSearch('');
        setSelectedCategory('Todos');
        onClose();
    }, [onAdd, onClose]);

    const handleAddCustom = useCallback(() => {
        if (search.trim()) {
            handleAdd(search.trim());
        }
    }, [search, handleAdd]);

    const handleClose = useCallback(() => {
        setSearch('');
        setSelectedCategory('Todos');
        onClose();
    }, [onClose]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
            <TouchableWithoutFeedback onPress={handleClose}>
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
                                <TouchableOpacity onPress={handleClose}>
                                    <X size={24} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Category Chips */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
                            >
                                {ALL_CATEGORIES.map((cat) => {
                                    const isActive = selectedCategory === cat;
                                    return (
                                        <TouchableOpacity
                                            key={cat}
                                            onPress={() => setSelectedCategory(cat)}
                                            style={{
                                                backgroundColor: isActive ? theme.primary : theme.field,
                                                paddingHorizontal: 14,
                                                paddingVertical: 7,
                                                borderRadius: 20,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: isActive ? '#fff' : theme.textSecondary,
                                                    fontSize: 13,
                                                    fontWeight: isActive ? '700' : '500',
                                                }}
                                            >
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            {/* Search */}
                            <View className="px-4 pb-3">
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
                                    />
                                    {search.length > 0 && (
                                        <TouchableOpacity onPress={() => setSearch('')}>
                                            <X size={18} color={theme.textSecondary} />
                                        </TouchableOpacity>
                                    )}
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
                                keyExtractor={(item, index) => `${item}-${index}`}
                                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                                keyboardShouldPersistTaps="handled"
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
