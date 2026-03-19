import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://zryedrsytfjkacrfwrun.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zmJcypDQyXA5T58mC7igiA_D7FkjrsG';

// Chaves para cache local
const CACHE_KEYS = {
    LAST_WORKOUT: 'totaltraining:cache:lastWorkout',
    USER_STATS: 'totaltraining:cache:userStats',
    WORKOUTS_LIST: 'totaltraining:cache:workoutsList',
    REMEMBER_ME: 'totaltraining:rememberMe',
};

// AsyncStorage adapter para Supabase - persiste sessão entre reinicializações
const AsyncStorageAdapter = {
    getItem: async (key: string): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.error('[Supabase] Error getting item:', error);
            return null;
        }
    },
    setItem: async (key: string, value: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('[Supabase] Error setting item:', error);
        }
    },
    removeItem: async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('[Supabase] Error removing item:', error);
        }
    },
};

// Fetch com timeout de 10s para evitar requests pendentes indefinidamente
const fetchWithTimeout = (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeout));
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    global: {
        fetch: fetchWithTimeout,
    },
});

// ==================== CACHE HELPERS ====================

export async function getCachedData<T>(key: string): Promise<T | null> {
    try {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
            const parsed = JSON.parse(cached);
            // Verifica se não expirou (24 horas)
            if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                return parsed.data as T;
            }
        }
        return null;
    } catch {
        return null;
    }
}

export async function setCachedData<T>(key: string, data: T): Promise<void> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now(),
        }));
    } catch (error) {
        console.error('[Cache] Error saving:', error);
    }
}

export async function clearCache(): Promise<void> {
    try {
        const keys = Object.values(CACHE_KEYS).filter(k => k.includes('cache'));
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
        console.error('[Cache] Error clearing:', error);
    }
}

// Cache específico para último treino
export async function getCachedLastWorkout() {
    return getCachedData<{ id: number; name: string; finished_at: string }>(CACHE_KEYS.LAST_WORKOUT);
}

export async function setCachedLastWorkout(workout: { id: number; name: string; finished_at: string }) {
    return setCachedData(CACHE_KEYS.LAST_WORKOUT, workout);
}

// Cache específico para stats do usuário
export async function getCachedUserStats() {
    return getCachedData<any>(CACHE_KEYS.USER_STATS);
}

export async function setCachedUserStats(stats: any) {
    return setCachedData(CACHE_KEYS.USER_STATS, stats);
}

// ==================== REMEMBER ME ====================

export async function setRememberMe(value: boolean): Promise<void> {
    try {
        await AsyncStorage.setItem(CACHE_KEYS.REMEMBER_ME, JSON.stringify(value));
        console.log('[Supabase] Remember me:', value);
    } catch (error) {
        console.error('[Supabase] Error setting remember me:', error);
    }
}

export async function getRememberMe(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(CACHE_KEYS.REMEMBER_ME);
        return value ? JSON.parse(value) : false;
    } catch {
        return false;
    }
}

export { CACHE_KEYS };
