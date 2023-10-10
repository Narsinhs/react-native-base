export const ON_BOARD_SUCCESS = "ON_BOARD_SUCCESS";

export const handleOnBoardSuccess = () => (dispatch, getState) => {
    dispatch({
        type: ON_BOARD_SUCCESS,
    })
}