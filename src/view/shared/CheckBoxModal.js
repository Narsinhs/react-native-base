import React, { useState } from 'react'
import { StyleSheet, Text, Image, View, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native'
import { modalcancelIcon } from '../../assets/images';
import { blackColor, fontFamily, fontH2, fontH2V3, grey, whiteColor } from '../../constants/Styles';
import { deviceHeight, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil';
import Modal from "react-native-modal";
import CheckBoxListView from './CheckBoxItemListview';
import SearchInput from './SearchInput';
import NoRecordFound from './NoRecordFound';
const CheckBoxModal = ({ modalHeading, onModalClose, isModalVisible, data, onModalSelectValue, handleAddOtherText }) => {

    const [searchInputValue, setSearchInputValue] = useState('');

    const renderItem = ({ item, index }) => {
        return (
            <CheckBoxListView
                id={item.id}
                label={item.label}
                selected={item?.selected}
                onModalClick={onModalClose}
                handleSelectValue={onModalSelectValue}
                handleAddOtherText={handleAddOtherText}
                index={index}
            />
        )
    }
    const handleSearchQueryChange = (text) => {
        setSearchInputValue(text);

    }
    const getFilteredList = () => {
        return data.filter(each => {
            return each?.label?.toLowerCase()?.includes(searchInputValue.toLowerCase())
        });
    }

    const ListEmptyComponent = () => {
        return (
            <NoRecordFound text={`No ${modalHeading || ""} Data found!`} />
        )
    }


    return (
        <>
            <Modal avoidKeyboard isVisible={isModalVisible} onBackButtonPress={onModalClose} onBackdropPress={onModalClose} >
                <View style={[styles.modalHeaderContainer]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: normalizeHeight(10), paddingHorizontal: normalizeWidth(40), marginBottom: normalizeHeight(20) }}>
                        <Text style={[styles.modalTitleText]}>{modalHeading || ""}</Text>
                        <TouchableOpacity onPress={onModalClose} style={{ position: 'absolute', right: '2%', top: '19%' }}>
                            <Image source={modalcancelIcon} resizeMode={'contain'} style={{ width: normalizeWidth(25), height: normalizeHeight(25) }} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.modalColumnContainer]}>
                        <View style={styles.journalListContainer}>
                            <SearchInput
                                searchInputValue={searchInputValue}
                                handleTextChange={handleSearchQueryChange}
                            />
                            {
                                <FlatList
                                    style={styles.flatListSyle}
                                    data={getFilteredList()}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                    ListEmptyComponent={ListEmptyComponent}
                                />
                            }
                        </View>
                    </View>
                </View>

            </Modal>
        </>
    )
}

export default CheckBoxModal

const styles = StyleSheet.create({
    modalTitleText: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        color: blackColor,
        fontFamily: fontFamily.Primary.Bold,
        fontSize: fontH2,
        textAlign: 'center',
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
