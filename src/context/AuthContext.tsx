import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHED_USER_KEY = 'totaltraining:cachedUser';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    // true = o user fez signOut explícito (não por falha de rede)
    const explicitSignOutRef = useRef(false);

    useEffect(() => {
        let mounted = true;

        // Carrega sessão inicial com timeout
        const initAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (mounted) {
                    if (error) {
                        console.log('[Auth] Error getting session:', error.message);
                    }
                    if (session?.user) {
                        setSession(session);
                        setUser(session.user);
                        // Salva user para fallback offline
                        AsyncStorage.setItem(CACHED_USER_KEY, JSON.stringify(session.user)).catch(() => {});
                    } else {
                        // Sem sessão — tenta fallback offline
                        await loadCachedUser();
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.log('[Auth] Exception getting session:', err);
                if (mounted) {
                    // Rede caiu — tenta fallback offline
                    await loadCachedUser();
                    setLoading(false);
                }
            }
        };

        // Carrega user salvo localmente (para uso offline)
        const loadCachedUser = async () => {
            try {
                const cached = await AsyncStorage.getItem(CACHED_USER_KEY);
                if (cached && mounted) {
                    const cachedUser = JSON.parse(cached) as User;
                    console.log('[Auth] Using cached user (offline mode)');
                    setUser(cachedUser);
                }
            } catch {
                // Sem cache, user fica null → login screen
            }
        };

        // Timeout de 3 segundos para não ficar loading infinito
        const timeout = setTimeout(() => {
            if (mounted && loading) {
                console.log('[Auth] Timeout - setting loading to false');
                setLoading(false);
            }
        }, 3000);

        initAuth();

        // Escuta mudanças de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('[Auth] State changed:', _event);
            if (!mounted) return;

            if (session?.user) {
                setSession(session);
                setUser(session.user);
                // Salva user para fallback offline
                AsyncStorage.setItem(CACHED_USER_KEY, JSON.stringify(session.user)).catch(() => {});
            } else if (_event === 'SIGNED_OUT' && !explicitSignOutRef.current) {
                // SIGNED_OUT disparado pelo SDK (ex: token refresh falhou por falta de rede)
                // NÃO limpa o user — mantém o usuário logado para uso offline
                console.log('[Auth] Ignoring network-triggered SIGNED_OUT, keeping cached user');
            } else {
                // Sign out explícito do usuário
                setSession(null);
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            mounted = false;
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setLoading(false);
            throw error;
        }
    };

    const signUp = async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setLoading(false);
            throw error;
        }
    };

    const signOut = async () => {
        setLoading(true);
        explicitSignOutRef.current = true;
        try {
            // Limpa cache offline
            await AsyncStorage.removeItem(CACHED_USER_KEY).catch(() => {});
            setUser(null);
            setSession(null);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            // Mesmo com erro de rede, o signOut local já aconteceu
            console.log('[Auth] SignOut error (user already cleared locally):', error);
        } finally {
            explicitSignOutRef.current = false;
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        if (!user) throw new Error('Usuário não autenticado');

        // Deleta todos os workouts do usuário (cascade deleta exercises e sets)
        const { error: deleteError } = await supabase
            .from('workouts')
            .delete()
            .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // Limpa cache e faz logout
        await AsyncStorage.removeItem(CACHED_USER_KEY).catch(() => {});
        await signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
