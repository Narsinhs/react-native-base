import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { buttonColorYellow, fontFamily, fontH2, greyedSchemeColor, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles'
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil'
import CustomButton from '../shared/CustomButton'
import { RouteNames } from '../../constants/RouteNames';
import CustomInput from '../shared/CustomInput';
import { useForm } from '../../hooks/useForm';
import { Formik } from "formik";
import autoScrollHOC from '../../hoc/AutoInputScrollHOC'
import { ContactFormApi } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyboardDismissWrapper from '../../components/sharedComponents/KeyboardDismissWrapper'
import { registerToastMessage } from '../../utils/RegisterToast'
const Contact = (props) => {
    const { ContactFormApi, user, InternetConnected } = props
    const [loading, setLoading] = useState(false)
    let createContactAction = {
        FirstName: { id: "FirstName", label: "First Name", value: user?.personal?.first_name, validations: [{ min: 3 }, { max: 8 }, { isRequired: true }] },
        Email: { id: "Email", label: "Email", value: user?.personal?.email, validations: [{ isRequired: true }, { isEmail: true }] },
        Subject: { id: "Subject", label: "Subject", value: '', validations: [{ min: 3 }, { max: 10 }, { isRequired: true }] },
        Note: { id: "Note", label: "Note", value: "", validations: [{ min: 5 }, { isRequired: true }] },
        Phone: { id: "Phone", label: "Phone", value: user?.personal?.phone || "", validations: [{ matches: /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/ }, { isRequired: true }] },

    }
    const redirection = (routeName, params) => {
        if (params) {
            return props.navigation.navigate(routeName, params)
        }
        return props.navigation.navigate(routeName)
    }

    function submitForm(values, { setErrors }) {
        setLoading(true)
        let prepareObj = {
            ...values
        }
        let finalObject = {
            name: prepareObj.FirstName,
            email: prepareObj.Email,
            phone: prepareObj.Phone,
            subject: prepareObj.Subject,
            message: prepareObj.Note,
        }
        ContactFormApi(finalObject).then((val) => {
            setLoading(false)
            return redirection(RouteNames.User.Home)
        }).catch((e) => {
            setLoading(false)
            console.log(e, "eeeeeeeeContactFormApi")
        })
    }
    const { initialValues, schema } = useForm(createContactAction);
    return (
        <KeyboardDismissWrapper>
            <View style={{ flex: 1, backgroundColor: whiteColor, padding: normalizeWidth(20) }}>
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
                            <View style={{ flex: 1, }}>
                                <View style={{ marginBottom: normalizeWidth(30), alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: primaryColor, fontSize: fontH2, fontFamily: fontFamily.Primary.SemiBold }}>Contact Us</Text>
                                </View>
                                <View style={styles.inputContainer}>
                                    <View style={styles.inputContainer}>
                                        <CustomInput
                                            errors={errors}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            placeholder={'First Name'}
                                            touched={touched}
                                            values={values}
                                            fieldkey={'FirstName'}
                                            borderColor={greyedSchemeColor}
                                            selectionColor={greyedSchemeColor}
                                            borderRadius={normalizeWidth(10)}
                                            textInputEditable={false}
                                            placeholderTextColor={greyedSchemeColor}
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
                                            selectionColor={greyedSchemeColor}
                                            borderColor={greyedSchemeColor}
                                            borderRadius={normalizeWidth(10)}
                                            textInputEditable={false}
                                            placeholderTextColor={greyedSchemeColor}

                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <CustomInput
                                            errors={errors}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            placeholder={'Subject'}
                                            touched={touched}
                                            values={values}
                                            fieldkey={'Subject'}
                                            selectionColor={greyedSchemeColor}
                                            borderColor={greyedSchemeColor}
                                            borderRadius={normalizeWidth(10)}
                                            placeholderTextColor={greyedSchemeColor}

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
                                            selectionColor={greyedSchemeColor}
                                            borderColor={greyedSchemeColor}
                                            borderRadius={normalizeWidth(10)}
                                            placeholderTextColor={greyedSchemeColor}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <CustomInput
                                            errors={errors}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            placeholder={'Type your message here'}
                                            touched={touched}
                                            values={values}
                                            fieldkey={'Note'}
                                            borderColor={greyedSchemeColor}
                                            borderRadius={normalizeWidth(10)}
                                            selectionColor={greyedSchemeColor}
                                            multiline={true}
                                            placeholderTextColor={greyedSchemeColor}

                                        />
                                    </View>
                                </View>
                                {
                                    InternetConnected ?
                                        <View style={{ marginHorizontal: normalizeWidth(40) }}>
                                            <CustomButton onPress={handleSubmit} buttonText={'Submit'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} disabled={loading} loading={loading} />
                                        </View>
                                        :
                                        <View style={{ marginHorizontal: normalizeWidth(40) }}>
                                            <CustomButton onPress={() => console.log("Offline Mode")} height={normalizeHeight(60)} buttonText={'This feature is not available in offline mode.'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} disabled={true} />
                                        </View>
                                }
                            </View>
                        )
                    }}
                </Formik>
            </View>
        </KeyboardDismissWrapper>
    )
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        InternetConnected: state?.InternetConnection?.internetConnected
    }
}
const mapDispatchToProps = {
    ContactFormApi
}
export default connect(mapStateToProps, mapDispatchToProps)(autoScrollHOC(Contact, 'white'))
const styles = StyleSheet.create({
    inputContainer: { marginBottom: normalizeWidth(20) },
})
