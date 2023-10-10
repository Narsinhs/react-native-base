import { Formik, useFormikContext } from 'formik';
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Button, ScrollView } from 'react-native'
import Modal from "react-native-modal";
import { calendarIcon, filterCalendarIcon, greyDropDownIcon, linkOpenIcon, modalcancelIcon, pinLocIcon } from '../../../assets/images';
import { blackColor, buttonColorYellow, fontFamily, fontH1, fontH2, fontH2V2, fontH2V3, grey, greyedSchemeColor, greylight, headingTextBlackColor, whiteColor } from '../../../constants/Styles';
import { useForm } from '../../../hooks/useForm';
import { deviceHeight, normalizeFont, normalizeHeight, normalizeWidth } from '../../../utils/FontUtil';
import CustomInput from '../../shared/CustomInput';
import CustomCheckBox from '../../shared/CustomCheckBox';

import { CustomDateTimePicker } from '../../shared/DateTimePicker';
import CustomButton from '../../shared/CustomButton';
import CustomSelector from '../../shared/CustomSelector';
import { countries, STATES } from '../../../constants/constants';
import { color } from 'react-native-reanimated';
import moment from 'moment';
import { GlobalStatesApi, GlobalCityApi, GetJournalListApi, saveFilterOptions } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import { filterNametoId } from '../../../utils/NametoIdUtil';
import { DATE_FORMATS, formatDate } from '../../../utils/DateUtil';
import { DATE_TIME_PICKER_TYPES } from '../../../constants/Enum';
const HUNT_CHECKBOX_TYPE = {
    "MORNING_HUNTS": "Morning Hunts",
    "AFTERNOON_HUNTS": "Afternoon Hunts"
}

const EntriesFilter = ({ onModalClick, isModalVisible, setFilter, GlobalStatesApi, GlobalCityApi, stateName, cityName, user, GetJournalListApi, saveFilterOptions }) => {
    const formRef = useRef()
    let createJournalSubmitAction = {
        State: { id: "State", label: "State", value: "" },
        Date: { id: "Date", label: "Date", value: new Date() },
        CountyTownship: { id: "CountyTownship", label: "County/Township", value: "" },
        time_in: { id: "time_in", label: "time_in", value: "" },
        time_out: { id: "time_out", label: "time_out", value: "" },
        // HuntType: { id: "HuntType", label: "HuntType", value: '' },

    }
    const [fetching, setFetching] = useState(false)
    const handleDateChange = (fieldKey, date) => {
        if (formRef.current) {
            formRef.current.setFieldValue(fieldKey, date)
        }
    }
    const handleCheckBoxValueChange = (fieldKey, type) => {
        if (formRef.current) {
            formRef.current.setFieldValue(fieldKey, type)
        }
    }
    const reintiallizationValue = () => {
        onModalClick();
        formRef.current.setFieldValue("time_in", "")
        formRef.current.setFieldValue("time_out", "")
    }



    const { initialValues, schema } = useForm(createJournalSubmitAction);
    function submitForm(values, { setErrors }) {
        setFetching(true)

        let obj = {
            ...values
        }
        let finalObject = {
            state: obj.State,
            township: obj.CountyTownship,
            submission_date: obj.Date ? formatDate(obj.Date, DATE_FORMATS.DATE) : "",
            time_in: obj.time_in ? formatDate(obj.time_in, DATE_FORMATS.TIME) : "",
            time_out: obj.time_out ? formatDate(obj.time_out, DATE_FORMATS.TIME) : ""
        }
        console.log("finalObject", finalObject)
        saveFilterOptions(finalObject)
        GetJournalListApi(1, 10, finalObject.state, finalObject.township, finalObject.time_in, finalObject.time_out, finalObject.submission_date).then((val) => {
            setFetching(false)
            setFilter(true)
            onModalClick()
        }).catch((e) => {
            setFilter(false)
            setFetching(false)
        })
    }
    const handleOnChangeSelect = (fieldkey, value) => {
        if (formRef.current) {
            formRef.current.setFieldValue(fieldkey, value)
        }
    }
    const transformStateData = () => {
        return [...STATES].map((each, index) => {
            return {
                id: each.id,
                label: each.name
            }
        })
    }
    return (
        <Formik
            innerRef={formRef}
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={submitForm}>
            {(formik) => {
                const {
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    handleBlur,
                } = formik;

                return (
                    <>
                        <Modal isVisible={isModalVisible} onBackdropPress={reintiallizationValue} onBackButtonPress={reintiallizationValue}>
                            <View style={[styles.modalHeaderContainer]}>
                                <View style={[styles.modalHeaderRow]}>
                                    <View style={[styles.modalCancelIconView]}>
                                        <TouchableOpacity onPress={reintiallizationValue}>
                                            <Image source={modalcancelIcon} resizeMode={'contain'} style={{ width: normalizeWidth(25), height: normalizeHeight(25) }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={[styles.modalTitleText]}>Choose Filter Search</Text>
                                <ScrollView>
                                    <View style={[styles.modalColumnContainer]}>
                                        <View style={styles.journalFormContainer}>
                                            <CustomDateTimePicker
                                                errors={errors}
                                                touched={touched}
                                                fieldkey={'Date'}
                                                values={values}
                                                placeholder={'Date'}
                                                handleChange={handleDateChange}
                                                customIcon={filterCalendarIcon}
                                                borderColor={greylight}
                                                placeholderTextColor={greyedSchemeColor}
                                                textInputStyles={{ color: greylight }}

                                            />
                                        </View>
                                        <View style={styles.journalFormContainer}>
                                            <CustomSelector
                                                errors={errors}
                                                handleBlur={handleBlur}
                                                handleOnChangeSelect={handleOnChangeSelect}
                                                placeholder={'State'}
                                                modalHeading={'State'}
                                                touched={touched}
                                                values={values}
                                                fieldkey={'State'}
                                                isLabel={false}
                                                textInputEditable={false}
                                                selectorItems={transformStateData()}
                                                selectionColor={greyedSchemeColor}
                                                borderColor={greyedSchemeColor}
                                                borderRadius={normalizeWidth(10)}
                                                placeholderTextColor={greyedSchemeColor}
                                            />
                                        </View>
                                        <View style={styles.journalFormContainer}>
                                            <CustomInput
                                                errors={errors}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                placeholder={'County/Township'}
                                                touched={touched}
                                                values={values}
                                                fieldkey={'CountyTownship'}
                                                selectionColor={greyedSchemeColor}
                                                borderColor={greyedSchemeColor}
                                                borderRadius={normalizeWidth(10)}
                                                placeholderTextColor={greyedSchemeColor}
                                            />
                                        </View>
                                        <View style={styles.journalFormContainer}>
                                            <CustomDateTimePicker
                                                errors={errors}
                                                touched={touched}
                                                fieldkey={"time_in"}
                                                isLabel={false}
                                                handleChange={handleDateChange}
                                                values={values}
                                                pickerMode={DATE_TIME_PICKER_TYPES.time}
                                                placeholder={'Time In'}
                                                borderColor={greyedSchemeColor}
                                                placeholderTextColor={greyedSchemeColor}
                                                textInputStyles={{ color: greyedSchemeColor }}
                                            />
                                        </View>
                                        <View style={styles.journalFormContainer}>
                                            <CustomDateTimePicker
                                                errors={errors}
                                                touched={touched}
                                                fieldkey={"time_out"}
                                                isLabel={false}
                                                placeholderTextColor={greyedSchemeColor}
                                                handleChange={handleDateChange}
                                                values={values}
                                                pickerMode={DATE_TIME_PICKER_TYPES.time}
                                                placeholder={'Time Out'}
                                                borderColor={greyedSchemeColor}
                                                textInputStyles={{ color: greyedSchemeColor }}

                                            />
                                        </View>
                                        {/* <View style={styles.customCheckBoxArea}>
                                            <CustomCheckBox
                                                value={values}
                                                fieldkey={'HuntType'}
                                                type={HUNT_CHECKBOX_TYPE.MORNING_HUNTS}
                                                label={HUNT_CHECKBOX_TYPE.MORNING_HUNTS}
                                                handleCheckBoxValueChange={handleCheckBoxValueChange}
                                                errors={errors}
                                            />
                                            <CustomCheckBox
                                                value={values}
                                                fieldkey={'HuntType'}
                                                type={HUNT_CHECKBOX_TYPE.AFTERNOON_HUNTS}
                                                label={HUNT_CHECKBOX_TYPE.AFTERNOON_HUNTS}
                                                handleCheckBoxValueChange={handleCheckBoxValueChange}
                                                errors={errors}

                                            />
                                        </View> */}

                                        <View style={styles.customCheckBoxBottomArea}>
                                        </View>
                                        <View style={styles.previousEntriesButtonContainer}>
                                            <CustomButton onPress={handleSubmit}
                                                buttonText={'Search'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} loading={fetching} disabled={fetching} />
                                        </View>

                                    </View>
                                </ScrollView>

                            </View>

                        </Modal>
                    </>
                )
            }}

        </Formik >
    )
}


const mapStateToProps = state => {
    return {
        user: state.auth.user,
        stateName: state.country.stateName,
        cityName: state.country.cityName,
    }
}

const mapDispatchToProps = {
    GlobalStatesApi,
    GlobalCityApi,
    GetJournalListApi,
    saveFilterOptions
}
export default connect(mapStateToProps, mapDispatchToProps)(EntriesFilter)
const styles = StyleSheet.create({

    modalColumnContainer: {
        flex: 1,
        flexDirection: "column"
    },
    modalTitleText: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        color: blackColor,
        fontFamily: fontFamily.Primary.SemiBold,
        fontSize: normalizeFont(20),
        marginBottom: normalizeHeight(20),
    },
    modalHeaderContainer: {
        flex: 1, backgroundColor: whiteColor, maxHeight: deviceHeight * 0.65, borderTopLeftRadius: normalizeWidth(5), borderTopRightRadius: normalizeWidth(5), borderBottomLeftRadius: normalizeWidth(5), borderBottomRightRadius: normalizeWidth(5)
    },
    modalHeaderRow: {
        flexDirection: 'row-reverse'
    },
    modalCancelIconView: {
        padding: 5, alignSelf: 'flex-end'
    },
    journalFormContainer: {
        marginHorizontal: normalizeWidth(15), marginBottom: normalizeHeight(10),
    },
    previousEntriesButtonContainer: {
        marginHorizontal: normalizeWidth(40),
        marginTop: normalizeWidth(10),
        marginBottom: normalizeWidth(20),
    },
    customCheckBoxArea: {
        flex: 1, marginTop: normalizeWidth(20)
    },
    customCheckBoxBottomArea: {
        flex: 1, marginTop: normalizeWidth(30)
    },

})
