import { faFile, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useCallback, useRef } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { trashIcon, whiteTailLogo, whiteTrashIcon } from '../../../assets/images'
import { ADD_NEW_PHOTO } from '../../../constants/constants'
import { buttonColorYellow, fontFamily, fontH3 } from '../../../constants/Styles'
import { deviceWidth, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../../utils/FontUtil'

const JournalImageListView = React.memo(({ type, onPressNewImage, imageURI, index, handleDeleteImage }) => {
    const onPressItem = useCallback(() => {
        if (handleDeleteImage) {
            handleDeleteImage(index)
        }
    }, [index, handleDeleteImage])
    return (
        <View style={{ width: deviceWidth * 0.32, height: normalizeHeight(160), marginRight: normalizeWidth(10) }}>
            <View style={{ overflow: 'hidden', flex: 1, borderRadius: normalizeWidth(15), borderColor: 'white', borderWidth: type !== ADD_NEW_PHOTO ? normalizeWidth(1.5) : StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center' }}>
                {
                    type === ADD_NEW_PHOTO ?
                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={onPressNewImage}>
                            <FontAwesomeIcon icon={faFile} size={normalizeWithScale(15)} color={buttonColorYellow} />
                            <Text style={styles.textClickHere}>ClICK HERE TO ADD PHOTO</Text>
                        </TouchableOpacity>
                        : <Image source={{ uri: imageURI }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                }
            </View>
            <View style={{ flex: 0.4, justifyContent: 'center' }}>
                {
                    type !== ADD_NEW_PHOTO ?
                        <TouchableOpacity onPress={onPressItem} style={{ alignItems: 'center' }}>
                            <Image source={whiteTrashIcon} style={{ width: '70%', height: '70%' }} resizeMode="contain" />
                        </TouchableOpacity>
                        : <></>
                }
            </View>
        </View>
    )
})

export default JournalImageListView

const styles = StyleSheet.create({
    textClickHere: {
        marginTop: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        color: buttonColorYellow, fontFamily: fontFamily.Primary.Regular, textAlign: 'center',
        fontSize: fontH3
    },
})
