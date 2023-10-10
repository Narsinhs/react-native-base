import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, ScrollView } from 'react-native'
import { capital, planetEarth, surface } from '../../../assets/images'
import { fontFamily, fontH1, fontH2, fontH20, fontH2V2, fontH2V3, fontH3, headingTextBlackColor, primaryColor, whiteColor } from '../../../constants/Styles'
import { normalizeFont, normalizeHeight, normalizeWidth } from '../../../utils/FontUtil'
import Map from '../../shared/Map'
import { useNetInfo } from "@react-native-community/netinfo";
import AnimatedLottieView from 'lottie-react-native'
import { CoordinateSet } from '../../../redux/actions';
import { connect } from 'react-redux';
import { convertDMS } from '../../../utils/ConvertDmsUtil'
import { DEFAULT_COORDINATE } from '../../../constants/Enum'

const Location = (props) => {
    const { InternetConnection, allLocations, InternalGeoLocation, InternalCoordinate } = props;
    const totalWidth = Dimensions.get("window").width;
    const [coordinate, setCoordinate] = useState(InternalCoordinate || props?.Coordinate);
    const [markers, setMarkers] = useState(allLocations || [])
    const [dms, setDms] = useState({
        latDMS: "",
        longDMS: ""
    })
    const [geoPosition, setGeoPosition] = useState(InternalGeoLocation || props?.geoLocation)
    useEffect(() => {
        HandleDMS(InternalCoordinate?.latitude || props?.Coordinate?.latitude || DEFAULT_COORDINATE.latitude, InternalCoordinate?.longitude || props?.Coordinate?.longitude || DEFAULT_COORDINATE.longitude)
        setCoordinate(InternalCoordinate?.latitude ? InternalCoordinate : props?.Coordinate?.latitude ? props?.Coordinate : DEFAULT_COORDINATE)
        setGeoPosition(InternalGeoLocation?.state ? InternalGeoLocation : props?.geoLocation)
        setMarkers(allLocations)
    }, [InternalCoordinate, InternalGeoLocation, props?.Coordinate?.latitude, props?.Coordinate?.longitude, props?.geoLocation?.city, props?.geoLocation?.country, props?.geoLocation?.state, allLocations?.length])
    const HandleDMS = (lat, long) => {
        let DMS = convertDMS(lat, long)
        setDms({ ...dms, latDMS: DMS.latDMS, longDMS: DMS.longDMS })
    }
    const onMapPress = (e) => {
        handleCordinate(e)
    }
    const handleCordinate = (e) => {
        const { CoordinateSet } = props
        CoordinateSet(e).then((val) => {
        }).catch((e) => {
            console.log(e, "eeeeeeeeeeCoordinateSet")
        })
    }
    const RenderLatLongBox = () => {
        return (
            <View style={{ ...styles.longLatBox, width: totalWidth - 50, }}>
                <View style={styles.latlongContainer}>
                    <View style={styles.latlongWidth}>
                        <Text style={styles.latlongText}>Longitude</Text>
                        <Text style={styles.latlongTextContainer}>{coordinate?.longitude?.toFixed(5) || "N/A"}</Text>
                        <Text style={styles.latlongText}>{dms?.longDMS}</Text>
                    </View>
                    <View style={{ ...styles.verticleLine, backgroundColor: whiteColor }}></View>
                    <View style={styles.latlongWidth}>
                        <Text style={styles.latlongText}>Latitude</Text>
                        <Text style={styles.latlongTextContainer}>{coordinate?.latitude?.toFixed(5) || "N/A"}</Text>
                        <Text style={styles.latlongText}>{dms?.latDMS}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const RenderOfflineMode = useMemo(() => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 4, alignItems: 'center' }}>
                        <AnimatedLottieView source={require('../../../assets/lottie/noInternet.json')} autoPlay loop style={{ height: normalizeHeight(350) }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'black', fontFamily: fontFamily.Primary.SemiBold, fontSize: normalizeFont(20), textAlign: 'center' }}>Location Offline Mode</Text>
                    </View>
                </View >
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <RenderLatLongBox />
                </View>
            </View >
        )
    }, [InternetConnection])
    return (
        <>
            {
                !InternetConnection && !markers?.length ?
                    <>
                        {RenderOfflineMode}
                    </>

                    :
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.mainContainer}>
                            <RenderLatLongBox />
                            <View style={styles.cityContainer}>
                                <View style={styles.viewContainer}>
                                    <Text style={styles.cityText}>City</Text>
                                    <Image source={surface} style={styles.imgContainer} />
                                    <Text style={styles.textCenter}>{geoPosition?.city || "N/A"}</Text>
                                </View>
                                <View style={{ ...styles.verticleLine, backgroundColor: headingTextBlackColor }}></View>
                                <View style={{ ...styles.viewContainer, marginHorizontal: normalizeWidth(5) }}>
                                    <Text style={styles.cityText}>Country</Text>
                                    <Image source={planetEarth} style={styles.imgContainer} />
                                    <Text style={styles.textCenter}>{geoPosition?.country || "N/A"}</Text>
                                </View>
                                <View style={{ ...styles.verticleLine, backgroundColor: headingTextBlackColor }}></View>
                                <View style={styles.viewContainer}>
                                    <Text style={styles.cityText}>State</Text>
                                    <Image source={capital} style={styles.imgContainer} />
                                    <Text style={styles.textCenter}>{geoPosition?.state || "N/A"}</Text>
                                </View>
                            </View>
                            <Map position={coordinate} onMapPress={onMapPress} markers={markers} />
                        </View>
                    </ScrollView>
            }

        </>
    )
}
const mapStateToProps = state => {
    return {
        allLocations: state.favoriteLocation.allLocations,
        selectedLocation: state.favoriteLocation.selectedLocation,
        Coordinate: state.favoriteLocation.Coordinate,
        geoLocation: state.favoriteLocation.geoLocation,
        InternetConnection: state.InternetConnection.internetConnected,
        InternalGeoLocation: state.favoriteLocation.InternalGeoLocation,
        InternalCoordinate: state.favoriteLocation.InternalCoordinate
    };
};

const mapDispatchToProps = {
    CoordinateSet
}
export default connect(mapStateToProps, mapDispatchToProps)(Location)

const styles = StyleSheet.create({
    verticleLine: {
        height: '100%',
        width: 1,
        opacity: 0.5
    },
    mainContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    longLatBox: { height: 'auto', paddingVertical: normalizeHeight(20), marginVertical: normalizeWidth(20), borderWidth: 1, borderColor: primaryColor, backgroundColor: primaryColor, borderRadius: normalizeWidth(10) },
    latlongContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
    latlongWidth: { width: '49%' },
    latlongText: { marginBottom: normalizeWidth(5), color: whiteColor, textAlign: 'center' },
    latlongTextContainer: { color: whiteColor, fontSize: fontH1, textAlign: 'center', marginBottom: normalizeWidth(5) },
    cityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: normalizeWidth(20) },
    viewContainer: { width: '33%', alignItems: 'center' },
    cityText: { textAlign: 'center', marginBottom: normalizeWidth(5), color: headingTextBlackColor, fontFamily: fontFamily.Primary.Regular, fontSize: fontH3 },
    imgContainer: { width: normalizeWidth(25), height: normalizeWidth(25), marginBottom: normalizeWidth(5) },
    textCenter: { textAlign: 'center', color: headingTextBlackColor, fontFamily: fontFamily.Primary.Regular, fontSize: fontH2V3 }
})
