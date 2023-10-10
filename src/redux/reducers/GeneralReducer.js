import { LOCATION_FETCH_FIRST_TIME, LOGOUT_SUCCESS, CHECKED_CURRENT_PRESSED } from "../actions";

const initialState = {
    locationFetchFirstTime: true,
    currentLocationPressed: false
}
const GeneralReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOCATION_FETCH_FIRST_TIME: {
            return {
                ...state,
                locationFetchFirstTime: false
            }
        }
        case CHECKED_CURRENT_PRESSED: {
            return {
                ...state,
                currentLocationPressed: action.payload
            }
        }
        case LOGOUT_SUCCESS: {
            return initialState
        }
        default:
            return state
    }
}

export default GeneralReducer