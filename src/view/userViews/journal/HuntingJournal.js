import { Formik } from 'formik'
import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, FlatList, Button } from 'react-native'
import { calendarIcon, capital, greyDropDownIcon, main_logo_icon, pinLocIcon } from '../../../assets/images'
import { blackColor, buttonColorYellow, dividerBlackColor, fontFamily, fontH2V3, fontH3, fontH4, fontSmallSize, greyedSchemeColor, greylight, headingTextBlackColor, primaryColor, transparentColor, whiteColor, whiteColoralpha40 } from '../../../constants/Styles'
import FadeInView from '../../../hoc/FadeInHoc'
import { normalizeWidth, normalizeHeight, normalizeWithScale, deviceWidth } from '../../../utils/FontUtil'
import CustomButton from '../../shared/CustomButton'
import CustomInput from '../../shared/CustomInput'
import { CustomDateTimePicker } from '../../shared/DateTimePicker'
import { useForm } from '../../../hooks/useForm';
import { getImage, getLocalImageURI } from '../../../utils/ImageUploadUtil'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendar, faDatabase, faEyeSlash, faFile } from '@fortawesome/free-solid-svg-icons'
import CustomDropDownSelector from '../../shared/CustomDropDownSelector'
import { countries, ADD_NEW_PHOTO, dummyCountryData, journalDummyData, IS_OFFLINE_FORM, COUNTRY, STATES } from '../../../constants/constants'
import CustomSelector from '../../shared/CustomSelector'
import { useRef } from 'react'
import JournalImageListView from './JournalImageListView'
import moment from 'moment'
import { useEffect } from 'react'
import { GetJournalFormApi, submitJournalForm, UploadImage, deleteJournalFormImage, saveOfflineForm } from '../../../redux/actions'
import { connect } from 'react-redux'
import { Loading } from '../../shared/Loading'
import { useMemo } from 'react'
import { DATE_TIME_PICKER_TYPES, DUMMY_VALUES, FORM_ITEM_TYPE, FORM_VALIDATION_TYPES, LOCATION_TYPES, } from '../../../constants/Enum'
import { HUNTING_JOURNAL_API_PHOTO } from '../../../constants/constants'
import { getKeyValueObject, getObjectOfValues, getRandomUUID, transferArrayOfObjectsIntoString, transformArrayToObjectWithKeys, transformJournalImageArray, transformLocationArrayToObjectWithKeys } from '../../../utils/CommonUtil'
import CustomCheckBoxSelector from '../../shared/CustomCheckBoxSelector'
import CustomRadioButtonSelector from '../../shared/CustomRadioButtonSelector'
import CustomImagePicker from '../../../components/sharedComponents/CustomImagePicker'
import { DATE_FORMATS, formatDate, getDateFromTime } from '../../../utils/DateUtil'
import autoScrollHOC from '../../../hoc/AutoInputScrollHOC'
import { prepareJournalApiPayload } from '../../../utils/JournalUploadFormUtil'
import useJournalFormSubmit from '../../../hooks/useJournalFormSubmit'
import { getToken } from '../../../utils/TokenUtil'
import { registerToastMessage } from '../../../utils/RegisterToast'
import CustomScrollPicker from '../../shared/CustomScrollPicker'


const HuntingJournal = (props) => {

    const { UploadImage, submitJournalForm, deleteJournalFormImage, InternetConnection, saveOfflineForm, selectedLocation } = props;

    const { handleSubmitJournalForm, formSubmitLoading } = useJournalFormSubmit(UploadImage, submitJournalForm);

    // Destructuring the redux state props
    const [formObject, setFormObject] = useState({});
    const [apiFormObject, setApiFormObject] = useState({});
    const [useFormObject, setUseFormObject] = useState({});
    const [isFormPrepared, setIsFormPrepared] = useState(false)
    const [countryId, setCountryId] = useState(false)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    // const [stateId, setStateId] = useState(false)
    // const [countyId, setCountyId] = useState(false)
    // const [counties, setCounties] = useState([])
    useEffect(() => {
        const params = props?.route?.params;
        if (params?.journalForm) {
            setIsFormPrepared(false)
            setApiFormObject(params?.journalForm);
            prepareFormObject(params?.journalForm).then(() => {
                setIsFormPrepared(true)
            })
        }
    }, [])


    const getHuntingJournalForm = (params) => {
        const { GetJournalFormApi } = props;
        GetJournalFormApi(params).then((res) => {
            setApiFormObject(res)
            prepareFormObject(res)
        }).catch(() => {
        })
    }
    const prepareFormObject = (formData) => {
        const formFields = formData?.form_options_list;
        let createdFormObject = {};
        for (let i = 0; i < formFields?.length; i++) {
            let eachField = formFields[i];


            if (eachField.option_type) {
                let eachFieldPreparedObject = prepareFieldObject(eachField);
                createdFormObject[`${eachField.id}`] = eachFieldPreparedObject;
            }


            if (eachField?.childs?.length) {
                for (let j = 0; j < eachField?.childs?.length; j++) {
                    let eachNestedChild = eachField?.childs[j]
                    if (eachNestedChild.option_type) {
                        let nestedChildPreparedObject = prepareFieldObject(eachNestedChild);
                        createdFormObject[`${eachNestedChild.id}`] = nestedChildPreparedObject;
                    }
                }
            }
        }
        setFormObject(createdFormObject);
        let resultOfUseForm = useForm(createdFormObject);
        setUseFormObject(resultOfUseForm)
        return Promise.resolve(true)

    }

    const prepareFieldObject = (fieldObject) => {
        if (fieldObject.option_type) {
            let createdFieldObject = {};
            createdFieldObject[`id`] = fieldObject.id
            createdFieldObject[`label`] = fieldObject.lable
            createdFieldObject[`value`] = ""
            let fieldValidations = [];
            if (fieldObject.validations) {
                for (let i = 0; i < fieldObject.validations.length; i++) {
                    let eachValidation = fieldObject.validations[i];
                    if (FORM_VALIDATION_TYPES[eachValidation]) {
                        let obj = getKeyValueObject(`${FORM_VALIDATION_TYPES[eachValidation]}`, true)
                        fieldValidations.push(obj)
                    }

                }
            }
            if (fieldObject.option_type === FORM_ITEM_TYPE.text) {

                createdFieldObject[`value`] = fieldObject.option_answer ? fieldObject.option_answer : "";
                if (fieldObject.lable === 'Name Of Stand' && selectedLocation?.location_state) {
                    createdFieldObject[`value`] = selectedLocation?.location_name + ' ' + selectedLocation?.location_state
                }
                let min = getKeyValueObject(`min`, 2)
                fieldValidations.push(min)

                let max = getKeyValueObject(`max`, 30)
                fieldValidations.push(max)

            }
            else if (fieldObject.option_type === FORM_ITEM_TYPE.textarea) {

                createdFieldObject[`value`] = fieldObject.option_answer ? fieldObject.option_answer : "";


                let min = getKeyValueObject(`min`, 2)
                fieldValidations.push(min)

                let max = getKeyValueObject(`max`, 500)
                fieldValidations.push(max)
            }
            else if (fieldObject.option_type === FORM_ITEM_TYPE.file) {
                // let min = getKeyValueObject(`min`,0)
                // fieldValidations.push(min)
            }
            else if (fieldObject.option_type === FORM_ITEM_TYPE.checkbox || fieldObject.option_type === FORM_ITEM_TYPE.radio) {
                fieldValidations.push(getKeyValueObject(`isOneSelected`, true));
            }

            createdFieldObject[`validations`] = fieldValidations;

            if (fieldObject.option_type === FORM_ITEM_TYPE.checkbox || fieldObject.option_type === FORM_ITEM_TYPE.radio) {
                let fieldAnswerList = getObjectOfValues(fieldObject?.option_answer?.split(","));

                let fieldOptionsList = fieldObject.option_list.split(",");
                const transformedOptionsArray = transformArrayToObjectWithKeys(fieldOptionsList, fieldAnswerList);
                createdFieldObject[`options`] = transformedOptionsArray;
                createdFieldObject[`value`] = transformedOptionsArray;
            }
            if (fieldObject.option_type === FORM_ITEM_TYPE.api) {
                if (fieldObject.option_list === LOCATION_TYPES.country) {
                    let fieldAnswerList = getObjectOfValues(fieldObject?.option_answer?.split(","));
                    const transformedOptionsArray = transformLocationArrayToObjectWithKeys(COUNTRY, { "United States": true });
                    createdFieldObject[`options`] = transformedOptionsArray
                    createdFieldObject[`value`] = transformedOptionsArray
                }
                else if (fieldObject.option_list === LOCATION_TYPES.state) {
                    let fieldAnswerList = getObjectOfValues(fieldObject?.option_answer?.split(","));
                    const transformedOptionsArray = transformLocationArrayToObjectWithKeys(STATES, fieldAnswerList);
                    createdFieldObject[`options`] = transformedOptionsArray
                    createdFieldObject[`value`] = transformedOptionsArray
                }
            }
            if (fieldObject.option_type === FORM_ITEM_TYPE.checkbox || fieldObject.option_type === FORM_ITEM_TYPE.radio || fieldObject.option_type === FORM_ITEM_TYPE.file || fieldObject.option_type === FORM_ITEM_TYPE.api) {
                createdFieldObject[`validationType`] = "array"
            }
            createdFieldObject[`option_type`] = fieldObject.option_type;
            if (fieldObject.option_type === FORM_ITEM_TYPE.file) {
                let values = []
                if (fieldObject?.localImages) {
                    values = [...fieldObject?.localImages]
                }
                else if (fieldObject.image_ids) {
                    const imageIds = fieldObject?.image_ids?.toString().split(',')

                    values = transformJournalImageArray(fieldObject?.image_urls, imageIds);
                }

                createdFieldObject[`value`] = [...values]
            }

            // Setting initial value for date type as new Date() and validation type as date for yup
            if (fieldObject.option_type === FORM_ITEM_TYPE.date) {
                createdFieldObject[`value`] = fieldObject?.option_answer ? new Date(fieldObject?.option_answer) : new Date();
                createdFieldObject[`validationType`] = "date"
            }
            if (fieldObject.option_type === FORM_ITEM_TYPE.time) {
                createdFieldObject[`value`] = fieldObject?.option_answer ? getDateFromTime(fieldObject?.option_answer) : new Date();
                createdFieldObject[`validationType`] = "date"
            }

            if (fieldObject.option_type === FORM_ITEM_TYPE.range) {
                // Setting empty string if new form, or populating the value if editing or offline form.
                createdFieldObject[`value`] = fieldObject?.option_answer?.length ? fieldObject?.option_answer : ""
            }

            createdFieldObject[`journal_option_answer_id`] = fieldObject?.journal_option_answer_id ? fieldObject?.journal_option_answer_id : ""
            return createdFieldObject
        }
    }


    const formRef = useRef()

    const handleDateChange = (fieldKey, date) => {
        if (formRef.current) {
            formRef.current.setFieldValue(fieldKey, date)
        }
    }

    const onPressNewImage = async (fieldKey) => {
        if (formRef.current) {
            const allValues = formRef.current?.values;
            const fieldKeyValue = [...allValues[fieldKey]];
            //checking the length of image array.
            if (fieldKeyValue.length > 4) {
                registerToastMessage("Maximum 5 images allowed", false)
                return
            }
            const image = await getImage();
            fieldKeyValue.push(image)
            formRef.current.setFieldValue(fieldKey, fieldKeyValue);
        }

    }

    const handleDeleteImage = async (fieldKey, itemIndex) => {
        if (formRef.current) {
            const allValues = formRef.current?.values
            const fieldKeyValue = [...allValues[fieldKey]];
            if (fieldKeyValue[itemIndex]?.type === HUNTING_JOURNAL_API_PHOTO) {
                await deleteJournalFormImage(fieldKeyValue[itemIndex].id).then(res => {
                    fieldKeyValue.splice(itemIndex, 1)
                    formRef.current.setFieldValue(fieldKey, fieldKeyValue)
                })
            }
            else {
                fieldKeyValue.splice(itemIndex, 1)
                formRef.current.setFieldValue(fieldKey, fieldKeyValue)
            }
        }
    }

    const renderLoading = useMemo(() => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Loading color="white" size={50} />
            </View>
        )
    })

    const handleCheckBoxItemSelect = (fieldKey, id, index, value) => {
        if (formRef.current) {
            const allValues = formRef.current?.values
            const fieldKeyValue = [...allValues[fieldKey]];
            fieldKeyValue[index] = { ...fieldKeyValue[index], selected: value };
            formRef.current.setFieldValue(fieldKey, fieldKeyValue)
        }
    }

    const handleSelectRange = (fieldKey, value) => {
        if (formRef.current) {
            formRef.current.setFieldValue(fieldKey, value)
        }
    }

    const handleCheckBoxAddOtherItem = (fieldKey, id, index, value, text) => {
        if (formRef.current) {
            const allValues = formRef.current?.values;
            const fieldKeyValue = [...allValues[fieldKey]];
            fieldKeyValue[index] = { ...fieldKeyValue[index], selected: value, label: text };
            formRef.current.setFieldValue(fieldKey, fieldKeyValue)
        }
    }

    const handleRadioButtonSelect = (fieldKey, id, index, value) => {
        if (formRef.current) {
            const allValues = formRef.current?.values
            const fieldKeyValue = [...allValues[fieldKey]].map(each => {
                if (each.id === id) {
                    return { ...each, selected: true };
                }
                else {
                    return { ...each, selected: false }
                }
            })
            formRef.current.setFieldValue(fieldKey, fieldKeyValue)
        }
    }

    const handleAddNewRadioItem = (fieldKey, id, index, value, text) => {
        if (formRef.current) {
            const allValues = formRef.current?.values
            const fieldKeyValue = [...allValues[fieldKey]].map(each => {
                if (each.id === id) {
                    return { ...each, selected: value, label: text ? text : each.label };
                }
                else {
                    return { ...each, selected: false }
                }
            })
            formRef.current.setFieldValue(fieldKey, fieldKeyValue)
        }
    }



    const { goBack } = props.navigation;
    // function submitForm(values, { setErrors }) {
    async function submitForm(values) {
        const apiFormObjectWithExtraValues = {
            ...apiFormObject,
            journal_submitted_id: apiFormObject?.journal_submitted_id ? apiFormObject.journal_submitted_id : getRandomUUID(),
            submission_date: formatDate(new Date(), DATE_FORMATS.JOURNAL_FORMAT)
        }
        const mappedApiFormObject = await prepareJournalApiPayload(apiFormObjectWithExtraValues, values);

        if (InternetConnection) {
            // CREATE OBJECT HERE FOR PAYLOAD OF API....
            await handleSubmitJournalForm(mappedApiFormObject, formSubmitCallBack);

        }
        else {
            // ADD WHOLE FORM INTO PERSISTED ARRAY WITH TYPE OFFLINE_FORM;
            let addedOfflineKeyObject = { form: { ...mappedApiFormObject }, submission_date: apiFormObjectWithExtraValues.submission_date, type: IS_OFFLINE_FORM, journal_submitted_id: apiFormObjectWithExtraValues.journal_submitted_id };
            saveOfflineForm(addedOfflineKeyObject);
            goBack()
        }

    }

    const formSubmitCallBack = () => {
        goBack()
        setIsFormSubmitted(false)
    }


    const RenderEachItem = React.memo(({
        id,
        label,
        errors,
        handleBlur,
        handleChange,
        touched,
        values,
        option_type,
        size,
        childParentLabel,
        option_list
    }) => {
        const fieldPlaceHolder = label === '-' ? " " : label;
        const labelText = childParentLabel ? label : label;

        return (
            <View style={{ flex: (size - 2.5) / 100, marginBottom: normalizeHeight(9) }}>
                <>
                    {
                        option_type === FORM_ITEM_TYPE.text ?
                            <CustomInput
                                errors={errors}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                touched={touched}
                                values={values}
                                fieldkey={id}
                                isLabel={true}
                                labelText={labelText}
                                borderRadius={normalizeWidth(10)}
                                placeholder={fieldPlaceHolder}
                            />
                            :
                            option_type === FORM_ITEM_TYPE.checkbox ?
                                <CustomCheckBoxSelector
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleCheckBoxItemSelect}
                                    touched={touched}
                                    values={values}
                                    fieldkey={id}
                                    isLabel={true}
                                    labelText={labelText}
                                    modalText={childParentLabel}
                                    placeholder={fieldPlaceHolder}
                                    borderRadius={normalizeWidth(10)}
                                    isHuntingJournal={true}
                                    handleCheckBoxAddOtherItem={handleCheckBoxAddOtherItem}
                                />
                                : option_type === FORM_ITEM_TYPE.radio ?
                                    <CustomRadioButtonSelector
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleRadioButtonSelect}
                                        touched={touched}
                                        values={values}
                                        fieldkey={id}
                                        isLabel={true}
                                        modalText={childParentLabel}
                                        labelText={labelText}
                                        placeholder={fieldPlaceHolder}
                                        borderRadius={normalizeWidth(10)}
                                        handleAddNewRadioItem={handleAddNewRadioItem}
                                        isHuntingJournal={true}
                                    />
                                    :
                                    option_type === FORM_ITEM_TYPE.api ?
                                        <CustomRadioButtonSelector
                                            errors={errors}
                                            handleBlur={handleBlur}
                                            handleChange={handleRadioButtonSelect}
                                            touched={touched}
                                            values={values}
                                            fieldkey={id}
                                            isLabel={true}
                                            modalText={childParentLabel}
                                            labelText={labelText}
                                            placeholder={fieldPlaceHolder}
                                            borderRadius={normalizeWidth(10)}
                                            handleAddNewRadioItem={handleAddNewRadioItem}
                                            isHuntingJournal={true}
                                        />
                                        :
                                        option_type === FORM_ITEM_TYPE.file ?
                                            <CustomImagePicker
                                                handleDeleteImage={handleDeleteImage}
                                                onPressNewImage={onPressNewImage}
                                                fieldKey={id}
                                                values={values}
                                                label={labelText}
                                                errors={errors}
                                            />
                                            : option_type === FORM_ITEM_TYPE.date ?
                                                <CustomDateTimePicker
                                                    errors={errors}
                                                    touched={touched}
                                                    fieldkey={id}
                                                    isLabel={true}
                                                    labelText={fieldPlaceHolder}
                                                    handleChange={handleDateChange}
                                                    values={values}
                                                    placeholder={'MM/DD/YYY'}
                                                    customIcon={calendarIcon}
                                                    borderColor={whiteColor}
                                                />

                                                :
                                                option_type === FORM_ITEM_TYPE.time ?
                                                    <CustomDateTimePicker
                                                        errors={errors}
                                                        touched={touched}
                                                        fieldkey={id}
                                                        isLabel={true}
                                                        labelText={fieldPlaceHolder}
                                                        handleChange={handleDateChange}
                                                        values={values}
                                                        pickerMode={DATE_TIME_PICKER_TYPES.time}
                                                        placeholder={'HH:MM'}
                                                        borderColor={whiteColor}
                                                    />
                                                    : option_type === FORM_ITEM_TYPE.textarea ?
                                                        <CustomInput
                                                            errors={errors}
                                                            handleBlur={handleBlur}
                                                            handleChange={handleChange}
                                                            placeholder={'Type your message here'}
                                                            touched={touched}
                                                            values={values}
                                                            fieldkey={id}
                                                            isLabel={true}
                                                            labelText={fieldPlaceHolder}
                                                            borderColor={whiteColor}
                                                            borderRadius={normalizeWidth(10)}
                                                            multiline={true}
                                                        />
                                                        :
                                                        option_type === FORM_ITEM_TYPE.range ?
                                                            <CustomScrollPicker
                                                                errors={errors}
                                                                values={values}
                                                                fieldkey={id}
                                                                touched={touched}
                                                                labelText={fieldPlaceHolder}
                                                                isLabel={true}
                                                                labelText={labelText}
                                                                placeholder={fieldPlaceHolder}
                                                                scrollRange={option_list}
                                                                handleChange={handleSelectRange}

                                                            />
                                                            : <></>


                    }

                </>
            </View>
        )
    })


    return (
        <>
            {
                !isFormPrepared ?
                    <>
                        {renderLoading}
                    </>
                    :
                    isFormPrepared &&
                    <Formik
                        innerRef={formRef}
                        initialValues={useFormObject.initialValues}
                        validationSchema={useFormObject.schema}
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

                                    <ScrollView>
                                        <View style={styles.journalMainViewContainer}>
                                            <View style={styles.journalMainLogoContainer} >
                                                <Image source={main_logo_icon} resizeMode={'contain'} style={styles.journalMainLogo} />
                                            </View>


                                            <View style={styles.journalTextParagraphContainer}>

                                                <Text>
                                                    <Text style={styles.journalTextParagraph}>The daily feeding and travel pattern information found in the
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                                            <Text style={{ color: buttonColorYellow, fontSize: fontH2V3, fontFamily: fontFamily.Primary.Regular, lineHeight: 15, top: normalizeHeight(2.5) }}> Whitetail Almanac App</Text>
                                                            <Text style={{ color: buttonColorYellow, fontSize: fontSmallSize, fontFamily: fontFamily.Primary.Regular, top: normalizeHeight(1) }}>TM </Text>
                                                        </View>
                                                        <Text style={{ ...styles.journalTextParagraph }}>,indicates the time and place when a major feeding period should occur. The</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ color: buttonColorYellow, fontSize: fontH2V3, fontFamily: fontFamily.Primary.Regular, lineHeight: 15, top: normalizeHeight(2.5) }}> Hunting Journal</Text>
                                                            <Text style={{ color: buttonColorYellow, fontSize: fontSmallSize, fontFamily: fontFamily.Primary.Regular, top: normalizeHeight(1) }}>TM  </Text>
                                                        </View>
                                                        gives you an opportunity to record the events, which take place during that period. </Text>
                                                </Text>
                                                <Text style={{ ...styles.journalTextParagraph, marginTop: normalizeHeight(20) }}>Climate, terrain, wind direction and rutting behavior will differ from region to region. Record as much information as possible during each hunt. As you record them, various movement patterns will begin to emerge, which will help you form strategies to “Outwit The Game You Hunt”</Text>
                                            </View>
                                            <View>

                                                <View style={styles.previousEntriesButtonContainer}>
                                                    <CustomButton onPress={() =>
                                                        goBack()
                                                    } buttonText={'Previous Entries'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} />
                                                </View>
                                            </View>
                                            {/* DYNAMIC FIELDS START */}
                                            <View style={{ marginHorizontal: normalizeWidth(10), marginTop: normalizeHeight(5) }}>
                                                {
                                                    apiFormObject?.form_options_list?.map(each => {
                                                        return (
                                                            <React.Fragment key={each.id}>
                                                                {
                                                                    each.option_type &&
                                                                    <>
                                                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalizeHeight(5) }}>
                                                                            <RenderEachItem
                                                                                values={values}
                                                                                errors={errors}
                                                                                handleChange={handleChange}
                                                                                handleBlur={handleBlur}
                                                                                touched={touched}
                                                                                id={each?.id}
                                                                                label={each?.lable}
                                                                                option_type={each?.option_type}
                                                                                size={each?.size}
                                                                                option_list={each?.option_list}
                                                                            />
                                                                            {
                                                                                each?.childs?.map(eachChild => {
                                                                                    return (
                                                                                        <RenderEachItem key={eachChild.id}
                                                                                            values={values}
                                                                                            errors={errors}
                                                                                            handleChange={handleChange}
                                                                                            handleBlur={handleBlur}
                                                                                            touched={touched}
                                                                                            id={eachChild?.id}
                                                                                            label={eachChild?.lable}
                                                                                            option_type={eachChild?.option_type}
                                                                                            size={eachChild?.size}
                                                                                            childParentLabel={each?.lable}
                                                                                            option_list={eachChild?.option_list}
                                                                                        />

                                                                                    )
                                                                                })
                                                                            }
                                                                        </View>
                                                                    </>
                                                                }
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }

                                            </View>
                                            <View>
                                                <View style={styles.saveButtonContainer}>
                                                    <CustomButton loading={formSubmitLoading == 1} disabled={formSubmitLoading == 1} onPress={handleSubmit} buttonText={'Save'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(10)} bordercolor={buttonColorYellow} />
                                                </View>
                                            </View>

                                        </View>
                                    </ScrollView>
                                </>
                            )
                        }}

                    </Formik >
            }
        </>

    )

}

const mapStateToProps = state => {
    return {
        formData: state.journal.formData,
        InternetConnection: state.InternetConnection.internetConnected,
        selectedLocation: state.favoriteLocation.selectedLocation,
    }
}

const mapDispatchToProps = {
    GetJournalFormApi,
    UploadImage,
    submitJournalForm,
    deleteJournalFormImage,
    saveOfflineForm,

}


export default connect(mapStateToProps, mapDispatchToProps)(autoScrollHOC(HuntingJournal))

const styles = StyleSheet.create({

    ageCustomInputContainer: {
        marginLeft: normalizeWidth(0),
        flex: 3.5
    },
    ageLabelContainer: {
        marginTop: normalizeHeight(20),
        marginRight: normalizeWidth(10),
        // justifyContent: 'flex-end', //Centered horizontally
        justifyContent: "center", //Centered vertically
        flex: 1.5,
    },
    ageRowContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    view: {
        flexDirection: "row",
        height: normalizeHeight(50),
    },
    clickhereImageSection: {
        flexDirection: "row",
        height: normalizeHeight(140),
        justifyContent: 'space-between'
    },
    imageUploadContainer: {
        width: '40%', borderColor: 'white', borderWidth: normalizeWidth(3), borderRadius: normalizeWidth(15)
    },
    touchableImageAddPhoto: {
        width: '40%', borderColor: 'white', borderWidth: StyleSheet.hairlineWidth, borderRadius: normalizeWidth(15), justifyContent: 'center', alignItems: 'center'
    },
    imageHW: {
        width: '100%', height: '100%'
    },
    textClickHere: {
        paddingHorizontal: normalizeWidth(15), color: buttonColorYellow, fontFamily: fontFamily.Primary.Regular, textAlign: 'center'
    },

    containerMain: {
        flex: 1,
        backgroundColor: whiteColor, alignItems: 'center'
    },

    customInputFlex: {
        flex: 3,

    },
    leftSideFlex: {
        flex: 3,
        flexGrow: 2
    },
    rightSideFlex: {
        flex: 3,
        flexGrow: 2
    },
    subcontainerMain: {
        backgroundColor: primaryColor,
        borderTopLeftRadius: normalizeWidth(20),
        borderTopRightRadius: normalizeWidth(20),
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    customInputRowLiveWeight: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    },

    customInputLiveWeight: {
        marginLeft: normalizeWidth(0), flex: 3.5
    },
    journalMainLogoContainer: {
        height: '3%',
    },
    journalMainViewContainer: {
        flex: 1, backgroundColor: primaryColor
    },
    journalMainLogo: {
        width: '100%', height: normalizeHeight(70), margin: normalizeWidth(10)
    },
    journalTextParagraphContainer: {
        marginHorizontal: normalizeWidth(10),
    },
    journalTextParagraph: {
        // textAlign: 'justify',
        textAlignVertical: "center",
        color: whiteColor, fontFamily: fontFamily.Primary.Regular, fontSize: fontH2V3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    journalTextSubParagraph: {
        textAlign: 'justify',
        textAlignVertical: 'top',
        fontFamily: fontFamily.Primary.Regular, fontSize: fontH4,

    },
    journalColumnContainer: {
        position: 'absolute', top: 0,
        flexDirection: "column",
        width: '100%',


    },
    previousEntriesButtonContainer: {
        marginHorizontal: normalizeWidth(50),
        marginVertical: normalizeWidth(20),

    },
    saveButtonContainer: {
        marginHorizontal: normalizeWidth(20),
        marginTop: normalizeWidth(20),
        marginBottom: normalizeWidth(40)
    },

    journalFormContainer: {
        marginHorizontal: normalizeWidth(20),
        marginTop: normalizeWidth(20),

    },
    timeInContainer: {
        flex: 0.5
    },
    timeOutContainer: {
        marginLeft: normalizeWidth(10), flex: 0.5
    },
    stateTouchableContainer: {
        flex: 3, justifyContent: 'flex-end'
    },
    weatherRowContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: 'space-between', alignItems: 'center'

    },
    customInputBarometricPressure: {
        flex: 3,
    },
    customInputuNamedPressure: {
        marginLeft: normalizeWidth(10), flex: 2
    },
    windDirectionRowChild: {
        // flex: 2,
        flex: 0.45,
        flexGrow: 1
    },
    smallCustomInputContainer: {
        marginTop: normalizeHeight(20), marginLeft: normalizeWidth(10), flex: 0.6
    },
    weatherSpaceBetweenContainer: {
        flex: 0.45,
        flexGrow: 1,
    },
    weatherSpaceFromLeftContainer: {
        marginLeft: normalizeWidth(10), flex: 0.3
    },

    weatherMainContainer: {
        marginBottom: normalizeHeight(10)
    },
    genericContainerSpaceBottom: {
        marginBottom: normalizeWidth(10)
    },
    scrollViewContainer: {
        width: '100%',
        height: '100%',
    },
    horizontalLine: {
        marginHorizontal: normalizeWidth(10),
        width: '95%',
        opacity: 0.4,
        height: normalizeWidth(0.5),
        backgroundColor: whiteColor,
    },
    textInputLabel: {
        // marginVertical:normalizeWidth(10),
        textAlign: 'right',
        color: whiteColor, marginLeft: normalizeWidth(0), fontFamily: fontFamily.Primary.Regular, fontSize: fontH2V3,

    },
    imageContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(20), borderWidth: 2, borderColor: whiteColor, borderRadius: 5, },
    image: { width: normalizeWidth(100), height: normalizeWidth(100), borderRadius: normalizeWidth(15), backgroundColor: transparentColor }
})
