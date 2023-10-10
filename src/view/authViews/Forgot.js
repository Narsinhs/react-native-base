import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { useForm } from '../../hooks/useForm';
import { Formik } from "formik";
import { buttonColorYellow, fontFamily, fontH2V2, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles';
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil';
import CustomInput from '../shared/CustomInput';
import CustomButton from '../shared/CustomButton';
import { backIcon, blackDear, logo } from '../../assets/images';
import FadeInView from '../../hoc/FadeInHoc';
import { RouteNames } from '../../constants/RouteNames';
import BackButtonHeader from '../shared/BackButtonHeader';
import { ForgotPassword } from '../../redux/actions/AuthAction';
import { connect } from 'react-redux';
import KeyboardDismissWrapper from "../../components/sharedComponents/KeyboardDismissWrapper"
const Forgot = (props) => {
    const { ForgotPassword } = props
    let createForgotAction = {
        Email: { id: "Email", label: "Email", value: "", validations: [{ min: 3 }, { isRequired: true }, { isEmail: true }] }
    }
    const [fetching, setFetching] = useState(false)
    const redirection = (routeName, params) => {
        props.navigation.navigate(routeName, params)
    }
    function submitForm(values, { setErrors }) {
        setFetching(true)
        let obj = {
            email: values.Email
        }
        ForgotPassword(obj).then((val) => {
            setFetching(false)
             redirection(RouteNames.AuthRoutes.ResetCode)
        }).catch((e) => {
            setFetching(false)
            console.log(e, "eeeeeeForgotPassword")
        })
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
                    <KeyboardDismissWrapper>

                        <View style={styles.mainContainer}>
                            <BackButtonHeader handleBackButtonPress={handleBackButtonPress} />
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>{`To reset password, enter your email, press the "Send" button and check email to follow instruction.`}</Text>
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
                                />
                            </View>
                            <View style={styles.sendBtn}>
                                <CustomButton onPress={handleSubmit} buttonText={'Send'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} disabled={fetching} loading={fetching} />
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
    }
}

const mapDispatchToProps = {
    ForgotPassword
}

export default connect(mapStateToProps, mapDispatchToProps)(FadeInView(Forgot))

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: primaryColor, padding: normalizeWidth(20) },
    text: { color: whiteColor, fontSize: fontH2V2, textAlign: 'center', fontFamily: fontFamily.Primary.Regular },
    textContainer: { marginVertical: normalizeWidth(30), },
    inputContainer: { marginBottom: normalizeWidth(60) },
    sendBtn: { marginHorizontal: normalizeWidth(40) },
    logo: { width: normalizeWidth(250), height: normalizeHeight(150) },
    logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(30) },
    iconContainer: { width: '10%' },
    img: { width: normalizeWidth(25), height: normalizeWidth(25) },
})
