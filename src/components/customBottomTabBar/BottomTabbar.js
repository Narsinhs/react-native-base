import React, { useState, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Dimensions,
    Animated,
    StyleSheet,
} from "react-native";
import BottomTabBarItem from "./BottomTabBarItem";
import * as Animatable from 'react-native-animatable';
import { buttonColorYellow, primaryColor } from "../../constants/Styles";
import { normalizeHeight, normalizeWidth } from "../../utils/FontUtil";

export const BottomTabbar = ({
    state,
    descriptors,
    navigation,
}) => {
    const [translateValue] = useState(new Animated.Value(0));
    const totalWidth = Dimensions.get("window").width;
    const tabWidth = totalWidth / state.routes.length;

    const animateSlider = (index) => {
        Animated.spring(translateValue, {
            toValue: index === 0 ? index * tabWidth - normalizeWidth(5) : index === 1 ? index * tabWidth - normalizeWidth(10) : index === 2 ? index * tabWidth - normalizeWidth(15) : index === 3 ? index * tabWidth - normalizeWidth(20) : index * tabWidth - normalizeWidth(30),
            velocity: 10,
            useNativeDriver: true
        }).start();
    };
    useEffect(() => {
        animateSlider(state.index);
    }, [state.index]);

    return (
        <Animatable.View animation={"fadeInUp"} style={[style.tabContainer, { width: totalWidth }]}>
            <Animated.View
                style={[
                    style.slider,
                    {
                        transform: [{ translateX: translateValue }],
                        width: tabWidth + 15,

                    },
                ]}
            />
            <View style={{ flexDirection: "row", marginHorizontal: normalizeWidth(10) }}>


                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];

                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }

                        animateSlider(index);
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    return (

                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityStates={isFocused ? ["selected"] : []}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{ flex: 1 }}
                            key={index}
                        >
                            <BottomTabBarItem
                                iconName={label.toString()}
                                isCurrent={isFocused}
                                activeIcon={options.activeIcon}
                                inActiveIcon={options.inActiveIcon}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </Animatable.View>

    );
};

const style = StyleSheet.create({
    tabContainer: {
        height: normalizeHeight(60),
        shadowOffset: {
            width: normalizeWidth(0),
            height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.0,
        backgroundColor: primaryColor,
        borderTopRightRadius: normalizeWidth(20),
        borderTopLeftRadius: normalizeWidth(20),
        elevation: normalizeWidth(10),
        position: "absolute",
        bottom: normalizeWidth(0),

    },
    slider: {
        height: "70%",
        position: "absolute",
        top: normalizeHeight(8),
        left: normalizeWidth(10),
        backgroundColor: buttonColorYellow,
        borderColor: buttonColorYellow,
        borderRadius: normalizeWidth(20),

    },
});