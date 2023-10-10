import Config from "../Config";
import { handleFetchError } from "./ErrorHandlerUtils";
import ErrorTypes from "../constants/errorContants";
import { registerToastMessage } from "./RegisterToast";

export const fetchUtil = (data) => {
    const { url, method = "GET", token = null, body = null, showToast = false } = data;
    let headers = { "Content-Type": "application/json", "Accept": "application/json" };
    if (token) {
        headers = { ...headers, Authorization: token };
    }
    return fetch(`${Config.env().API_URL}${url}`, {
        method,
        headers,
        body,
        credentials: "include",
    }).then((res) => (
        handleFetchError(res, showToast)
    )).catch((err) => {
        // handleFetchError(err,showToast)
        let ERROR = new Error(err).message;
        if (ErrorTypes.NetworkError.message == new Error(err).message) {
            if (showToast) {
                registerToastMessage(ErrorTypes.NetworkError.toastMessage, false)
            }
        }
    });
};
export const ImageUtil = (data) => {
    const { url, method = "GET", token = null, body = null } = data;
    let headers = {}
    if (token) {
        headers = { ...headers, Authorization: token };
    }
    return fetch(`${Config.env().API_URL}${url}`, {
        method,
        headers,
        body
    }).then(handleFetchError);
};
