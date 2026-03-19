/**
 * CancelWorkoutModal - Modal de confirmação para cancelar treino
 *
 * Mesmo padrão visual do RestFinishedModal:
 * Overlay escuro + card centralizado com emoji + mensagem + 2 botões
 */
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface CancelWorkoutModalProps {
    visible: boolean;
    onCancel: () => void;  // confirma cancelamento do treino
    onDismiss: () => void; // fecha modal (volta pro treino)
}

export const CancelWorkoutModal = ({ visible, onCancel, onDismiss }: CancelWorkoutModalProps) => {
    const { theme } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.surface }]}>
                    <Text style={styles.emoji}>🗑️</Text>
                    <Text style={[styles.title, { color: theme.text }]}>
                        Cancelar treino?
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Todo o progresso deste treino será perdido.
                    </Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#ef4444' }]}
                            onPress={onCancel}
                        >
                            <Text style={styles.buttonText}>
                                Cancelar treino
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.field || '#1a1a1a' }]}
                            onPress={onDismiss}
                        >
                            <Text style={[styles.buttonText, { color: theme.text }]}>
                                Voltar
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
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
