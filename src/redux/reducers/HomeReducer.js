import { HUNTING_DETAILS_DAY, LOCATION_UNAVAILABLE, WEATHER_TIME, HUNTING_DETAILS_MONTH, IS_PRESSED_HEADER, NULL_HUNTING_MONTH, LOGOUT_SUCCESS, FETCHING_HUNTING_DAYS, COMPLETE_HUNTING_DAYS, NULL_HUNTING_TODAY } from "../actions/index"

const initialState = {
    huntingForToday: {},
    huntingForTomorrow: {},
    huntingFor4Day: [],
    huntingFor8Day: [],
    huntingFor12Day: [],
    huntingForMonth: [],
    headerArrowPressed: true,
    fetchingHuntingDays: false,
    indexTime: 0,
    isDay: false
}
const HomeReducer = (state = initialState, action) => {
    switch (action.type) {
        case HUNTING_DETAILS_DAY: {
            return {
                ...state,
                huntingFor4Day: action.payload.huntingFor4Day,
                huntingFor8Day: action.payload.huntingFor8Day,
                huntingFor12Day: action.payload.huntingFor12Day,
                huntingForTomorrow: action.payload.huntingForTomorrow,
                huntingForToday: action.payload.huntingForToday,
                fetchingHuntingDays: false
            }
        }
        case WEATHER_TIME: {
            return {
                ...state,
                indexTime: action.payload.indexTime,
                isDay: action.payload.isDay

            }
        }
        case IS_PRESSED_HEADER: {
            return {
                ...state,
                headerArrowPressed: action.payload
            }
        }
        case NULL_HUNTING_TODAY: {
            return {
                ...state,
                huntingForToday: {}
            }
        }
        case NULL_HUNTING_MONTH: {
            return {
                ...state,
                huntingForMonth: []
            }
        }
        case FETCHING_HUNTING_DAYS: {
            return {
                ...state,
                fetchingHuntingDays: true
            }
        }
        case COMPLETE_HUNTING_DAYS: {
            return {
                ...state,
                fetchingHuntingDays: false
            }
        }
        case HUNTING_DETAILS_MONTH: {
            return {
                ...state,
                huntingForMonth: action.payload,
            }
        }
        case LOCATION_UNAVAILABLE: {
            return {
                huntingForToday: {},
                huntingForTomorrow: {},
                huntingFor4Day: [],
                huntingFor8Day: [],
                huntingFor12Day: [],
                huntingForMonth: [],
            }
        }
        case LOGOUT_SUCCESS: {
            return initialState
        }
        default:
            return state
    }
}
export default HomeReducer