import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { blackColor, fontFamily, fontH2V2, fontH3, primaryColor, whiteColor } from '../../constants/Styles';
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil';
const CustomButton = ({ buttonColor, buttonText, onPress, ImgSource, Gradient = false, GradientColor, disabled, loading = false, activityIndicatorColor = whiteColor, containerPadding = normalizeHeight(15), buttonTextColor = whiteColor, fontSize = fontH2V2, bordercolor = primaryColor, customStyles = {}, borderRadius = normalizeWidth(50), height = normalizeHeight(50), capital = false, Line = false, customTextStyles = {} }) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
            {Gradient ?
                <LinearGradient
                    colors={GradientColor}
                    style={styles.buttonContainer}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                >
                    {
                        <>
                            <View style={styles.buttonTextContainer}>
                                {
                                    loading &&
                                    <View style={{ paddingRight: normalizeWidth(10) }}>
                                        <FontAwesomeIcon icon={faSpinner} size={normalizeWithScale(20)} color={whiteColor} />
                                    </View>
                                }

                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ ...styles.buttonText, color: loading ? primaryColor : whiteColor }}>{capital ? buttonText.toUpperCase() : buttonText}</Text>
                                </View>
                            </View>
                            {
                                ImgSource && !loading ?
                                    <Image source={ImgSource} style={{ width: "100%", height: "100%" }} resizeMode={"contain"} /> : <></>
                            }
                        </>
                    }

                </LinearGradient>

                :
                <View style={{ ...styles.buttonContainer, paddingHorizontal: containerPadding, borderColor: bordercolor, backgroundColor: buttonColor ? buttonColor : whiteColor, borderRadius: borderRadius, height: height, ...customStyles }}>

                    {
                        Line && !loading ?
                            <View style={{ width: '10%', height: normalizeHeight(20) }}>
                                <View style={styles.line}>
                                </View>
                            </View>
                            : <></>
                    }
                    {!loading ?
                        <View >
                            <Text numberOfLines={2} style={{ ...styles.buttonText, color: buttonTextColor, fontSize: fontSize, ...customTextStyles }}>{capital ? buttonText.toUpperCase() : buttonText}</Text>
                        </View> :
                        <View style={{ paddingRight: normalizeWidth(10) }}>
                            <ActivityIndicator color={blackColor} />
                        </View>
                    }
                    {
                        ImgSource && !loading ?
                            <View style={{ width: '20%', alignItems: 'center' }}>
                                <Image source={ImgSource} style={{ width: normalizeWidth(20), height: normalizeWidth(20), borderRadius: normalizeWidth(50) }} />
                            </View>
                            : <></>
                    }


                </View>
            }

        </TouchableOpacity>
    )
}
export default CustomButton
const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: primaryColor,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: fontFamily.Primary.SemiBold,
        textAlign: 'center'
    },

    line: {
        height: '100%',
        width: 1,
        backgroundColor: primaryColor,
    },

})