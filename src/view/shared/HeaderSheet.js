import { faLocationArrow, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { buttonColorYellow, fontFamily, fontH2, fontH2V2, fontH2V3, primaryColor, whiteColor } from '../../constants/Styles'
import { deviceHeight, deviceWidth, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil'
import HeaderLocationItem from './HeaderItem'
import { connect } from 'react-redux';
import { UseCurrentLocation, isFavoraite } from '../../redux/actions';
import { RouteNames } from '../../constants/RouteNames'
import { locationItemPressType } from '../../constants/constants'
import { registerToastMessage } from '../../utils/RegisterToast'
const HeaderSheet = React.memo(({ items, currentItem, updateCurrentLocation, UseCurrentLocation, isFavoraite, onPress, navigation, InternetConnected }) => {
    const [locationData, setlocationData] = useState(items);
    const [isloading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        let not_favoritelocation = [];
        let favoritelocation = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].is_favourite) {
                favoritelocation.push(items[i]);
            } else {
                not_favoritelocation.push(items[i]);
            }
        }
        let all_location = favoritelocation.concat(not_favoritelocation);
        setlocationData(all_location);
        setTimeout(() => {
            setLoading(false);

        }, 300)
    }, [items])



    const handleLocationItemPress = (locationId, pressType, itemIndex) => {
        if (pressType == locationItemPressType.FAVORITE) {
            if (itemIndex) {
                itemIndex = 0;
            } else {
                itemIndex = 1
            }
            let all_locations = locationData.map((location) => {
                if (location.id == locationId) {

                    location.is_favourite = itemIndex
                }
                return location
            });
            isFavoraite(locationId, itemIndex, all_locations).then((res) => {

            })
        } else if (updateCurrentLocation) {
            updateCurrentLocation(locationId, pressType, locationData[itemIndex]?.longitude, locationData[itemIndex]?.latitude)
        }
    }

    const handleCurrentLocation = () => {
        if (!InternetConnected) {
            registerToastMessage("This feature is not available in offline mode.", false)
            return
        }
        onPress()
        UseCurrentLocation(true)
    }
    const renderHeaderItems = ({ item, index }) => {
        return <HeaderLocationItem is_favourite={item.is_favourite} locationHeading={item?.location_name + ", " + item?.location_state} itemIndex={index} is_favourite={item?.is_favourite} location_name={item?.location_place !== '' ? item?.location_place : item.location_name} locationId={item?.id} currentSelectedLocationId={currentItem?.id} onPressItem={handleLocationItemPress} />
    }
    const handleAddLocation = () => {
        if (!InternetConnected) {
            registerToastMessage("This feature is not available in offline mode.", false)
            return
        }
        return navigation.navigate(RouteNames.User.AddLocation)
    }
    return (
        <>

            <View style={styles.mainContainer}>
                <View style={{ flex: 1 }}>
                </View>
                <View style={{ flex: 2.5 }}>
                    <View style={{ flex: 1, paddingHorizontal: normalizeWidth(20) }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.headingContainer} onPress={handleCurrentLocation}>
                                <FontAwesomeIcon size={normalizeWithScale(18)} icon={faLocationArrow} color={buttonColorYellow} />
                                <Text style={styles.text}>Use my current Location</Text>
                            </TouchableOpacity>
                        </View>
                        {!isloading ?
                            <View style={styles.middleContainer}>
                                <FlatList
                                    style={{ top: 0, bottom: 0, width: '100%', height: '100%' }}
                                    data={locationData}
                                    scrollEnabled={true}
                                    renderItem={renderHeaderItems}
                                    keyExtractor={(item, index) => item.id.toString()}
                                />
                            </View>
                            :
                            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator size={"large"} color={whiteColor} />
                            </View>
                        }
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.headingContainer} onPress={handleAddLocation}>
                                <FontAwesomeIcon size={normalizeWithScale(18)} icon={faPlus} color={buttonColorYellow} />
                                <Text style={styles.text}>Add New Location</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

        </>
    )
})

const mapStateToProps = state => {
    return {
        InternetConnected: state?.InternetConnection?.internetConnected
    };
};

const mapDispatchToProps = {
    UseCurrentLocation,
    isFavoraite
}
export default connect(mapStateToProps, mapDispatchToProps)(HeaderSheet)

const styles = StyleSheet.create({
    mainContainer: {
        width: deviceWidth,
        height: deviceHeight * 0.45,
        position: 'absolute',
        backgroundColor: primaryColor,
        borderBottomLeftRadius: normalizeWidth(30),
        borderBottomRightRadius: normalizeWidth(30),
    },
    middleContainer: {
        flex: 3,
        borderTopWidth: normalizeWidth(1),
        borderBottomWidth: normalizeWidth(1),
        borderColor: '#00A54A50',

    },
    text: {
        color: buttonColorYellow,
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V3,
        marginLeft: normalizeWidth(10)
    },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})
