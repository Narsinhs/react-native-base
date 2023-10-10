import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
import { fontFamily, fontH1, fontH2V3, fontH3, greylight, primaryColor } from '../../constants/Styles';



const CustomCheckBox = ({ value, type, label, fieldkey, handleCheckBoxValueChange, errors }) => {

    const isSelected = () => {
        return type === value[fieldkey] ? true : false
    }
    const onValueChange = () => {
        if (handleCheckBoxValueChange) {
            handleCheckBoxValueChange(fieldkey, type)
        }

    }

    return (
        <View style={styles.customCheckBoxContainer}>
            <CheckBox style={{ width: normalizeWidth(17), height: normalizeWidth(17) }} onCheckColor={primaryColor} onTintColor={primaryColor} onAnimationType="fade" offAnimationType='fade' boxType="square" value={isSelected()} onValueChange={onValueChange} />
            <TouchableOpacity onPress={onValueChange}>
                <Text style={styles.customCheckBoxLabelContainer}>{label}</Text>
            </TouchableOpacity>
        </View>
    )


}
export default CustomCheckBox

const styles = StyleSheet.create({
    customCheckBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: normalizeWidth(20),
        marginBottom: normalizeHeight(5)
    },
    customCheckBoxLabelContainer: {
        marginTop: normalizeWidth(4), fontSize: fontH2V3, alignSelf: 'flex-start', color: greylight, fontFamily: fontFamily.Primary.Regular, marginLeft: normalizeWidth(10),
    },
})
