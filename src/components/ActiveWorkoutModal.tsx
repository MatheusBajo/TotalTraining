import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface ActiveWorkoutModalProps {
    visible: boolean;
    currentWorkoutName: string;
    onResume: () => void;
    onStartNew: () => void;
    onCancel: () => void;
}

export const ActiveWorkoutModal = ({
    visible,
    currentWorkoutName,
    onResume,
    onStartNew,
    onCancel,
}: ActiveWorkoutModalProps) => {
    const { theme } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.surface }]}>
                    {/* Header com emoji */}
                    <Text style={styles.emoji}>🤔</Text>
                    <Text style={[styles.title, { color: theme.text }]}>
                        Treino em andamento
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Você já tem um treino ativo:{'\n'}
                        <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
                            {currentWorkoutName}
                        </Text>
                    </Text>

                    {/* Botões */}
                    <View style={styles.buttonsContainer}>
                        {/* Retomar treino atual */}
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primary }]}
                            onPress={onResume}
                        >
                            <Text style={styles.buttonTextPrimary}>
                                Retomar treino atual
                            </Text>
                        </TouchableOpacity>

                        {/* Iniciar novo treino */}
                        <TouchableOpacity
                            style={[styles.button, styles.buttonOutline, { borderColor: theme.primary }]}
                            onPress={onStartNew}
                        >
                            <Text style={[styles.buttonTextOutline, { color: theme.primary }]}>
                                Iniciar novo treino
                            </Text>
                        </TouchableOpacity>

                        {/* Cancelar */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                        >
                            <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                                Cancelar
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
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
    },
    buttonTextPrimary: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonTextOutline: {
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
