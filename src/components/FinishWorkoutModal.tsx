import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface FinishWorkoutModalProps {
    visible: boolean;
    hasData: boolean;           // true se tem séries preenchidas
    hasIncomplete: boolean;     // true se tem séries não marcadas como completas
    onFinish: () => void;       // Finaliza normalmente
    onFinishAnyway: () => void; // Finaliza mesmo com incompletos
    onCancel: () => void;       // Cancela (fecha modal)
    onDiscardWorkout: () => void; // Descarta treino vazio
}

export const FinishWorkoutModal = ({
    visible,
    hasData,
    hasIncomplete,
    onFinish,
    onFinishAnyway,
    onCancel,
    onDiscardWorkout,
}: FinishWorkoutModalProps) => {
    const { theme } = useTheme();

    // Modal para treino vazio
    if (!hasData) {
        return (
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={onCancel}
            >
                <View style={styles.overlay}>
                    <View style={[styles.container, { backgroundColor: theme.surface }]}>
                        <Text style={styles.emoji}>🤷</Text>
                        <Text style={[styles.title, { color: theme.text }]}>
                            Treino vazio
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                            Você não registrou nenhum exercício.{'\n'}
                            Deseja descartar este treino?
                        </Text>

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#ef4444' }]}
                                onPress={onDiscardWorkout}
                            >
                                <Text style={styles.buttonTextPrimary}>
                                    Descartar treino
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={onCancel}
                            >
                                <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                                    Voltar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Modal para treino com dados
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.surface }]}>
                    <Text style={styles.emoji}>💪</Text>
                    <Text style={[styles.title, { color: theme.text }]}>
                        Terminar treino?
                    </Text>

                    {hasIncomplete ? (
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                            Algumas séries ainda não foram marcadas como concluídas.
                        </Text>
                    ) : (
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                            Bom trabalho! Seu treino será salvo.
                        </Text>
                    )}

                    <View style={styles.buttonsContainer}>
                        {/* Botão principal - Terminar */}
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primary }]}
                            onPress={onFinish}
                        >
                            <Text style={styles.buttonTextPrimary}>
                                Terminar treino
                            </Text>
                        </TouchableOpacity>

                        {/* Se tem incompletos, mostra botão extra */}
                        {hasIncomplete && (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#22c55e' }]}
                                onPress={onFinishAnyway}
                            >
                                <Text style={styles.buttonTextPrimary}>
                                    Terminar mesmo assim
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                        >
                            <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                                Continuar treinando
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    emoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    buttonsContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonTextPrimary: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 14,
    },
});
