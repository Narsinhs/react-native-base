import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { buttonColorYellow, primaryColor } from '../../constants/Styles'
import { normalizeWidth } from '../../utils/FontUtil'


const CustomRadioButton = ({ size = 22, onPress, id, currentId }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ ...styles.mainContainer, width: normalizeWidth(size), height: normalizeWidth(size), justifyContent: 'center', alignItems: 'center' }}>
            {
                id === currentId ?
                    <View style={{ ...styles.innerContainer, width: normalizeWidth(size - 11), height: normalizeWidth(size - 11), borderRadius: normalizeWidth(size - 10) }}>

                    </View> : <></>
            }
        </TouchableOpacity>
    )
}

export default CustomRadioButton

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: primaryColor,
        borderRadius: normalizeWidth(20),
        borderColor: buttonColorYellow,
        borderWidth: normalizeWidth(2)
    },
    innerContainer: {
        backgroundColor: buttonColorYellow
    }
})
