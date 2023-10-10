import React, { useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { useForm } from '../../hooks/useForm';
import { Formik } from "formik";
import { buttonColorYellow, headingTextBlackColor, primaryColor } from '../../constants/Styles';
import { normalizeHeight, normalizeWidth, } from '../../utils/FontUtil';
import CustomInput from '../shared/CustomInput';
import CustomButton from '../shared/CustomButton';
import { RouteNames } from '../../constants/RouteNames';
import { ref } from "yup";
import BackButtonHeader from '../shared/BackButtonHeader';
import { UserChangePassword } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyboardDismissWrapper from '../../components/sharedComponents/KeyboardDismissWrapper';
const ChangePasswordDrawer = (props) => {
    const { UserChangePassword, InternetConnected } = props
    const [loading, setLoading] = useState(false)
    let createForgotAction = {
        OldPassword: { id: "OldPassword", label: "Old Password", value: "", validations: [{ min: 3 }, { isRequired: true }] },
        NewPassword: { id: "NewPassword", label: "New Password", value: "", validations: [{ min: 3 }, { isRequired: true }, { notOneOf: [ref("OldPassword")] }] },
        ConfirmPassword: { id: "ConfirmPassword", label: "Confirm Password", value: "", validations: [{ oneOf: [ref("NewPassword")] }, { isRequired: true }] },
    }
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
        setLoading(true)
        let obj = {
            ...values
        }
        let finalObject = {
            old_password: obj.OldPassword,
            new_password: obj.NewPassword
        }
        UserChangePassword(finalObject).then((val) => {
            setLoading(false)
            return redirection(RouteNames.User.Home)
        }).catch((e) => {
            setLoading(false)
            console.log(e, "eeeeeeUserChangePassword")
        })
    }
    const { initialValues, schema } = useForm(createForgotAction);
    const handleBackButtonPress = () => {
        return props.navigation.goBack()
    }
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
                            <View style={styles.inputContainer}>
                                <View style={styles.spacexxVertically}>
                                </View>
                                <View style={styles.inputContainer}>
                                    <CustomInput
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        placeholder={'Old Password'}
                                        touched={touched}
                                        values={values}
                                        fieldkey={'OldPassword'}
                                        showEye={true}
                                        nextFieldKey={'NewPassword'}
                                        handleFocusNext={handleFocusNext}
                                        nextFocusedInput={nextFocusedInput}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <CustomInput
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        placeholder={'New Password'}
                                        touched={touched}
                                        values={values}
                                        fieldkey={'NewPassword'}
                                        showEye={true}
                                        nextFieldKey={'ConfirmPassword'}
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
                                        fieldkey={'ConfirmPassword'}
                                        showEye={true}
                                        nextFieldKey={'OldPassword'}
                                        handleFocusNext={handleFocusNext}
                                        nextFocusedInput={nextFocusedInput}
                                    />
                                </View>
                            </View>
                            {
                                InternetConnected ?
                                    <View style={styles.sendBtn}>
                                        <CustomButton onPress={handleSubmit} buttonText={'Update'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} loading={loading} disabled={loading} />
                                    </View>
                                    :
                                    <View style={styles.sendBtn}>
                                        <CustomButton onPress={() => console.log("Offline Mode")} height={normalizeHeight(60)} buttonText={'This feature is not available in offline mode.'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} disabled={true} />
                                    </View>
                            }
                        </View>
                    </KeyboardDismissWrapper>
                )
            }}
        </Formik>
    )
}

const mapStateToProps = state => {
    return {
        InternetConnected: state?.InternetConnection?.internetConnected
    }
}
const mapDispatchToProps = {
    UserChangePassword
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordDrawer)
const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: primaryColor, padding: normalizeWidth(20) },
    inputContainer: { marginBottom: normalizeWidth(20) },
    sendBtn: { marginHorizontal: normalizeWidth(40) },
    logo: { width: normalizeWidth(250), height: normalizeHeight(150) },
    logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(30) },
    iconContainer: { width: '10%' },
    img: { width: normalizeWidth(25), height: normalizeWidth(25) },
    spacexxVertically: { marginVertical: normalizeHeight(40) },

})
