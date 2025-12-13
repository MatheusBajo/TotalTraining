import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { User, Clock, Plus, Barbell, Crown } from 'phosphor-react-native';
import { useSheetAnimation } from '../context/SheetAnimationContext';
import { useTheme } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;
const MINI_PLAYER_HEIGHT = 70;

const tabs = [
    { name: 'Perfil', icon: User },
    { name: 'Histórico', icon: Clock },
    { name: 'Iniciar o treino', icon: Plus },
    { name: 'Exercícios', icon: Barbell },
    { name: 'Loja', icon: Crown },
];

export const StandaloneTabBar = () => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const { animatedPosition, screenHeight } = useSheetAnimation();

    // Pega a rota atual de forma segura
    const [currentTab, setCurrentTab] = React.useState('Iniciar o treino');

    // Listener pra atualizar tab ativa
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e: any) => {
            try {
                const state = e.data.state;
                if (state?.routes) {
                    const mainTabsRoute = state.routes.find((r: any) => r.name === 'MainTabs');
                    if (mainTabsRoute?.state?.routes) {
                        const activeTab = mainTabsRoute.state.routes[mainTabsRoute.state.index];
                        if (activeTab?.name) {
                            setCurrentTab(activeTab.name);
                        }
                    }
                }
            } catch (err) {
                // Ignora erros de navegação
            }
        });

        return unsubscribe;
    }, [navigation]);

    const totalHeight = TAB_BAR_HEIGHT + insets.bottom;
    const navbarHeight = totalHeight;

    // Calcular posições do sheet (mesmos valores do WorkoutBottomSheet)
    const snapPointMinimized = MINI_PLAYER_HEIGHT + navbarHeight + 10;
    const snapPointExpanded = screenHeight * 0.75;

    const expandedPosition = screenHeight - snapPointExpanded;   // 25% da tela
    const minimizedPosition = screenHeight - snapPointMinimized; // ~758
    const closedPosition = screenHeight;

    const animatedStyle = useAnimatedStyle(() => {
        const pos = animatedPosition.value;

        const translateY = interpolate(
            pos,
            [expandedPosition, expandedPosition + 150, minimizedPosition, closedPosition],
            [totalHeight, totalHeight, 0, 0],
            Extrapolation.CLAMP
        );

        return { transform: [{ translateY }] };
    });

    const handlePress = (tabName: string) => {
        // Navega para a tab dentro do MainTabs
        navigation.navigate('MainTabs', { screen: tabName });
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    height: totalHeight,
                    paddingBottom: insets.bottom,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    borderTopColor: theme.border,
                },
                animatedStyle,
            ]}
        >
            {tabs.map((tab) => {
                const isFocused = currentTab === tab.name;
                const IconComponent = tab.icon;
                const color = isFocused ? theme.tabBarActive : theme.tabBarInactive;
                const iconSize = tab.name === 'Iniciar o treino' ? 32 : 24;

                return (
                    <TouchableOpacity
                        key={tab.name}
                        onPress={() => handlePress(tab.name)}
                        style={styles.tab}
                        activeOpacity={0.7}
                    >
                        <IconComponent color={color} size={iconSize} weight="fill" />
                        <Text style={[styles.label, { color }]} numberOfLines={1}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 0.5,
        paddingTop: 8,
        zIndex: 9999,
        elevation: 9999,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 10,
        marginTop: 4,
    },
});