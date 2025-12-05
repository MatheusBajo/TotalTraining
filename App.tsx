import './src/global.css';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme';

import { WorkoutProvider } from './src/context/WorkoutContext';
import { WorkoutDrawer } from './src/components/WorkoutDrawer';

export default function App() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootNavigator />
            <WorkoutDrawer />
          </NavigationContainer>
        </SafeAreaProvider>
      </WorkoutProvider>
    </ThemeProvider>
  );
}
