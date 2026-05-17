/**
 * PlanHistoryModal - Modal fullscreen para gerenciar planos de treino
 *
 * Lista planos salvos, permite ativar, duplicar e deletar.
 */
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { X, CheckCircle, Copy, Trash, Barbell, Lightning, CalendarBlank } from 'phosphor-react-native';
import { usePlan } from '../context/PlanContext';
import { PlanoTreino } from '../types';
import { CoreHaptics } from 'expo-core-haptics';

interface PlanHistoryModalProps {
    visible: boolean;
    onClose: () => void;
}

export const PlanHistoryModal = ({ visible, onClose }: PlanHistoryModalProps) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { plans, activePlan, setActivePlan, deletePlan, duplicatePlan } = usePlan();

    const handleActivate = useCallback(async (plan: PlanoTreino) => {
        if (plan.id === activePlan.id) return;

        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.medium();
        }

        await setActivePlan(plan.id);
    }, [activePlan.id, setActivePlan]);

    const handleDuplicate = useCallback(async (plan: PlanoTreino) => {
        if (CoreHaptics.isSupported()) {
            CoreHaptics.tap.light();
        }

        const newName = `${plan.nome} (cópia)`;
        await duplicatePlan(plan.id, newName);
    }, [duplicatePlan]);

    const handleDelete = useCallback((plan: PlanoTreino) => {
        if (plan.id === activePlan.id) {
            Alert.alert('Não é possível', 'Não é possível excluir o plano ativo. Ative outro plano primeiro.');
            return;
        }

        if (CoreHaptics.isSupported()) {
            CoreHaptics.patterns.warning();
        }

        Alert.alert(
            'Excluir plano',
            `Tem certeza que deseja excluir "${plan.nome}"?\n\nEsta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        await deletePlan(plan.id);
                    },
                },
            ],
        );
    }, [activePlan.id, deletePlan]);

    const renderPlanCard = (plan: PlanoTreino) => {
        const isActive = plan.id === activePlan.id;

        return (
            <View
                key={plan.id}
                style={[
                    styles.planCard,
                    { backgroundColor: theme.surface },
                    isActive && { borderColor: theme.primary, borderWidth: 2 },
                ]}
            >
                {/* Header do card */}
                <View style={styles.planCardHeader}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.planNameRow}>
                            <Text style={[styles.planName, { color: theme.text }]} numberOfLines={1}>
                                {plan.nome}
                            </Text>
                            {isActive && (
                                <View style={[styles.activeBadge, { backgroundColor: theme.primary }]}>
                                    <Text style={styles.activeBadgeText}>Ativo</Text>
                                </View>
                            )}
                        </View>
                        {plan.objetivo && (
                            <Text style={[styles.planObjective, { color: theme.textSecondary }]} numberOfLines={2}>
                                {plan.objetivo}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Info */}
                <View style={styles.planInfo}>
                    <View style={styles.planInfoItem}>
                        <Barbell size={14} color={theme.textSecondary} />
                        <Text style={[styles.planInfoText, { color: theme.textSecondary }]}>
                            {plan.templates.length} treinos
                        </Text>
                    </View>
                    <View style={styles.planInfoItem}>
                        <CalendarBlank size={14} color={theme.textSecondary} />
                        <Text style={[styles.planInfoText, { color: theme.textSecondary }]}>
                            {plan.criadoEm}
                        </Text>
                    </View>
                </View>

                {/* Templates preview */}
                <View style={styles.templatesPreview}>
                    {plan.templates.map((t) => (
                        <View key={t.id} style={[styles.templateChip, { backgroundColor: theme.field }]}>
                            <Text style={[styles.templateChipText, { color: theme.text }]} numberOfLines={1}>
                                {t.nome}
                            </Text>
                            <Text style={[styles.templateChipSub, { color: theme.textSecondary }]}>
                                {t.exercicios.length} ex
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Ações */}
                <View style={[styles.planActions, { borderTopColor: theme.borderSubtle }]}>
                    {!isActive && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.primary }]}
                            onPress={() => handleActivate(plan)}
                            activeOpacity={0.7}
                        >
                            <CheckCircle size={16} color="#fff" weight="bold" />
                            <Text style={styles.actionButtonTextWhite}>Ativar</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.field }]}
                        onPress={() => handleDuplicate(plan)}
                        activeOpacity={0.7}
                    >
                        <Copy size={16} color={theme.text} weight="bold" />
                        <Text style={[styles.actionButtonText, { color: theme.text }]}>Duplicar</Text>
                    </TouchableOpacity>
                    {!isActive && plan.id !== 'fullbody-ab-2025' && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#ef444420' }]}
                            onPress={() => handleDelete(plan)}
                            activeOpacity={0.7}
                        >
                            <Trash size={16} color="#ef4444" weight="bold" />
                            <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Excluir</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
                    <View style={styles.headerContent}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>
                            Meus Planos
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={theme.text} weight="bold" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                        {plans.length} {plans.length === 1 ? 'plano salvo' : 'planos salvos'}
                    </Text>
                </View>

                {/* Lista de planos */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Plano ativo primeiro */}
                    {renderPlanCard(activePlan)}

                    {/* Outros planos */}
                    {plans
                        .filter(p => p.id !== activePlan.id)
                        .map(plan => renderPlanCard(plan))
                    }
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        borderBottomWidth: 1,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 13,
        marginBottom: 4,
    },
    closeButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
        paddingBottom: 40,
    },
    planCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    planCardHeader: {
        padding: 16,
        paddingBottom: 8,
    },
    planNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    planName: {
        fontSize: 18,
        fontWeight: '800',
    },
    activeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    activeBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    planObjective: {
        fontSize: 13,
        marginTop: 4,
        lineHeight: 18,
    },
    planInfo: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    planInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    planInfoText: {
        fontSize: 12,
        fontWeight: '500',
    },
    templatesPreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    templateChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    templateChipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    templateChipSub: {
        fontSize: 11,
    },
    planActions: {
        flexDirection: 'row',
        gap: 8,
        padding: 12,
        borderTopWidth: 1,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    actionButtonTextWhite: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
