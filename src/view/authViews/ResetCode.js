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


const ResetCode = (props) => {
    const { resetCode } = props
    let createForgotAction = {
        Code: { id: "Code", label: "Reset Code", value: "", validations: [{ matches: resetCode }, { isRequired: true }] }
    }
    const redirection = (routeName) => {
        props.navigation.navigate(routeName)
    }
    async function submitForm(values, { setErrors }) {
        return redirection(RouteNames.AuthRoutes.ChangePassword)
    }

    const handleBackButtonPress = () => {
        redirection(RouteNames.AuthRoutes.Forgot)
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
                            <Text style={styles.text}>{`Enter the 6 digit Reset code sent on your registered Email Address`}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <CustomInput
                                errors={errors}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                placeholder={'Reset Code'}
                                touched={touched}
                                values={values}
                                fieldkey={'Code'}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View style={styles.sendBtn}>
                                <CustomButton onPress={handleSubmit} buttonText={'Submit'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} />
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
        resetCode:state.auth.resetCode
    }
}

const mapDispatchToProps = {
    OtpVerification,
    OtpResendCode,
    FreeSubscription
}

export default connect(mapStateToProps, mapDispatchToProps)(FadeInView(ResetCode))

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: primaryColor, padding: normalizeWidth(20) },
    text: { color: whiteColor, fontSize: fontH2V2, textAlign: 'center', fontFamily: fontFamily.Primary.Regular },
    textContainer: { marginBottom: normalizeWidth(30), marginTop: normalizeHeight(25) },
    inputContainer: { marginBottom: normalizeWidth(60) },
    sendBtn: { marginHorizontal: normalizeWidth(50) },
    logo: { width: normalizeWidth(250), height: normalizeHeight(150) },
    logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(30) },
    iconContainer: { width: '10%' },
    img: { width: normalizeWidth(25), height: normalizeWidth(25) },
})
