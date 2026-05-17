import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlanoTreino, TemplateTreino } from '../types';
import { planoAtual as defaultPlan } from '../data';

const PLANS_KEY = '@plans';
const ACTIVE_PLAN_KEY = '@activePlanId';

interface PlanContextData {
    activePlan: PlanoTreino;
    plans: PlanoTreino[];
    setActivePlan: (planId: string) => Promise<void>;
    savePlan: (plan: PlanoTreino) => Promise<void>;
    deletePlan: (planId: string) => Promise<void>;
    duplicatePlan: (planId: string, newName: string) => Promise<void>;
    loading: boolean;
    // Templates do plano ativo (atalho)
    templates: TemplateTreino[];
}

const PlanContext = createContext<PlanContextData>({} as PlanContextData);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [plans, setPlans] = useState<PlanoTreino[]>([defaultPlan]);
    const [activePlanId, setActivePlanId] = useState<string>(defaultPlan.id);
    const [loading, setLoading] = useState(true);

    // Carrega planos e plano ativo do AsyncStorage
    useEffect(() => {
        const load = async () => {
            try {
                const [storedPlans, storedActiveId] = await Promise.all([
                    AsyncStorage.getItem(PLANS_KEY),
                    AsyncStorage.getItem(ACTIVE_PLAN_KEY),
                ]);

                let parsedPlans: PlanoTreino[] = storedPlans ? JSON.parse(storedPlans) : [];

                // Garante que o plano padrão sempre existe
                if (!parsedPlans.find(p => p.id === defaultPlan.id)) {
                    parsedPlans = [defaultPlan, ...parsedPlans];
                }

                setPlans(parsedPlans);

                if (storedActiveId && parsedPlans.find(p => p.id === storedActiveId)) {
                    setActivePlanId(storedActiveId);
                }
            } catch (error) {
                console.error('[PlanContext] Error loading plans:', error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // Persiste planos no AsyncStorage
    const persistPlans = useCallback(async (newPlans: PlanoTreino[]) => {
        try {
            await AsyncStorage.setItem(PLANS_KEY, JSON.stringify(newPlans));
        } catch (error) {
            console.error('[PlanContext] Error persisting plans:', error);
        }
    }, []);

    const setActivePlan = useCallback(async (planId: string) => {
        setActivePlanId(planId);
        try {
            await AsyncStorage.setItem(ACTIVE_PLAN_KEY, planId);
        } catch (error) {
            console.error('[PlanContext] Error setting active plan:', error);
        }
    }, []);

    const savePlan = useCallback(async (plan: PlanoTreino) => {
        setPlans(prev => {
            const exists = prev.findIndex(p => p.id === plan.id);
            let newPlans: PlanoTreino[];
            if (exists >= 0) {
                newPlans = [...prev];
                newPlans[exists] = plan;
            } else {
                newPlans = [...prev, plan];
            }
            persistPlans(newPlans);
            return newPlans;
        });
    }, [persistPlans]);

    const deletePlan = useCallback(async (planId: string) => {
        // Não permite deletar o plano ativo
        if (planId === activePlanId) return;
        // Não permite deletar o plano padrão
        if (planId === defaultPlan.id) return;

        setPlans(prev => {
            const newPlans = prev.filter(p => p.id !== planId);
            persistPlans(newPlans);
            return newPlans;
        });
    }, [activePlanId, persistPlans]);

    const duplicatePlan = useCallback(async (planId: string, newName: string) => {
        const original = plans.find(p => p.id === planId);
        if (!original) return;

        const duplicate: PlanoTreino = {
            ...original,
            id: `plan-${Date.now()}`,
            nome: newName,
            criadoEm: new Date().toLocaleDateString('pt-BR'),
        };

        await savePlan(duplicate);
    }, [plans, savePlan]);

    const activePlan = plans.find(p => p.id === activePlanId) || defaultPlan;

    return (
        <PlanContext.Provider
            value={{
                activePlan,
                plans,
                setActivePlan,
                savePlan,
                deletePlan,
                duplicatePlan,
                loading,
                templates: activePlan.templates,
            }}
        >
            {children}
        </PlanContext.Provider>
    );
};

export const usePlan = () => useContext(PlanContext);
