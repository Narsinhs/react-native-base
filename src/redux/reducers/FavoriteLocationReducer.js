import { UPDATE_LOCATION_ARRAY, UPDATE_SELECTED_LOCATION, CLEAR_INTERNAL_LOCATION, INTERNAL_CURRENT_LOCATION, INTERNAL_GEO_LOCATION, CURRENT_LOCATION, MAP_URIS, GEO_LOCATION, ALL_LOCATION, LOCATION_SAVE_SUCCESSFULLY, LOGOUT_SUCCESS, LOCATION_STATUS, LOCATION_UPDATE_SUCCESSFULLY, LOGIN_SUCCESS, OTP_SUCCESS, LOCATION_UNAVAILABLE } from "../actions";

const initialState = {
    allLocations: [],
    selectedLocation: {},
    Coordinate: {},
    InternalCoordinate: {},
    geoLocation: {},
    InternalGeoLocation: {},
    mapUri: {},
}
const favoriteLocationReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SELECTED_LOCATION: {
            return {
                ...state,
                selectedLocation: action.payload
            }
        }

        case ALL_LOCATION: {
            return {
                ...state,
                allLocations: action.payload,
            }
        }
        case LOCATION_STATUS: {
            return {
                ...state,
                allLocations: action.payload.all_locations
            }
        }
        case LOCATION_UPDATE_SUCCESSFULLY: {
            return {
                ...state,
                allLocations: action.payload,
            }
        }

        case LOCATION_SAVE_SUCCESSFULLY: {
            return {
                ...state,
                selectedLocation: action.payload,
                allLocations: [action.payload, ...state.allLocations]
            }
        }
        case CLEAR_INTERNAL_LOCATION: {
            return {
                ...state,
                InternalCoordinate: {},
                InternalGeoLocation: {}
            }
        }
        case MAP_URIS: {
            return {
                ...state,
                mapUri: action.payload
            }
        }
        case UPDATE_LOCATION_ARRAY: {
            return {
                ...state,
                allLocations: action.payload
            }
        }
        case CURRENT_LOCATION: {
            return {
                ...state,
                Coordinate: action.payload.Coordinate
            }
        }
        case INTERNAL_CURRENT_LOCATION: {
            return {
                ...state,
                InternalCoordinate: action.payload.Coordinate
            }
        }
        case GEO_LOCATION: {
            return {
                ...state,
                geoLocation: action.payload
            }
        }
        case INTERNAL_GEO_LOCATION: {
            return {
                ...state,
                InternalGeoLocation: action.payload
            }
        }

        case LOGOUT_SUCCESS: {
            return initialState
        }
        // case LOGIN_SUCCESS: {
        //     console.log("12121212121212121")
        //     return initialState
        // }
        case OTP_SUCCESS: {
            return initialState
        }
        case LOCATION_UNAVAILABLE: {
            return {
                ...state,
                selectedLocation: {},
                allLocations: [],
                geoLocation: {},
                Coordinate: {}
            }
        }
        default:
            return state
    }
}

export default favoriteLocationReducer