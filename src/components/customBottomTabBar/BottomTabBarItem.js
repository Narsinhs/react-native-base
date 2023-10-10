
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { fontFamily, fontH3, primaryColor, whiteColor } from "../../constants/Styles";
import { normalizeWidth, normalizeWithScale } from "../../utils/FontUtil";

const BottomTabBarItem = ({ iconName, isCurrent, inActiveIcon, activeIcon }) => {
    return (
        <View
            style={style.tabContainer}
        >
            <View style={style.iconContainer}>
                <Image
                    source={isCurrent ? activeIcon : inActiveIcon}
                    style={{ width: normalizeWidth(20), height: normalizeWidth(20), resizeMode: 'contain' }}
                />
                {
                    isCurrent ?
                        <Text style={style.iconText}>{iconName}</Text>
                        :
                        <>
                        </>
                }
            </View>
        </View>
    );
};
export default BottomTabBarItem
const style = StyleSheet.create({
    tabContainer: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    iconText: { color: primaryColor, marginLeft: normalizeWidth(5), fontFamily: fontFamily.Primary.Regular, fontSize: fontH3 },
    iconContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
});