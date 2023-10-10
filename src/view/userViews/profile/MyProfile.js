import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Formik } from "formik";
import { ref } from "yup";
import autoScrollHOC from '../../../hoc/AutoInputScrollHOC';
import FadeInView from '../../../hoc/FadeInHoc';
import CustomButton from '../../shared/CustomButton';
import CustomInput from '../../shared/CustomInput';
import { useForm } from '../../../hooks/useForm';
import { buttonColorYellow, fontH2V2, headingTextBlackColor, primaryColor, whiteColor } from '../../../constants/Styles';
import { normalizeHeight, normalizeWidth } from '../../../utils/FontUtil';
import { backIcon, blackDear, greyDropDownIcon, userProfile, whiteTailLogo } from '../../../assets/images';
import { getImage, getLocalImageURI } from '../../../utils/ImageUploadUtil';
import useAndroidResize from '../../../hooks/useAndroidResize';
import { getFCMToken } from '../../../utils/TokenUtil';
import { UserProfileSaveApi, GlobalCountriesApi, GlobalStatesApi, GlobalCityApi } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import CustomSelector from '../../shared/CustomSelector';
import { RouteNames } from '../../../constants/RouteNames';
import BackButtonHeader from '../../shared/BackButtonHeader';
import { filterIdtoName, filterNametoId } from '../../../utils/NametoIdUtil';
import { registerToastMessage } from '../../../utils/RegisterToast';
import { COUNTRY } from '../../../constants/constants';
const MyProfile = (props) => {
    const { UserProfileSaveApi, user, GlobalCountriesApi, countryName, GlobalCityApi, GlobalStatesApi, stateName, cityName, InternetConnected } = props;
    const [loading, setLoading] = useState(false)
    const [nextFocusedInput, setNextFocusedInput] = useState('')
    const [stateLoadling, setStateLoading] = useState(user?.detail?.state ? true : false)
    const [cityLoadling, setCityLoading] = useState(user?.detail?.city ? true : false)
    const formRef = useRef()
    useEffect(() => {
        getStates(COUNTRY[0].id)

        if (user?.detail?.state && user?.detail?.state_id) {
            getCity(user?.detail?.state_id)
        }
    }, [])
    useAndroidResize()

    let createProfileAction = {
        FirstName: { id: "FirstName", label: "First Name", value: user?.personal?.first_name || "", validations: [{ min: 3 }, { max: 15 }, { isRequired: true }] },
        LastName: { id: "LastName", label: "Last Name", value: user?.personal?.last_name || "", validations: [{ min: 3 }, { max: 15 }, { isRequired: true }] },
        Phone: { id: "Phone", label: "Phone", value: user?.personal?.phone || "", validations: [{ matches: /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/ }, { isRequired: true }] },
        Email: { id: "Email", label: "Email", value: user?.personal?.email || "", validations: [{ isRequired: true }, { isEmail: true }] },
        Age: { id: "Age", label: "Age", value: user?.personal?.age || 0, validations: [{ min: 2 }, { max: 3 }, { matches: /^[0-9]+$/ }, { isRequired: true }] },
        Address: { id: "Address", label: "Address", value: user?.detail?.address || "", validations: [{ min: 3 }, { max: 25 }, { isRequired: true }] },
        ZipCode: { id: "ZipCode", label: "Zip Code", value: user?.detail?.zipcode || "", validations: [{ min: 3 }, { max: 8 }, { matches: /^[0-9]+$/ }, { isRequired: true }] },
        Country: { id: "Country", label: "Country", value: user?.detail?.country || "United States", validations: [{ min: 2 }, { isRequired: true }] },
        State: { id: "State", label: "State", value: user?.detail?.state || "", validations: [{ min: 2 }, { isRequired: true }] },
        City: { id: "City", label: "City", value: user?.detail?.city || "" },
    }
    const handleFocusNext = (fieldKey) => {
        if (fieldKey) {
            setNextFocusedInput(fieldKey)
        }
    }
    const handleOnChangeSelect = (fieldkey, value) => {
        if (fieldkey === createProfileAction.Country.id) {
            let id = filterNametoId(COUNTRY, value)
            setCityLoading(false)
            setStateLoading(false)
            formRef.current.setFieldValue(createProfileAction.State.id, 0)
            formRef.current.setFieldValue(createProfileAction.City.id, 0)
            getStates(id)
        }
        if (fieldkey === createProfileAction.State.id) {
            let id = filterNametoId(stateName, value)
            setCityLoading(false)
            formRef.current.setFieldValue(createProfileAction.City.id, 0)
            getCity(id)
        }
        if (formRef.current) {
            formRef.current.setFieldValue(fieldkey, value)
        }
    }
    const transformCounrtyData = () => {
        return [...COUNTRY].map((each, index) => {
            return {
                id: each.id,
                label: each.name
            }
        })
    }

    const transformStateData = () => {
        if (stateName?.length) {
            return [...stateName].map((each, index) => {
                return {
                    id: each.id,
                    label: each.name
                }
            })
        } else {
            return false
        }
    }
    const transformCityData = () => {
        if (cityName?.length) {
            return [...cityName].map((each, index) => {
                return {
                    id: each.id,
                    label: each.name
                }
            })
        } else {
            return false
        }
    }


    const [image, setImage] = useState({
        img: { keyName: "img", value: { uri: user?.personal?.image_url } || "", error: null },
    })
    const redirection = (routeName) => {
        props.navigation.navigate(routeName)
    }
    async function submitForm(values, { setErrors }) {
        //api hit
        setLoading(true)
        let prepareObject = {
            ...values
        }
        let obj = {
            first_name: prepareObject.FirstName,
            last_name: prepareObject.LastName,
            address: prepareObject.Address,
            zipcode: prepareObject.ZipCode,
            age: prepareObject.Age,
            phone: prepareObject.Phone,
            source_image: image?.img?.value?.base64 || "",
            country: filterNametoId(COUNTRY, prepareObject.Country),
            state: stateName?.length ? filterNametoId(stateName, prepareObject.State) : user?.detail?.state_id,
            city: cityName?.length ? filterNametoId(cityName, prepareObject.City) : user?.detail?.city_id,
        }
        UserProfileSaveApi(obj).then((val) => {
            setLoading(false)
            return redirection(RouteNames.User.Home)
        }).catch((e) => {
            setLoading(false)
            console.log(e, "eeeUserProfileSaveApi")
        })
    }

    // const getCountries = () => {
    //     GlobalCountriesApi().then((val) => {
    //     }).catch((e) => {
    //         console.log(e, "error in country api")
    //     })
    // }
    const getStates = (country_id) => {
        setStateLoading(false)
        GlobalStatesApi(country_id).then((val) => {
            setStateLoading(true)
        }).catch((e) => {
            setStateLoading(false)
            console.log(e, "error in getStates api")
        })
    }
    const getCity = (state_id) => {
        setCityLoading(false)
        GlobalCityApi(state_id).then((val) => {
            setCityLoading(true)
        }).catch((e) => {
            setCityLoading(false)
            console.log(e, "error in getCity api")
        })
    }
    const handleBackButtonPress = () => {
        return props.navigation.goBack()
    }
    const { initialValues, schema } = useForm(createProfileAction);
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

                    <View style={styles.mainContainer}>
                        <BackButtonHeader handleBackButtonPress={handleBackButtonPress} />
                        <ScrollView >
                            <TouchableOpacity style={styles.imageContainer} onPress={() => getImage(setImage, image, 'img')}>
                                <Image style={styles.image} source={getLocalImageURI(image.img.value.uri, userProfile)} />
                            </TouchableOpacity>
                            <View style={styles.inputContainer}>
                                <CustomInput
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    placeholder={'First Name'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={'FirstName'}
                                    nextFieldKey={'LastName'}
                                    handleFocusNext={handleFocusNext}
                                    nextFocusedInput={nextFocusedInput}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <CustomInput
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    placeholder={'Last Name'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={'LastName'}
                                    nextFieldKey={'Phone'}
                                    handleFocusNext={handleFocusNext}
                                    nextFocusedInput={nextFocusedInput}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <CustomInput
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    placeholder={'Email'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={'Email'}
                                    textInputEditable={false}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <CustomInput
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    placeholder={'Phone'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={'Phone'}
                                    nextFieldKey={'Age'}
                                    handleFocusNext={handleFocusNext}
                                    keyboardType={'phone-pad'}
                                    nextFocusedInput={nextFocusedInput}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <CustomInput
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    placeholder={'Age'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={'Age'}
                                    isRequired={true}
                                    nextFieldKey={'Address'}
                                    handleFocusNext={handleFocusNext}
                                    keyboardType={'phone-pad'}
                                    nextFocusedInput={nextFocusedInput}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <CustomInput
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    placeholder={'Address'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={'Address'}
                                    nextFieldKey={'ZipCode'}
                                    handleFocusNext={handleFocusNext}
                                    nextFocusedInput={nextFocusedInput}
                                />
                            </View>
                            <View style={styles.inputCustomSelectorContainer}>
                                <CustomInput
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    placeholder={'Zip Code'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={'ZipCode'}
                                    nextFieldKey={'ZipCode'}
                                    handleFocusNext={handleFocusNext}
                                    keyboardType={'phone-pad'}
                                    nextFocusedInput={nextFocusedInput}
                                />
                            </View>
                            <View style={styles.inputCustomSelectorContainer}>
                                <CustomSelector
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleOnChangeSelect={handleOnChangeSelect}
                                    placeholder={'Country'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={createProfileAction.Country.id}
                                    isLabel={true}
                                    textInputEditable={false}
                                    borderRadius={normalizeWidth(25)}
                                    modalHeading={'Country'}
                                    selectorItems={transformCounrtyData()}
                                    customIcon={greyDropDownIcon}
                                    customIconTintColor={whiteColor}
                                    isRequired={true}
                                    search={false}
                                />
                            </View>
                            <View style={styles.inputCustomSelectorContainer}>
                                <CustomSelector
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleOnChangeSelect={handleOnChangeSelect}
                                    placeholder={'State'}
                                    modalHeading={'State'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={createProfileAction.State.id}
                                    isLabel={true}
                                    textInputEditable={false}
                                    borderRadius={normalizeWidth(25)}
                                    selectorItems={transformStateData() ? transformStateData() : []}
                                    customIcon={greyDropDownIcon}
                                    customIconTintColor={whiteColor}
                                    disabled={!stateLoadling}
                                    readOnly={!stateLoadling}
                                    isRequired={true}
                                />
                            </View>
                            <View style={styles.inputCustomSelectorContainer}>

                                <CustomSelector
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleOnChangeSelect={handleOnChangeSelect}
                                    placeholder={'City'}
                                    modalHeading={'City'}
                                    touched={touched}
                                    values={values}
                                    fieldkey={createProfileAction.City.id}
                                    isLabel={true}
                                    textInputEditable={false}
                                    disabled={!cityLoadling}
                                    readOnly={!cityLoadling}
                                    borderRadius={normalizeWidth(25)}
                                    selectorItems={transformCityData() ? transformCityData() : []}
                                    customIcon={greyDropDownIcon}
                                    customIconTintColor={whiteColor}
                                    isRequired={true}
                                />
                            </View>
                        </ScrollView>
                        {
                            InternetConnected ?
                                <View style={styles.sendBtn}>
                                    <CustomButton onPress={handleSubmit} buttonText={"Update"} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} disabled={loading} loading={loading} />
                                </View>
                                :
                                <View style={styles.sendBtn}>
                                    <CustomButton onPress={() => console.log("Offline Mode")} height={normalizeHeight(60)} buttonText={'This feature is not available in offline mode.'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} disabled={true} />
                                </View>
                        }
                    </View>
                )
            }}
        </Formik>
    )
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        countryName: state.country.countryName,
        stateName: state.country.stateName,
        cityName: state.country.cityName,
        InternetConnected: state?.InternetConnection?.internetConnected
    }
}

const mapDispatchToProps = {
    UserProfileSaveApi,
    GlobalCountriesApi,
    GlobalStatesApi,
    GlobalCityApi
}
export default connect(mapStateToProps, mapDispatchToProps)(autoScrollHOC(FadeInView(MyProfile)))

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: primaryColor, padding: normalizeWidth(20) },
    inputContainer: { marginBottom: normalizeWidth(20) },
    inputCustomSelectorContainer: { marginBottom: normalizeWidth(5) },
    sendBtn: { marginHorizontal: normalizeWidth(40), marginVertical: normalizeWidth(10) },
    logo: { width: normalizeWidth(250), height: normalizeHeight(100) },
    logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(10) },
    iconContainer: { width: '10%' },
    signupContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    signupText: { color: whiteColor, fontSize: fontH2V2 },
    img: { width: normalizeWidth(25), height: normalizeWidth(25) },
    imageContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(20) },
    image: { width: normalizeWidth(100), height: normalizeWidth(100), borderRadius: normalizeWidth(50), backgroundColor: whiteColor }
})
