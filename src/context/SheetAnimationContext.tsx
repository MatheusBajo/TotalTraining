import React, { createContext, useContext } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SheetAnimationContextData {
    animatedIndex: SharedValue<number>;
    animatedPosition: SharedValue<number>;
    screenHeight: number;
}

const SheetAnimationContext = createContext<SheetAnimationContextData | null>(null);

export const SheetAnimationProvider = ({ children }: { children: React.ReactNode }) => {
    const animatedIndex = useSharedValue(-1);
    const animatedPosition = useSharedValue(SCREEN_HEIGHT);

    return (
        <SheetAnimationContext.Provider value={{
            animatedIndex,
            animatedPosition,
            screenHeight: SCREEN_HEIGHT
        }}>
            {children}
        </SheetAnimationContext.Provider>
    );
};

export const useSheetAnimation = () => {
    const context = useContext(SheetAnimationContext);
    if (!context) {
        throw new Error('useSheetAnimation must be used within SheetAnimationProvider');
    }
    return context;
};