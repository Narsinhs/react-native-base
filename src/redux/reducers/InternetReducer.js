import { SET_INTERNET_CONNECTION_STATUS } from "../actions"

const intialState = {
    internetConnected: false
}

const InternetReducer = (state = intialState, action) => {
    switch (action.type) {
        case SET_INTERNET_CONNECTION_STATUS: {
            return {
                ...state,
                internetConnected: action.payload
            }
        }
        default: {
            return state
        }
    }
}
export default InternetReducer