import { faAngleLeft, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useEffect, useRef } from 'react'
import { useCallback } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { blackDear, cardIcon, logo, main_logo_icon, whiteTailLogo } from '../../../assets/images'
import { buttonColorYellow, fontFamily, fontH1, fontH2, greyedSchemeColor, headingTextBlackColor, primaryColor } from '../../../constants/Styles'
import { useForm } from '../../../hooks/useForm'
import { deviceWidth, normalizeFont, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../../utils/FontUtil'
import CustomButton from '../../shared/CustomButton'
import { Formik } from 'formik'
import CustomInput from '../../shared/CustomInput'
import useAndroidResize from '../../../hooks/useAndroidResize'
import CustomCreditCardInput from '../../shared/CustomCreditCardInput'
import KeyboardDismissWrapper from '../../../components/sharedComponents/KeyboardDismissWrapper'
import autoScrollHOC from '../../../hoc/AutoInputScrollHOC'
import BackButtonHeader from '../../shared/BackButtonHeader'
const CardDetails = (props) => {
    useAndroidResize()
    const formRef = useRef()
    let cardDetailsForm = {
        NameOnCard: { id: "NameOnCard", label: "Name On Card", value: "", validations: [{ isRequired: true }] },
        CardNumber: { id: "CardNumber", label: "Card Number", value: "", validations: [{ isRequired: true }] },
        Expiry: { id: "Expiry", label: "Valid till MM/YY", value: "", validations: [{ isRequired: true }] },
        CVV: { id: "CVV", label: "CVV", value: "", validations: [{ isRequired: true }] },
    }
    const { initialValues, schema } = useForm(cardDetailsForm);



    const setFormValues = (fieldkey, value) => {
        formRef.current.setFieldValue(fieldkey, value)
    }

    const onChangeCreditCardInfo = (form) => {
        setFormValues(cardDetailsForm.CardNumber.id, form?.values?.number)
        setFormValues(cardDetailsForm.Expiry.id, form?.values?.expiry)
        setFormValues(cardDetailsForm.CVV.id, form?.values?.cvc)
    }

    const handleSubmit = (values) => {
    }

    const handleBackButtonPress = () => {
        return props.navigation.goBack()
    }
    return (
        <ScrollView  >
            <View style={{ flex: 1, backgroundColor: primaryColor, marginTop: normalizeHeight(20) }}>
                <View style={{ flex: 1, marginHorizontal: normalizeWidth(15) }}>
                    <BackButtonHeader handleBackButtonPress={handleBackButtonPress}/>
                    <Text style={{ color: 'white', fontFamily: fontFamily.Primary.Medium, fontSize: normalizeFont(20), marginTop: normalizeHeight(15), textAlign: 'center' }}>Card Details</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        validationSchema={schema}
                        onSubmit={handleSubmit}
                    >
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
                                <View style={{ paddingHorizontal: normalizeWidth(20) }}>
                                    <View style={{ marginBottom: normalizeHeight(20) }}>
                                        <CustomInput
                                            errors={errors}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            placeholder={cardDetailsForm.NameOnCard.label}
                                            touched={touched}
                                            values={values}
                                            isLabel={true}
                                            borderRadius={normalizeWidth(10)}
                                            customIcon={cardIcon}
                                            customIconSize={normalizeWithScale(20)}
                                            customeIconWidth={normalizeWithScale(25)}
                                            fieldkey={cardDetailsForm.NameOnCard.id}
                                            customStyles={{ borderRadius: normalizeWidth(20) }}
                                        />
                                    </View>
                                    <CustomCreditCardInput
                                        onChangeCreditCardInfo={onChangeCreditCardInfo}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </View>
                            )
                        }}
                    </Formik>

                </View>
                <View style={{ alignItems: 'center', width: '80%', alignSelf: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#FFFFFF21' }}>
                    <View style={{ width: "75%", paddingVertical: normalizeHeight(15) }}>
                        <CustomButton buttonText="Pay Now" buttonColor={buttonColorYellow} onPress={() => formRef.current.handleSubmit()} buttonTextColor={headingTextBlackColor} customTextStyles={{ fontFamily: fontFamily.Primary.SemiBold }} />
                    </View>
                </View>
            </View>
        </ScrollView >
    )
}

export default autoScrollHOC(CardDetails)

const styles = StyleSheet.create({

})
