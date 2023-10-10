import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { LiteCreditCardInput } from "../shared/react-native-credit-card-input-view";
const CustomCreditCardInput = ({ placeholders, onChangeCreditCardInfo, formObject, values, errors, touched }) => {
    return (
        <View >
            <LiteCreditCardInput
                onChange={onChangeCreditCardInfo}
                placeholders={placeholders}
                formObject={formObject}
                values={values}
                errors={errors}
                touched={touched}
            />
        </View>
    )
}

export default CustomCreditCardInput

const styles = StyleSheet.create({})
