// API Client para comunicação com o servidor
import Constants from 'expo-constants';

// Configuração da API
const API_PORT = 3001;
const LOCAL_IP = '192.168.2.50'; // Seu IP local (fallback)

// ⚠️ NGROK URL - Configure aqui quando for usar fora de casa (4G)
// Rode: ngrok http 3001
// Cole a URL HTTPS aqui (ex: 'https://abc123.ngrok-free.app')
// Deixe null para auto-detectar na rede local
const NGROK_URL: string | null = "https://unrefusing-monroe-unaldermanly.ngrok-free.dev";

// Detecta o IP/host do Expo para conectar ao servidor
function getBaseApiUrl(): string {
    const expoDebuggerHost = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;

    if (expoDebuggerHost) {
        // expoDebuggerHost é algo como "192.168.2.50:8081" ou "abc-xyz-8081.exp.direct:8081"
        const host = expoDebuggerHost.split(':')[0];

        // Se for domínio do Expo tunnel (.exp.direct), usa IP local como fallback
        // porque o servidor da API está no PC, não no tunnel do Expo
        if (host.includes('.exp.direct') || host.includes('ngrok') || host.includes('tunnel')) {
            console.log(`[API] Detected Expo tunnel (${host}), using local IP fallback`);
            return `http://${LOCAL_IP}:${API_PORT}`;
        }

        const url = `http://${host}:${API_PORT}`;
        console.log(`[API] Base URL from Expo: ${url}`);
        return url;
    }

    const fallbackUrl = `http://${LOCAL_IP}:${API_PORT}`;
    console.log(`[API] Using fallback URL: ${fallbackUrl}`);
    return fallbackUrl;
}

// URL da API - começa com a URL local
let API_URL = getBaseApiUrl();
let isInitialized = false;

// Tenta descobrir a URL pública do ngrok (se estiver rodando)
async function discoverNgrokUrl(): Promise<string | null> {
    try {
        // Primeiro tenta via IP local
        const baseUrl = getBaseApiUrl();
        const response = await fetch(`${baseUrl}/api/ngrok-url`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();

        if (data.url) {
            console.log(`[API] Discovered ngrok URL: ${data.url}`);
            return data.url;
        }
    } catch (error) {
        // Servidor local não acessível, provavelmente está fora da rede
        console.log('[API] Could not reach local server, ngrok URL needed');
    }
    return null;
}

// Inicializa a API - tenta descobrir ngrok automaticamente
export async function initializeApi(): Promise<void> {
    if (isInitialized) return;

    console.log('[API] Initializing...');

    // Se NGROK_URL está configurada manualmente, usa direto
    if (NGROK_URL) {
        API_URL = NGROK_URL;
        console.log(`[API] Using configured ngrok URL: ${API_URL}`);
        isInitialized = true;
        return;
    }

    // Tenta usar URL local primeiro
    const baseUrl = getBaseApiUrl();

    try {
        // Testa se o servidor está acessível localmente
        const healthResponse = await fetch(`${baseUrl}/api/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (healthResponse.ok) {
            // Servidor local acessível - verifica se tem ngrok
            const ngrokUrl = await discoverNgrokUrl();
            if (ngrokUrl) {
                API_URL = ngrokUrl;
                console.log(`[API] Using ngrok URL: ${API_URL}`);
            } else {
                API_URL = baseUrl;
                console.log(`[API] Using local URL: ${API_URL}`);
            }
            isInitialized = true;
            return;
        }
    } catch (error) {
        console.log('[API] Local server not reachable');
    }

    // Se não conseguiu acessar localmente, mantém a URL base
    // (vai falhar, mas pelo menos tenta)
    API_URL = baseUrl;
    isInitialized = true;
}

// Permite configurar manualmente a URL
export function setApiUrl(url: string) {
    API_URL = url;
    isInitialized = true;
    console.log('[API] URL manually set to:', url);
}

// Retorna a URL atual da API
export function getConfiguredApiUrl(): string {
    return API_URL;
}

// Helper para fazer requests
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(`[API] Error fetching ${url}:`, error);
        throw error;
    }
}

// ==================== TYPES ====================

export interface WorkoutRecord {
    id: number;
    date: string;
    name: string;
    template_id?: string;
    started_at?: string;
    finished_at?: string;
    duration_seconds?: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface ExerciseRecord {
    id: number;
    workout_id: number;
    exercise_name: string;
    order_index: number;
    notes?: string;
    created_at: string;
}

export interface SetRecord {
    id: number;
    exercise_id: number;
    order_index: number;
    set_type: string;
    weight?: number;
    weight_type: string;
    reps?: number;
    time_seconds?: number;
    rir?: number;
    rpe?: number;
    completed: boolean;
    notes?: string;
    created_at: string;
}

export interface ExerciseWithSets extends ExerciseRecord {
    sets: SetRecord[];
}

export interface FullWorkout {
    workout: WorkoutRecord;
    exercises: ExerciseWithSets[];
}

export interface LastPerformance {
    weight: number;
    reps: number;
    weight_type: string;
}

// ==================== WORKOUTS ====================

export async function getAllWorkouts(): Promise<WorkoutRecord[]> {
    return fetchApi('/api/workouts');
}

export async function getFullWorkout(workoutId: number): Promise<FullWorkout | null> {
    try {
        return await fetchApi(`/api/workouts/${workoutId}`);
    } catch {
        return null;
    }
}

export async function createWorkout(data: {
    date: string;
    name: string;
    template_id?: string;
    started_at?: string;
    notes?: string;
}): Promise<number> {
    const result = await fetchApi<{ id: number }>('/api/workouts', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return result.id;
}

export async function finishWorkout(workoutId: number, durationSeconds: number): Promise<void> {
    await fetchApi(`/api/workouts/${workoutId}/finish`, {
        method: 'PUT',
        body: JSON.stringify({ duration_seconds: durationSeconds }),
    });
}

export interface FinishSetData {
    id: number;
    weight: number | null;
    reps: number | null;
    rir: number | null;
    completed: boolean;
    set_type: string;
}

export async function finishWorkoutBatch(
    workoutId: number,
    durationSeconds: number,
    sets: FinishSetData[]
): Promise<void> {
    await fetchApi(`/api/workouts/${workoutId}/finish-batch`, {
        method: 'PUT',
        body: JSON.stringify({ duration_seconds: durationSeconds, sets }),
    });
}

export async function deleteWorkout(workoutId: number): Promise<void> {
    await fetchApi(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
    });
}

// ==================== EXERCISES ====================

export async function getExercisesByWorkout(workoutId: number): Promise<ExerciseRecord[]> {
    return fetchApi(`/api/workouts/${workoutId}/exercises`);
}

export async function createExercise(data: {
    workout_id: number;
    exercise_name: string;
    order_index: number;
    notes?: string;
}): Promise<number> {
    const result = await fetchApi<{ id: number }>('/api/exercises', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return result.id;
}

// ==================== SETS ====================

export async function createSet(data: {
    exercise_id: number;
    order_index: number;
    set_type?: string;
    weight_type?: string;
    completed?: boolean;
}): Promise<number> {
    const result = await fetchApi<{ id: number }>('/api/sets', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return result.id;
}

export async function updateSet(
    setId: number,
    data: Partial<{
        weight: number | null;
        reps: number | null;
        rir: number | null;
        completed: boolean;
        set_type: string;
    }>
): Promise<void> {
    // Converte completed para 0/1 para SQLite
    const dbData = {
        ...data,
        completed: data.completed !== undefined ? (data.completed ? 1 : 0) : undefined,
    };

    await fetchApi(`/api/sets/${setId}`, {
        method: 'PUT',
        body: JSON.stringify(dbData),
    });
}

// ==================== LAST PERFORMANCE ====================

export async function getLastPerformance(exerciseName: string): Promise<LastPerformance | null> {
    try {
        return await fetchApi(`/api/last-performance/${encodeURIComponent(exerciseName)}`);
    } catch {
        return null;
    }
}

export async function getLastPerformanceBatch(exerciseNames: string[]): Promise<Record<string, LastPerformance | null>> {
    try {
        return await fetchApi('/api/last-performance/batch', {
            method: 'POST',
            body: JSON.stringify({ exerciseNames }),
        });
    } catch {
        return {};
    }
}

// ==================== BATCH OPERATIONS ====================

export interface BatchExercise {
    templateId: string;
    name: string;
    numSets: number;
}

export interface BatchWorkoutResult {
    workoutId: number;
    exercises: Array<{
        templateId: string;
        name: string;
        dbId: number;
        sets: Array<{ orderIndex: number; dbId: number }>;
    }>;
}

export async function createWorkoutBatch(data: {
    date: string;
    name: string;
    template_id?: string;
    started_at?: string;
    exercises: BatchExercise[];
}): Promise<BatchWorkoutResult> {
    return fetchApi('/api/workouts/batch', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ==================== STATISTICS ====================

export interface UserStats {
    totalTreinos: number;
    tempoTotal: string;
    volumeTotal: number;
    streak: number;
    metaSemanal: {
        atual: number;
        meta: number;
    };
    progressao: Array<{
        exercicio: string;
        cargaInicial: number;
        cargaAtual: number;
        evolucao: number;
    }>;
}

export async function getUserStats(): Promise<UserStats> {
    return fetchApi('/api/stats');
}

// ==================== PERSONAL RECORDS ====================

export interface SetPR {
    order_index: number;
    weight: number;
    reps: number;
    rir: number | null;
}

export interface ExercisePRs {
    bySet: SetPR[];
    absolute: SetPR | null;
}

export async function getExercisePRs(exerciseName: string): Promise<ExercisePRs> {
    return fetchApi(`/api/pr/${encodeURIComponent(exerciseName)}`);
}

export async function getPRsBatch(exerciseNames: string[]): Promise<Record<string, SetPR[]>> {
    return fetchApi('/api/pr/batch', {
        method: 'POST',
        body: JSON.stringify({ exercises: exerciseNames }),
    });
}

// ==================== HEALTH CHECK ====================

export async function checkServerHealth(): Promise<boolean> {
    try {
        await fetchApi('/api/health');
        return true;
    } catch {
        return false;
    }
}
