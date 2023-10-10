import React from 'react'
import { Image, Platform, StyleSheet, Text, View } from 'react-native'
import { alarmClockIcon } from '../../assets/images'
import { fontFamily, fontH1, fontH2V2, fontH2V3, fontH3, fontH3V3, headingTextBlackColor } from '../../constants/Styles'
import { formatDate } from '../../utils/DateUtil'
import { deviceWidth, normalizeFont, normalizeHeight, normalizeWidth } from '../../utils/FontUtil'

const RoutineBox = ({ date, backgroundColor, dayName, dayPhase, actionTime, action, moonIcon, detailsFound, showMoon }) => {

    const getBorderRadius = () => {
        return Platform.OS === 'android' ? 0 : normalizeWidth(15)
    }

    return (
        <View style={{ ...styles.mainContainer }}>
            <View style={{ flex: 1.6, backgroundColor: backgroundColor, justifyContent: 'center', borderTopLeftRadius: getBorderRadius(), borderTopRightRadius: getBorderRadius() }}>
                <Text style={styles.dateStyles}>{formatDate(date, "DD MMM, YYYY")}</Text>
            </View>
            <View style={{ flex: 5, borderBottomLeftRadius: getBorderRadius() }}>
                {
                    detailsFound && showMoon ?
                        <Image source={{ uri: moonIcon }} style={{ position: 'absolute', left: '2%', top: '2%', zIndex: 99, width: normalizeWidth(17), height: normalizeWidth(17), resizeMode: 'contain' }} />
                        :
                        <></>
                }
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    {
                        detailsFound ?
                            <>
                                <Text style={{ color: headingTextBlackColor, fontFamily: fontFamily.Primary.Regular, fontSize: fontH3, lineHeight: normalizeHeight(15), textAlign: 'center' }}>{dayPhase}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Image source={alarmClockIcon} style={{ width: normalizeWidth(15), height: normalizeWidth(15), marginRight: normalizeWidth(5) }} resizeMode="contain" />
                                    <Text style={{ lineHeight: normalizeHeight(17), fontFamily: fontFamily.Primary.SemiBold, fontSize: fontH2V2, color: headingTextBlackColor, textAlign: 'center', marginRight: normalizeWidth(10) }}>{actionTime}</Text>
                                </View>
                                <Text style={{ fontFamily: fontFamily.Primary.Regular, fontSize: fontH3, color: headingTextBlackColor, lineHeight: normalizeHeight(15), textAlign: 'center' }}>{action}</Text>
                            </>
                            :
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: headingTextBlackColor, fontFamily: fontFamily.Primary.Bold, fontSize: fontH1, lineHeight: normalizeHeight(25), textAlign: 'center' }}>{'N/A'}</Text>
                            </View>
                    }

                </View>
                <View style={{ backgroundColor: 'white' }}>
                    <Text style={{ color: backgroundColor, ...styles.dayText }}>{dayName}</Text>
                </View>
            </View>
            <View style={{ height: Platform.OS === 'ios' ? normalizeHeight(15) : normalizeHeight(12), backgroundColor: backgroundColor, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            </View>

        </View>
    )
}

export default RoutineBox

const styles = StyleSheet.create({
    mainContainer: {
        width: deviceWidth * 0.47,
        height: normalizeHeight(125),
        marginBottom: normalizeHeight(15),
        borderRadius: normalizeWidth(10),
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    dateStyles: {
        fontFamily: fontFamily.Primary.Medium,
        color: 'white',
        textAlign: 'center',
        fontSize: fontH2V3
    },
    dayText: {
        fontFamily: fontFamily.Primary.Medium,
        fontSize: fontH2V3,
        textAlign: 'center'
    }
})
