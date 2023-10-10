import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { BackHandler, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { backIcon, blackDear, whiteTailLogo } from '../../assets/images'
import { deviceWidth, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil'

const BackButtonHeader = ({ handleBackButtonPress }) => {
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleGoBack); // if callback returns true, back button doesn't working and vice versa
        return () => backHandler.remove();
    }, [])


    const handleGoBack = () => {
        if (handleBackButtonPress) {
            handleBackButtonPress();
            return true
        }
        return false
    }

    return (
        <View >
            <View style={styles.container}>
                <TouchableOpacity onPress={handleGoBack} style={{ marginRight: normalizeWidth(10) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={backIcon} style={{ width: normalizeWidth(40), height: normalizeWidth(40) }} resizeMode="contain" />
                    </View>
                </TouchableOpacity>
                <View>
                    <Image source={blackDear} style={{ width: normalizeWidth(35), height: normalizeWidth(35) }} resizeMode="contain" />
                </View>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Image source={whiteTailLogo} resizeMode='contain' style={{ width: deviceWidth * 0.8, height: normalizeHeight(100) }} />
            </View>
        </View>
    )
}

export default BackButtonHeader

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    }
})
