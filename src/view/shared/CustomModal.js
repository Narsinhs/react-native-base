import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import Modal from "react-native-modal";
import { countries, dummyCountryData, journalDummyData } from "../../constants/constants";
import { whiteColor } from "../../constants/Styles";
import { normalizeWidth, normalizeWithScale } from "../../utils/FontUtil";
import JournalListItem from "../userViews/profile/JournalListItem";
import ModalListItem from "./ModalListItem";

const CustomModal = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const renderItem = ({ item }) => {
        return (
            <ModalListItem date={item.date} isDraft={item.isDraft} />
        )
    }
    const handleSearch = text => {
        const newData = dummyCountryData.filter(item => {
            const itemData = item.date.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1
        });


    }




    return (
        <View style={{ flex: 1 }}>
            <Button title="Show modal" onPress={toggleModal} />
            <Modal isVisible={isModalVisible} onBackButtonPress={toggleModal} onBackdropPress={toggleModal}>
                <View style={{ flex: 1, backgroundColor: whiteColor }}>
                    <View style={{ width: "100%", marginHorizontal: normalizeWidth(10) }}>
                        {
                            <TextInput
                                placeholder="Search"
                                onChangeText={handleSearch}
                            // value={ }
                            />
                        }
                    </View>
                    <View style={styles.journalListContainer}>
                        {
                            <FlatList
                                style={{ height: '100%', flex: 1 }}
                                data={dummyCountryData}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                        }
                    </View>

                    <Button title="Hide modal" onPress={toggleModal} />
                </View>
            </Modal>
        </View>
    )
}
export default CustomModal

const styles = StyleSheet.create({

    journalListContainer: {
        marginTop: normalizeWithScale(20),
        backgroundColor: whiteColor,
        flex: 6,
        paddingHorizontal: normalizeWidth(10)
    },
})
