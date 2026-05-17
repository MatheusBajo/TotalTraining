import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    SectionList,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { X, MagnifyingGlass, PencilSimple } from 'phosphor-react-native';
import { getExerciseDBPriority, getExerciseImageUrl, ExerciseDBPriority } from '../api';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface ExercisePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (exerciseName: string) => void;
    currentExerciseName?: string;
}

// Traduz músculo alvo (target) para português
const getTargetLabel = (target: string) => {
    const translations: Record<string, string> = {
        // Músculos principais do ExerciseDB
        'pectorals': 'Peito',
        'lats': 'Dorsais',
        'delts': 'Deltoides',
        'biceps': 'Bíceps',
        'triceps': 'Tríceps',
        'forearms': 'Antebraços',
        'abs': 'Abdômen',
        'quads': 'Quadríceps',
        'hamstrings': 'Posterior',
        'glutes': 'Glúteos',
        'calves': 'Panturrilha',
        'traps': 'Trapézio',
        'upper back': 'Costas Superior',
        'spine': 'Coluna',
        'serratus anterior': 'Serrátil',
        'levator scapulae': 'Elevador Escápula',
        'cardiovascular system': 'Cardio',
        'adductors': 'Adutores',
        'abductors': 'Abdutores',
    };
    return translations[target?.toLowerCase()] || target || '';
};

// Componente de item de exercício
const ExerciseItem = ({
    exercise,
    theme,
    onPress,
    isSelected,
}: {
    exercise: ExerciseDBPriority;
    theme: any;
    onPress: () => void;
    isSelected: boolean;
}) => {
    // Usa a função helper para construir a URL da imagem GIF
    const imageUrl = exercise.localImage ? getExerciseImageUrl(exercise.localImage) : null;
    // Usa nome em português se disponível, senão usa inglês
    const displayName = exercise.name_pt || exercise.name;
    const displayEquipment = exercise.equipment_pt || exercise.equipment;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: isSelected ? theme.primary + '20' : theme.surface,
                borderBottomColor: theme.borderSubtle,
                borderLeftWidth: isSelected ? 3 : 0,
                borderLeftColor: theme.primary,
            }}
            className="flex-row items-center px-4 py-3 border-b"
            activeOpacity={0.7}
        >
            {/* Imagem GIF animada ou placeholder */}
            <View
                style={{ backgroundColor: theme.field }}
                className="w-14 h-14 rounded-lg mr-3 overflow-hidden items-center justify-center"
            >
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 56, height: 56 }}
                        resizeMode="cover"
                    />
                ) : (
                    <Text style={{ color: theme.textSecondary }} className="text-xl font-bold">
                        {displayName.charAt(0).toUpperCase()}
                    </Text>
                )}
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text
                    style={{ color: isSelected ? theme.primary : theme.text }}
                    className="font-semibold text-base"
                    numberOfLines={1}
                >
                    {displayName}
                </Text>
                <Text style={{ color: theme.textSecondary }} className="text-sm" numberOfLines={1}>
                    {getTargetLabel(exercise.target)} • {displayEquipment}
                </Text>
            </View>

            {isSelected && (
                <View style={{ backgroundColor: theme.primary }} className="px-2 py-1 rounded">
                    <Text className="text-white text-xs font-bold">Atual</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export const ExercisePickerModal = ({
    visible,
    onClose,
    onSelect,
    currentExerciseName,
}: ExercisePickerModalProps) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const sectionListRef = useRef<SectionList>(null);
    const [exercises, setExercises] = useState<ExerciseDBPriority[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [customName, setCustomName] = useState('');

    // Carrega exercícios do ExerciseDB com GIFs
    const loadExercises = useCallback(async () => {
        setLoading(true);
        try {
            const results = await getExerciseDBPriority({
                q: searchQuery || undefined,
                limit: 100,
            });
            setExercises(results);
        } catch (error) {
            console.error('[ExercisePickerModal] Error loading exercises:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    // Recarrega quando abre ou quando pesquisa muda
    useEffect(() => {
        if (visible) {
            loadExercises();
        }
    }, [visible, loadExercises]);

    // Limpa pesquisa ao fechar
    useEffect(() => {
        if (!visible) {
            setSearchQuery('');
            setIsEditingName(false);
            setCustomName('');
        } else {
            // Inicializa com o nome atual quando abre
            setCustomName(currentExerciseName || '');
        }
    }, [visible, currentExerciseName]);

    // Agrupa exercícios por letra (usando nome em português se disponível)
    const sections = useMemo(() => {
        const grouped: Record<string, ExerciseDBPriority[]> = {};

        exercises.forEach(ex => {
            const displayName = ex.name_pt || ex.name;
            const letter = displayName.charAt(0).toUpperCase();
            if (!grouped[letter]) {
                grouped[letter] = [];
            }
            grouped[letter].push(ex);
        });

        return Object.keys(grouped)
            .sort()
            .map(letter => ({
                title: letter,
                data: grouped[letter].sort((a, b) => {
                    const nameA = a.name_pt || a.name;
                    const nameB = b.name_pt || b.name;
                    return nameA.localeCompare(nameB);
                }),
            }));
    }, [exercises]);

    // Letras disponíveis para o índice
    const availableLetters = useMemo(() => sections.map(s => s.title), [sections]);

    // Scroll para letra
    const scrollToLetter = useCallback((letter: string) => {
        const sectionIndex = sections.findIndex(s => s.title === letter);
        if (sectionIndex >= 0 && sectionListRef.current) {
            sectionListRef.current.scrollToLocation({
                sectionIndex,
                itemIndex: 0,
                viewOffset: 50,
                animated: true,
            });
        }
    }, [sections]);

    const handleSelect = (exercise: ExerciseDBPriority) => {
        // Usa o nome em português se disponível, senão inglês
        onSelect(exercise.name_pt || exercise.name);
        onClose();
    };

    const handleSaveCustomName = () => {
        if (customName.trim()) {
            onSelect(customName.trim());
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={{ backgroundColor: theme.background, flex: 1, paddingTop: insets.top }}>
                {/* Header */}
                <View
                    className="flex-row items-center justify-between px-4 py-3 border-b"
                    style={{ borderColor: theme.borderSubtle }}
                >
                    <TouchableOpacity onPress={() => isEditingName ? setIsEditingName(false) : onClose()} className="p-2">
                        <X size={24} color={theme.text} weight="bold" />
                    </TouchableOpacity>
                    <Text style={{ color: theme.text }} className="text-lg font-bold">
                        {isEditingName ? 'Editar Nome' : 'Trocar Exercício'}
                    </Text>
                    {isEditingName ? (
                        <TouchableOpacity
                            onPress={handleSaveCustomName}
                            className="p-2"
                            disabled={!customName.trim()}
                        >
                            <Text style={{ color: customName.trim() ? theme.primary : theme.textSecondary }} className="font-bold">
                                Salvar
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setIsEditingName(true)} className="p-2">
                            <PencilSimple size={24} color={theme.primary} weight="bold" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Modo edição manual */}
                {isEditingName ? (
                    <View className="px-4 py-6">
                        <Text style={{ color: theme.textSecondary }} className="text-sm mb-2">
                            Digite o nome do exercício:
                        </Text>
                        <TextInput
                            value={customName}
                            onChangeText={setCustomName}
                            placeholder="Ex: Supino Inclinado Halter"
                            placeholderTextColor={theme.textSecondary}
                            style={{
                                color: theme.text,
                                backgroundColor: theme.field,
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                            }}
                            autoFocus
                            autoCapitalize="words"
                            onSubmitEditing={handleSaveCustomName}
                            returnKeyType="done"
                        />
                        <Text style={{ color: theme.textSecondary }} className="text-xs mt-3">
                            Você pode digitar qualquer nome personalizado para este exercício.
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Search Bar */}
                        <View className="px-4 py-3">
                            <View
                                style={{ backgroundColor: theme.field }}
                                className="flex-row items-center px-3 py-2 rounded-lg"
                            >
                                <MagnifyingGlass size={20} color={theme.textSecondary} />
                                <TextInput
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholder="Pesquisar exercício..."
                                    placeholderTextColor={theme.textSecondary}
                                    style={{ color: theme.text }}
                                    className="flex-1 ml-2 text-base"
                                    autoFocus
                                />
                            </View>
                        </View>
                    </>
                )}

                {/* Loading */}
                {!isEditingName && loading && (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                )}

                {/* Exercise List */}
                {!isEditingName && !loading && (
                    <View className="flex-1 flex-row">
                        <SectionList
                            ref={sectionListRef}
                            sections={sections}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <ExerciseItem
                                    exercise={item}
                                    theme={theme}
                                    onPress={() => handleSelect(item)}
                                    isSelected={item.name.toLowerCase() === currentExerciseName?.toLowerCase()}
                                />
                            )}
                            renderSectionHeader={({ section: { title } }) => (
                                <View style={{ backgroundColor: theme.background }} className="px-4 py-2">
                                    <Text style={{ color: theme.textSecondary }} className="text-sm font-bold">
                                        {title}
                                    </Text>
                                </View>
                            )}
                            stickySectionHeadersEnabled={true}
                            className="flex-1"
                            contentContainerStyle={{ paddingBottom: 100 }}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={20}
                            maxToRenderPerBatch={20}
                            onScrollToIndexFailed={() => {}}
                            ListEmptyComponent={
                                <View className="items-center py-8">
                                    <Text style={{ color: theme.textSecondary }}>
                                        Nenhum exercício encontrado
                                    </Text>
                                </View>
                            }
                        />

                        {/* Índice alfabético lateral */}
                        <View className="absolute right-0 top-0 bottom-0 justify-center pr-1">
                            {availableLetters.map(letter => (
                                <TouchableOpacity
                                    key={letter}
                                    onPress={() => scrollToLetter(letter)}
                                    className="py-0.5 px-1"
                                >
                                    <Text style={{ color: theme.primary }} className="text-xs font-bold">
                                        {letter}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </View>
        </Modal>
    );
};
