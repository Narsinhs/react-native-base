import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useForm } from '../../hooks/useForm';
import { Formik } from "formik";
import { buttonColorYellow, fontFamily, fontH2V2, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles';
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil';
import CustomInput from '../shared/CustomInput';
import CustomButton from '../shared/CustomButton';
import { backIcon, blackDear, logo } from '../../assets/images';
import FadeInView from '../../hoc/FadeInHoc';
import { OtpVerification, OtpResendCode, FreeSubscription } from '../../redux/actions/index';
import { connect } from 'react-redux';
import { RouteNames } from '../../constants/RouteNames';
import { getFCMToken } from '../../utils/TokenUtil';
import BackButtonHeader from '../shared/BackButtonHeader';
import KeyboardDismissWrapper from '../../components/sharedComponents/KeyboardDismissWrapper';


const Otp = (props) => {
    const { OtpVerification, user, deviceId, deviceName, OtpResendCode, FreeSubscription } = props
    const { params, isEmail } = props?.route?.params

    const [submitfetching, setSubmitFetching] = useState(false)
    const [resendfetching, setResendFetching] = useState(false)
    let createForgotAction = {
        OTP_KEY: { id: "OTP_KEY", label: "OTP KEY", value: "", validations: [{ matches: /^[0-9]+$/ }, { length: 6 }, { isRequired: true }] }
    }
    const redirection = (routeName) => {
        props.navigation.navigate(routeName)
    }
    const handleResendVerify = () => {
        setResendFetching(true)
        let email = user?.personal?.email || isEmail
        OtpResendCode(email).then((val) => {
            setResendFetching(false)
        }).catch(() => {
            setResendFetching(false)
            console.log(e, "error in resend code")
        })
    }
    async function submitForm(values, { setErrors }) {
        setSubmitFetching(true)
        let fcmToken = await getFCMToken()
        let prepareObject = {
            ...values
        }
        if (fcmToken) {
            let finalObject = {
                email: user?.personal?.email || isEmail,
                verify_code: prepareObject.OTP_KEY,
                device_id: deviceId,
                device_name: deviceName,
                fcm_token: fcmToken
            }
            OtpVerification(finalObject).then((val) => {
                setSubmitFetching(false)
                if (params && params === "ForgotPassword") {
                    return redirection(RouteNames.AuthRoutes.ChangePassword, { params: finalObject.verify_code })
                }
                else {
                    redirection(RouteNames.AuthRoutes.Subscription)
                }
            }).catch((e) => {
                setSubmitFetching(false)
                console.log(e, "error OtpVerification")
            })
        }
        else {
            setSubmitFetching(false)
        }

    }

    const handleBackButtonPress = () => {
        redirection(RouteNames.AuthRoutes.Login)
    }
    const { initialValues, schema } = useForm(createForgotAction);
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
                    // <KeyboardDismissWrapper>
                    <ScrollView style={styles.mainContainer}>
                        <BackButtonHeader handleBackButtonPress={handleBackButtonPress} />
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`Enter 6 digit OTP sent on your registered Phone Number or Email Address.`}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <CustomInput
                                errors={errors}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                placeholder={'OTP'}
                                touched={touched}
                                values={values}
                                fieldkey={'OTP_KEY'}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View style={styles.sendBtn}>
                            <View style={{ width: '45%' }}>
                                <CustomButton onPress={() => handleResendVerify()} buttonText={'Resend'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} loading={resendfetching} disabled={resendfetching} />
                            </View>
                            <View style={{ width: '45%' }}>
                                <CustomButton onPress={handleSubmit} buttonText={'Submit'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} loading={submitfetching} disabled={submitfetching} />
                            </View>
                        </View>
                    </ScrollView >
                    // </KeyboardDismissWrapper>
                )
            }}
        </Formik>
    )
}
const mapStateToProps = state => {
    return {
        user: state.auth.user,
        deviceId: state.device.deviceId,
        deviceName: state.device.deviceName,
    }
}

const mapDispatchToProps = {
    OtpVerification,
    OtpResendCode,
    FreeSubscription
}

export default connect(mapStateToProps, mapDispatchToProps)(FadeInView(Otp))

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: primaryColor, padding: normalizeWidth(20) },
    text: { color: whiteColor, fontSize: fontH2V2, textAlign: 'center', fontFamily: fontFamily.Primary.Regular },
    textContainer: { marginBottom: normalizeWidth(30), marginTop: normalizeHeight(25) },
    inputContainer: { marginBottom: normalizeWidth(60) },
    sendBtn: { marginHorizontal: normalizeWidth(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    logo: { width: normalizeWidth(250), height: normalizeHeight(150) },
    logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(30) },
    iconContainer: { width: '10%' },
    img: { width: normalizeWidth(25), height: normalizeWidth(25) },
})
