import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { Check } from 'phosphor-react-native';
import { SetType, SetTypeModal } from './SetTypeModal';

interface SetRowProps {
    index: number;
    prev?: string;
    kg: string;
    reps: string;
    rir: string;
    completed: boolean;
    type: SetType;
    onUpdate: (field: 'kg' | 'reps' | 'rir', value: string) => void;
    onToggle: () => void;
    onChangeType: (type: SetType) => void;
}

export const SetRow = ({ index, prev, kg, reps, rir, completed, type, onUpdate, onToggle, onChangeType }: SetRowProps) => {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    const getTypeColor = () => {
        switch (type) {
            case 'W': return '#f59e0b';
            case 'D': return '#a855f7';
            case 'F': return '#ef4444';
            default: return theme.textSecondary;
        }
    };

    const getBackgroundColor = () => {
        if (completed) return '#22c55e20'; // Green tint
        switch (type) {
            case 'W': return '#f59e0b10';
            case 'D': return '#a855f710';
            case 'F': return '#ef444410';
            default: return 'transparent';
        }
    };

    return (
        <View style={{ backgroundColor: getBackgroundColor() }} className="flex-row items-center py-2 px-1 rounded-md mb-1">
            {/* Set Number / Type */}
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="w-8 h-8 items-center justify-center mr-2"
            >
                <Text style={{ color: getTypeColor(), fontWeight: 'bold' }}>
                    {type === 'N' ? index + 1 : type}
                </Text>
            </TouchableOpacity>

            <SetTypeModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelect={onChangeType}
                currentType={type}
            />

            {/* Previous */}
            <View className="flex-1 items-center justify-center">
                <Text style={{ color: theme.textSecondary }} className="text-xs text-center">
                    {prev || '-'}
                </Text>
            </View>

            {/* KG */}
            <View className="flex-1 items-center justify-center mx-1">
                <TextInput
                    value={kg}
                    onChangeText={(v) => onUpdate('kg', v)}
                    keyboardType="numeric"
                    placeholder="-"
                    placeholderTextColor={theme.textSecondary}
                    style={{ color: theme.text, backgroundColor: theme.background }}
                    className="w-full text-center py-1 rounded font-bold"
                />
            </View>

            {/* Reps */}
            <View className="flex-1 items-center justify-center mx-1">
                <TextInput
                    value={reps}
                    onChangeText={(v) => onUpdate('reps', v)}
                    keyboardType="numeric"
                    placeholder="-"
                    placeholderTextColor={theme.textSecondary}
                    style={{ color: theme.text, backgroundColor: theme.background }}
                    className="w-full text-center py-1 rounded font-bold"
                />
            </View>

            {/* RIR */}
            <View className="flex-1 items-center justify-center mx-1">
                <TextInput
                    value={rir}
                    onChangeText={(v) => onUpdate('rir', v)}
                    keyboardType="numeric"
                    placeholder="-"
                    placeholderTextColor={theme.textSecondary}
                    style={{ color: theme.text, backgroundColor: theme.background }}
                    className="w-full text-center py-1 rounded font-bold"
                />
            </View>

            {/* Checkbox */}
            <TouchableOpacity
                onPress={onToggle}
                style={{ backgroundColor: completed ? '#22c55e' : theme.surface }}
                className="w-8 h-8 rounded items-center justify-center ml-2"
            >
                <Check size={16} color={completed ? '#fff' : theme.textSecondary} weight="bold" />
            </TouchableOpacity>
        </View>
    );
};
