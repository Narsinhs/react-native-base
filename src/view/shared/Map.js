import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Image } from "react-native"
import { buttonColorYellow, draftColor, primaryColor, whiteColor } from '../../constants/Styles';
import { deviceWidth, normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
import CustomButton from './CustomButton';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import { MapBoxApiKeyToken } from '../../constants/constants';
import { connect } from 'react-redux';
import { setMapOfflineUri } from '../../redux/actions/index'
MapboxGL.setAccessToken(MapBoxApiKeyToken);
const Map = ({ handleCordinate, saveFetching = false, onMapPress, markers, headerArrowPressed, selectedLocation, mapUri, setMapOfflineUri, btnStatus, position, handleConfirm, draggable = false, handleDeny, height = Dimensions.get("window").height / 2, InternetConnection }) => {
    const totalHeight = Dimensions.get("window").height;
    const [uri, setUri] = useState('')
    Logger.setLogCallback(log => {
        const { message } = log;
        // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
        if (
            message.match('Request failed due to a permanent error: Canceled') ||
            message.match('Request failed due to a permanent error: Socket Closed')
        ) {
            return true;
        }
        return false;
    });
    useEffect(() => {
        if (InternetConnection && selectedLocation && position) {
            let location = position?.latitude + "," + position.longitude
            if (mapUri[location]) {
                return
            }
            else {
                takeSnapshot()
            }
        }
    }, [selectedLocation, headerArrowPressed])

    const takeSnapshot = async () => {
        const uri = await MapboxGL.snapshotManager.takeSnap({
            centerCoordinate: [position?.longitude, position?.latitude],
            width: deviceWidth,
            height,
            zoomLevel: 17,
            pitch: 30,
            heading: 20,
            styleURL: MapboxGL.StyleURL.Outdoors,
            writeToDisk: true, // creates a temp file
        });
        let temp = { ...mapUri }
        let location = position?.latitude + "," + position.longitude
        temp[location] = uri
        setMapOfflineUri(temp)
    }
    let location = position?.latitude + "," + position.longitude
    return (

        InternetConnection ?
            <MapboxGL.MapView
                key='mainmap'
                style={{ height: height, width: deviceWidth }}
                logoEnabled={false}
                onPress={(e) => onMapPress(e)}
                localizeLabels={true}
                showUserLocation={true}
                rotateEnabled={!saveFetching}
                zoomEnabled={!saveFetching}
                pitchEnabled={!saveFetching}
                scrollEnabled={!saveFetching}
                attributionEnabled={!saveFetching}
                styleURL={MapboxGL.StyleURL.Outdoors}
                textureMode={true}
                pitch={60}
                zoomLevel={17}
                maxZoomLevel={21}
                minZoomLevel={15}
                tintColor={primaryColor}

            >
                <MapboxGL.Camera
                    zoomLevel={14}
                    animationMode={'flyTo'}
                    animationDuration={1100}
                    centerCoordinate={[position?.longitude, position?.latitude]}
                // maxBounds={{
                //     ne: [-66.9513812,49.3457868],
                //     sw: [-124.7844079,24.743319],
                //   }}

                />
                {
                    markers && markers.map((val) => {
                        return (
                            <MapboxGL.PointAnnotation
                                id={val.id.toString()}
                                coordinate={[Number(val?.longitude), Number(val?.latitude)]}
                                draggable={draggable}
                                onDragEnd={(e) => onMapPress(e)}


                            />
                            // {/* <MapboxGL.Callout title='' /> */}
                            // {/* </MapboxGL.PointAnnotation> */}
                        )
                    })
                }
            </MapboxGL.MapView>
            :
            mapUri?.[location] ?
                <View style={{ flex: 1 }}>
                    <Image
                        source={{ uri: mapUri[location] }}
                        resizeMode="contain"
                        style={{ height: height, width: deviceWidth }}
                    />
                </View>
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: normalizeHeight(70) }}>
                    <CustomButton onPress={() => console.log("hello")} height={normalizeHeight(42)} buttonText={'No data is found on the selected location'} buttonColor={primaryColor} buttonTextColor={whiteColor} borderRadius={normalizeWidth(10)} bordercolor={primaryColor} disabled={true} />
                </View>
    )
}

const mapStateToProps = state => {
    return {
        InternetConnection: state.InternetConnection.internetConnected,
        mapUri: state.favoriteLocation.mapUri,
        selectedLocation: state.favoriteLocation.selectedLocation,
        headerArrowPressed: state.home.headerArrowPressed,
    };
};

const mapDispatchToProps = {
    setMapOfflineUri
}
export default connect(mapStateToProps, mapDispatchToProps)(Map)
const styles = StyleSheet.create({
    btnContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: normalizeWidth(20), bottom: normalizeWidth(80) },
    btnWidth: { width: '45%' }
})
