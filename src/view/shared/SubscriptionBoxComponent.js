import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { buttonColorYellow, fontFamily, fontH1, fontH2, fontH2V2, fontH3, primaryColor, whiteColor } from '../../constants/Styles';
import { normalizeFont, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil';
import { Loading } from './Loading';
const SubscriptionBoxComponent = ({ subType = "Free Subscription", subValue = "0", subDescription, onPress, loading }) => {
    const height = Dimensions.get("window").height * 0.25;

    return (
        <TouchableOpacity style={{ ...styles.mainContainer, height: height }} onPress={onPress}>
            {
                loading ?
                    <View style={{ position: 'absolute', right: normalizeWidth(10), top: normalizeHeight(10) }}>
                        <Loading color='white' />
                    </View> : <></>
            }
            <View style={styles.typeContainer}>
                <Text style={styles.type}>{subType}</Text>
            </View>
            <View style={styles.valueContainer}>
                <Text style={styles.value}>{subValue}</Text>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{subDescription}</Text>
            </View>
        </TouchableOpacity>
    )
}
export default SubscriptionBoxComponent

const styles = StyleSheet.create({
    mainContainer: {
        borderWidth: 1,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        borderRadius: normalizeWidth(20),
        elevation: normalizeWidth(10),
        padding: normalizeWidth(10),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    typeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    type: { textAlign: 'center', color: whiteColor, fontSize: fontH2, fontFamily: fontFamily.Primary.SemiBold },
    valueContainer: { flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    dollarContainer: { textAlign: 'center', bottom: normalizeWidth(15), color: buttonColorYellow, fontSize: fontH2V2, fontFamily: fontFamily.Primary.SemiBold },
    value: { textAlign: 'center', color: whiteColor, fontSize: normalizeFont(70), fontFamily: fontFamily.Primary.SemiBold },
    decimal: { textAlign: 'center', color: whiteColor, fontSize: fontH1, fontFamily: fontFamily.Primary.SemiBold },
    descriptionContainer: { flex: 2, alignItems: 'center', justifyContent: 'center' },
    description: { textAlign: 'center', color: whiteColor, fontSize: fontH3, fontFamily: fontFamily.Primary.Regular },
})
