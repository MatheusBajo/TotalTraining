import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, Platform } from 'react-native';
import { useTheme } from '../theme';
import { X, Barbell, Check, PencilSimple, FloppyDisk, Play, Stop, Timer } from 'phosphor-react-native';
import { getFullWorkout, updateWorkout } from '../api';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface WorkoutDetailModalProps {
    visible: boolean;
    workoutId: number | null;
    onClose: () => void;
    onWorkoutUpdated?: () => void;
}

interface FullWorkoutData {
    workout: {
        id: number;
        date: string;
        name: string;
        started_at: string | null;
        finished_at: string | null;
        duration_seconds: number | null;
        notes: string | null;
    };
    exercises: Array<{
        id: number;
        exercise_name: string;
        notes: string | null;
        sets: Array<{
            id: number;
            order_index: number;
            set_type: string;
            weight: number | null;
            reps: number | null;
            rir: number | null;
            completed: boolean;
        }>;
    }>;
}

export const WorkoutDetailModal = ({ visible, workoutId, onClose, onWorkoutUpdated }: WorkoutDetailModalProps) => {
    const { theme } = useTheme();
    const [data, setData] = useState<FullWorkoutData | null>(null);
    const [originalData, setOriginalData] = useState<FullWorkoutData | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Estados de edição
    const [editMode, setEditMode] = useState<'none' | 'startTime' | 'endTime' | 'duration'>('none');
    const [editStartedAt, setEditStartedAt] = useState<Date>(new Date());
    const [editFinishedAt, setEditFinishedAt] = useState<Date>(new Date());
    const [editDurationHours, setEditDurationHours] = useState('');
    const [editDurationMinutes, setEditDurationMinutes] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [timePickerMode, setTimePickerMode] = useState<'start' | 'end'>('start');

    // Guarda valores originais para comparação
    const [originalStartedAt, setOriginalStartedAt] = useState<Date>(new Date());
    const [originalFinishedAt, setOriginalFinishedAt] = useState<Date>(new Date());
    const [originalDurationHours, setOriginalDurationHours] = useState('');
    const [originalDurationMinutes, setOriginalDurationMinutes] = useState('');

    // Verifica se há alterações não salvas
    const hasUnsavedChanges = useCallback(() => {
        if (editMode === 'none') return false;

        if (editMode === 'startTime') {
            return editStartedAt.getTime() !== originalStartedAt.getTime();
        }
        if (editMode === 'endTime') {
            return editFinishedAt.getTime() !== originalFinishedAt.getTime();
        }
        if (editMode === 'duration') {
            return editDurationHours !== originalDurationHours || editDurationMinutes !== originalDurationMinutes;
        }
        return false;
    }, [editMode, editStartedAt, editFinishedAt, editDurationHours, editDurationMinutes, originalStartedAt, originalFinishedAt, originalDurationHours, originalDurationMinutes]);

    useEffect(() => {
        if (visible && workoutId) {
            loadWorkout();
            setEditMode('none');
        } else {
            setData(null);
            setOriginalData(null);
            setEditMode('none');
        }
    }, [visible, workoutId]);

    const loadWorkout = async () => {
        if (!workoutId) return;
        setLoading(true);
        try {
            const result = await getFullWorkout(workoutId);
            setData(result as FullWorkoutData);
            setOriginalData(result as FullWorkoutData);

            // Inicializa os campos de edição
            let startDate = new Date();
            let endDate = new Date();

            if (result?.workout.started_at) {
                startDate = parseISO(result.workout.started_at);
            } else if (result?.workout.date) {
                startDate = parseISO(result.workout.date);
                startDate.setHours(8, 0, 0, 0);
            }

            if (result?.workout.finished_at) {
                endDate = parseISO(result.workout.finished_at);
            } else if (result?.workout.date) {
                endDate = parseISO(result.workout.date);
                endDate.setHours(9, 0, 0, 0);
            }

            setEditStartedAt(startDate);
            setEditFinishedAt(endDate);
            setOriginalStartedAt(startDate);
            setOriginalFinishedAt(endDate);

            let hours = '0';
            let minutes = '0';
            if (result?.workout.duration_seconds) {
                const totalMins = Math.floor(result.workout.duration_seconds / 60);
                hours = Math.floor(totalMins / 60).toString();
                minutes = (totalMins % 60).toString();
            }
            setEditDurationHours(hours);
            setEditDurationMinutes(minutes);
            setOriginalDurationHours(hours);
            setOriginalDurationMinutes(minutes);
        } catch (error) {
            console.error('[WorkoutDetailModal] Error loading workout:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handler para fechar com verificação de alterações
    const handleClose = () => {
        if (hasUnsavedChanges()) {
            Alert.alert(
                'Alterações não salvas',
                'Você tem alterações não salvas. Deseja salvá-las antes de sair?',
                [
                    {
                        text: 'Descartar',
                        style: 'destructive',
                        onPress: () => {
                            setEditMode('none');
                            // Restaura valores originais
                            setEditStartedAt(originalStartedAt);
                            setEditFinishedAt(originalFinishedAt);
                            setEditDurationHours(originalDurationHours);
                            setEditDurationMinutes(originalDurationMinutes);
                            onClose();
                        }
                    },
                    {
                        text: 'Salvar',
                        onPress: async () => {
                            // Salva baseado no modo atual
                            if (editMode === 'startTime') {
                                await handleSaveStartTime();
                            } else if (editMode === 'endTime') {
                                await handleSaveEndTime();
                            } else if (editMode === 'duration') {
                                await handleSaveDuration();
                            }
                            onClose();
                        }
                    },
                    { text: 'Cancelar', style: 'cancel' }
                ]
            );
        } else {
            setEditMode('none');
            onClose();
        }
    };

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '-';
        const mins = Math.floor(seconds / 60);
        const hrs = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        if (hrs > 0) {
            return `${hrs}h ${remainingMins}min`;
        }
        return `${mins}min`;
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '-';
        try {
            return format(parseISO(dateString), 'HH:mm');
        } catch {
            return '-';
        }
    };

    // Salvar horário de início
    const handleSaveStartTime = async () => {
        if (!data || !workoutId) return;

        setSaving(true);
        try {
            const startedAtString = editStartedAt.toISOString();
            let newDuration = data.workout.duration_seconds;
            if (data.workout.finished_at) {
                newDuration = differenceInSeconds(parseISO(data.workout.finished_at), editStartedAt);
                newDuration = Math.max(0, newDuration);
            }

            await updateWorkout(workoutId, {
                started_at: startedAtString,
                duration_seconds: newDuration || undefined,
            });

            const updatedData = {
                ...data,
                workout: {
                    ...data.workout,
                    started_at: startedAtString,
                    duration_seconds: newDuration,
                }
            };
            setData(updatedData);
            setOriginalStartedAt(editStartedAt);

            // Atualiza duração exibida
            if (newDuration) {
                const totalMins = Math.floor(newDuration / 60);
                const hrs = Math.floor(totalMins / 60).toString();
                const mins = (totalMins % 60).toString();
                setEditDurationHours(hrs);
                setEditDurationMinutes(mins);
                setOriginalDurationHours(hrs);
                setOriginalDurationMinutes(mins);
            }

            setEditMode('none');
            onWorkoutUpdated?.();
        } catch (error) {
            console.error('[WorkoutDetailModal] Error updating:', error);
            Alert.alert('Erro', 'Não foi possível atualizar');
        } finally {
            setSaving(false);
        }
    };

    // Salvar horário de término
    const handleSaveEndTime = async () => {
        if (!data || !workoutId) return;

        setSaving(true);
        try {
            const finishedAtString = editFinishedAt.toISOString();
            let newDuration = data.workout.duration_seconds;
            if (data.workout.started_at) {
                newDuration = differenceInSeconds(editFinishedAt, parseISO(data.workout.started_at));
                newDuration = Math.max(0, newDuration);
            }

            await updateWorkout(workoutId, {
                finished_at: finishedAtString,
                duration_seconds: newDuration || undefined,
            });

            const updatedData = {
                ...data,
                workout: {
                    ...data.workout,
                    finished_at: finishedAtString,
                    duration_seconds: newDuration,
                }
            };
            setData(updatedData);
            setOriginalFinishedAt(editFinishedAt);

            // Atualiza duração exibida
            if (newDuration) {
                const totalMins = Math.floor(newDuration / 60);
                const hrs = Math.floor(totalMins / 60).toString();
                const mins = (totalMins % 60).toString();
                setEditDurationHours(hrs);
                setEditDurationMinutes(mins);
                setOriginalDurationHours(hrs);
                setOriginalDurationMinutes(mins);
            }

            setEditMode('none');
            onWorkoutUpdated?.();
        } catch (error) {
            console.error('[WorkoutDetailModal] Error updating:', error);
            Alert.alert('Erro', 'Não foi possível atualizar');
        } finally {
            setSaving(false);
        }
    };

    // Salvar duração manual
    const handleSaveDuration = async () => {
        if (!data || !workoutId) return;

        const hours = parseInt(editDurationHours) || 0;
        const minutes = parseInt(editDurationMinutes) || 0;
        const totalSeconds = (hours * 60 + minutes) * 60;

        if (totalSeconds <= 0) {
            Alert.alert('Erro', 'Duração deve ser maior que zero');
            return;
        }

        setSaving(true);
        try {
            await updateWorkout(workoutId, { duration_seconds: totalSeconds });

            setData({
                ...data,
                workout: { ...data.workout, duration_seconds: totalSeconds }
            });
            setOriginalDurationHours(editDurationHours);
            setOriginalDurationMinutes(editDurationMinutes);

            setEditMode('none');
            onWorkoutUpdated?.();
        } catch (error) {
            console.error('[WorkoutDetailModal] Error updating:', error);
            Alert.alert('Erro', 'Não foi possível atualizar');
        } finally {
            setSaving(false);
        }
    };

    const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // No iOS com display="spinner", precisamos de um botão para confirmar
        // No Android, fecha automaticamente
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }

        if (event.type !== 'dismissed' && selectedDate) {
            if (timePickerMode === 'start') {
                setEditStartedAt(selectedDate);
            } else {
                setEditFinishedAt(selectedDate);
            }
        }
    };

    const confirmTimePicker = () => {
        setShowTimePicker(false);
    };

    const cancelTimePicker = () => {
        // Restaura valor original
        if (timePickerMode === 'start') {
            setEditStartedAt(originalStartedAt);
        } else {
            setEditFinishedAt(originalFinishedAt);
        }
        setShowTimePicker(false);
    };

    const openTimePicker = (mode: 'start' | 'end') => {
        setTimePickerMode(mode);
        setEditMode(mode === 'start' ? 'startTime' : 'endTime');
        setShowTimePicker(true);
    };

    const getSetTypeLabel = (type: string) => {
        switch (type) {
            case 'W': return 'Aquec.';
            case 'D': return 'Drop';
            case 'F': return 'Falha';
            default: return '';
        }
    };

    const getSetTypeColor = (type: string) => {
        switch (type) {
            case 'W': return '#f97316';
            case 'D': return '#8b5cf6';
            case 'F': return '#ef4444';
            default: return theme.text;
        }
    };

    // Componente de campo editável de horário
    const TimeField = ({
        icon,
        label,
        value,
        editValue,
        isEditing,
        onPress,
        onSave,
    }: {
        icon: React.ReactNode;
        label: string;
        value: string;
        editValue: Date;
        isEditing: boolean;
        onPress: () => void;
        onSave: () => void;
    }) => (
        <TouchableOpacity
            onPress={onPress}
            style={{ backgroundColor: theme.surface }}
            className="flex-1 p-3 rounded-xl"
            activeOpacity={0.7}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    {icon}
                    <View className="ml-2 flex-1">
                        <Text style={{ color: theme.textSecondary }} className="text-xs">
                            {label}
                        </Text>
                        <Text style={{ color: isEditing ? theme.primary : theme.text }} className="font-bold">
                            {isEditing ? format(editValue, 'HH:mm') : value}
                        </Text>
                    </View>
                </View>
                {isEditing ? (
                    <TouchableOpacity
                        onPress={onSave}
                        disabled={saving}
                        style={{ backgroundColor: theme.primary }}
                        className="w-7 h-7 rounded-full items-center justify-center"
                    >
                        <FloppyDisk size={14} color="#fff" weight="bold" />
                    </TouchableOpacity>
                ) : (
                    <PencilSimple size={14} color={theme.textSecondary} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={{ backgroundColor: theme.background }} className="flex-1">
                {/* Header */}
                <View
                    style={{ backgroundColor: theme.surface, borderBottomColor: theme.borderSubtle }}
                    className="px-4 pt-4 pb-3 flex-row justify-between items-center border-b"
                >
                    <View className="flex-1">
                        <Text style={{ color: theme.text }} className="text-xl font-bold">
                            {data?.workout.name || 'Carregando...'}
                        </Text>
                        {data && (
                            <Text style={{ color: theme.textSecondary }} className="text-sm">
                                {format(parseISO(data.workout.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={{ backgroundColor: theme.field }}
                        className="w-10 h-10 rounded-full items-center justify-center"
                    >
                        <X size={20} color={theme.text} weight="bold" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                ) : data ? (
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Horários - Início e Término */}
                        <View className="flex-row mb-3 gap-2">
                            <TimeField
                                icon={<Play size={18} color="#22c55e" weight="fill" />}
                                label="Início"
                                value={formatTime(data.workout.started_at)}
                                editValue={editStartedAt}
                                isEditing={editMode === 'startTime'}
                                onPress={() => openTimePicker('start')}
                                onSave={handleSaveStartTime}
                            />
                            <TimeField
                                icon={<Stop size={18} color="#ef4444" weight="fill" />}
                                label="Término"
                                value={formatTime(data.workout.finished_at)}
                                editValue={editFinishedAt}
                                isEditing={editMode === 'endTime'}
                                onPress={() => openTimePicker('end')}
                                onSave={handleSaveEndTime}
                            />
                        </View>

                        {/* Duração e Exercícios */}
                        <View className="flex-row mb-6 gap-2">
                            <TouchableOpacity
                                onPress={() => setEditMode(editMode === 'duration' ? 'none' : 'duration')}
                                style={{ backgroundColor: theme.surface }}
                                className="flex-1 p-3 rounded-xl"
                                activeOpacity={0.7}
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <Timer size={18} color={theme.primary} />
                                        <View className="ml-2 flex-1">
                                            <Text style={{ color: theme.textSecondary }} className="text-xs">
                                                Duração
                                            </Text>
                                            {editMode === 'duration' ? (
                                                <View className="flex-row items-center">
                                                    <TextInput
                                                        value={editDurationHours}
                                                        onChangeText={setEditDurationHours}
                                                        keyboardType="numeric"
                                                        maxLength={2}
                                                        style={{
                                                            backgroundColor: theme.field,
                                                            color: theme.text,
                                                            width: 32,
                                                            height: 28,
                                                            borderRadius: 4,
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize: 14,
                                                        }}
                                                    />
                                                    <Text style={{ color: theme.text }} className="mx-1 text-sm font-bold">h</Text>
                                                    <TextInput
                                                        value={editDurationMinutes}
                                                        onChangeText={setEditDurationMinutes}
                                                        keyboardType="numeric"
                                                        maxLength={2}
                                                        style={{
                                                            backgroundColor: theme.field,
                                                            color: theme.text,
                                                            width: 32,
                                                            height: 28,
                                                            borderRadius: 4,
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize: 14,
                                                        }}
                                                    />
                                                    <Text style={{ color: theme.text }} className="ml-1 text-sm font-bold">m</Text>
                                                </View>
                                            ) : (
                                                <Text style={{ color: theme.text }} className="font-bold">
                                                    {formatDuration(data.workout.duration_seconds)}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    {editMode === 'duration' ? (
                                        <TouchableOpacity
                                            onPress={handleSaveDuration}
                                            disabled={saving}
                                            style={{ backgroundColor: theme.primary }}
                                            className="w-7 h-7 rounded-full items-center justify-center"
                                        >
                                            <FloppyDisk size={14} color="#fff" weight="bold" />
                                        </TouchableOpacity>
                                    ) : (
                                        <PencilSimple size={14} color={theme.textSecondary} />
                                    )}
                                </View>
                            </TouchableOpacity>

                            <View
                                style={{ backgroundColor: theme.surface }}
                                className="flex-1 p-3 rounded-xl flex-row items-center"
                            >
                                <Barbell size={18} color={theme.primary} />
                                <View className="ml-2">
                                    <Text style={{ color: theme.textSecondary }} className="text-xs">
                                        Exercícios
                                    </Text>
                                    <Text style={{ color: theme.text }} className="font-bold">
                                        {String(data.exercises.length)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Exercises */}
                        {data.exercises.map((exercise) => (
                            <View
                                key={exercise.id}
                                style={{ backgroundColor: theme.surface }}
                                className="mb-4 rounded-xl overflow-hidden"
                            >
                                {/* Exercise Header */}
                                <View className="px-4 pt-4 pb-2 flex-row items-center">
                                    <View
                                        style={{
                                            width: 4,
                                            height: 24,
                                            backgroundColor: theme.primary,
                                            borderRadius: 2,
                                            marginRight: 10,
                                        }}
                                    />
                                    <Text style={{ color: theme.primary }} className="font-bold text-base uppercase flex-1">
                                        {exercise.exercise_name}
                                    </Text>
                                </View>

                                {/* Column Headers */}
                                <View className="flex-row px-4 py-2" style={{ backgroundColor: theme.background + '40' }}>
                                    <Text style={{ color: theme.textSecondary }} className="w-12 text-xs font-bold">
                                        Série
                                    </Text>
                                    <Text style={{ color: theme.textSecondary }} className="flex-1 text-center text-xs font-bold">
                                        Peso
                                    </Text>
                                    <Text style={{ color: theme.textSecondary }} className="flex-1 text-center text-xs font-bold">
                                        Reps
                                    </Text>
                                    <Text style={{ color: theme.textSecondary }} className="flex-1 text-center text-xs font-bold">
                                        RIR
                                    </Text>
                                    <View className="w-8" />
                                </View>

                                {/* Sets */}
                                {exercise.sets.map((set, setIndex) => {
                                    const isSpecialType = set.set_type && set.set_type !== 'N';
                                    const typeColor = getSetTypeColor(set.set_type);

                                    return (
                                        <View
                                            key={set.id}
                                            className="flex-row items-center px-4 py-3"
                                            style={{
                                                backgroundColor: Boolean(set.completed) ? '#22c55e10' : 'transparent',
                                                borderTopWidth: setIndex > 0 ? 1 : 0,
                                                borderTopColor: theme.borderSubtle,
                                            }}
                                        >
                                            <View className="w-12">
                                                <Text style={{ color: isSpecialType ? typeColor : theme.text }} className="text-sm font-bold">
                                                    {isSpecialType ? getSetTypeLabel(set.set_type) : String(setIndex + 1)}
                                                </Text>
                                            </View>
                                            <Text style={{ color: theme.text }} className="flex-1 text-center font-medium">
                                                {set.weight !== null && set.weight !== undefined ? `${set.weight}kg` : '-'}
                                            </Text>
                                            <Text style={{ color: theme.text }} className="flex-1 text-center font-medium">
                                                {set.reps !== null && set.reps !== undefined ? String(set.reps) : '-'}
                                            </Text>
                                            <Text style={{ color: theme.text }} className="flex-1 text-center font-medium">
                                                {set.rir !== null && set.rir !== undefined ? String(set.rir) : '-'}
                                            </Text>
                                            <View className="w-8 items-center">
                                                {Boolean(set.completed) && (
                                                    <View
                                                        style={{ backgroundColor: '#22c55e' }}
                                                        className="w-6 h-6 rounded items-center justify-center"
                                                    >
                                                        <Check size={14} color="#fff" weight="bold" />
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}

                                {/* Exercise Notes */}
                                {exercise.notes && (
                                    <View className="px-4 py-2" style={{ backgroundColor: theme.background + '40' }}>
                                        <Text style={{ color: theme.textSecondary }} className="text-sm italic">
                                            {exercise.notes}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}

                        {/* Workout Notes */}
                        {data.workout.notes && (
                            <View
                                style={{ backgroundColor: theme.surface }}
                                className="p-4 rounded-xl mb-4"
                            >
                                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2">
                                    OBSERVAÇÕES
                                </Text>
                                <Text style={{ color: theme.text }}>
                                    {data.workout.notes}
                                </Text>
                            </View>
                        )}

                        <View className="h-8" />
                    </ScrollView>
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text style={{ color: theme.textSecondary }}>
                            Treino não encontrado
                        </Text>
                    </View>
                )}
            </View>

            {/* Time Picker Modal - Separado do conteúdo principal */}
            {showTimePicker && (
                <Modal
                    visible={showTimePicker}
                    transparent
                    animationType="fade"
                    onRequestClose={cancelTimePicker}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 20, width: '80%' }}>
                            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
                                {timePickerMode === 'start' ? 'Horário de Início' : 'Horário de Término'}
                            </Text>

                            <DateTimePicker
                                value={timePickerMode === 'start' ? editStartedAt : editFinishedAt}
                                mode="time"
                                is24Hour={true}
                                display="spinner"
                                onChange={handleTimeChange}
                                style={{ height: 150 }}
                            />

                            <View className="flex-row gap-3 mt-4">
                                <TouchableOpacity
                                    onPress={cancelTimePicker}
                                    style={{ backgroundColor: theme.field, flex: 1 }}
                                    className="py-3 rounded-xl items-center"
                                >
                                    <Text style={{ color: theme.text }} className="font-bold">Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={confirmTimePicker}
                                    style={{ backgroundColor: theme.primary, flex: 1 }}
                                    className="py-3 rounded-xl items-center"
                                >
                                    <Text className="text-white font-bold">Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </Modal>
    );
};
