import './src/global.css';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from './src/theme';

import { WorkoutProvider, useWorkout } from './src/context/WorkoutContext';
import { SheetAnimationProvider } from './src/context/SheetAnimationContext';
import { WorkoutBottomSheet } from './src/components/WorkoutBottomSheet';
import { StandaloneTabBar } from './src/components/StandaloneTabBar';
import { SheetBackdrop } from './src/components/SheetBackdrop';
import { ActiveWorkoutModal } from './src/components/ActiveWorkoutModal';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/Auth/LoginScreen';

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
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textSecondary, marginTop: 16 }}>Carregando...</Text>
      </View>
    );
  }

  // Se não tem usuário logado, mostra tela de login
  if (!user) {
    return <LoginScreen />;
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
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
  );
}