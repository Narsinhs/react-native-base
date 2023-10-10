import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native'
import { useForm } from '../../hooks/useForm';
import { Formik } from "formik";
import { buttonColorYellow, fontFamily, fontH2V2, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles';
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
import CustomInput from '../shared/CustomInput';
import CustomButton from '../shared/CustomButton';
import { greyDropDownIcon, userProfile } from '../../assets/images';
import FadeInView from '../../hoc/FadeInHoc';
import { RouteNames } from '../../constants/RouteNames';
import { ref } from "yup";
import { getImage, getLocalImageURI } from '../../utils/ImageUploadUtil';
import autoScrollHOC from '../../hoc/AutoInputScrollHOC';
import BackButtonHeader from '../shared/BackButtonHeader';
import { connect } from 'react-redux';
import { SignUp } from '../../redux/actions/AuthAction';
import CustomSelector from '../shared/CustomSelector';
import { GlobalCountriesApi, GlobalStatesApi, GlobalCityApi, UseCurrentLocation } from '../../redux/actions/index';
import useAndroidResize from '../../hooks/useAndroidResize';
import KeyboardDismissWrapper from '../../components/sharedComponents/KeyboardDismissWrapper';
import { filterNametoId } from '../../utils/NametoIdUtil';
import { COUNTRY, dummyCountryData } from '../../constants/constants';
const Register = (props) => {
  const { SignUp, GlobalCountriesApi, countryName, InternetConnected, GlobalCityApi, Coordinate, geoLocation, GlobalStatesApi, stateName, cityName, UseCurrentLocation } = props
  const formRef = useRef()
  useEffect(() => {
    getStates(COUNTRY[0].id)
    getrouteName()
  }, [props?.route, InternetConnected])

  const [fetching, setFetching] = useState(false)
  useAndroidResize()
  let createRegisterAction = {
    FirstName: { id: "FirstName", label: "First Name", value: "", validations: [{ min: 3 }, { max: 15 }, { isRequired: true }] },
    LastName: { id: "LastName", label: "Last Name", value: "", validations: [{ min: 3 }, { max: 15 }, { isRequired: true }] },
    Password: { id: "Password", label: "Password", value: "", validations: [{ min: 3 }, { max: 20 }, { isRequired: true }] },
    ConfirmPassword: { id: "ConfirmPassword", label: "Confirm Password", value: "", validations: [{ oneOf: [ref("Password")] }, { isRequired: true }] },
    Email: { id: "Email", label: "Email", value: "", validations: [{ isRequired: true }, { isEmail: true }] },
    Address: { id: "Address", label: "Address", value: "", validations: [{ min: 3 }, { max: 25 }, { isRequired: true }] },
    ZipCode: { id: "ZipCode", label: "Zip Code", value: "", validations: [{ min: 3 }, { max: 8 }, { matches: /^[0-9]+$/ }, { isRequired: true }] },
    Country: { id: "Country", label: "Country", value: "United States", validations: [{ isRequired: true }] },
    State: { id: "State", label: "State", value: "", validations: [{ isRequired: true }] },
    City: { id: "City", label: "City", value: "" },
    Phone: { id: "Phone", label: "Phone Number", value: "", validations: [{ isRequired: true }, { matches: /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/ }] },
  }
  const [stateLoadling, setStateLoading] = useState(false)
  const [cityLoadling, setCityLoading] = useState(false)

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

  const [nextFocusedInput, setNextFocusedInput] = useState('')


  const handleOnChangeSelect = (fieldkey, value) => {
    if (fieldkey === createRegisterAction.Country.id) {
      let id = filterNametoId(COUNTRY, value)
      setCityLoading(false)
      setStateLoading(false)
      formRef.current.setFieldValue(createRegisterAction.State.id, 0)
      formRef.current.setFieldValue(createRegisterAction.City.id, 0)
      getStates(id)
    }
    if (fieldkey === createRegisterAction.State.id) {
      let id = filterNametoId(stateName, value)
      setCityLoading(false)
      formRef.current.setFieldValue(createRegisterAction.City.id, 0)
      getCity(id)
    }
    if (formRef.current) {
      formRef.current.setFieldValue(fieldkey, value)
    }
  }

  const handleFocusNext = (fieldKey) => {
    if (fieldKey) {
      setNextFocusedInput(fieldKey)
    }
  }
  const [image, setImage] = useState({
    img: { keyName: "img", value: '', error: null },
  })
  const getrouteName = () => {
    return props?.route?.name === RouteNames.AuthRoutes.SignUp
  }
  const redirection = (routeName, params) => {
    if (params) {
      return props.navigation.navigate(routeName, params)
    }
    return props.navigation.navigate(routeName)
  }
  function submitForm(values, { setErrors }) {
    if (getrouteName()) {
      setFetching(true)
      let object = {
        ...values
      }
      let finalObject = {
        first_name: object.FirstName,
        last_name: object.LastName,
        email: object.Email,
        password: object.Password,
        country: filterNametoId(COUNTRY, object.Country),
        state: filterNametoId(stateName, object.State),
        city: filterNametoId(cityName, object.City),
        phone: object.Phone,
        address: object.Address,
        zipcode: object.ZipCode,
        source_image: image?.img?.value?.base64 || "",
        latitude: Coordinate?.latitude,
        longitude: Coordinate?.longitude,
        location_name: geoLocation?.city || '',
        location_state: geoLocation?.state || '',
        location_place: geoLocation?.placeName || ''

      }
      SignUp(finalObject).then((val) => {
        setFetching(false)
        return redirection(RouteNames.AuthRoutes.Otp, { params: "SignUp" })
      }).catch((e) => {
        setFetching(false)
        console.log(e, "eeeeeeeSignUp")
      })
    }
    else {
      setFetching(false)
      return redirection(RouteNames.User.Home)
    }
  }
  // const getCountries = () => {
  //   GlobalCountriesApi().then((val) => {
  //   }).catch((e) => {
  //     console.log(e, "error in country api")
  //   })
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
    redirection(RouteNames.AuthRoutes.Login)
  }

  const { initialValues, schema } = useForm(createRegisterAction);

  return (
    countryName ?
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
            <KeyboardDismissWrapper>
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
                      isRequired={true}
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
                      nextFieldKey={'Email'}
                      isRequired={true}
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
                      nextFieldKey={'Password'}
                      isRequired={true}
                      handleFocusNext={handleFocusNext}
                      nextFocusedInput={nextFocusedInput}

                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <CustomInput
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder={'Password'}
                      touched={touched}
                      values={values}
                      fieldkey={'Password'}
                      nextFieldKey={'ConfirmPassword'}
                      showEye={true}
                      isRequired={true}
                      handleFocusNext={handleFocusNext}
                      nextFocusedInput={nextFocusedInput}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <CustomInput
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder={'Confirm Password'}
                      nextFieldKey={'Phone'}
                      touched={touched}
                      values={values}
                      fieldkey={'ConfirmPassword'}
                      showEye={true}
                      isRequired={true}
                      nextFocusedInput={nextFocusedInput}
                      handleFocusNext={handleFocusNext}

                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <CustomInput
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder={'Phone Number'}
                      touched={touched}
                      values={values}
                      fieldkey={'Phone'}
                      nextFieldKey={'Address'}
                      isRequired={true}
                      handleFocusNext={handleFocusNext}
                      nextFocusedInput={nextFocusedInput}
                      keyboardType={'phone-pad'}
                      maxLength={20}
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
                      isRequired={true}
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
                      isRequired={true}
                      handleFocusNext={handleFocusNext}
                      nextFocusedInput={nextFocusedInput}
                      keyboardType={'numeric'}
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
                      fieldkey={createRegisterAction.Country.id}
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
                      fieldkey={createRegisterAction.State.id}
                      isLabel={true}
                      textInputEditable={false}
                      borderRadius={normalizeWidth(25)}
                      selectorItems={transformStateData() ? transformStateData() : []}
                      customIcon={greyDropDownIcon}
                      disabled={!stateLoadling}
                      readOnly={!stateLoadling}
                      customIconTintColor={whiteColor}
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
                      fieldkey={createRegisterAction.City.id}
                      isLabel={true}
                      disabled={!cityLoadling}
                      readOnly={!cityLoadling}
                      textInputEditable={false}
                      borderRadius={normalizeWidth(25)}
                      selectorItems={transformCityData() ? transformCityData() : []}
                      customIcon={greyDropDownIcon}
                      customIconTintColor={whiteColor}
                      isRequired={true}
                    />
                  </View>
                </ScrollView>
                <View style={styles.sendBtn}>
                  <CustomButton onPress={handleSubmit} buttonText={getrouteName() ? 'Sign Up' : "Update"} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} loading={fetching} disabled={fetching} />
                </View>
                {
                  getrouteName() &&
                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Already have an Account</Text>
                    <TouchableOpacity onPress={() => redirection(RouteNames.AuthRoutes.Login)}>
                      <Text style={styles.signupText}>Login!</Text>
                    </TouchableOpacity>
                  </View>
                }

              </View>
            </KeyboardDismissWrapper>
          )
        }}
      </Formik>
      :
      <>
        <ActivityIndicator size={large} color={whiteColor} />
      </>
  )
}


const mapStateToProps = state => {
  return {
    countryName: state.country.countryName,
    stateName: state.country.stateName,
    cityName: state.country.cityName,
    Coordinate: state.favoriteLocation.Coordinate,
    geoLocation: state.favoriteLocation.geoLocation,
    InternetConnected: state?.InternetConnection?.internetConnected,
  }
}


const mapDispatchToProps = {
  SignUp,
  GlobalCountriesApi,
  GlobalStatesApi,
  GlobalCityApi,
  UseCurrentLocation
}


export default connect(mapStateToProps, mapDispatchToProps)(autoScrollHOC(FadeInView(Register)))

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: primaryColor, padding: normalizeWidth(20), marginBottom: Platform.OS === 'ios' ? normalizeHeight(20) : 0 },
  inputContainer: { marginBottom: normalizeWidth(20) },
  inputCustomSelectorContainer: { marginBottom: normalizeWidth(5) },
  sendBtn: { marginHorizontal: normalizeWidth(40), marginVertical: normalizeWidth(10) },
  logo: { width: normalizeWidth(250), height: normalizeHeight(100) },
  logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(10) },
  iconContainer: { width: '10%' },
  signupContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  signupText: { color: whiteColor, fontSize: fontH2V2, fontFamily: fontFamily.Primary.Medium },
  img: { width: normalizeWidth(25), height: normalizeWidth(25) },
  imageContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(20) },
  image: { width: normalizeWidth(100), height: normalizeWidth(100), borderRadius: normalizeWidth(50), backgroundColor: whiteColor }
})
