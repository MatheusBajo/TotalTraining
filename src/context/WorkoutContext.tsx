import React, { createContext, useContext, useState, useEffect } from 'react';
import { treinos } from '../data/treinos.json';
import { SetType } from '../components/SetTypeModal';

interface WorkoutSet {
    id: string;
    kg: string;
    reps: string;
    rir: string;
    completed: boolean;
    type: SetType;
    prev: string;
}

interface WorkoutExercise {
    id: string;
    name: string;
    sets: WorkoutSet[];
}

interface WorkoutContextData {
    isActive: boolean;
    isMinimized: boolean;
    workoutName: string;
    duration: number;
    exercises: WorkoutExercise[];
    startWorkout: (template?: any) => void;
    minimizeWorkout: () => void;
    maximizeWorkout: () => void;
    finishWorkout: () => void;
    cancelWorkout: () => void;
    addSet: (exerciseId: string) => void;
    updateSet: (exerciseId: string, setId: string, field: 'kg' | 'reps' | 'rir', value: string) => void;
    toggleSet: (exerciseId: string, setId: string) => void;
    changeSetType: (exerciseId: string, setId: string, type: SetType) => void;
}

const WorkoutContext = createContext<WorkoutContextData>({} as WorkoutContextData);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [isActive, setIsActive] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [workoutName, setWorkoutName] = useState('');
    const [duration, setDuration] = useState(0);
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            timer = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive]);

    const getLastStats = (exerciseName: string) => {
        for (let i = treinos.length - 1; i >= 0; i--) {
            const workout = treinos[i];
            const exercise = workout.exercicios.find((e: any) => e.nome === exerciseName);
            if (exercise && exercise.series && Array.isArray(exercise.series) && exercise.series.length > 0) {
                const lastSet = exercise.series[exercise.series.length - 1];
                if (typeof lastSet === 'object' && lastSet !== null) {
                    if ('carga' in lastSet && 'reps' in lastSet) return `${lastSet.carga}kg x ${lastSet.reps}`;
                    if ('reps' in lastSet) return `${lastSet.reps} reps`;
                }
            }
        }
        return '-';
    };

    const startWorkout = (template?: any) => {
        const initialExercises = template ? template.exercicios.map((ex: any) => ({
            id: ex.id,
            name: ex.nome,
            sets: Array(typeof ex.series === 'number' ? ex.series : 3).fill(0).map(() => ({
                id: Math.random().toString(),
                kg: '',
                reps: '',
                rir: '',
                completed: false,
                type: 'N' as SetType,
                prev: getLastStats(ex.nome)
            }))
        })) : [];

        setWorkoutName(template?.nome || 'Quick Workout');
        setExercises(initialExercises);
        setDuration(0);
        setIsActive(true);
        setIsMinimized(false);
    };

    const minimizeWorkout = () => setIsMinimized(true);
    const maximizeWorkout = () => setIsMinimized(false);

    const finishWorkout = () => {
        setIsActive(false);
        setIsMinimized(false);
        // Save logic here
    };

    const cancelWorkout = () => {
        setIsActive(false);
        setIsMinimized(false);
    };

    const addSet = (exerciseId: string) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            const lastSet = ex.sets[ex.sets.length - 1];
            const newSet = {
                id: Math.random().toString(),
                kg: lastSet ? lastSet.kg : '',
                reps: lastSet ? lastSet.reps : '',
                rir: '',
                completed: false,
                type: 'N' as SetType,
                prev: '-'
            };
            return { ...ex, sets: [...ex.sets, newSet] };
        }));
    };

    const updateSet = (exerciseId: string, setId: string, field: 'kg' | 'reps' | 'rir', value: string) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
            };
        }));
    };

    const toggleSet = (exerciseId: string, setId: string) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
            };
        }));
    };

    const changeSetType = (exerciseId: string, setId: string, type: SetType) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(s => s.id === setId ? { ...s, type } : s)
            };
        }));
    };

    return (
        <WorkoutContext.Provider value={{
            isActive,
            isMinimized,
            workoutName,
            duration,
            exercises,
            startWorkout,
            minimizeWorkout,
            maximizeWorkout,
            finishWorkout,
            cancelWorkout,
            addSet,
            updateSet,
            toggleSet,
            changeSetType
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkout = () => useContext(WorkoutContext);
