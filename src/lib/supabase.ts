import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://zryedrsytfjkacrfwrun.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zmJcypDQyXA5T58mC7igiA_D7FkjrsG';

// Chave para verificar se "Lembrar de mim" está ativo
const REMEMBER_ME_KEY = 'totaltraining_remember_me';

// Storage em memória (para quando "Lembrar de mim" está desativado)
const memoryStorage: Record<string, string> = {};

// Storage híbrido: usa AsyncStorage se "Lembrar de mim" está ativo, senão usa memória
const HybridStorageAdapter = {
    getItem: async (key: string): Promise<string | null> => {
        try {
            const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
            if (rememberMe === 'true') {
                return await AsyncStorage.getItem(key);
            }
            return memoryStorage[key] ?? null;
        } catch {
            return memoryStorage[key] ?? null;
        }
    },
    setItem: async (key: string, value: string): Promise<void> => {
        try {
            const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
            if (rememberMe === 'true') {
                await AsyncStorage.setItem(key, value);
            } else {
                memoryStorage[key] = value;
            }
        } catch {
            memoryStorage[key] = value;
        }
    },
    removeItem: async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
            delete memoryStorage[key];
        } catch {
            delete memoryStorage[key];
        }
    },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: HybridStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Funções para controlar "Lembrar de mim"
export async function setRememberMe(value: boolean): Promise<void> {
    try {
        if (value) {
            await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
        } else {
            await AsyncStorage.removeItem(REMEMBER_ME_KEY);
            // Limpa sessão do AsyncStorage quando desativa
            const keys = await AsyncStorage.getAllKeys();
            const supabaseKeys = keys.filter(k => k.startsWith('sb-'));
            if (supabaseKeys.length > 0) {
                await AsyncStorage.multiRemove(supabaseKeys);
            }
        }
    } catch (error) {
        console.error('[Supabase] Error setting remember me:', error);
    }
}

export async function getRememberMe(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        return value === 'true';
    } catch {
        return false;
    }
}
