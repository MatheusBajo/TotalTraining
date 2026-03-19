import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useKeyboard } from '../context/KeyboardContext';
import { useTheme } from '../theme';
import { Backspace, Keyboard as KeyboardIcon, Plus, Minus, CaretDown, Barbell } from 'phosphor-react-native';
// @ts-ignore
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROW_HEIGHT = 60; // Taller rows for the floating look

export const CustomKeyboard = () => {
    const { isVisible, activeInputId, handleKeyPress, handleBackspace, handleNext, closeKeyboard, handleIncrement, handleDecrement } = useKeyboard();
    const insets = useSafeAreaInsets();

    if (!isVisible) return null;

    // Hardcoded colors to match the specific "Dark Mode" aesthetic of the image
    const KEYBOARD_BG = '#151517';
    const ACTION_BTN_BG = '#2B2B2E';
    const BLUE_BTN_BG = '#3ba1ff';
    const TEXT_COLOR = '#FFFFFF';

    const renderNumberKey = (num: string) => (
        <TouchableOpacity
            key={num}
            style={styles.numKey}
            onPress={() => handleKeyPress(num)}
            activeOpacity={0.5}
        >
            <Text style={[styles.keyText, { color: TEXT_COLOR }]}>{num}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <Animated.View
                entering={SlideInDown.duration(200)}
                exiting={SlideOutDown.duration(200)}
                style={[
                    styles.container,
                    {
                        backgroundColor: KEYBOARD_BG,
                        paddingBottom: Math.max(insets.bottom, 12),
                        paddingTop: 12, // More air on top
                    }
                ]}
            >
            <View style={styles.contentContainer}>
                {/* Left Side: Numpad (Text Only, Clean) */}
                <View style={styles.numpad}>
                    <View style={styles.numRow}>
                        {['1', '2', '3'].map(renderNumberKey)}
                    </View>
                    <View style={styles.numRow}>
                        {['4', '5', '6'].map(renderNumberKey)}
                    </View>
                    <View style={styles.numRow}>
                        {['7', '8', '9'].map(renderNumberKey)}
                    </View>
                    <View style={styles.numRow}>
                        {/* Decimal */}
                        {activeInputId?.includes('reps') ? (
                            <View style={styles.numKey} />
                        ) : (
                            <TouchableOpacity
                                style={styles.numKey}
                                onPress={() => handleKeyPress('.')}
                                activeOpacity={0.5}
                            >
                                <Text style={[styles.keyText, { color: TEXT_COLOR }]}>,</Text>
                            </TouchableOpacity>
                        )}

                        {/* Zero */}
                        {renderNumberKey('0')}

                        {/* Backspace */}
                        <TouchableOpacity
                            style={styles.numKey}
                            onPress={handleBackspace}
                            activeOpacity={0.5}
                        >
                            <Backspace color={TEXT_COLOR} size={22} weight="fill" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Right Side: Action Column (Floating Buttons) */}
                <View style={styles.actionColumn}>

                    {/* Row 1: Hide Keyboard */}
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: ACTION_BTN_BG }]}
                        onPress={closeKeyboard}
                        activeOpacity={0.7}
                    >
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                            <KeyboardIcon color={TEXT_COLOR} size={24} weight="fill" />
                            <CaretDown color={TEXT_COLOR} size={14} weight="fill" style={{ marginTop: -4 }} />
                        </View>
                    </TouchableOpacity>

                    {/* Row 2: Plate Calc */}
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: ACTION_BTN_BG }]}
                        onPress={() => { }} // Placeholder func
                        activeOpacity={0.7}
                    >
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', gap: 2, marginBottom: -4 }}>
                                <Plus color={TEXT_COLOR} size={12} weight="bold" />
                                <Minus color={TEXT_COLOR} size={12} weight="bold" />
                            </View>
                            <Barbell color={TEXT_COLOR} size={24} weight="fill" />
                        </View>
                    </TouchableOpacity>

                    {/* Row 3: Split +/- */}
                    <View style={[styles.actionBtn, { backgroundColor: ACTION_BTN_BG, flexDirection: 'row', padding: 0 }]}>
                        <TouchableOpacity
                            style={styles.splitBtn}
                            onPress={handleDecrement}
                            activeOpacity={0.6}
                        >
                            <Minus color={TEXT_COLOR} size={20} weight="bold" />
                        </TouchableOpacity>

                        {/* Divider Line */}
                        <View style={{ width: 1, backgroundColor: '#3E3E42', height: '60%' }} />

                        <TouchableOpacity
                            style={styles.splitBtn}
                            onPress={handleIncrement}
                            activeOpacity={0.6}
                        >
                            <Plus color={TEXT_COLOR} size={20} weight="bold" />
                        </TouchableOpacity>
                    </View>

                    {/* Row 4: Next (Blue) */}
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: BLUE_BTN_BG }]}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.nextText}>Next</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingHorizontal: 6,
        // Shadows for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    contentContainer: {
        flexDirection: 'row',
        height: ROW_HEIGHT * 4 + 24, // 4 rows + gaps
    },
    numpad: {
        flex: 3, // 75% roughly
        marginRight: 8,
        justifyContent: 'space-around',
    },
    numRow: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    numKey: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 26,
        fontWeight: '500',
    },
    actionColumn: {
        flex: 1, // 25% roughly
        justifyContent: 'space-around',
        paddingVertical: 4, // slight inset adjustment
    },
    actionBtn: {
        height: 52, // Fixed height for "Card" look
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    splitBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    nextText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
    }
});
