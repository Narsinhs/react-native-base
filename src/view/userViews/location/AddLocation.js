import React, { useState, useEffect } from "react";
import { MapboxAutocomplete } from "../../shared/MapboxAutocomplete";
import { StyleSheet, Text, View, Dimensions, Image, ScrollView, Platform, TouchableOpacity } from 'react-native'
import { buttonColorYellow, headingTextBlackColor, primaryColor, whiteColor } from "../../../constants/Styles";
import autoScrollHOC from "../../../hoc/AutoInputScrollHOC";
import { normalizeHeight, normalizeWidth } from "../../../utils/FontUtil";
import { backblackcolor, currentlocation } from "../../../assets/images";
import { UseCurrentLocation, LocationSave, CoordinateSet, IsArrowPressedFromHeader } from '../../../redux/actions';
import { connect } from 'react-redux';
import Map from "../../shared/Map";
import CustomButton from "../../shared/CustomButton";
import KeyboardDismissWrapper from "../../../components/sharedComponents/KeyboardDismissWrapper";
import { RouteNames } from "../../../constants/RouteNames";
import useAndroidResize from "../../../hooks/useAndroidResize";
import { DEFAULT_COORDINATE } from "../../../constants/Enum";

const AddLocation = (props) => {
    useAndroidResize()
    const totalHeight = Dimensions.get("window").height;
    const { UseCurrentLocation, LocationSave, Coordinate, CoordinateSet, selectedLocation, geoLocation, IsArrowPressedFromHeader } = props
    const [confirmButton, setConfirmButton] = useState(false)
    const [cord, setCord] = useState(Coordinate)
    const [markers, setMarkers] = useState([])
    const [saveFetching, setSaveFetching] = useState(false);
    const [isSelectedFromMap, setIsSelectedFromMap] = useState(false)
    useEffect(() => {
        setCord(props?.Coordinate?.latitude ? props?.Coordinate : DEFAULT_COORDINATE)
    }, [props?.Coordinate?.latitude, props?.Coordinate?.longitude])
    const handleBack = () => {
        CoordinateSet('', selectedLocation?.latitude, selectedLocation?.longitude).then((val) => {
        }).catch((e) => {
            console.log(e, "eeeeeeeeeeCoordinateSet")
        })
        return props.navigation.goBack()
    }
    const handleUseCurrentLocation = () => {
        UseCurrentLocation().then((val) => {
            setConfirmButton(true)
            setIsSelectedFromMap(true);
            setMarkers([{ id: new Date(), longitude: val?.longitude, latitude: val?.latitude }])
        }).catch((e) => {
            console.log(e, "eeeeUseCurrentLocation")
        })
    }
    const handleCordinate = (e, lat, long) => {
        if (lat && long) {
            CoordinateSet('', lat, long).then((val) => {
            }).catch((e) => {
                console.log(e, "eeeeeeeeeeCoordinateSet")
            })
        }
        else {
            CoordinateSet(e).then((val) => {
            }).catch((e) => {
                console.log(e, "eeeeeeeeeeCoordinateSet")
            })
        }
    }
    const renderLeftButton = () => {
        return (
            <TouchableOpacity hitSlop={{ right: 25, top: 25, left: 25, bottom: 25 }} style={{ alignItems: 'center', justifyContent: 'center' }} onPress={handleBack}>
                <Image source={backblackcolor} style={{ width: normalizeWidth(15), height: normalizeWidth(15), resizeMode: 'contain' }} />
            </TouchableOpacity>
        )
    }
    const renderCurrentLocation = () => {
        return (
            <TouchableOpacity hitSlop={{ right: 20, top: 20, left: 20, bottom: 20 }} style={{ alignItems: 'center', justifyContent: 'center', marginRight: normalizeWidth(10) }} onPress={handleUseCurrentLocation}>
                <Image source={currentlocation} style={{ width: normalizeWidth(20), height: normalizeWidth(20), resizeMode: 'contain' }} />
            </TouchableOpacity>
        )
    }
    const OnLocationClick = (rowData) => {
        setConfirmButton(true)
        if (rowData?.geometry?.coordinates) {
            let data = rowData?.geometry?.coordinates
            handleCordinate('', data[1], data[0])
            setMarkers([{ id: rowData?.id, longitude: data[0], latitude: data[1] }])
        }

    }
    const onMapPress = (e) => {
        if (saveFetching) {
            return
        }
        setIsSelectedFromMap(true);
        setConfirmButton(true)
        if (e?.geometry?.coordinates) {
            let data = e?.geometry?.coordinates
            setMarkers([{ id: new Date(), longitude: data[0], latitude: data[1] }])
            handleCordinate(e)
        }
    }
    const OnConfirm = () => {
        setSaveFetching(true);
        let obj = {
            latitude: cord?.latitude,
            longitude: cord?.longitude,
            location_name: geoLocation?.city || '',
            location_state: geoLocation?.state || '',
            location_place: geoLocation?.placeName
        }
        LocationSave(obj).then((val) => {
            IsArrowPressedFromHeader(true)
            setSaveFetching(false)
            setConfirmButton(false)
            return props.navigation.navigate(RouteNames.User.Location)
        }).catch((e) => {
            setSaveFetching(false)
            setConfirmButton(false)
            console.log(e, "errorLocationSave")
        })


    }

    return (
        <KeyboardDismissWrapper>
            <View style={{ flex: 1, backgroundColor: whiteColor }}>
                <View style={{ flex: 1, marginTop: normalizeWidth(30) }}>
                    <Map height={totalHeight} onMapPress={onMapPress} position={cord} markers={markers} draggable={true} saveFetching={saveFetching} />
                </View>
                <View style={styles.mainContainer}>
                    <View style={{ marginTop: Platform.OS === 'ios' ? 0 : normalizeWidth(30) }}>
                        <MapboxAutocomplete
                            isSelectedFromMap={isSelectedFromMap}
                            setIsSelectedFromMap={setIsSelectedFromMap}
                            renderLeftButton={renderLeftButton}
                            renderCurrentLocation={renderCurrentLocation}
                            onMapPress={OnLocationClick}
                            setConfirmButton={setConfirmButton}
                            selectedMapLocation={geoLocation?.placeName}
                        />
                    </View>
                </View>
                {
                    confirmButton ?
                        <View style={{ bottom: normalizeWidth(40), marginHorizontal: normalizeWidth(75) }}>
                            <CustomButton onPress={OnConfirm} buttonText={'Confirm'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} loading={saveFetching} disabled={saveFetching} />
                        </View>
                        :
                        <></>
                }
            </View>
        </KeyboardDismissWrapper>
    );
}
const mapStateToProps = state => {
    return {
        Coordinate: state.favoriteLocation.Coordinate,
        selectedLocation: state.favoriteLocation.selectedLocation,
        geoLocation: state.favoriteLocation.geoLocation
    };
};

const mapDispatchToProps = {
    UseCurrentLocation,
    LocationSave,
    CoordinateSet,
    IsArrowPressedFromHeader
}
export default connect(mapStateToProps, mapDispatchToProps)(AddLocation)
const styles = StyleSheet.create({
    mainContainer: {
        top: 0,
        // justifyContent:'flex-start',
        // alignItems:'flex-start',
        position: 'absolute',
        zIndex: 999,
        height: 'auto',
        width: '100%',
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

})