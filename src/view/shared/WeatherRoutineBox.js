import React from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { weatherIconAndBackgroundDetails } from '../../constants/constants'
import { blackColor, buttonColorYellow, fontFamily, fontH1, fontH2, fontH2V2, fontH3, fontH3V3, greyedSchemeColor, headingTextBlackColor, mainContainer, primaryColor, textBlueColor, whiteColor } from '../../constants/Styles'
import { deviceWidth, normalizeFont, normalizeHeight, normalizeWidth } from '../../utils/FontUtil'

const WeatherRoutineBox = ({ upperBound, lowerBound, dayName, sunPhase, image, toggleModal, index, indexTime, isDay }) => {
    const getBorderRadius = () => {
        return Platform.OS === 'ios' ? normalizeWidth(10) : 0
    }
    return (
        <TouchableOpacity style={{ ...styles.mainContainer, backgroundColor: weatherIconAndBackgroundDetails.Sunny.backgroundColor }} onPress={() => toggleModal(index)} activeOpacity={1}>
            <View style={{ flex: 1.6, justifyContent: 'space-between', alignItems: 'center', paddingVertical: normalizeHeight(2) }}>
                <Text style={{ ...styles.dayText, fontFamily: fontFamily.Primary.SemiBold, fontSize: fontH3V3, color: headingTextBlackColor }}>{dayName}</Text>
                {
                    image ?
                        <>
                            <Image source={{ uri: image }} style={{ width: normalizeWidth(55), height: normalizeWidth(55) }} resizeMode="contain" />
                            <Text style={{ ...styles.dayText, color: headingTextBlackColor }}>{sunPhase}</Text>
                        </>
                        :
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text style={{ color: headingTextBlackColor, fontFamily: fontFamily.Primary.Bold, fontSize: fontH2, textAlign: 'center' }}>{'N/A'}</Text>
                        </View>
                }

            </View>
            <View style={{ flex: 1, backgroundColor: upperBound || lowerBound ? primaryColor : 'grey', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: getBorderRadius(), borderBottomRightRadius: getBorderRadius() }}>
                <Text style={{ ...styles.weatherText, fontSize: fontH2, lineHeight: normalizeHeight(22), color: buttonColorYellow }}>{upperBound}</Text>
                <Text style={{ ...styles.weatherText, lineHeight: normalizeHeight(15) }}>{lowerBound}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default WeatherRoutineBox

const styles = StyleSheet.create({
    mainContainer: {
        height: normalizeHeight(160),
        width: normalizeWidth(83),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: normalizeWidth(10),
        elevation: 5,
        overflow: Platform.OS === 'ios' ? 'visible' : 'hidden'
    },
    weatherText: {
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH3,
        color: textBlueColor
    },
    dayText: {
        fontFamily: fontFamily.Primary.Regular,
        fontSize: normalizeFont(8),
        textAlign: 'center',
        marginHorizontal: normalizeWidth(3)

    }
})
