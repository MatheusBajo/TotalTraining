import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
import { useTheme } from '../theme';

export type SetType = 'N' | 'W' | 'D' | 'F'; // Normal, Warm-up, Drop Set, Failure

interface SetTypeModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (type: SetType) => void;
    currentType: SetType;
}

export const SetTypeModal = ({ visible, onClose, onSelect, currentType }: SetTypeModalProps) => {
    const { theme } = useTheme();

    if (!visible) return null;

    const options: { type: SetType; label: string; color: string; letter: string; desc: string }[] = [
        { type: 'N', label: 'Normal', color: theme.text, letter: '1', desc: 'Série padrão de trabalho' },
        { type: 'W', label: 'Warm-up', color: '#f59e0b', letter: 'W', desc: 'Aquecimento, não conta para o volume' },
        { type: 'D', label: 'Drop Set', color: '#a855f7', letter: 'D', desc: 'Redução de carga sem descanso' },
        { type: 'F', label: 'Failure', color: '#ef4444', letter: 'F', desc: 'Série levada até a falha total' },
    ];

    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end bg-black/50">
                    <TouchableWithoutFeedback>
                        <View
                            style={{ backgroundColor: theme.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                            className="p-6 pb-10"
                        >
                            <View className="items-center mb-6">
                                <View className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                            </View>

                            <Text style={{ color: theme.text }} className="text-xl font-bold mb-4 text-center">
                                Tipo de Série
                            </Text>

                            <View className="gap-3">
                                {options.map((opt) => (
                                    <TouchableOpacity
                                        key={opt.type}
                                        onPress={() => {
                                            onSelect(opt.type);
                                            onClose();
                                        }}
                                        className="flex-row items-center p-4 rounded-xl border"
                                        style={{
                                            backgroundColor: currentType === opt.type ? theme.background : 'transparent',
                                            borderColor: currentType === opt.type ? opt.color : theme.borderSubtle
                                        }}
                                    >
                                        <View
                                            className="w-10 h-10 rounded-full items-center justify-center mr-4"
                                            style={{ backgroundColor: opt.color + '20' }}
                                        >
                                            <Text style={{ color: opt.color }} className="font-bold text-lg">
                                                {opt.letter}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: theme.text }} className="font-bold text-base">
                                                {opt.label}
                                            </Text>
                                            <Text style={{ color: theme.textSecondary }} className="text-xs">
                                                {opt.desc}
                                            </Text>
                                        </View>
                                        {currentType === opt.type && (
                                            <View className="flex-1 items-end">
                                                <View className="w-4 h-4 rounded-full bg-green-500" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
