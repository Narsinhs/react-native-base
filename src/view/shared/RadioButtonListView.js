import CheckBox from '@react-native-community/checkbox';
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native'
import { OTHER_SLUG } from '../../constants/constants';
import { blackColor, dividerBlackColor, fontFamily, fontH2V2, grey, primaryColor, whiteColor, whiteColoralpha40 } from '../../constants/Styles';
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil';


const RadioButtonListView = ({ id, label, handleSelectValue, selected, index, handleAddRadioItem }) => {

    const onValueChange = () => {
        if (handleSelectValue) {
            handleSelectValue(id, index, !selected)
        }
    }
    const onChangeText = (text) => {
        if (handleAddRadioItem) {
            let transformedText = `${OTHER_SLUG}:${text}`
            if (text.length) {
                handleAddRadioItem(id, index, true, transformedText)
            } else {
                handleAddRadioItem(id, index, false, transformedText)
            }
        }
    }

    const getTextInputValue = () => {
        if (label) {
            return label.split(':')[1]?.trim()
        }
    }


    return (
        <>
            <TouchableOpacity disabled={label.includes(OTHER_SLUG) && !getTextInputValue()?.length} onPress={onValueChange}>
                <View style={{ ...styles.listItem, backgroundColor: selected ? '#00793635' : '#70707020' }}>
                    {
                        label.includes(OTHER_SLUG) ?
                            <>
                                <View style={styles.containerStyles}>
                                    {
                                        selected ?
                                            <View style={styles.radioStyles} />
                                            : null
                                    }
                                </View>
                                <TextInput
                                    value={getTextInputValue()}
                                    onChangeText={onChangeText}
                                    style={{ flex: 1, fontSize: fontH2V2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: primaryColor, fontFamily: fontFamily.Primary.Medium }}
                                    placeholderStyle={{ fontFamily: fontFamily.Primary.Medium }}
                                    selectionColor={primaryColor}
                                    placeholder={OTHER_SLUG}
                                    placeholderTextColor={'#00000050'}
                                />

                            </>
                            :
                            <>
                                <View style={styles.containerStyles}>
                                    {
                                        selected ?
                                            <View style={styles.radioStyles} />
                                            : null
                                    }
                                </View>
                                <Text style={styles.journalDate}>{label}</Text>
                            </>
                    }
                </View>
            </TouchableOpacity>
        </>

    );


}
export default RadioButtonListView
const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalizeHeight(10),
        paddingHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(10),
        borderRadius: normalizeWidth(5)
    },
    journalDate: {
        color: blackColor,
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V2,
    },

    verticleLine: {
        margin: normalizeWidth(10),
        height: '120%',
        opacity: 0.8,
        width: normalizeWidth(0.5),
        backgroundColor: dividerBlackColor,
    },
    imgContainer: {
        height: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    containerStyles: {
        height: normalizeWidth(18),
        width: normalizeWidth(18),
        borderRadius: normalizeWidth(12),
        borderWidth: normalizeWidth(2),
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: normalizeWidth(10)
    },
    radioStyles: {
        height: normalizeWidth(10),
        width: normalizeWidth(10),
        borderRadius: normalizeWidth(6),
        backgroundColor: primaryColor,
    }
})
