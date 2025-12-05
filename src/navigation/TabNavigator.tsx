import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { HistoryScreen, ExercisesScreen, StoreScreen, ProfileScreen } from '../screens/Placeholders';
import { User, Clock, Plus, Barbell, Crown, SwapLight } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    const insets = useSafeAreaInsets();
    const { theme, toggleTheme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#000",
                    opacity: 0.95,
                    borderTopColor: theme.border,
                    height: 60 + insets.bottom,
                    paddingBottom: 8 + insets.bottom,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: theme.tabBarActive,
                tabBarInactiveTintColor: theme.tabBarInactive,
                tabBarLabelStyle: {
                    fontSize: 10,
                    marginTop: 4,
                },
                headerRight: () => (
                    <TouchableOpacity onPress={toggleTheme} className="mr-4">
                        <SwapLight size={24} color={theme.primary} />
                    </TouchableOpacity>
                ),
            }}
        >
            <Tab.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} weight="fill" />
                }}
            />
            <Tab.Screen
                name="Histórico"
                component={HistoryScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Clock color={color} size={size} weight="fill" />
                }}
            />
            <Tab.Screen
                name="Iniciar o treino"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Plus color={color} size={32} weight="bold" />,
                    tabBarLabel: 'Iniciar o treino'
                }}
            />
            <Tab.Screen
                name="Exercícios"
                component={ExercisesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Barbell color={color} size={size} weight="fill" />
                }}
            />
            <Tab.Screen
                name="Loja"
                component={StoreScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Crown color={color} size={size} weight="fill" />
                }}
            />
        </Tab.Navigator>
    );
};
