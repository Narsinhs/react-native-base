import { GLOBAL_COUNTRIES_SUCCESS ,GLOBAL_STATE_SUCCESS,GLOBAL_CITY_SUCCESS} from "../actions/index"

const initialState = {
    countryName: [],
    stateName: [],
    cityName: [],
}
const CountryStateCityReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBAL_COUNTRIES_SUCCESS: {
            return {
                ...state,
                countryName : action.payload
            }
        }
        case GLOBAL_STATE_SUCCESS: {
            return {
                ...state,
                stateName : action.payload
            }
        }
        case GLOBAL_CITY_SUCCESS: {
            return {
                ...state,
                cityName : action.payload
            }
        }
        default:
            return state
    }
}

export default CountryStateCityReducer