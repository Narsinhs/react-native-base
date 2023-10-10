import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal'
import { WheelPicker } from '../../modules/react-native-wheel-picker-android';
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
import { fontFamily, fontH1, fontH2, primaryColor } from '../../constants/Styles';
const WheelPickerModal = ({ isVisible, closeModal, pickerData, onItemSelect, selectedItem }) => {

    const getIndexOfSelectedItem = () => {
        let index = pickerData.findIndex(each => each == selectedItem);
        return index
    }
    const onItemSelectPicker = (item) => {
        // For some reason, selectedItem index was maintained on android and by value on iOS, but it's working by index on both platforms. MAGIC!!
        // if (Platform.OS === 'android') {
        //     onItemSelect(pickerData[item])
        // }
        // else {
        //     onItemSelect(item)
        // }

        onItemSelect(pickerData[item])
    }

    return (
        <Modal
            visible={isVisible}
            onBackdropPress={closeModal}
            animationType={"slide"}
        >
            <View style={styles.container}>
                <Text style={styles.header}>Pick a number</Text>
                <WheelPicker
                    initPosition={getIndexOfSelectedItem()}
                    data={pickerData}
                    itemTextFontFamily={fontFamily.Primary.Regular}
                    selectedItemTextFontFamily={fontFamily.Primary.SemiBold}
                    itemTextColor='white'
                    selectedItemTextSize={fontH1}
                    selectedItemTextColor='white'
                    itemStyle={{ color: 'white', fontFamily: fontFamily.Primary.Regular }} // iOS picker props
                    onItemSelected={onItemSelectPicker}
                    selectedItem={getIndexOfSelectedItem()}
                />
            </View>
        </Modal>
    );
};

export default WheelPickerModal;

const styles = StyleSheet.create({
    container: {
        elevation: 10, marginHorizontal: normalizeWidth(10), backgroundColor: primaryColor, height: normalizeHeight(250), alignItems: 'center', borderRadius: normalizeWidth(20), paddingTop: normalizeHeight(20)
    },
    header: {
        color: 'white', fontFamily: fontFamily.Primary.Regular, fontSize: fontH2
    }
});
