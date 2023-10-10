import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { buttonColorYellow, fontFamily, fontH2, fontH2V2, fontH3, fontH3V3, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles';
import { normalizeFont, normalizeWidth } from '../../utils/FontUtil';
import CustomButton from './CustomButton';
const height = Dimensions.get("window").height * 0.20;
const CancelSubscriptionBox = ({ plan = "Plan Details", planDetail = "Yearly Paid Subscription", planButtonText = "Cancel Subscription", onPress, subscriptionExpireTime = "4:45pm on Monday 7th February 2022" }) => {
    return (

        <>
            <View style={styles.typeContainer}>
                <Text style={styles.type}>{plan}</Text>
                <Text style={styles.expiryTime}>Expires on: {subscriptionExpireTime}</Text>
            </View>
            <View style={{ ...styles.mainContainer, height: height }} >

                <View style={styles.typeContainer}>
                    <Text style={styles.value}>{planDetail}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <CustomButton customTextStyles={{ fontFamily: fontFamily.Primary.Bold }} onPress={onPress} buttonText={planButtonText} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} />
                </View>
            </View>
        </>
    )
}
export default CancelSubscriptionBox

const styles = StyleSheet.create({
    mainContainer: { borderWidth: 1, borderColor: primaryColor, backgroundColor: primaryColor, borderRadius: normalizeWidth(20), elevation: normalizeWidth(10), padding: normalizeWidth(20) },
    typeContainer: { marginBottom: normalizeWidth(10) },
    type: { color: primaryColor, fontSize: normalizeFont(19), fontFamily: fontFamily.Primary.SemiBold, textAlign: 'center' },
    value: { color: whiteColor, fontSize: fontH2, fontFamily: fontFamily.Primary.SemiBold, marginBottom: normalizeWidth(10) },
    buttonContainer: { marginHorizontal: normalizeWidth(10) },
    expiryTime: {
        color: primaryColor,
        fontFamily: fontFamily.Primary.Light,
        fontSize: fontH2V2,
        textAlign: 'center'
    }
})
