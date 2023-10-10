
import { API_RESPONSE_STATUS } from "../../constants/Enum";
import { fetchUtil } from "../../utils/FetchUtils";
import { registerToastMessage } from "../../utils/RegisterToast";
import { getToken } from "../../utils/TokenUtil";
import { appendQueryParams, appendRouteParams } from "../../utils/UrlUtils";
export const HUNTING_DETAILS_DAY = "HUNTING_DETAILS_DAY"
export const HUNTING_DETAILS_MONTH = "HUNTING_DETAILS_MONTH"
export const FETCHING_HUNTING_DAYS = "FETCHING_HUNTING_DAYS"
export const COMPLETE_HUNTING_DAYS = "COMPLETE_HUNTING_DAYS"
export const NULL_HUNTING_TODAY = "NULL_HUNTING_TODAY";
export const NULL_HUNTING_MONTH = " NULL_HUNTING_MONTH";
export const WEATHER_TIME = " WEATHER_TIME";
export const GetHuntingDetailsForDay = (location_name, start_date = "2021-12-16", no_of_day = 14) => (dispatch, getState) => {
    dispatch({ type: FETCHING_HUNTING_DAYS })
    return fetchUtil({
        url: `/hunting-details/get/${location_name}/${start_date}/${no_of_day}`,
        method: `GET`,
        token: getToken()
    }).then((response) => {
        if (response.status === 200) {
            let huntingForToday = response?.data?.detail[0]
            let huntingForTomorrow = response?.data?.detail[1]
            let huntingFor4Day = response?.data?.detail.slice(2, 6)
            let huntingFor8Day = response?.data?.detail.slice(6, 10)
            let huntingFor12Day = response?.data?.detail.slice(10, 14)
            dispatch({ type: HUNTING_DETAILS_DAY, payload: { huntingFor12Day: huntingFor12Day, huntingFor8Day: huntingFor8Day, huntingFor4Day: huntingFor4Day, huntingForTomorrow: huntingForTomorrow, huntingForToday: huntingForToday } });
            return Promise.resolve(response);
        }
        else {
            if (response?.description && !response?.message) {
                registerToastMessage(response?.description, false)
            }
            dispatch({ type: COMPLETE_HUNTING_DAYS })
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        dispatch({ type: COMPLETE_HUNTING_DAYS })
        return Promise.reject(err);
    })
}

export const GetCurrentWeather = (lat, long, userId) => (dispatch, getState) => {
    return fetchUtil({
        url: `/current/temperature/${lat}/${long}/${userId}`,
        method: "GET",
        token: getToken()
    }).then((response) => {
        if (response?.status === API_RESPONSE_STATUS.SUCCESS) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    }).catch(err => {
        return Promise.reject(err);
    })
}
export const GetHuntingDetailsForMonth = (location_name, month_start_date) => (dispatch, getState) => {
    return fetchUtil({
        url: `/monthly-hunting-details/get/${location_name}/${month_start_date}`,
        method: `GET`,
        token: getToken()
    }).then((response) => {
        if (response.status === 200) {
            let huntingForMonth = response?.data?.detail
            dispatch({ type: HUNTING_DETAILS_MONTH, payload: huntingForMonth });
            return Promise.resolve(huntingForMonth);
        }
        else {
            if (response?.description && !response?.message) {
                registerToastMessage(response?.description, false)
            }
            return Promise.reject(response?.message);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
export const IS_PRESSED_HEADER = "IS_PRESSED_HEADER"
export const IsArrowPressedFromHeader = (flag) => (dispatch, getState) => {
    dispatch({
        type: IS_PRESSED_HEADER,
        payload: flag
    })
}

export const NullHuntingTodayData = () => (dispatch, getState) => {

    dispatch({
        type: NULL_HUNTING_TODAY,
        payload: {}
    })
}
export const NullHuntingMonthData = () => (dispatch, getState) => {

    dispatch({
        type: NULL_HUNTING_MONTH,
        payload: {}
    })
}

export const SetIndexTime = (indexTime = 0, isDay = false) => (dispatch, getState) => {

    dispatch({
        type: WEATHER_TIME,
        payload: { indexTime, isDay }
    })
}