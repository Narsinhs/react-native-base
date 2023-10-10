
import { faExclamationTriangle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity, Image, StatusBar, Platform, Pressable } from "react-native";
import { buttonColorYellow, errorColor, fontFamily, fontH2V3, fontH3V3, primaryColor, whiteColor } from "../../constants/Styles";
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil'
import Tooltip from 'react-native-walkthrough-tooltip';
const hitSlop = normalizeWidth(20)
const CustomInput = ({ keyboardType, maxLength = null, nextFocusedInput, handleFocusNext, nextFieldKey = null, isRequired = false, asterikColor = buttonColorYellow, fieldkey = "", returnKeyType = 'next', borderColor = whiteColor, selectionColor = whiteColor, multiline = false, customIcon, showEye, values, type = "text", touched, errors, handleChange, handleBlur, disabled = false, readOnly = false, placeholder = "Enter the text", isLabel = false, labelText = "", textInputEditable = true, borderRadius = normalizeWidth(25), customStyles = {}, textInputStyles = {}, customIconSize = normalizeWithScale(10), customeIconWidth = normalizeWithScale(20), placeholderTextColor = '#FFFFFF60' }) => {
    useEffect(() => {
        if (nextFocusedInput && nextFocusedInput === fieldkey) {
            textInputRef?.current?.focus()
        }
    }, [nextFocusedInput, textInputRef])

    const [isSecure, setIsSecure] = useState(true)
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const textInputRef = useRef()
    let hasError = touched[`${fieldkey}`] && errors[`${fieldkey}`];
    const handleOnPressContainer = useCallback(() => {
        textInputRef?.current?.focus()
    }, [textInputRef])

    const handleSubmitEnd = () => {
        if (nextFieldKey && handleFocusNext) {
            handleFocusNext(nextFieldKey)
        }
    }

    const getErrorText = () => {
        return `${errors[`${fieldkey}`]} `.replace('-', 'This Field');
    }

    return (
        <View >
            {
                isLabel ?
                    <View style={styles.textInputLabelContainer}>
                        <Text numberOfLines={1} style={styles.textInputLabel}>{labelText}</Text>
                    </View>
                    :
                    <></>
            }
            <Pressable onPress={handleOnPressContainer} style={{ paddingHorizontal: normalizeWidth(5), alignItems: multiline ? 'flex-start' : 'center', paddingTop: multiline ? normalizeHeight(10) : 0, flexDirection: 'row', borderWidth: normalizeWidth(1), height: multiline ? normalizeHeight(175) : normalizeHeight(50), borderColor: hasError ? errorColor : borderColor, borderRadius: borderRadius, ...customStyles }}>

                <View pointerEvents={Platform.OS === 'android' ? 'box-none' : 'none'} style={{ flex: 4, justifyContent: 'center' }}>
                    <TextInput
                        ref={textInputRef}
                        type={type}
                        name={fieldkey}
                        style={{ ...styles.inputContainer, ...textInputStyles, color: borderColor, textAlignVertical: multiline ? 'top' : 'center', height: '100%' }}
                        placeholderTextColor={hasError ? errorColor : placeholderTextColor}
                        selectionColor={selectionColor}
                        placeholderStyle={{ fontFamily: fontFamily.Primary.Regular }}
                        // underlineColorAndroid={'transparent'}
                        onChangeText={handleChange(`${fieldkey}`)}
                        onBlur={handleBlur(`${fieldkey}`)}
                        disabled={disabled}
                        readOnly={readOnly}
                        placeholder={isRequired ? `${placeholder}*` : placeholder}
                        value={values[`${fieldkey}`]}
                        secureTextEntry={showEye && isSecure ? true : false}
                        editable={textInputEditable}
                        multiline={multiline}
                        returnKeyType={returnKeyType}
                        blurOnSubmit={false}
                        onSubmitEditing={handleSubmitEnd}
                        keyboardType={keyboardType}
                        autoCapitalize={'none'}
                        numberOfLines={1}
                        maxLength={maxLength}
                    />

                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }}>
                    {hasError && (
                        <View style={styles.toolTipContainer}>
                            <Tooltip
                                isVisible={toolTipVisible}
                                content={<Text style={styles.errorText}>{getErrorText()} </Text>}
                                placement="top"

                                onClose={() => setToolTipVisible(prev => !prev)}
                                topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                                backgroundColor={'transparent'}

                            >
                                <TouchableOpacity hitSlop={{ right: hitSlop, top: hitSlop, left: hitSlop, bottom: hitSlop }} activeOpacity={1} style={{ ...styles.errorIcon, marginTop: multiline ? 10 : 0, }} onPress={() => setToolTipVisible(true)}>
                                    <FontAwesomeIcon size={normalizeWithScale(20)} color={errorColor} icon={faExclamationTriangle} />
                                </TouchableOpacity>
                            </Tooltip>
                        </View>
                    )}
                    {
                        showEye && isSecure &&

                        <TouchableOpacity hitSlop={{ right: hitSlop, top: hitSlop, left: hitSlop, bottom: hitSlop }} style={{ marginRight: normalizeWidth(10) }} onPress={() => setIsSecure(!isSecure)}>
                            <FontAwesomeIcon size={normalizeWithScale(20)} color={hasError ? errorColor : whiteColor} icon={faEyeSlash} />
                        </TouchableOpacity>
                    }
                    {
                        showEye && !isSecure &&

                        <TouchableOpacity hitSlop={{ right: hitSlop, top: hitSlop, left: hitSlop, bottom: hitSlop }} style={{ marginRight: normalizeWidth(10) }} onPress={() => setIsSecure(!isSecure)}>
                            <FontAwesomeIcon size={normalizeWithScale(20)} color={hasError ? errorColor : whiteColor} icon={faEye} />
                            {/* <Image source={eye} /> */}
                        </TouchableOpacity>

                    }

                    {
                        customIcon &&
                        <View style={{ marginRight: normalizeWidth(10) }}>
                            {/* <FontAwesomeIcon size={normalizeWithScale(20)} color={whiteColor} icon={customIcon} /> */}
                            <Image source={customIcon} size={customIconSize} resizeMode={'contain'} style={{ width: customeIconWidth }} />
                        </View>
                    }
                </View>

            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: normalizeWidth(1),
        flexDirection: 'row',
        // padding: normalizeWidth(5),
        justifyContent: 'space-between',
        flex: 1,
    },
    inputContainer: {
        marginLeft: normalizeWidth(5),
        borderWidth: 0,
        borderColor: whiteColor,
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V3

    },
    toolTipContainer: { alignItems: 'center', justifyContent: 'center', marginRight: normalizeWidth(5) },
    errorText: {
        textAlign: 'center',
        fontSize: fontH3V3,
        color: errorColor,
        fontFamily: fontFamily.Primary.Regular
    },
    errorIcon: {
        color: errorColor,
    },
    textInputLabelContainer: {
        marginBottom: normalizeWidth(6),

    },
    textInputLabel: {
        color: whiteColor, marginLeft: normalizeWidth(0), fontFamily: fontFamily.Primary.Regular, fontSize: fontH2V3,
    },
    journalMainLogo: {
        width: normalizeWithScale(20)
    },
    placeHolderStyles: {
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V3
    }
});

export default CustomInput;