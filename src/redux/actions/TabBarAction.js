export const ROUTE = "ROUTE";
export const TABINDEX = "TABINDEX";
export const Route = (route) => (dispatch, getState) => {
    dispatch(
        {
            type: ROUTE,
            payload: { route }
        }
    );

}

export const TabIndex = (num) => (dispatch, getState) => {
    dispatch(
        {
            type: TABINDEX,
            payload: { num }
        }
    );

}