import { SHOW_TOAST_WITH_MESSAGE } from "../actions/index";
const initialState = {
    toastData: {
        visible: false,
        message: "",
        success: null
    }
};

const ToastReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_TOAST_WITH_MESSAGE: {
            return {
                ...state,
                toastData: {
                    visible: action.payload.visible,
                    message: action.payload.message,
                    success: action.payload.success
                }
            }
        }
        default: {
            return {
                state
            }
        }
    }
};

export default ToastReducer