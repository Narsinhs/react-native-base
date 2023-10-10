import CheckBox from '@react-native-community/checkbox';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { OTHER_SLUG, RANGE_SLUG } from '../../constants/constants';
import WheelPickerModal from '../../components/sharedComponents/WheelPickerModal'
import { blackColor, dividerBlackColor, fontFamily, fontH2, fontH2V2, fontH2V3, fontH3, grey, primaryColor, whiteColor, whiteColoralpha40 } from '../../constants/Styles';
import { WheelPicker } from '../../modules/react-native-wheel-picker-android';
import { deviceHeight, deviceWidth, normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
import Modal from 'react-native-modal'
import { getArrayOfRange } from '../../utils/CommonUtil';


const CheckBoxListView = ({ id, label, handleSelectValue, selected, index, handleAddOtherText }) => {

    const [wheelPickerData, setWheelPickerData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(0);

    useEffect(() => {
        if (label.includes('|') && label?.split('|')[1]) {
            let range = label.split('|')[1]?.split('-');
            let rangeArray = getArrayOfRange(range[0], range[1])
            setWheelPickerData(rangeArray)
            if (!label.includes(RANGE_SLUG)) {
                setSelectedItem(rangeArray[0])
                let transformedText = `${RANGE_SLUG}_${rangeArray[0]}=${label}`
                handleAddOtherText(id, index, false, transformedText)
            }

        }
        if (label.includes('=') && label?.split('=')) {
            let rangeNumber = label?.split('=')[0]?.split('_');
            setSelectedItem(rangeNumber[1])
        }
    }, [label])

    const [rangeModalVisible, setRangeModalVisible] = useState(false)

    const onValueChange = () => {
        if (handleSelectValue) {
            handleSelectValue(id, index, !selected)
        }
    }

    const mapRangeTextToLabel = (rangeText) => {
        if (handleAddOtherText) {
            let oldText = label.split('=');
            let transformedText = `${RANGE_SLUG}_${rangeText}=${oldText[1] ? oldText[1] : oldText[0]}`
            if (transformedText.length) {
                handleAddOtherText(id, index, true, transformedText)
            } else {
                handleAddOtherText(id, index, false, transformedText)
            }
        }
    }

    const onChangeText = (text) => {
        if (handleAddOtherText) {
            let transformedText = `${OTHER_SLUG}:${text}`
            if (text.length) {
                handleAddOtherText(id, index, true, transformedText)
            } else {
                handleAddOtherText(id, index, false, transformedText)
            }
        }
    }

    const getTextInputValue = () => {
        if (label) {
            return label.split(':')[1]?.trim()
        }
    }
    const onItemSelected = selectedItem => {
        setSelectedItem(selectedItem)
    }

    const toggleRangeModal = () => {
        setRangeModalVisible(true)
    }

    const closeRangeModal = () => {
        setRangeModalVisible(false)
    }

    const getSplitLabel = () => {
        if (label && label.includes('|')) {
            let firstLevel = label.split('|')[0]?.trim()
            let secondLevel = firstLevel.split('=');
            if (secondLevel[1] === "") {
                return "Select Count"
            }
            return secondLevel[1] ? secondLevel[1] : secondLevel[0]
        }
        else {
            return label
        }

    }
    const onItemSelect = (item) => {
        setSelectedItem(item)
        mapRangeTextToLabel(item)
    }

    let rangeBounds = label?.split('|')[1]?.split('-') || []
    return (
        <>

            <View style={{ ...styles.listItem, backgroundColor: selected ? '#00793635' : '#70707020' }}>
                {
                    label.includes(OTHER_SLUG) ?
                        <>
                            <CheckBox disabled={!getTextInputValue()?.length} onValueChange={onValueChange} style={{ marginRight: normalizeWidth(20) }} onCheckColor={primaryColor} onTintColor={primaryColor} onAnimationType="fade" offAnimationType='fade' boxType="square" value={selected} />
                            <TextInput
                                placeholder={OTHER_SLUG}
                                value={getTextInputValue()}
                                onChangeText={onChangeText}
                                style={{ flex: 1, fontSize: fontH2V2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: primaryColor, fontFamily: fontFamily.Primary.Medium }}
                                placeholderStyle={{ fontFamily: fontFamily.Primary.Medium }}
                                selectionColor={primaryColor}
                                placeholderTextColor={'#00000050'}
                            />
                        </>
                        :
                        <>
                            <CheckBox onValueChange={onValueChange} style={{ marginRight: normalizeWidth(20) }} onCheckColor={primaryColor} onTintColor={primaryColor} onAnimationType="fade" offAnimationType='fade' boxType="square" value={selected} />
                            <TouchableOpacity hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }} onPress={onValueChange} style={{ flex: 1 }}>
                                <Text style={styles.journalDate}>{getSplitLabel()}</Text>
                            </TouchableOpacity>
                        </>
                }
                {
                    selectedItem ?
                        <View style={{ width: normalizeWidth(25), height: normalizeWidth(25), borderRadius: normalizeWidth(15), backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center', marginRight: normalizeWidth(10) }}>
                            <Text style={{ ...styles.rangeText, color: 'white', textAlign: 'center' }}>{selectedItem}</Text>
                        </View>
                        :
                        <></>
                }
                {
                    label.includes('|') ?
                        <TouchableOpacity disabled={!selected} onPress={toggleRangeModal} style={{ flex: 0.35, backgroundColor: selected ? '#00793650' : '#70707020', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', borderRadius: normalizeWidth(10), paddingVertical: normalizeHeight(5), paddingHorizontal: normalizeWidth(10) }}>
                            <Text style={styles.rangeText} >{rangeBounds[0]}</Text>
                            <Text style={styles.rangeText} >-</Text>
                            <Text style={styles.rangeText}>{rangeBounds[1]}</Text>
                        </TouchableOpacity> : <></>
                }


            </View>
            {
                label.includes('|') ?
                    <WheelPickerModal
                        isVisible={rangeModalVisible}
                        pickerData={wheelPickerData}
                        closeModal={closeRangeModal}
                        onItemSelect={onItemSelect}
                        selectedItem={selectedItem}
                    />
                    :
                    <></>
            }

        </>

    );


}
export default CheckBoxListView
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
    rangeText: {
        fontFamily: fontFamily.Primary.Medium,
        fontSize: fontH2V3
    }

})
