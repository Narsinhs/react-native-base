import { locationItemPressType, MapBoxApiKeyToken } from "../../constants/constants";
import Geolocation from 'react-native-geolocation-service';
import { fetchUtil } from "../../utils/FetchUtils";
import { getToken } from "../../utils/TokenUtil";
import { getFormattedLocation, requestLocationPermission } from "../../utils/CommonUtil";
import ErrorTypes from '../../constants/errorContants'
import { registerToastMessage } from "../../utils/RegisterToast";
import { IsArrowPressedFromHeader } from ".";
import { setHuntingDetails } from "./HuntingDetailAction";
export const UPDATE_SELECTED_LOCATION = "UPDATE_SELECTED_LOCATION";
export const UPDATE_LOCATION_ARRAY = "UPDATE_LOCATION_ARRAY"
export const CURRENT_LOCATION = "CURRENT_LOCATION"
export const GEO_LOCATION = "GEO_LOCATION"
export const ALL_LOCATION = "ALL_LOCATION"
export const LOCATION_SAVE_SUCCESSFULLY = "LOCATION_SAVE_SUCCESSFULLY"
export const LOCATION_STATUS = "LOCATION_STATUS"
export const LOCATION_UPDATE_SUCCESSFULLY = "LOCATION_UPDATE_SUCCESSFULLY"
export const LOCATION_UNAVAILABLE = "LOCATION_UNAVAILABLE"
export const MAP_URIS = "MAP_URIS"
export const CLEAR_INTERNAL_LOCATION = "CLEAR_INTERNAL_LOCATION"
export const INTERNAL_CURRENT_LOCATION = "INTERNAL_CURRENT_LOCATION"
export const INTERNAL_GEO_LOCATION = "INTERNAL_GEO_LOCATION"


export const updateSelectedLocation = (locationId, pressType, long, lat) => (dispatch, getState) => {
    const allFavoriteLocations = getState().favoriteLocation.allLocations;
    const updatedFavorite = allFavoriteLocations.findIndex(
        each => each.id == locationId);
    if (pressType === locationItemPressType.RADIO) {
        dispatch({
            type: UPDATE_SELECTED_LOCATION,
            payload: { ...allFavoriteLocations[updatedFavorite] }
        })
        dispatch(CoordinateSet("", lat, long))
    }
    else if (pressType === locationItemPressType.FAVORITE) {
        const cloneArray = [...allFavoriteLocations];
        cloneArray[updatedFavorite] = { ...cloneArray[updatedFavorite], is_favourite: !cloneArray[updatedFavorite].is_favourite }
        dispatch({
            type: UPDATE_LOCATION_ARRAY,
            payload: [...cloneArray]
        })
    }
}

export const UseCurrentLocation = (forced = false) => (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
        await requestLocationPermission()
        Geolocation.getCurrentPosition(
            (pos) => {
                const crd = pos.coords;
                dispatch({
                    type: forced ? INTERNAL_CURRENT_LOCATION : CURRENT_LOCATION,
                    payload: { Coordinate: { latitude: crd.latitude, longitude: crd.longitude, latitudeDelta: 0.0421, longitudeDelta: 0.0421 } }
                })
                dispatch(UseGeoLocation(crd.latitude, crd.longitude, forced))
                resolve(crd);
            }, (error) => {
                if (error?.message === ErrorTypes.GPSOFFERROR.message) {
                    registerToastMessage("Please turn on your Gps Location of your device.", false)
                }
            }
        ), { enableHighAccuracy: true, timeout: 20000 }
    })
}

export const UseGeoLocation = (lat, lng, forced = false) => (dispatch, getState) => {
    return fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MapBoxApiKeyToken}`).then((val) => {
        val.json().then((v) => {

            if (v.features) {
                let obj = v?.features;
                let locationDetails = getFormattedLocation(obj)
                let object = {
                    ...locationDetails,
                    placeName: obj[0]?.place_name || "N/A"
                }
                dispatch({
                    type: forced ? INTERNAL_GEO_LOCATION : GEO_LOCATION,
                    payload: object
                })
                return Promise.resolve(object);
            }
            else {
                return Promise.reject("Coordinates not found");
            }


        }).catch((e) => {
            console.log(e, "eror in geocoding")
        })
    })

}
export const CoordinateSet = (e, lat, long) => (dispatch, getState) => {
    if (e?.geometry?.coordinates) {
        let cordinate = e?.geometry?.coordinates
        dispatch({
            type: CURRENT_LOCATION,
            payload: { Coordinate: { latitude: cordinate[1], longitude: cordinate[0], latitudeDelta: 0.0421, longitudeDelta: 0.0421 } }
        })
        dispatch(UseGeoLocation(cordinate[1], cordinate[0]))
        return Promise.resolve({ latitude: cordinate[1], longitude: cordinate[0], latitudeDelta: 0.0421, longitudeDelta: 0.0421 });
    }

    else if (lat && long) {
        dispatch({
            type: CURRENT_LOCATION,
            payload: { Coordinate: { latitude: Number(lat), longitude: Number(long), latitudeDelta: 0.0421, longitudeDelta: 0.0421 } }
        })
        dispatch(UseGeoLocation(lat, long))
        return Promise.resolve({ latitude: lat, longitude: long, latitudeDelta: 0.0421, longitudeDelta: 0.0421 });
    }
    else {
        return Promise.reject("Coordinates are not proper")
    }
}

export const isFavoraite = (location_id, is_favourite, all_locations) => (dispatch, getState) => {
    return fetchUtil({
        url: `/user-locations/${location_id}/${is_favourite}`,
        method: `GET`,
        token: getToken()
    }).then((response) => {
        if (response.status === 200) {
            dispatch({ type: LOCATION_STATUS, payload: { location_id, is_favourite, all_locations } });
            return Promise.resolve();
        }
        else {
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
export const GetAllUserLocation = () => (dispatch, getState) => {
    return fetchUtil({
        url: `/user-locations`,
        method: `GET`,
        token: getToken()
    }).then((response) => {
        if (response.status === 200) {
            let allLocations = response?.data?.detail;
            dispatch({ type: ALL_LOCATION, payload: allLocations });
            return Promise.resolve(allLocations);
        }
        else {
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
export const DeleteLocationById = (user_location_id) => (dispatch, getState) => {
    return fetchUtil({
        url: `/user-locations/delete/${user_location_id}`,
        method: `DELETE`,
        token: getToken(),
        showToast: true
    }).then((response) => {
        if (response.status === 200) {
            const allFavoriteLocations = getState().favoriteLocation.allLocations
            const huntingDetails = getState().hunt.huntingDetails
            const geoLocation = allFavoriteLocations.find(location => location.id === user_location_id);
            let temp = { ...huntingDetails }
            delete temp[`${geoLocation.location_name},${geoLocation.state}`]
            dispatch(setHuntingDetails(temp))
            const Locations = allFavoriteLocations.filter(function (location) {
                return location.id != user_location_id;
            });
            let currentCoordinate = Locations[0]
            dispatch({ type: ALL_LOCATION, payload: Locations });
            if (!currentCoordinate?.latitude) {
                dispatch({ type: LOCATION_UNAVAILABLE })
            }
            else {
                dispatch({
                    type: UPDATE_SELECTED_LOCATION,
                    payload: Locations[0]
                })
                dispatch(CoordinateSet('', currentCoordinate?.latitude, currentCoordinate.longitude))
                setTimeout(() => {
                    dispatch(IsArrowPressedFromHeader(true))
                }, 500)
            }

            // dispatch(GetAllUserLocation())
            return Promise.resolve(response.message);
        }
        else {
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        console.log(err, "errerrerr")
        return Promise.reject(err);
    })
}
export const LocationSave = (obj) => (dispatch, getState) => {
    let body = JSON.stringify(obj)
    return fetchUtil({
        url: `/user-locations/save`,
        method: `Post`,
        body,
        token: getToken(),
        showToast: true
    }).then((response) => {
        if (response.status === 200) {
            let data = response?.data?.detail
            dispatch({ type: LOCATION_SAVE_SUCCESSFULLY, payload: data });
            return Promise.resolve(data);
        }
        else if (response.status === 400 && response?.force_update?.detail) {
            const allFavoriteLocations = getState().favoriteLocation.allLocations
            const Locations = allFavoriteLocations.filter(function (location) {
                return location.id != response?.force_update?.detail?.id;
            });
            let UpdatedLocation = [...Locations, response?.force_update?.detail]
            dispatch({ type: LOCATION_UPDATE_SUCCESSFULLY, payload: UpdatedLocation });
            return Promise.reject(response.message);
        }
        else {
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}

export const setMapOfflineUri = (Uri) => (dispatch, getState) => {
    dispatch({
        type: MAP_URIS,
        payload: Uri,
    })
}

export const ClearInternalLocationData = () => (dispatch, getState) => {
    dispatch({
        type: CLEAR_INTERNAL_LOCATION,
    })
}
