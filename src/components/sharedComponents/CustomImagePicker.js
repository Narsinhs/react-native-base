import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { ADD_NEW_PHOTO } from '../../constants/constants'
import { errorColor, fontFamily, fontH2V3, fontH3, whiteColor } from '../../constants/Styles'
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil'
import JournalImageListView from '../../view/userViews/journal/JournalImageListView'

const CustomImagePicker = ({ onPressNewImage, handleDeleteImage, fieldKey, label, values, errors }) => {
    const handleAddImage = () => {
        onPressNewImage(fieldKey)
    }

    const onDelete = (itemIndex) => {
        handleDeleteImage(fieldKey, itemIndex)
    }
    const renderImageListView = ({ item, index }) => {
        return (
            <JournalImageListView type={item?.type} onPressNewImage={handleAddImage} index={index} imageURI={item?.uri} handleDeleteImage={onDelete} />
        )

    }


    let hasError = errors[fieldKey]

    return (
        <View style={styles.mainContainer}>
            {
                label ?
                    <View style={styles.textInputLabelContainer}>
                        {/* <Text numberOfLines={1} style={styles.textInputLabel}>{label} <Text style={{ color: errorColor }}>*</Text></Text> */}
                        <Text numberOfLines={1} style={styles.textInputLabel}>{label}</Text>
                    </View>
                    :
                    <></>
            }
            <View style={styles.flatlistContainer}>
                {/* {
                    hasError && <Text style={{ color: errorColor, fontFamily: fontFamily.Primary.Regular, fontSize: fontH3, marginLeft: normalizeWidth(2) }}>{`${label} is Required`}</Text>
                } */}
                <FlatList
                    data={[...values[fieldKey], { type: ADD_NEW_PHOTO }]}
                    renderItem={renderImageListView}
                    keyExtractor={(item, index) => index}
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}
                />

            </View>
        </View>
    )
}

export default CustomImagePicker

const styles = StyleSheet.create({
    mainContainer: {
        marginBottom: normalizeHeight(10),
        marginTop: normalizeHeight(30)
    },
    flatlistContainer: {
        width: '100%',
        paddingHorizontal: normalizeWidth(10)
    },
    textInputLabelContainer: {
        marginBottom: normalizeWidth(6),
        marginLeft: normalizeWidth(15)
    },
    textInputLabel: {
        color: whiteColor,
        marginLeft: normalizeWidth(0),
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V3,
    },
})
