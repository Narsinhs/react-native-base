import React, { useState } from 'react';
import { View, Button, Platform, TouchableOpacity, TextInput, StyleSheet, Text, Image, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil';
import { errorColor, fontFamily, fontH2V3, fontH3V3, primaryColor, whiteColor, whiteColoralpha40 } from '../../constants/Styles';
import moment from 'moment';
import { DATE_TIME_PICKER_TYPES } from '../../constants/Enum';
import { DATE_FORMATS } from '../../utils/DateUtil';
import Modal from "react-native-modal";

export const CustomDateTimePicker = ({ errors, values, placeholderTextColor = '#FFFFFF60', handleChange, pickerMode = DATE_TIME_PICKER_TYPES.date, fieldkey = "", touched, isLabel, labelText, placeholder, customIcon, borderColor, textInputStyles = {} }) => {
    let hasError = touched[`${fieldkey}`] && errors[`${fieldkey}`]

    const [isPickerModalVisible, setIsPickerModalVisible] = useState(false)

    const [mode, setMode] = useState(() => pickerMode);
    const [show, setShow] = useState(() => Platform.OS === 'ios' ? true : false);
    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        handleChange(fieldkey, (selectedDate || values[`${fieldkey}`]))
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        if (Platform.OS === 'android') {
            showMode(pickerMode);
        }
        else {
            setIsPickerModalVisible(true)
        }
    };

    const getFormattedDate = () => {

        if (pickerMode === DATE_TIME_PICKER_TYPES.date) {
            return moment(new Date(values[`${fieldkey}`])).isValid() ? moment(new Date(values[`${fieldkey}`])).format(DATE_FORMATS.DATE) : "";
        }
        else {
            return moment(new Date(values[`${fieldkey}`])).isValid() ? moment(new Date(values[`${fieldkey}`])).format(DATE_FORMATS.TIME) : "";
        }
    }

    const closePickerModal = () => {
        setIsPickerModalVisible(false)
    }

    return (
        <>
            {
                Platform.OS === 'ios' ?
                    <Modal isVisible={isPickerModalVisible} onBackButtonPress={closePickerModal} onBackdropPress={closePickerModal}>
                        <View style={{ backgroundColor: primaryColor, borderRadius: normalizeWidth(10), paddingHorizontal: normalizeWidth(10) }}>
                            <DateTimePicker
                                value={values[`${fieldkey}`]}
                                mode={mode}
                                onChange={(event, selectedDate) => onChange(event, selectedDate)}
                                textColor="white"
                                display={'spinner'}
                                style={{ color: 'white' }}
                            />
                        </View>
                    </Modal> :
                    <></>
            }
            {
                isLabel ?
                    <View style={{ ...styles.textInputLabelContainer }}>
                        <Text numberOfLines={1} style={{ ...styles.textInputLabel }}>{labelText}</Text>
                    </View>
                    :
                    <></>
            }

            <Pressable onPress={showDatepicker}>
                <View pointerEvents={Platform.OS === 'android' ? 'box-none' : 'none'} style={{ ...styles.container, borderColor: hasError ? errorColor : borderColor, }}>
                    <TextInput
                        name={fieldkey}
                        placeholder={placeholder}
                        placeholderTextColor={placeholderTextColor}
                        editable={false}
                        value={getFormattedDate()}
                        placeholderStyle={{ fontFamily: fontFamily.Primary.Italic }}
                        style={{ ...styles.inputContainer, ...textInputStyles }}
                    // underlineColorAndroid={'transparent'}
                    />
                    {
                        customIcon &&
                        <View style={{ marginRight: normalizeWidth(10) }}>
                            <Image source={customIcon} style={{ width: normalizeWidth(20), height: normalizeWidth(20) }} resizeMode={'contain'} />
                        </View>
                    }

                </View>
            </Pressable>
            {show && Platform.OS === 'android' ?

                <DateTimePicker
                    value={values[`${fieldkey}`] || new Date()}
                    mode={mode}
                    onChange={(event, selectedDate) => onChange(event, selectedDate)}
                    textColor="black"
                    display={Platform.OS === "android" ? 'default' : 'compact'}
                /> :
                <></>
            }
        </>
    );


};

const styles = StyleSheet.create({
    inputContainer: {
        width: '85%',
        marginLeft: normalizeWidth(10),
        borderColor: whiteColor,
        color: whiteColor,
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V3
    },
    container: {

        height: Platform.OS === 'ios' ? normalizeHeight(50) : normalizeHeight(50),
        borderWidth: normalizeWidth(1),
        borderRadius: normalizeWidth(10),
        flexDirection: 'row',
        padding: normalizeWidth(3),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        fontSize: fontH3V3,
        fontFamily: fontFamily.Primary.Regular,
        color: 'red',
    },
    errorInput: {
        borderColor: 'red',
    },
    textInputLabelContainer: {
        marginBottom: normalizeWidth(6),
    },
    textInputLabel: {
        color: whiteColor, fontFamily: fontFamily.Primary.Regular, fontSize: fontH2V3,
    },
    journalMainLogo: {
        width: normalizeWithScale(20)
    },
});