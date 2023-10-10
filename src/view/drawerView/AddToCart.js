import { Formik } from 'formik'
import React from 'react'
import { Image, StyleSheet, Text, ScrollView, TouchableOpacity, View } from 'react-native'
import { backIcon, blackDear, promoIcon, whiteTailLogo } from '../../assets/images'
import { DummyAddToCartData } from '../../constants/constants'
import { buttonColorYellow, fontFamily, fontH1, fontH2, fontH20, fontH2V2, fontH2V3, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles'
import { useForm } from '../../hooks/useForm'
import { deviceWidth, normalizeHeight, normalizeWidth } from '../../utils/FontUtil'
import BackButtonHeader from '../shared/BackButtonHeader'
import CustomButton from '../shared/CustomButton'
import CustomInput from '../shared/CustomInput'


const AddToCart = (props) => {
    function submitForm(values, { setErrors }) {
        //api hit
    }
    let enterPromoCodeAction = {
        PromoCode: { id: "PromoCode", label: "Enter Promo Code", value: "", validations: [{ min: 3 }, { max: 8 }] },
    }
    const { initialValues, schema } = useForm(enterPromoCodeAction);
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
                    <View style={styles.mainContainer}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.iconContainer}>
                                <Image source={backIcon} style={styles.img} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <Image source={blackDear} style={styles.img} resizeMode={'contain'} />
                        </View>
                        <View style={styles.logoContainer}>
                            <Image source={whiteTailLogo} resizeMode={'contain'} style={styles.logo} />
                        </View>
                        <ScrollView>

                            <View style={styles.mainContainerColumn}>
                                <Text style={styles.titleTextCart}>
                                    Cart
                                </Text>
                                <View style={styles.spacexxVertically}>
                                </View>
                                <View style={styles.inputContainer}>
                                    <View style={styles.subTitleRow}>
                                        <Text style={styles.tvSubscription}>
                                            Subscription
                                        </Text>
                                        <Text style={styles.tvAmount}>
                                            Amount
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.tvBottomHorizontalDivider} />
                                <View style={styles.spacexxVertically}>
                                </View>
                                <View style={styles.inputContainer}>
                                    <View style={styles.subTitleRow}>
                                        <Text style={styles.tvSubscription}>
                                            Monthly Paid{"\n"}
                                            Subscription
                                        </Text>
                                        <Text style={styles.tvAmount}>
                                            {/* $ 9.99 */}
                                            {DummyAddToCartData.cart.monthlyPaidSubscriptionAmount}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.spacexxVertically}>
                                </View>
                                <View style={styles.tvBottomHorizontalDivider} />
                                <View style={styles.spacexVertically}>
                                </View>
                                <View style={styles.inputContainer}>
                                    <View style={styles.subTitleRow}>
                                        <Text style={styles.tvSubTotal}>
                                            Sub Total
                                        </Text>
                                        <Text style={styles.tvSubTotalAmount}>
                                            {DummyAddToCartData.cart.subTotal}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.spacexVertically}>
                                </View>
                                <View style={styles.customInputContainer}>
                                    <CustomInput
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        placeholder={enterPromoCodeAction.PromoCode.label}
                                        touched={touched}
                                        values={values}
                                        fieldkey={enterPromoCodeAction.PromoCode.id}
                                        customIcon={promoIcon}
                                    />
                                </View>
                                <View style={styles.spacexxVertically}>
                                </View>
                                <View style={styles.inputContainer}>
                                    <View style={styles.subTitleRow}>
                                        <Text style={styles.tvSubscription}>
                                            Monthly Paid{"\n"}
                                            Subscription
                                        </Text>
                                        <Text style={styles.tvAmountLineThrough}>
                                            {DummyAddToCartData.cart.subTotal}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.spacexxVertically}>
                                </View>

                                <View style={styles.inputContainer}>
                                    <View style={styles.promoCodeDiscountRow} >
                                        <Text style={styles.tvAmount}>
                                            {DummyAddToCartData.cart.subTotal}
                                        </Text>
                                    </View>
                                    <View style={styles.promoCodeDiscountRow}>
                                        <Text style={styles.tvPromoCodeDiscount}>
                                            {DummyAddToCartData.cart.promoCodeDiscount}
                                        </Text>
                                        <View style={styles.spacexHorizontal}>
                                        </View>
                                        <Text style={styles.tvPromoCodeDiscountValue}>
                                            {DummyAddToCartData.cart.promoCodeDiscountAmount}
                                        </Text>

                                    </View>

                                    <View style={styles.spacexVertically}>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.tvBottomHorizontalDivider} />

                        </ScrollView>


                        <View style={styles.spacexVertically}>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.subTitleRow}>
                                <Text style={styles.tvTotal}>
                                    Total
                                </Text>
                                <Text style={styles.tvTotal}>
                                    {DummyAddToCartData.cart.total}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.continueBtn}>
                            <CustomButton customTextStyles={{ fontFamily: fontFamily.Primary.Bold }} onPress={handleSubmit} buttonText={"Continue"} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} />
                        </View>


                    </View>
                )
            }}
        </Formik>
    )

}

export default AddToCart

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: primaryColor, padding: normalizeWidth(15) },
    logo: { width: normalizeWidth(250), height: normalizeHeight(100) },
    logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(10) },
    iconContainer: { width: '10%' },
    imageContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(20) },
    inputContainer: { marginBottom: normalizeWidth(10) },

    mainContainerColumn: {},
    subTitleRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: normalizeWidth(10) },
    titleTextCart: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: fontFamily.Primary.Regular, color: whiteColor, fontSize: fontH1 },
    tvAmount: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: fontFamily.Primary.Regular, color: whiteColor, fontSize: fontH2V2 },
    tvAmountLineThrough: { textDecorationLine: 'line-through', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: fontFamily.Primary.Regular, color: whiteColor, fontSize: fontH2V2 },
    tvSubscription: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: fontFamily.Primary.Regular, color: whiteColor, fontSize: fontH2V2 },
    tvBottomHorizontalDivider: { width: deviceWidth * 100, borderBottomColor: whiteColor, borderBottomWidth: 1, opacity: 0.4 },

    spacexVertically: { marginVertical: normalizeHeight(10) },
    spacexxVertically: { marginVertical: normalizeHeight(20) },


    spacexHorizontal: { marginHorizontal: normalizeHeight(10) },

    tvSubTotalAmount: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: fontFamily.Primary.SemiBold, color: whiteColor, fontSize: fontH2 },
    tvSubTotal: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: fontFamily.Primary.SemiBold, color: whiteColor, fontSize: fontH2 },
    customInputContainer: { marginHorizontal: normalizeWidth(20) },

    promoCodeDiscountRow: { flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: normalizeWidth(10) },

    tvPromoCodeDiscount: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: fontFamily.Primary.Regular, color: buttonColorYellow, fontSize: fontH2V3 },
    tvPromoCodeDiscountValue: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: fontFamily.Primary.Regular, color: buttonColorYellow, fontSize: fontH2V2 },

    tvTotal: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: fontFamily.Primary.SemiBold, color: buttonColorYellow, fontSize: fontH20 },
    continueBtn: { marginHorizontal: normalizeWidth(60), marginVertical: normalizeWidth(10) },

})
