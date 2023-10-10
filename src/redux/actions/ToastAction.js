export const SHOW_TOAST_WITH_MESSAGE = "SHOW_TOAST_WITH_MESSAGE";

export const showToastWithMessage = (obj) => (dispatch, getState) => {
    dispatch({
        type: SHOW_TOAST_WITH_MESSAGE,
        payload: obj
    })
}