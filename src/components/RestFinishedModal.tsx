/**
 * RestFinishedModal - Modal que aparece quando o timer de descanso termina
 *
 * Mesmo padrão visual do FinishWorkoutModal:
 * Overlay escuro + card centralizado com emoji + mensagem + botão
 */
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface RestFinishedModalProps {
    visible: boolean;
    onDismiss: () => void;
}

export const RestFinishedModal = ({ visible, onDismiss }: RestFinishedModalProps) => {
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
                    <Text style={styles.emoji}>🙅‍♂️</Text>
                    <Text style={[styles.title, { color: theme.text }]}>
                        Acabou o descanso!
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Bora pra próxima série 💪
                    </Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primary }]}
                            onPress={onDismiss}
                        >
                            <Text style={styles.buttonText}>
                                Bora!
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
