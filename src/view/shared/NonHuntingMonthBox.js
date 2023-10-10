import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { fontFamily, fontH1, primaryColor } from '../../constants/Styles'
import { normalizeWidth } from '../../utils/FontUtil'

const NonHuntingMonthBox = ({ text = "Non Hunting Month" }) => {
    return (
        <View style={{ paddingVertical: normalizeWidth(7), justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: fontFamily.Primary.SemiBold, color: primaryColor, fontSize: normalizeWidth(35), textAlign: 'center', }}>{text}</Text>
        </View>
    )
}

export default NonHuntingMonthBox

const styles = StyleSheet.create({})
