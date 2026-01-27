import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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
                    setSession(session);
                    setUser(session?.user ?? null);
                    setLoading(false);
                }
            } catch (err) {
                console.log('[Auth] Exception getting session:', err);
                if (mounted) {
                    setLoading(false);
                }
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
            if (mounted) {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
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
        const { error } = await supabase.auth.signOut();
        if (error) {
            setLoading(false);
            throw error;
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

        // Faz logout
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
