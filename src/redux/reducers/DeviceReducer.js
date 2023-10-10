import {  DEVICE_SUCCESS} from "../actions/index"

const initialState = {
    deviceId: '',
    deviceName: '',

}

const DeviceReducer = (state = initialState, action) => {
    switch (action.type) {
        case DEVICE_SUCCESS: {
            return {
                ...state,
                deviceId: action.payload.deviceId,
                deviceName: action.payload.deviceName
            }
        }
        default:
            return state
    }
}

export default DeviceReducer