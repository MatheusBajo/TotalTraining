import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { setRememberMe, getRememberMe } from '../../lib/supabase';
import { CheckSquare, Square } from 'phosphor-react-native';

export default function LoginScreen() {
    const { signIn, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMeState] = useState(false);

    // Carrega preferência de "Lembrar de mim"
    useEffect(() => {
        getRememberMe().then(setRememberMeState);
    }, []);

    const toggleRememberMe = async () => {
        const newValue = !rememberMe;
        setRememberMeState(newValue);
        await setRememberMe(newValue);
    };

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preencha email e senha');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                await signUp(email, password);
                Alert.alert(
                    'Conta criada!',
                    'Verifique seu email para confirmar o cadastro.',
                    [{ text: 'OK' }]
                );
            } else {
                await signIn(email, password);
            }
        } catch (error: any) {
            let message = error.message;
            if (message.includes('Invalid login credentials')) {
                message = 'Email ou senha incorretos';
            } else if (message.includes('User already registered')) {
                message = 'Este email já está cadastrado';
            } else if (message.includes('Email not confirmed')) {
                message = 'Confirme seu email antes de fazer login';
            }
            Alert.alert('Erro', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <Text style={styles.title}>TotalTraining</Text>
                <Text style={styles.subtitle}>
                    {isSignUp ? 'Criar conta' : 'Entrar'}
                </Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#666"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoComplete="password"
                    />

                    {/* Checkbox Lembrar de mim */}
                    {!isSignUp && (
                        <TouchableOpacity
                            style={styles.rememberRow}
                            onPress={toggleRememberMe}
                            activeOpacity={0.7}
                        >
                            {rememberMe ? (
                                <CheckSquare size={24} color="#007AFF" weight="fill" />
                            ) : (
                                <Square size={24} color="#666" />
                            )}
                            <Text style={styles.rememberText}>Lembrar de mim</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {isSignUp ? 'Criar conta' : 'Entrar'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => setIsSignUp(!isSignUp)}
                    >
                        <Text style={styles.switchText}>
                            {isSignUp
                                ? 'Já tem conta? Entrar'
                                : 'Não tem conta? Criar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginBottom: 32,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#333',
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    switchButton: {
        padding: 16,
        alignItems: 'center',
    },
    switchText: {
        color: '#007AFF',
        fontSize: 16,
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    rememberText: {
        color: '#888',
        fontSize: 14,
        marginLeft: 8,
    },
});
