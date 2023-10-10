import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { starFilledIcon, starUnfilledIcon, trashIcon } from '../../assets/images'
import { locationItemPressType } from '../../constants/constants'
import { buttonColorYellow, fontFamily, fontH2V2, fontH3 } from '../../constants/Styles'
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil'
import CustomRadioButton from './CustomRadioButton'
import { DeleteLocationById } from '../../redux/actions';
import { connect } from 'react-redux';
import { registerToastMessage } from '../../utils/RegisterToast'

const iconSize = normalizeWidth(20);
const HeaderLocationItem = React.memo(({ locationHeading, InternetConnected, DeleteLocationById, locationId, location_name, currentSelectedLocationId, onPressItem, itemIndex, is_favourite }) => {
    const [fetching, setFetching] = useState(false)
    const handleDeleteLocation = (event, locationId) => {
        if (!InternetConnected) {
            registerToastMessage("This feature is not available in offline mode.", false)
            return
        }
        setFetching(true)
        DeleteLocationById(locationId).then((val) => {
            setFetching(false)
        }).catch((e) => {
            setFetching(false)
            console.log(e, "error in deleting location id")
        })
    }
    const handlePressItem = useCallback((event, iconPressType, itemIndex) => {
        if (onPressItem) {
            onPressItem(locationId, iconPressType, itemIndex)
        }
    }, [locationId])
    const handleFavIcon = (e) => {
        if (!InternetConnected) {
            registerToastMessage("This feature is not available in offline mode.", false)
            return
        }
        handlePressItem(e, locationItemPressType.FAVORITE, is_favourite)
    }
    const RenderIcon = useMemo(() => {

        return (
            <TouchableOpacity onPress={(e) => handleFavIcon(e)}>
                <Image source={is_favourite ? starFilledIcon : starUnfilledIcon} style={{ width: normalizeWidth(25), height: normalizeWidth(25) }} resizeMode="contain" />
            </TouchableOpacity>
        )
    }, [is_favourite])

    return (
        <View style={styles.mainContainer}>
            <View style={{ alignItems: 'center', marginRight: normalizeWidth(10), justifyContent: 'center' }}>
                <CustomRadioButton onPress={(e) => handlePressItem(e, locationItemPressType.RADIO, itemIndex)} id={locationId} currentId={currentSelectedLocationId} />
            </View>
            <TouchableOpacity style={{ flex: 4 }} onPress={(e) => handlePressItem(e, locationItemPressType.RADIO, itemIndex)}>
                <Text style={styles.locationText}>{locationHeading}</Text>
                <Text style={{ ...styles.locationText, fontFamily: fontFamily.Primary.Regular, fontSize: fontH3 }}>{location_name}</Text>
            </TouchableOpacity >
            <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {RenderIcon}
                </View>
                <View style={{
                    borderWidth: normalizeWidth(1),
                    borderColor: '#00A54A50',
                    height: '60%'
                }}></View>
                {
                    fetching ?
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <ActivityIndicator size={'large'} color={buttonColorYellow} />
                        </View>
                        :
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={(e) => handleDeleteLocation(e, locationId)}>
                            <Image source={trashIcon} style={{ width: normalizeWidth(25), height: normalizeWidth(25) }} resizeMode="contain" />
                        </TouchableOpacity>
                }
            </View>
        </View >
    )
})


const mapStateToProps = state => {
    return {
        InternetConnected: state?.InternetConnection?.internetConnected
    };
};

const mapDispatchToProps = {
    DeleteLocationById
}
export default connect(mapStateToProps, mapDispatchToProps)(HeaderLocationItem)
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginBottom: normalizeHeight(5),
        flexDirection: 'row',
        paddingVertical: normalizeWidth(11),
    },
    locationText: {
        color: 'white',
        fontFamily: fontFamily.Primary.Medium,
        fontSize: fontH2V2
    }
})
