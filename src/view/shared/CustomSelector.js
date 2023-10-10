
import { faExclamationTriangle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState, useRef, } from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity, Image, StatusBar, Platform, ActivityIndicator } from "react-native";
import { modalcancelIcon, pinLocIcon } from "../../assets/images";
import { blackColor, buttonColorYellow, errorColor, fontFamily, fontH2V3, fontH3V3, whiteColor } from "../../constants/Styles";
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil'
import Tooltip from 'react-native-walkthrough-tooltip';
import CustomDropDownSelector from "./CustomDropDownSelector";
import { useCallback } from "react";

const CustomSelector = ({ search = true, placeholderTextColor = '#FFFFFF60', modalHeading = '', isRequired = false, handleOnChangeSelect, selectorItems, fieldkey = "", borderColor = whiteColor, multiline = false, customIcon, customIconTintColor, showEye, values, type = "text", touched, errors, handleChange, handleBlur, disabled = false, readOnly = true, placeholder = "Enter the text", isLabel = false, labelText = "", textInputEditable = true, borderRadius = normalizeWidth(25), customStyles = {}, textInputStyles = {} }) => {
    const [isSecure, setIsSecure] = useState(true)
    const [toolTipVisible, setToolTipVisible] = useState(false)
    const textInputRef = useRef()

    let hasError = touched[`${fieldkey}`] && errors[`${fieldkey}`];

    const [isModalVisible, setIsModalVisible] = useState(false)

    const onModalClose = useCallback(() => {
        setIsModalVisible(!isModalVisible)
    }, [isModalVisible])

    const openSelectorModal = useCallback(() => {
        setIsModalVisible(true)
    }, [])

    const onModalSelectValue = (value) => {
        onModalClose()
        handleOnChangeSelect(fieldkey, value)
    }
    const handleOnPressContainer = useCallback(() => {
        textInputRef?.current?.focus()
    }, [textInputRef])


    return (
        <>
            <CustomDropDownSelector
                isModalVisible={isModalVisible}
                onModalClose={onModalClose}
                onModalSelectValue={onModalSelectValue}
                data={selectorItems}
                textInputplaceholder={'Search...'}
                customIcon={modalcancelIcon}
                modalHeading={modalHeading}
                search={search}
            />
            <TouchableOpacity disabled={disabled} onPress={openSelectorModal}>
                {
                    isLabel ?
                        <View style={styles.textInputLabelContainer}>
                            <Text style={styles.textInputLabel}>{labelText}</Text>
                        </View>
                        :
                        < ></>
                }
                <View style={{ ...styles.container, height: multiline ? normalizeHeight(175) : normalizeHeight(50), alignItems: multiline ? "flex-start" : "center", borderColor: hasError ? errorColor : borderColor, borderRadius: borderRadius, }}>

                    <View style={{ flex: 4, justifyContent: 'center' }}>
                        <TextInput
                            ref={textInputRef}
                            type={type}
                            name={fieldkey}
                            style={{ ...styles.inputContainer, ...textInputStyles, color: borderColor, width: hasError && (showEye || customIcon) ? '75%' : "85%" }}
                            placeholderTextColor={hasError ? errorColor : placeholderTextColor}
                            // underlineColorAndroid={'transparent'}
                            // onChangeText={handleChange(`${fieldkey}`)}
                            onBlur={handleBlur(`${fieldkey}`)}
                            disabled={disabled}
                            readOnly={readOnly}
                            value={values[`${fieldkey}`]}
                            placeholderStyle={{ fontFamily: fontFamily.Primary.Regular }}
                            placeholder={isRequired ? `${placeholder}*` : placeholder}
                            secureTextEntry={showEye && isSecure ? true : false}
                            editable={textInputEditable}
                            multiline={multiline}

                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {hasError && (
                            <View style={styles.toolTipContainer}>
                                <Tooltip
                                    isVisible={toolTipVisible}
                                    content={<Text style={styles.errorText}>{errors[`${fieldkey}`]}{' '} </Text>}
                                    placement="top"
                                    onClose={() => setToolTipVisible(false)}
                                    topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                                    backgroundColor={'transparent'}
                                >
                                    <TouchableOpacity style={styles.errorIcon} onPress={() => setToolTipVisible(true)}>
                                        <FontAwesomeIcon size={normalizeWithScale(20)} color={errorColor} icon={faExclamationTriangle} />
                                    </TouchableOpacity>
                                </Tooltip>
                            </View>
                        )}
                        {
                            showEye && isSecure &&

                            <TouchableOpacity style={{ marginRight: normalizeWidth(10) }} onPress={() => setIsSecure(!isSecure)}>
                                <FontAwesomeIcon size={normalizeWithScale(20)} color={whiteColor} icon={faEyeSlash} />
                                {/* <Image source={eye} /> */}
                            </TouchableOpacity>
                        }
                        {
                            showEye && !isSecure &&

                            <TouchableOpacity style={{ marginRight: normalizeWidth(10) }} onPress={() => setIsSecure(!isSecure)}>
                                <FontAwesomeIcon size={normalizeWithScale(20)} color={whiteColor} icon={faEye} />
                                {/* <Image source={eye} /> */}
                            </TouchableOpacity>

                        }

                        {
                            customIcon &&
                            <View style={{ marginRight: normalizeWidth(10) }}>

                                {/* {
                                    disabled ?
                                        <ActivityIndicator color={customIconTintColor} size={normalizeWithScale(20)} />
                                        : */}
                                <Image source={customIcon} tintColor={customIconTintColor} size={normalizeWithScale(10)} resizeMode={'contain'} style={styles.journalMainLogo} />
                                {/* } */}
                            </View>
                        }
                    </View>

                </View>


            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: normalizeWidth(1),
        flexDirection: 'row',
        justifyContent: 'space-between',


    },
    inputContainer: {
        marginLeft: normalizeWidth(10),
        borderColor: whiteColor,
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V3

    },
    toolTipContainer: { alignItems: 'center', justifyContent: 'center', marginRight: normalizeWidth(10) },
    errorText: {
        textAlign: 'center',
        fontSize: fontH3V3,
        color: errorColor,
    },
    errorIcon: {
        color: errorColor,
    },
    textInputLabelContainer: {
        flexDirection: 'row',
        marginBottom: normalizeWidth(6)
    },
    textInputLabel: {
        color: whiteColor, marginLeft: normalizeWidth(0), fontFamily: fontFamily.Primary.Regular, fontSize: fontH2V3, flex: 1, flexWrap: 'wrap'
    },
    journalMainLogo: {
        width: normalizeWithScale(20),


    },
    placeHolderStyles: {
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V3

    }
});

export default CustomSelector;