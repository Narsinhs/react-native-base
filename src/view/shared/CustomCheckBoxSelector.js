
import { faExclamationTriangle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity, Image, StatusBar, Platform, Pressable } from "react-native";
import { buttonColorYellow, errorColor, fontFamily, fontH2V3, fontH3V3, whiteColor } from "../../constants/Styles";
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil'
import Tooltip from 'react-native-walkthrough-tooltip';
import CheckBoxModal from "./CheckBoxModal";
import { transferArrayOfObjectsIntoString, transformArrayOfObjectForTextInput } from "../../utils/CommonUtil";
const hitSlop = normalizeWidth(20)
const CustomCheckBoxSelector = ({
    keyboardType,
    nextFocusedInput,
    handleFocusNext,
    nextFieldKey = null,
    isRequired = false,
    asterikColor = buttonColorYellow,
    fieldkey = "",
    returnKeyType = 'next',
    borderColor = whiteColor,
    selectionColor = "#F8F8FF",
    multiline = false,
    customIcon,
    values,
    type = "text",
    touched, errors,
    handleChange,
    handleBlur,
    placeholder = "Enter the text",
    isLabel = false,
    labelText = "",
    textInputEditable = true,
    borderRadius = normalizeWidth(25),
    customStyles = {}, textInputStyles = {}, customIconSize = normalizeWithScale(10), customeIconWidth = normalizeWithScale(20),
    modalText,
    isHuntingJournal = false,
    handleCheckBoxAddOtherItem,
    placeholderTextColor = '#FFFFFF60'
}) => {

    const [isCheckBoxModalVisible, setIsCheckBoxModalVisible] = useState(false)

    useEffect(() => {
        if (nextFocusedInput && nextFocusedInput === fieldkey) {
            textInputRef?.current?.focus()
        }
    }, [nextFocusedInput, textInputRef])

    const [toolTipVisible, setToolTipVisible] = useState(false);
    const textInputRef = useRef()



    const handleOnPressContainer = () => {
        setIsCheckBoxModalVisible(true)
    }

    const handleSubmitEnd = () => {
        if (nextFieldKey && handleFocusNext) {
            handleFocusNext(nextFieldKey)
        }
    }

    const onModalClose = () => {
        setIsCheckBoxModalVisible(false)
    }

    const handleChangeSelectValue = (id, index, value) => {
        handleChange(fieldkey, id, index, value)
    }

    const handleAddOtherText = (id, index, value, text) => {
        handleCheckBoxAddOtherItem(fieldkey, id, index, value, text)
    }

    const getValue = () => {
        return transformArrayOfObjectForTextInput([...values[fieldkey]]);
    }
    let hasError = touched[`${fieldkey}`] && errors[`${fieldkey}`];

    return (
        <View >
            <CheckBoxModal
                isModalVisible={isCheckBoxModalVisible}
                onModalClose={onModalClose}
                data={values[fieldkey]}
                modalHeading={modalText || labelText}
                onModalSelectValue={handleChangeSelectValue}
                handleAddOtherText={handleAddOtherText}
            />
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
                        onBlur={handleBlur(`${fieldkey}`)}
                        disabled={true}
                        readOnly={true}
                        placeholder={isRequired ? `${placeholder}*` : placeholder}
                        value={getValue()}
                        editable={false}
                        returnKeyType={returnKeyType}
                        blurOnSubmit={false}
                        onSubmitEditing={handleSubmitEnd}
                        keyboardType={keyboardType}
                        numberOfLines={1}
                    />

                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }}>
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
                                <TouchableOpacity hitSlop={{ right: hitSlop, top: hitSlop, left: hitSlop, bottom: hitSlop }} activeOpacity={1} style={{ ...styles.errorIcon, marginTop: multiline ? 10 : 0, }} onPress={() => setToolTipVisible(true)}>
                                    <FontAwesomeIcon size={normalizeWithScale(20)} color={errorColor} icon={faExclamationTriangle} />
                                </TouchableOpacity>
                            </Tooltip>
                        </View>
                    )}
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

export default CustomCheckBoxSelector;