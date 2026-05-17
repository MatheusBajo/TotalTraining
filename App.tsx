import './src/global.css';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from './src/theme';
import { CoreHaptics } from 'expo-core-haptics';

import { WorkoutProvider, useWorkoutMeta, useWorkoutActions } from './src/context/WorkoutContext';
import { SheetAnimationProvider } from './src/context/SheetAnimationContext';
import { WorkoutBottomSheet } from './src/components/WorkoutBottomSheet';
import { StandaloneTabBar } from './src/components/StandaloneTabBar';
import { SheetBackdrop } from './src/components/SheetBackdrop';
import { MiniPlayer } from './src/components/MiniPlayer';
import { ActiveWorkoutModal } from './src/components/ActiveWorkoutModal';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DevProvider } from './src/context/DevContext';
import { PlanProvider } from './src/context/PlanContext';
import LoginScreen from './src/screens/Auth/LoginScreen';

// Database & Sync
import { initDatabase } from './src/db';
import { startSyncService, stopSyncService, pullFromRemote } from './src/db/syncService';

// Componente separado para o modal (precisa estar dentro do WorkoutProvider)
function ActiveWorkoutModalWrapper() {
  // Optimized: only subscribes to meta (no exercises) - doesn't re-render on set updates
  const { showActiveModal, workoutName } = useWorkoutMeta();
  const { resumeWorkout, confirmStartNew, dismissModal } = useWorkoutActions();

  return (
    <ActiveWorkoutModal
      visible={showActiveModal}
      currentWorkoutName={workoutName}
      onResume={resumeWorkout}
      onStartNew={confirmStartNew}
      onCancel={dismissModal}
    />
  );
}

function AppContent() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const [dbReady, setDbReady] = useState(false);
  const [syncStarted, setSyncStarted] = useState(false);

  // Inicializa o banco de dados LOCAL ao montar
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        console.log('[App] Database initialized');
        setDbReady(true);
      } catch (error) {
        console.error('[App] Failed to initialize database:', error);
        // Mesmo com erro, permite continuar (dados vão pro Supabase)
        setDbReady(true);
      }
    };

    setupDatabase();
  }, []);

  // Inicia sync service quando usuário loga
  useEffect(() => {
    if (user && dbReady && !syncStarted) {
      const setupSync = async () => {
        try {
          // Inicia sync service em background
          startSyncService(user.id);
          setSyncStarted(true);
          console.log('[App] Sync service started for user:', user.id);

          // Pull inicial do Supabase (para novos dispositivos)
          // Isso roda em background, não bloqueia a UI
          pullFromRemote(user.id).catch(err => {
            console.warn('[App] Initial pull failed (may be offline):', err);
          });
        } catch (error) {
          console.error('[App] Failed to start sync service:', error);
        }
      };

      setupSync();
    }

    // Cleanup: para sync quando usuário desloga
    if (!user && syncStarted) {
      stopSyncService();
      setSyncStarted(false);
      console.log('[App] Sync service stopped');
    }
  }, [user, dbReady, syncStarted]);

  // Mostra loading enquanto auth ou db carrega
  if (loading || !dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textSecondary, marginTop: 16 }}>
          {!dbReady ? 'Preparando banco de dados...' : 'Carregando...'}
        </Text>
      </View>
    );
  }

  // Se não tem usuário logado, mostra tela de login
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <PlanProvider>
    <WorkoutProvider>
      <SheetAnimationProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootNavigator />
            <SheetBackdrop />
            <WorkoutBottomSheet />
            <MiniPlayer />
            <StandaloneTabBar />
            <ActiveWorkoutModalWrapper />
          </NavigationContainer>
        </SafeAreaProvider>
      </SheetAnimationProvider>
    </WorkoutProvider>
    </PlanProvider>
  );
}

export default function App() {
  // Prepara o Haptic Engine no startup
  useEffect(() => {
    if (CoreHaptics.isSupported()) {
      CoreHaptics.prepare();
    }
  }, []);

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <DevProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </DevProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
  );
}