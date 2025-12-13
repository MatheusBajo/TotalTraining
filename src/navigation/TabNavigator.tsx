import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { HistoryScreen, ExercisesScreen, StoreScreen, ProfileScreen } from '../screens/Placeholders';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={() => null}  // TabBar renderizada externamente no App.tsx
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Perfil" component={ProfileScreen} />
            <Tab.Screen name="Histórico" component={HistoryScreen} />
            <Tab.Screen name="Iniciar o treino" component={HomeScreen} />
            <Tab.Screen name="Exercícios" component={ExercisesScreen} />
            <Tab.Screen name="Loja" component={StoreScreen} />
        </Tab.Navigator>
    );
};