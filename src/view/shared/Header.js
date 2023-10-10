import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Keyboard,
    Text,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';
import { deviceHeight, deviceWidth, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../utils/FontUtil';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faChevronLeft, faChevronRight, faHeart, faHorseHead, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { fontFamily, fontH1, fontH2, fontH2V2, fontH3, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles';
import HeaderSheet from './HeaderSheet';
import { updateSelectedLocation, GetAllUserLocation, IsArrowPressedFromHeader, ClearInternalLocationData } from '../../redux/actions';
import { locationItemPressType } from '../../constants/constants';
import { RouteNames } from '../../constants/RouteNames';
import { useNavigation } from '@react-navigation/native';
import { blackDear, drawerBarIcon, footPrintIcon } from '../../assets/images';
const LOCATION_ARROW_DIRECTION = {
    "Right": 2,
    "Left": 1
}

const hitSlop = normalizeWidth(35)
const Header = React.memo((props) => {

    const navigation = useNavigation()
    const { allLocations, selectedLocation, locationFetchFirstTime, ClearInternalLocationData, InternalGeoLocation, InternalCoordinate, updateSelectedLocation, routeName, GetAllUserLocation, IsArrowPressedFromHeader, InternetConnected } = props;
    const [isActive, setIsActive] = useState(false);
    useEffect(() => {
        // console.log("11111111111", locationFetchFirstTime)
        if (locationFetchFirstTime && InternetConnected) {
            // console.log('22222222')
            handleGetAllLocation()
        }
    }, [locationFetchFirstTime, InternetConnected])
    useEffect(() => {
        if (routeName === RouteNames.User.AddLocation) {
            setIsActive(false)
        }
    }, [routeName])
    const handleGetAllLocation = () => {
        GetAllUserLocation().then((val) => {
            let obj = val[0]
            updateSelectedLocation(obj.id, locationItemPressType.RADIO, obj.longitude, obj.latitude)
            setTimeout(() => {
                IsArrowPressedFromHeader(true)
            }, 500);
        }).catch((e) => {
            console.log(e, "error in all location")
        })
    }

    const OpenDrawer = () => {
        Keyboard.dismiss();
        props.navigation.openDrawer()
    }
    const BackHandle = () => {
        Keyboard.dismiss();
        props.navigation.goBack()
    }

    const updateCurrentLocation = async (locationId, pressType, long, lat) => {
        await updateSelectedLocation(locationId, pressType, long, lat)
        if (Object.keys(InternalCoordinate).length !== 0 && Object.keys(InternalGeoLocation).length !== 0) {
            ClearInternalLocationData()
        }
        setTimeout(() => {
            IsArrowPressedFromHeader(true)
        }, 100);
    }

    const onPressArrowIcon = (arrowDirectionType) => {
        const currentLocationIndex = [...allLocations].findIndex(each => each.id === selectedLocation.id);
        if (arrowDirectionType === LOCATION_ARROW_DIRECTION.Left && currentLocationIndex - 1 >= 0) {
            const updatedIndex = currentLocationIndex - 1;
            updateCurrentLocation(allLocations[updatedIndex].id, locationItemPressType.RADIO, allLocations[updatedIndex]?.longitude, allLocations[updatedIndex]?.latitude)
        }
        else if (arrowDirectionType === LOCATION_ARROW_DIRECTION.Right && currentLocationIndex + 1 < allLocations.length) {
            const updatedIndex = currentLocationIndex + 1;
            updateCurrentLocation(allLocations[updatedIndex].id, locationItemPressType.RADIO, allLocations[updatedIndex].longitude, allLocations[updatedIndex].latitude)

        }

    }

    const toggleHeaderSheet = () => {
        setIsActive(prev => !prev)
    }

    const renderHeaderSheet = useMemo(() => {
        return (
            <Animatable.View animation={isActive ? "fadeInDownBig" : "fadeOutUpBig"}  >
                <HeaderSheet items={allLocations} currentItem={selectedLocation} updateCurrentLocation={updateCurrentLocation} onPress={toggleHeaderSheet} {...props} />
            </Animatable.View>
        )
    }, [allLocations, isActive, selectedLocation])

    const renderHeaderSheetForRoute = () => {
        return 2 === navigation?.getState()?.routes[0]?.state?.index
    }

    return (
        <View style={{ backgroundColor: routeName === RouteNames.User.HuntingJournal ? primaryColor : 'white' }}>
            {
                isActive && renderHeaderSheetForRoute() ?
                    <Animatable.View animation={isActive ? "fadeIn" : "fadeOut"}>
                        <TouchableOpacity activeOpacity={1} onPress={toggleHeaderSheet} style={{ backgroundColor: '#00000090', height: deviceHeight, position: 'absolute', width: deviceWidth }}>

                        </TouchableOpacity>
                    </Animatable.View> : <></>
            }

            {
                renderHeaderSheetForRoute() && isActive ?
                    renderHeaderSheet : <></>
            }
            <Animatable.View animation={"fadeInDown"} style={styles.mainContainer}>
                <View style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <TouchableOpacity hitSlop={{ right: hitSlop, top: hitSlop, left: hitSlop, bottom: hitSlop }} onPress={() => onPressArrowIcon(LOCATION_ARROW_DIRECTION.Left)}>
                            <FontAwesomeIcon icon={faChevronLeft} color={whiteColor} size={normalizeWithScale(15)} />
                        </TouchableOpacity>

                        <TouchableOpacity disabled={!renderHeaderSheetForRoute()} activeOpacity={renderHeaderSheetForRoute() ? 0.5 : 1} onPress={() => setIsActive(prev => !prev)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: normalizeWidth(10) }}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} color={whiteColor} size={normalizeWithScale(15)} />
                            <Text numberOfLines={1} style={{ marginLeft: normalizeWidth(5), fontSize: fontH2V2, color: whiteColor, fontFamily: fontFamily.Primary.Medium }}>{selectedLocation?.location_state ? `${selectedLocation?.location_name}` + ', ' + `${selectedLocation?.location_state}` : "Location Unavailable"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity hitSlop={{ right: hitSlop, top: hitSlop, left: hitSlop, bottom: hitSlop }} onPress={() => onPressArrowIcon(LOCATION_ARROW_DIRECTION.Right)}>
                            <FontAwesomeIcon icon={faChevronRight} color={whiteColor} size={normalizeWithScale(15)} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '10%' }} onPress={OpenDrawer}>
                            <Image source={drawerBarIcon} style={{ width: normalizeWidth(20), height: normalizeWidth(20) }} resizeMode="contain" />
                            <Image source={footPrintIcon} style={{ width: normalizeWidth(20), height: normalizeWidth(20) }} resizeMode="contain" />
                        </TouchableOpacity>
                        <View style={{ width: "80%", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => setIsActive(prev => !prev)}>
                            <Text style={{ marginLeft: normalizeWidth(5), fontSize: fontH1, color: headingTextBlackColor, textAlign: 'center', fontFamily: fontFamily.Secondary.Bold }}>Whitetail Almanac</Text>
                            <Text style={{ fontFamily: fontFamily.Secondary.Bold, color: headingTextBlackColor, fontSize: fontH3, top: normalizeHeight(-5) }}>TM</Text>
                        </View>
                        <View style={{ width: '10%', flexDirection: 'row' }}>
                            <Image source={blackDear} style={{ width: normalizeWidth(25), height: normalizeWidth(25) }} resizeMode="contain" />
                            <Text>©</Text>
                        </View>
                    </View>

                </View>

            </Animatable.View>
        </View>
    )
})

const mapStateToProps = state => {
    return {
        role: state.auth.role,
        allLocations: state.favoriteLocation.allLocations,
        selectedLocation: state.favoriteLocation.selectedLocation,
        locationFetchFirstTime: state.general.locationFetchFirstTime,
        InternetConnected: state?.InternetConnection?.internetConnected,
        InternalCoordinate: state?.favoriteLocation?.InternalCoordinate,
        InternalGeoLocation: state?.favoriteLocation.InternalGeoLocation
    };
};

const mapDispatchToProps = {
    updateSelectedLocation,
    GetAllUserLocation,
    IsArrowPressedFromHeader,
    ClearInternalLocationData
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)
const styles = StyleSheet.create({
    mainContainer: {
        height: Platform.OS === 'android' ? normalizeHeight(95) : normalizeHeight(80),
        borderWidth: 1,
        paddingHorizontal: normalizeWidth(20),
        paddingVertical: normalizeHeight(10),
        borderBottomRightRadius: normalizeWidth(20),
        borderBottomLeftRadius: normalizeWidth(20),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.46,
        shadowRadius: 11.14,

        elevation: 17,
        backgroundColor: primaryColor,
        borderColor: primaryColor
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: normalizeWidth(5)
    },
})