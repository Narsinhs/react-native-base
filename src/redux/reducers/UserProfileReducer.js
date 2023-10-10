import { UPDATE_USER_INFO_SUCCESS, UPDATE_USER_INFO_FAIL, GET_USER_INFO_SUCCESS } from "../actions/index"

const initialState = {
    authorize: false,
    deviceId: '',
    deviceName: ''
}

const UserProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER_INFO_SUCCESS: {
            return {
                ...state,
                authorize: true
            }
        }
        case GET_USER_INFO_SUCCESS: {
            return {
                ...state,
                deviceId: action.payload.deviceId,
                deviceName: action.payload.deviceName
            }
        }
        case UPDATE_USER_INFO_FAIL: {
            return {
                ...state,
                authorize: false
            }
        }
        default:
            return state
    }
}

export default UserProfileReducer