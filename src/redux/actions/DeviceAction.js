
export const DEVICE_SUCCESS = "DEVICE_SUCCESS";
export const DeviceInformation = (deviceId, deviceName) => (dispatch, getState) => {
    let payload = { deviceId, deviceName }
    dispatch({
        type: DEVICE_SUCCESS,
        payload
    })
}