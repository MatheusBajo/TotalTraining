import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { ActiveWorkoutScreen } from '../screens/Workout/ActiveWorkoutScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
                name="ActiveWorkout"
                component={ActiveWorkoutScreen}
                options={{
                    presentation: 'fullScreenModal',
                    gestureEnabled: false
                }}
            />
        </Stack.Navigator>
    );
};
