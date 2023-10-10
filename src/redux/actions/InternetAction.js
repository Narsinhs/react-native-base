export const SET_INTERNET_CONNECTION_STATUS = "SET_INTERNET_CONNECTION_STATUS";

export const setInternetStatus = (flag) => (dispatch, getState) => {
    dispatch({
        type: SET_INTERNET_CONNECTION_STATUS,
        payload: flag
    })
}