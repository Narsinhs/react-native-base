import React, { useState } from 'react'
import { StyleSheet, Text, Image, View, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native'
import { modalcancelIcon } from '../../assets/images';
import { blackColor, fontFamily, fontH2, fontH2V3, grey, whiteColor } from '../../constants/Styles';
import { deviceHeight, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil';
import Modal from "react-native-modal";
import ModalListItem from './ModalListItem';
import { dummyCountryData } from '../../constants/constants';
const CustomDropDownSelector = ({ search, modalHeading, onModalClose, isModalVisible, textInputplaceholder = "Search", textInputkeyboardType, data, labelText, onModalSelectValue }) => {

    const [searchQuery, setSearchQuery] = useState('')

    const renderItem = ({ item }) => {
        return (
            <ModalListItem id={item.id} label={item.label} onModalClick={onModalClose} handleSelectValue={onModalSelectValue} />
        )
    }

    const onChangeText = (val) => {
        setSearchQuery(val)
    }

    const filterData = () => {
        return [...data].filter(each => {
            return each.label.toLowerCase().includes(searchQuery.toLowerCase())
        })

    }


    return (
        <>
            <Modal isVisible={isModalVisible} onBackdropPress={onModalClose} onBackButtonPress={onModalClose}>
                <View style={[styles.modalHeaderContainer]}>

                    <View style={[styles.modalHeaderRow]}>
                        <View style={[styles.modalCancelIconView]}>
                            <TouchableOpacity onPress={onModalClose}>
                                <Image source={modalcancelIcon} resizeMode={'contain'} style={{ width: normalizeWidth(25), height: normalizeHeight(25) }} />
                            </TouchableOpacity>
                        </View>
                    </View>



                    <View style={[styles.modalColumnContainer]}>
                        <Text style={[styles.modalTitleText]}>{modalHeading ? modalHeading : ''}</Text>
                        {search &&
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    style={styles.inputContainer}
                                    value={searchQuery}
                                    onChangeText={onChangeText}
                                    placeholder={textInputplaceholder}
                                    keyboardType={textInputkeyboardType}
                                    selectionColor="black"
                                /></View>

                        }
                        <View style={styles.journalListContainer}>
                            {
                                <FlatList
                                    style={styles.flatListSyle}
                                    data={filterData()}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                />
                            }
                        </View>
                    </View>






                </View>

            </Modal>
        </>
    )
}

export default CustomDropDownSelector

const styles = StyleSheet.create({
    modalTitleText: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        color: blackColor,
        fontFamily: fontFamily.Primary.Bold,
        fontSize: fontH2,
    },

    modalHeaderContainer: {
        flex: 1, backgroundColor: whiteColor, maxHeight: deviceHeight * 0.7, borderTopLeftRadius: normalizeWidth(5), borderTopRightRadius: normalizeWidth(5), borderBottomLeftRadius: normalizeWidth(5), borderBottomRightRadius: normalizeWidth(5)
    },
    modalHeaderRow: {
        flexDirection: 'row-reverse',
    },
    modalCancelIconView: {
        padding: 5, alignSelf: 'flex-end'
    },
    modalColumnContainer: {
        flex: 1,
        flexDirection: "column",
    },
    journalListContainer: {
        marginTop: normalizeWithScale(0),
        backgroundColor: whiteColor,
        flex: 6,
        paddingHorizontal: normalizeWidth(10)
    },
    flatListSyle: {
        height: '100%', flex: 1
    },

    textInputContainer: {
        margin: normalizeWidth(10),
        borderWidth: normalizeWidth(0),
        borderBottomLeftRadius: normalizeWidth(5),
        borderBottomRightRadius: normalizeWidth(5),
        borderTopLeftRadius: normalizeWidth(5),
        borderTopRightRadius: normalizeWidth(5),
        backgroundColor: grey


    },
    inputContainer: {
        marginLeft: normalizeWidth(20),
        height: Platform.OS === 'ios' ? normalizeHeight(40) : 40,
        borderColor: whiteColor,
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V3,
        color: blackColor
    },

})
