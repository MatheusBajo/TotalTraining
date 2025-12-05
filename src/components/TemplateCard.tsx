import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { DotsThree } from 'phosphor-react-native';
import { useTheme } from '../theme';

interface TemplateCardProps {
    title: string;
    exercises: string;
}

export const TemplateCard = ({ title, exercises }: TemplateCardProps) => {
    const { theme } = useTheme();

    return (
        <View style={{ backgroundColor: theme.surface, borderColor: theme.borderSubtle }} className="p-4 rounded-xl mb-3 border">
            <View className="flex-row justify-between items-start mb-2">
                <Text style={{ color: theme.text }} className="font-bold text-lg flex-1 mr-2">{title}</Text>
                <TouchableOpacity>
                    <DotsThree size={24} color={theme.primary} weight="bold" />
                </TouchableOpacity>
            </View>
            <Text style={{ color: theme.textSecondary }} className="text-sm leading-5" numberOfLines={3}>
                {exercises}
            </Text>
        </View>
    );
};
