import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { RouteNames } from '../../constants/RouteNames';
import { useForm } from '../../hooks/useForm';
import CustomInput from '../shared/CustomInput';
import { Formik } from "formik";
import { buttonColorYellow, draftColor, fontFamily, fontH1, fontH2V2, greyedSchemeColor, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles';
import { logo, whiteTailLogo } from '../../assets/images';
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
import CustomButton from '../shared/CustomButton';
import { loginApi, googleLoginApi, UseCurrentLocation } from '../../redux/actions/index';
import { connect } from 'react-redux';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../../constants/Enum';
import { getFCMToken } from '../../utils/TokenUtil';
import { AUTH_STATUS } from '../../constants/constants';
import KeyboardDismissWrapper from '../../components/sharedComponents/KeyboardDismissWrapper';
import { registerToastMessage } from '../../utils/RegisterToast';
import {
  WheelPicker,
} from "../../modules/react-native-wheel-picker-android";

const wheelPickerData = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday"
];

const Login = (props) => {
  const [selectedItem, setSelectedItem] = useState(0)
  const { loginApi, deviceId, deviceName, googleLoginApi, UseCurrentLocation, Coordinate, geoLocation, } = props;
  const [loading, setloading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false)
  const [screen, setScreen] = useState(props?.route?.params?.screen || "")
  useEffect(() => {
    handleGeoLocation()
  }, [])
  const handleGeoLocation = () => {
    UseCurrentLocation().then((val) => {
    }).catch((e) => {
      console.log(e, "eeeehandleGeoLocation")
    })
  }
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    }, []);
  })
  useEffect(() => {
    if (props?.route?.params?.screen) {
      setScreen(props?.route?.params?.screen)
    }

  }, [props?.route])
  const handleSignUp = () => {
    setScreen("")
    redirection(RouteNames.AuthRoutes.SignUp)
  }
  const handleForgot = () => {
    setScreen("")
    redirection(RouteNames.AuthRoutes.Forgot)
  }
  const redirection = (routeName, params) => {
    if (params) {
      return props.navigation.navigate(routeName, params)
    }
    return props.navigation.navigate(routeName)
  }
  let createLoginAction = {
    Email: { id: "Email", label: "Email", value: "", validations: [{ min: 3 }, { isRequired: true }, { isEmail: true }] },
    Password: { id: "Password", label: "Password", value: "", validations: [{ min: 3 }, { max: 20 }, { isRequired: true }] },
  }
  async function submitForm(values, { setErrors }) {
    //api hit
    setloading(true)
    let fcm_token = await getFCMToken();
    let prepareObject = {
      ...values
    }
    if (fcm_token) {
      let obj = {
        email: prepareObject.Email,
        password: prepareObject.Password,
        device_id: deviceId,
        device_name: deviceName,
        fcm_token: fcm_token
      }
      handleLogin(obj)
    }
    else {
      setloading(false)
    }
  }

  const handleLogin = (obj) => {
    loginApi(obj).then((val) => {
      if (val.auth_status === AUTH_STATUS.NOT_VERIFIED) {
        setloading(false)
        redirection(RouteNames.AuthRoutes.Otp, { params: "login" })
      }
      else if (!val?.personal?.is_subscribed) {
        redirection(RouteNames.AuthRoutes.Subscription)
      }
      else {
        setloading(false)
      }
    }).catch((e) => {
      setloading(false)
      console.log(e, "eeeloginApi")
    })
  }

  const handleGoogle = (obj) => {
    googleLoginApi(obj).then((val) => {
      if (val.auth_status === AUTH_STATUS.NOT_VERIFIED) {
        setGoogleLoading(false)
        redirection(RouteNames.AuthRoutes.Otp, { params: "login" })
      }
      else if (!val?.personal?.is_subscribed) {
        redirection(RouteNames.AuthRoutes.Subscription)
      }
      else {
        setGoogleLoading(false)
      }
    }).catch((e) => {
      setGoogleLoading(false)
      console.log(e, "ERROR GOOGLE LOGIN API")
    })
  }

  const handleGmailSignIn = async () => {
    try {
      setGoogleLoading(true)
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let fcm_token = await getFCMToken();
      if (fcm_token) {
        let obj = {
          user: { ...userInfo.user },
          device_id: deviceId,
          device_name: deviceName,
          fcm_token: fcm_token,
          latitude: Coordinate?.latitude,
          longitude: Coordinate?.longitude,
          location_name: geoLocation?.city || '',
          location_state: geoLocation?.state || '',
          location_place: geoLocation?.placeName || ''
        }
        handleGoogle(obj)
      } else {
        setGoogleLoading(false)
      }
    } catch (error) {
      setGoogleLoading(false)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
        console.log("errorhandleGmailSignIn", error)
      }
    }
  }
  const onItemSelected = selectedItem => {
    setSelectedItem(selectedItem)
  }

  // return (
  //   <WheelPicker
  //     selectedItem={selectedItem}
  //     data={wheelPickerData}
  //     onItemSelected={onItemSelected}
  //   />
  // )

  const { initialValues, schema } = useForm(createLoginAction);
  return (
    <Formik
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
              <Animatable.View animation={screen === "Register" ? "fadeInDown" : ""} style={styles.logoContainer}>
                <Image source={whiteTailLogo} resizeMode={'contain'} style={styles.logo} />
              </Animatable.View>
              <ScrollView style={styles.scrollContainer}>
                <Animatable.View animation={screen === "GetStartedScreen" ? "fadeInUpBig" : ""}>
                  <View style={styles.headingContainer}>
                    <Text style={styles.container}>7-Day Free Trail !</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <CustomInput
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder={'Email Address'}
                      touched={touched}
                      values={values}
                      fieldkey={'Email'}
                    // keyboardType={'email-address'}
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
                      showEye={true}
                    />
                  </View>
                  <TouchableOpacity style={styles.forgotContainer} onPress={() => handleForgot()}>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                  </TouchableOpacity>
                  <Animatable.View animation={screen === "Register" ? "fadeInUpBig" : ""} style={styles.loginBtn}>
                    <CustomButton onPress={() => handleSubmit()} buttonText={'Login'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} disabled={loading || googleLoading} loading={loading} />
                  </Animatable.View>
                  <View style={styles.textBetweenContainer}>
                    <View style={styles.textBetweenLine} />
                    <View>
                      <Text style={styles.textBetweenText}>OR</Text>
                    </View>
                    <View style={styles.textBetweenLine} />
                  </View>
                  <View style={styles.gmailBtn}>
                    <CustomButton loading={googleLoading} disabled={googleLoading} onPress={handleGmailSignIn} buttonText={'Login with Gmail'} buttonColor={draftColor} buttonTextColor={whiteColor} borderRadius={normalizeWidth(30)} bordercolor={draftColor} />
                  </View>
                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an Account</Text>
                    <TouchableOpacity onPress={() => handleSignUp()}>
                      <Text style={styles.signupText}>Sign Up!</Text>
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              </ScrollView>
            </View>
          </KeyboardDismissWrapper>
        )
      }}
    </Formik>
  )
}

const mapStateToProps = state => {
  return {
    deviceId: state.device.deviceId,
    deviceName: state.device.deviceName,
    Coordinate: state.favoriteLocation.Coordinate,
    geoLocation: state.favoriteLocation.geoLocation,
  }
}

const mapDispatchToProps = {
  loginApi,
  googleLoginApi,
  UseCurrentLocation
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: primaryColor },
  logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(30) },
  logo: { width: normalizeWidth(250), height: normalizeHeight(150) },
  scrollContainer: { marginHorizontal: normalizeWidth(20) },
  headingContainer: { marginBottom: normalizeWidth(30) },
  container: { color: whiteColor, fontSize: fontH1, textAlign: 'center', fontFamily: fontFamily.Primary.Medium },
  inputContainer: { marginBottom: normalizeWidth(20) },
  forgotContainer: { marginBottom: normalizeWidth(30) },
  forgot: { color: whiteColor, fontSize: fontH2V2, textAlign: 'center', fontFamily: fontFamily.Primary.Medium },
  loginBtn: { marginHorizontal: normalizeWidth(30), marginBottom: normalizeWidth(30) },
  textBetweenContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: normalizeWidth(30) },
  textBetweenLine: { flex: 1, height: 1, backgroundColor: greyedSchemeColor },
  textBetweenText: { width: normalizeWidth(40), textAlign: 'center', color: whiteColor, fontSize: fontH2V2, fontFamily: fontFamily.Primary.Medium },
  gmailBtn: { marginHorizontal: normalizeWidth(30), marginBottom: normalizeWidth(40) },
  signupContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  signupText: { color: whiteColor, fontSize: fontH2V2, fontFamily: fontFamily.Primary.Medium }
})
