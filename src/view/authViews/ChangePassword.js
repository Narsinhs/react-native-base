import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { useForm } from '../../hooks/useForm';
import { Formik } from "formik";
import { buttonColorYellow, fontH2V2, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles';
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil';
import CustomInput from '../shared/CustomInput';
import CustomButton from '../shared/CustomButton';
import { backIcon, blackDear, logo } from '../../assets/images';
import FadeInView from '../../hoc/FadeInHoc';
import { RouteNames } from '../../constants/RouteNames';
import { ref } from "yup";
import { ChangePasswordApi } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyboardDismissWrapper from '../../components/sharedComponents/KeyboardDismissWrapper';
import BackButtonHeader from '../shared/BackButtonHeader';
import { registerToastMessage } from '../../utils/RegisterToast';
const ChangePassword = (props) => {
    const { resetCode, ChangePasswordApi, InternetConnected } = props
    let createForgotAction = {
        Password: { id: "Password", label: "Password", value: "", validations: [{ min: 3 }, { max: 20 }, { isRequired: true }] },
        ConfirmPassword: { id: "Confirm Password", label: "Confirm Password", value: "", validations: [{ oneOf: [ref("Password")] }, { isRequired: true }] },
    }
    const [fetching, setFetching] = useState(false)
    const [nextFocusedInput, setNextFocusedInput] = useState('')
    const handleFocusNext = (fieldKey) => {
        if (fieldKey) {
            setNextFocusedInput(fieldKey)
        }
    }
    const redirection = (routeName) => {
        props.navigation.navigate(routeName)
    }
    function submitForm(values, { setErrors }) {
        setFetching(true)
        let prepareObject = {
            reset_code: resetCode,
            new_password: values.Password
        }
        ChangePasswordApi(prepareObject).then((val) => {
            setFetching(false)
            redirection(RouteNames.AuthRoutes.Login)
        }).catch((e) => {
            setFetching(false)
            console.log(e, "errors ChangePassword")
        })

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
                    <KeyboardDismissWrapper>
                        <View style={styles.mainContainer}>
                            <BackButtonHeader handleBackButtonPress={handleBackButtonPress} />
                            <View style={{ ...styles.inputContainer, marginTop: normalizeHeight(25) }}>
                                <View style={styles.inputContainer}>
                                    <CustomInput
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        placeholder={'New Password'}
                                        touched={touched}
                                        values={values}
                                        fieldkey={'Password'}
                                        showEye={true}
                                        nextFieldKey={'Confirm Password'}
                                        handleFocusNext={handleFocusNext}
                                        nextFocusedInput={nextFocusedInput}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <CustomInput
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        placeholder={'Confirm New Password'}
                                        touched={touched}
                                        values={values}
                                        fieldkey={'Confirm Password'}
                                        showEye={true}
                                    />
                                </View>
                            </View>
                            <View style={styles.sendBtn}>
                                <CustomButton onPress={handleSubmit} buttonText={'Update'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} loading={fetching} disabled={fetching} />
                            </View>
                        </View>
                    </KeyboardDismissWrapper>
                )
            }}
        </Formik>
    )
}

const mapStateToProps = state => {
    return {
        resetCode: state.auth.resetCode,

    }
}

const mapDispatchToProps = {
    ChangePasswordApi
}

export default connect(mapStateToProps, mapDispatchToProps)(FadeInView(ChangePassword))
const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: primaryColor, padding: normalizeWidth(20) },
    inputContainer: { marginBottom: normalizeWidth(20) },
    sendBtn: { marginHorizontal: normalizeWidth(40) },
    logo: { width: normalizeWidth(250), height: normalizeHeight(150) },
    logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(30) },
    iconContainer: { width: '10%' },
    img: { width: normalizeWidth(25), height: normalizeWidth(25) },
})
