import { Platform } from "react-native";
import { getMe } from ".";
import { API_RESPONSE_STATUS } from "../../constants/Enum";
import { fetchUtil } from "../../utils/FetchUtils";
import { getToken } from "../../utils/TokenUtil";

export const ACKNOWLEDGE_SUBSCRIPTION = "ACKNOWLEDGE_SUBSCRIPTION";
export const ACKNOWLEDGE_SUBSCRIPTION_SUCCESS = "ACKNOWLEDGE_SUBSCRIPTION_SUCCESS";
export const ACKNOWLEDGE_SUBSCRIPTION_FAILED = "ACKNOWLEDGE_SUBSCRIPTION_FAILED";


export const acknowledgeSubscription = (subscriptionReceipt) => (dispatch, getState) => {
    dispatch({
        type: ACKNOWLEDGE_SUBSCRIPTION
    })
    return fetchUtil({
        url: Platform.OS === 'android' ? "/checkout/google" : "/checkout/apple",
        method: `POST`,
        body: JSON.stringify(subscriptionReceipt),
        token: getToken(),
        showToast: true
    }).then((response) => {
        console.log("THIS IS RESPONSE", response)
        if (response.status === API_RESPONSE_STATUS.SUCCESS) {
            dispatch({
                type: ACKNOWLEDGE_SUBSCRIPTION_SUCCESS
            })
            dispatch(getMe())
            return Promise.resolve(response?.message);
        }
        else {
            dispatch({
                type: ACKNOWLEDGE_SUBSCRIPTION_FAILED
            })
            return Promise.reject(response?.message);
        }
    }).catch((err) => {
        console.log("I AM INSIDE CACTCH***************")
        dispatch({
            type: ACKNOWLEDGE_SUBSCRIPTION_FAILED
        })
        return Promise.reject(err);
    })

}