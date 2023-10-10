import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { buttonColorYellow, fontFamily, fontH2V2, primaryColor } from '../../constants/Styles'
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil'

const FloatingButton = ({ onPress, disabled }, ...props) => {


    return (
        <Pressable style={styles.mainContainer} onPress={onPress} disabled={disabled}>
            <View style={{
                width: normalizeWidth(120), height: normalizeHeight(45), justifyContent: 'center', backgroundColor: buttonColorYellow, right: normalizeWidth(90), borderRadius: normalizeWidth(20), shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
            }}>
                <Text style={{ marginLeft: normalizeWidth(10), color: 'black', fontFamily: fontFamily.Primary.Regular, color: primaryColor, fontSize: fontH2V2 }}>New Entry</Text>
            </View>
            <View
                style={{
                    width: normalizeWidth(65),
                    height: normalizeWidth(65),
                    backgroundColor: primaryColor,
                    position: 'absolute',
                    borderRadius: normalizeWidth(100),
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }}>
                <FontAwesomeIcon icon={faPlus} color={"white"} size={normalizeWithScale(25)} />
            </View>
        </Pressable>
    )
}

export default FloatingButton

const styles = StyleSheet.create({
    mainContainer: {
        width: normalizeWidth(60),
        position: 'absolute',
        bottom: normalizeWidth(10),
        right: normalizeWidth(20),
        height: normalizeWidth(60),
        justifyContent: 'center'
    }
})
