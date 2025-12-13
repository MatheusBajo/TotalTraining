import './src/global.css';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from './src/theme';
import { useEffect, useState } from 'react';

import { WorkoutProvider, useWorkout } from './src/context/WorkoutContext';
import { SheetAnimationProvider } from './src/context/SheetAnimationContext';
import { WorkoutBottomSheet } from './src/components/WorkoutBottomSheet';
import { StandaloneTabBar } from './src/components/StandaloneTabBar';
import { SheetBackdrop } from './src/components/SheetBackdrop';
import { ActiveWorkoutModal } from './src/components/ActiveWorkoutModal';
import { initializeApi, getConfiguredApiUrl } from './src/api';

// Componente separado para o modal (precisa estar dentro do WorkoutProvider)
function ActiveWorkoutModalWrapper() {
  const { showActiveModal, workoutName, resumeWorkout, confirmStartNew, dismissModal } = useWorkout();

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
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        await initializeApi();
        console.log(`[App] API initialized at: ${getConfiguredApiUrl()}`);
        setIsReady(true);
      } catch (err) {
        console.error('[App] Failed to initialize API:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    }
    init();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: '#ef4444', fontSize: 16 }}>Erro ao conectar com servidor</Text>
        <Text style={{ color: theme.textSecondary, marginTop: 8 }}>{error.message}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textSecondary, marginTop: 16 }}>Conectando ao servidor...</Text>
      </View>
    );
  }

  return (
    <WorkoutProvider>
      <SheetAnimationProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootNavigator />
            <SheetBackdrop />
            <WorkoutBottomSheet />
            <StandaloneTabBar />
            <ActiveWorkoutModalWrapper />
          </NavigationContainer>
        </SafeAreaProvider>
      </SheetAnimationProvider>
    </WorkoutProvider>
  );
}

export default function App() {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </GestureHandlerRootView>
  );
}