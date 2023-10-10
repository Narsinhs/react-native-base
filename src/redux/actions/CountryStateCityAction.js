import { fetchUtil } from "../../utils/FetchUtils";

export const GLOBAL_COUNTRIES_SUCCESS = "GLOBAL_COUNTRIES_SUCCESS";
export const GLOBAL_STATE_SUCCESS = "GLOBAL_STATE_SUCCESS";
export const GLOBAL_CITY_SUCCESS = "GLOBAL_CITY_SUCCESS";
export const GlobalCountriesApi = () => (dispatch, getState) => {
    return fetchUtil({
        url: "/global/countries",
        method: `GET`
    }).then((response) => {
        if (response.status === 200) {
            let countryName=response.data
            dispatch({type:GLOBAL_COUNTRIES_SUCCESS,payload:countryName})
            return Promise.resolve(countryName)
        }else
        {
            return Promise.reject(response.error)
        }

    }).catch((err) => {
        console.log(err, "errGlobalCountriesApi")
    })
}

export const GlobalStatesApi = (country_id) => (dispatch, getState) => {
    return fetchUtil({
        url: `/global/states/${country_id}`,
        method: `GET`
    }).then((response) => {
        if (response.status === 200) {
            let stateName=response.data
            dispatch({type:GLOBAL_STATE_SUCCESS,payload:stateName})
            return Promise.resolve(stateName)
        }else
        {
            return Promise.reject(response.error)
        }
    }).catch((err) => {
        console.log(err, "errGlobalStatesApi")
    })
}

export const GlobalCityApi = (state_id) => (dispatch, getState) => {
    return fetchUtil({
        url: `/global/cities/${state_id}`,
        method: `GET`
    }).then((response) => {
        if (response.status === 200) {
            let cityName=response.data
            dispatch({type:GLOBAL_CITY_SUCCESS,payload:cityName})
            return Promise.resolve(cityName)
        }else
        {
            return Promise.reject(response.error)
        }
    }).catch((err) => {
        console.log(err, "errGlobalCityApi")
    })
}