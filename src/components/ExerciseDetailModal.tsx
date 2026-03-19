/**
 * ExerciseDetailModal - Modal fullscreen com detalhes do exercício
 *
 * 4 tabs: Sobre, Histórico, Gráficos, Registros
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { X, Barbell, ClockCounterClockwise, ChartLineUp, Trophy } from 'phosphor-react-native';
import { useAuth } from '../context/AuthContext';
import {
    getExerciseHistoryLocal,
    getExerciseRecordsLocal,
    ExerciseHistoryEntry,
    ExerciseRecord,
} from '../db/database';

interface ExerciseDetailModalProps {
    visible: boolean;
    exerciseName: string;
    onClose: () => void;
}

type TabKey = 'about' | 'history' | 'charts' | 'records';

interface TabDef {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ExerciseDetailModal = ({ visible, exerciseName, onClose }: ExerciseDetailModalProps) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<TabKey>('about');
    const [history, setHistory] = useState<ExerciseHistoryEntry[]>([]);
    const [records, setRecords] = useState<ExerciseRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const tabs = useMemo<TabDef[]>(() => [
        { key: 'about', label: 'Sobre', icon: <Barbell size={18} color={activeTab === 'about' ? theme.primary : theme.textSecondary} weight="bold" /> },
        { key: 'history', label: 'Histórico', icon: <ClockCounterClockwise size={18} color={activeTab === 'history' ? theme.primary : theme.textSecondary} weight="bold" /> },
        { key: 'charts', label: 'Gráficos', icon: <ChartLineUp size={18} color={activeTab === 'charts' ? theme.primary : theme.textSecondary} weight="bold" /> },
        { key: 'records', label: 'Registros', icon: <Trophy size={18} color={activeTab === 'records' ? theme.primary : theme.textSecondary} weight="bold" /> },
    ], [activeTab, theme]);

    // Carrega dados quando modal abre ou tab muda
    useEffect(() => {
        if (!visible || !user?.id) return;
        setActiveTab('about');
        setHistory([]);
        setRecords([]);
    }, [visible, user?.id]);

    useEffect(() => {
        if (!visible || !user?.id) return;

        if (activeTab === 'history' && history.length === 0) {
            setLoading(true);
            getExerciseHistoryLocal(user.id, exerciseName)
                .then(setHistory)
                .catch(() => {})
                .finally(() => setLoading(false));
        } else if (activeTab === 'records' && records.length === 0) {
            setLoading(true);
            getExerciseRecordsLocal(user.id, exerciseName)
                .then(setRecords)
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [visible, activeTab, user?.id, exerciseName]);

    const formatDate = useCallback((dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch {
            return dateStr;
        }
    }, []);

    // ========== TAB: SOBRE ==========
    const renderAbout = () => (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.aboutCard, { backgroundColor: theme.field }]}>
                <Barbell size={48} color={theme.primary} weight="duotone" />
                <Text style={[styles.aboutExerciseName, { color: theme.text }]}>{exerciseName}</Text>
            </View>

            <View style={[styles.infoSection, { backgroundColor: theme.field }]}>
                <Text style={[styles.infoSectionTitle, { color: theme.primary }]}>Informações</Text>
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    Detalhes do exercício como músculos alvo, instruções e imagens serão adicionados em breve.
                </Text>
            </View>
        </ScrollView>
    );

    // ========== TAB: HISTÓRICO ==========
    const renderHistory = () => {
        if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            );
        }

        if (history.length === 0) {
            return (
                <View style={styles.centered}>
                    <ClockCounterClockwise size={48} color={theme.textSecondary} weight="light" />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                        Nenhum histórico encontrado
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                        Complete um treino com este exercício para ver o histórico
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
                {history.map((entry) => (
                    <View key={entry.workoutId} style={[styles.historyCard, { backgroundColor: theme.field }]}>
                        <View style={styles.historyHeader}>
                            <Text style={[styles.historyWorkoutName, { color: theme.text }]}>
                                {entry.workoutName}
                            </Text>
                            <Text style={[styles.historyDate, { color: theme.textSecondary }]}>
                                {formatDate(entry.workoutDate)}
                            </Text>
                        </View>

                        {/* Cabeçalho da tabela */}
                        <View style={styles.historyTableHeader}>
                            <Text style={[styles.historyColHeader, { color: theme.textSecondary, width: 40 }]}>Série</Text>
                            <Text style={[styles.historyColHeader, { color: theme.textSecondary, flex: 1 }]}>Peso</Text>
                            <Text style={[styles.historyColHeader, { color: theme.textSecondary, flex: 1 }]}>Reps</Text>
                            <Text style={[styles.historyColHeader, { color: theme.textSecondary, flex: 1 }]}>RIR</Text>
                        </View>

                        {entry.sets.map((set, idx) => (
                            <View key={idx} style={styles.historyRow}>
                                <Text style={[styles.historyCell, { color: theme.textSecondary, width: 40 }]}>
                                    {set.setType === 'N' ? idx + 1 : set.setType}
                                </Text>
                                <Text style={[styles.historyCell, { color: theme.text, flex: 1 }]}>
                                    {set.weight != null ? `${set.weight}kg` : '-'}
                                </Text>
                                <Text style={[styles.historyCell, { color: theme.text, flex: 1 }]}>
                                    {set.reps ?? '-'}
                                </Text>
                                <Text style={[styles.historyCell, { color: theme.text, flex: 1 }]}>
                                    {set.rir ?? '-'}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        );
    };

    // ========== TAB: GRÁFICOS ==========
    const renderCharts = () => (
        <View style={styles.centered}>
            <ChartLineUp size={48} color={theme.textSecondary} weight="light" />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Em breve</Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                Gráficos de progressão serão adicionados em uma próxima atualização
            </Text>
        </View>
    );

    // ========== TAB: REGISTROS ==========
    const renderRecords = () => {
        if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            );
        }

        if (records.length === 0) {
            return (
                <View style={styles.centered}>
                    <Trophy size={48} color={theme.textSecondary} weight="light" />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                        Nenhum PR registrado
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                        Complete séries com peso e repetições para registrar seus PRs
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.recordsTable, { backgroundColor: theme.field }]}>
                    {/* Header */}
                    <View style={[styles.recordsRow, styles.recordsHeaderRow, { borderBottomColor: theme.borderSubtle }]}>
                        <Text style={[styles.recordsHeaderText, { color: theme.textSecondary, flex: 1 }]}>Reps</Text>
                        <Text style={[styles.recordsHeaderText, { color: theme.textSecondary, flex: 1.5 }]}>Peso Máx</Text>
                        <Text style={[styles.recordsHeaderText, { color: theme.textSecondary, flex: 1 }]}>RIR</Text>
                        <Text style={[styles.recordsHeaderText, { color: theme.textSecondary, flex: 1.5 }]}>Data</Text>
                    </View>

                    {records.map((record, idx) => (
                        <View
                            key={record.reps}
                            style={[
                                styles.recordsRow,
                                idx < records.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.borderSubtle },
                            ]}
                        >
                            <Text style={[styles.recordsCell, { color: theme.primary, flex: 1, fontWeight: '800' }]}>
                                {record.reps}
                            </Text>
                            <Text style={[styles.recordsCell, { color: theme.text, flex: 1.5, fontWeight: '700' }]}>
                                {record.weight}kg
                            </Text>
                            <Text style={[styles.recordsCell, { color: theme.textSecondary, flex: 1 }]}>
                                {record.rir ?? '-'}
                            </Text>
                            <Text style={[styles.recordsCell, { color: theme.textSecondary, flex: 1.5, fontSize: 12 }]}>
                                {formatDate(record.date)}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'about': return renderAbout();
            case 'history': return renderHistory();
            case 'charts': return renderCharts();
            case 'records': return renderRecords();
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
            <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
                    <View style={styles.headerContent}>
                        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
                            {exerciseName}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={theme.text} weight="bold" />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabBar}>
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;
                            return (
                                <TouchableOpacity
                                    key={tab.key}
                                    style={[
                                        styles.tab,
                                        isActive && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
                                    ]}
                                    onPress={() => setActiveTab(tab.key)}
                                    activeOpacity={0.7}
                                >
                                    {tab.icon}
                                    <Text
                                        style={[
                                            styles.tabLabel,
                                            { color: isActive ? theme.primary : theme.textSecondary },
                                            isActive && { fontWeight: '700' },
                                        ]}
                                    >
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Conteúdo da tab ativa */}
                {renderActiveTab()}
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
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 12,
    },
    closeButton: {
        padding: 4,
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 8,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    // Sobre
    aboutCard: {
        alignItems: 'center',
        padding: 32,
        borderRadius: 16,
        marginBottom: 16,
        gap: 16,
    },
    aboutExerciseName: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    infoSection: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    infoSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
    },
    // Histórico
    historyCard: {
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    historyWorkoutName: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
    },
    historyDate: {
        fontSize: 12,
        fontWeight: '500',
    },
    historyTableHeader: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingBottom: 6,
    },
    historyColHeader: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    historyRow: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    historyCell: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    // Registros
    recordsTable: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    recordsHeaderRow: {
        borderBottomWidth: 1,
    },
    recordsRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: 'center',
    },
    recordsHeaderText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    recordsCell: {
        fontSize: 14,
        fontWeight: '500',
    },
});
