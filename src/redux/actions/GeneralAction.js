
export const LOCATION_FETCH_FIRST_TIME = "LOCATION_FETCH_FIRST_TIME"
export const CHECKED_CURRENT_PRESSED = "CHECKED_CURRENT_PRESSED"
export const LocationSuccessFirstTime = () => (dispatch, getState) => {
    return (
        dispatch({ type: LOCATION_FETCH_FIRST_TIME })
    )
}
export const CheckIsCurrentLocationPressed = (pressed) => (dispatch, getState) => {
    dispatch({
        type: CHECKED_CURRENT_PRESSED,
        payload: pressed,
    })
}