import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Date_Arrow_Icon_Type } from '../../constants/constants'
import { fontFamily, fontH2 } from '../../constants/Styles'
import { formatDate } from '../../utils/DateUtil'
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil'

const iconSize = normalizeWithScale(20)
const hitSlop = { top: iconSize, bottom: iconSize, left: iconSize, right: iconSize }

const DateComponent = React.memo(({ showNavigationIcons = true, leftIcon = faAngleLeft, rightIcon = faAngleRight, onPressIcon, leftIconColor = "black", rightIconColor = "black", rightIconDisabled = false, leftIconDisabled = false, date }) => {
    const handlePress = (type) => {
        if (onPressIcon) {
            onPressIcon(type)
        }
    }
    return (
        <View style={styles.mainContainer}>
            {showNavigationIcons ? <TouchableOpacity hitSlop={hitSlop} onPress={() => handlePress(Date_Arrow_Icon_Type.LEFT)} disabled={leftIconDisabled}>
                <FontAwesomeIcon color={leftIconDisabled ? "gray" : leftIconColor} icon={leftIcon} size={iconSize} />
            </TouchableOpacity> : <></>}
            <Text style={styles.dateText}>{formatDate(date, "dddd DD MMM, YYYY")}</Text>
            {showNavigationIcons ? <TouchableOpacity hitSlop={hitSlop} onPress={() => handlePress(Date_Arrow_Icon_Type.RIGHT)} disabled={rightIconDisabled}>
                <FontAwesomeIcon color={rightIconDisabled ? "gray" : rightIconColor} icon={rightIcon} size={iconSize} />
            </TouchableOpacity> : <></>}
        </View>
    )
})

export default DateComponent

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalizeHeight(10)
    },
    dateText: {
        textAlign: 'center',
        color: 'black',
        fontFamily: fontFamily.Primary.SemiBold,
        fontSize: fontH2,
        marginHorizontal: normalizeWidth(10)
    }
})
