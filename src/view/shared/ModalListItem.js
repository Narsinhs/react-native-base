import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { blackColor, dividerBlackColor, fontFamily, fontH2V2, grey, primaryColor, whiteColor, whiteColoralpha40 } from '../../constants/Styles';
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil';


const ModalListItem = ({ id, label, handleSelectValue }) => {

    const handlePress = () => {
        if (handleSelectValue) {
            handleSelectValue(label)
        }
    }


    return (
            <TouchableOpacity onPress={handlePress}>
                <View style={{ ...styles.listItem, backgroundColor: grey }}>
                    <Text style={{ ...styles.journalDate }}>{label}</Text>
                </View>
            </TouchableOpacity>

    );


}
export default ModalListItem
const styles = StyleSheet.create({
    listItem: {
        paddingVertical: normalizeWidth(10),
        paddingHorizontal: normalizeWidth(20),
        marginBottom: normalizeHeight(10),
        height: '100%',
        width: '100%',
        flex: 1,
        alignSelf: "center",
        flexDirection: "row",
        borderRadius: normalizeWidth(10),
    },
    journalDate: {
        alignSelf: "center",
        color: blackColor,
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V2
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

})
