
import { fetchUtil } from "../../utils/FetchUtils";
import { getToken } from "../../utils/TokenUtil";

import { AUTH_STATUS } from '../../constants/constants'
import { API_RESPONSE_STATUS } from "../../constants/Enum";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_PENDING = "LOGIN_PENDING";

export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";

export const SAVE_FCM_TOKEN = "SAVE_FCM_TOKEN";
export const OTP_SUCCESS = "OTP_SUCCESS";
export const FREE_SUBSCRIBED = "FREE_SUBSCRIBED";

export const FETCHING_USER_INFO = "FETCHING_USER_INFO";
export const FETCHING_USER_INFO_SUCCESS = "FETCHING_USER_INFO_SUCCESS";
export const FETCHING_USER_INFO_FAILED = "FETCHING_USER_INFO_FAILED";


export const getMe = () => (dispatch, getState) => {
    dispatch({
        type: FETCHING_USER_INFO
    })
    return fetchUtil({
        url: '/user/info',
        token: getToken()
    }).then(response => {
        if (response.status === API_RESPONSE_STATUS.SUCCESS) {
            let user = response.data.user;
            let token = response.data.token;
            dispatch({ type: FETCHING_USER_INFO_SUCCESS, payload: { user, token } });
            return Promise.resolve(response?.data)
        }
        else {
            dispatch({
                type: FETCHING_USER_INFO_FAILED
            })
            return Promise.reject(response?.message);
        }
    }).catch(e => {
        dispatch({
            type: FETCHING_USER_INFO_FAILED
        })
        return Promise.reject(e);
    })
}

export const loginApi = (obj) => (dispatch, getState) => {
    let body = JSON.stringify(obj)
    return fetchUtil({
        url: "/login",
        method: `POST`,
        body,
        showToast: true
    }).then((response) => {
        if (response.status === 200) {
            let user = response.data.user
            let token = response.data.token
            dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
            return Promise.resolve(response.data.user);
        } else if (response?.data.user?.personal?.auth_status === AUTH_STATUS.NOT_VERIFIED) {
            let user = response.data.user
            dispatch({ type: LOGIN_PENDING, payload: { user } });
            return Promise.resolve(response?.data.user?.personal);
        }
        else {
            return Promise.reject(response?.message);
        }
    }).catch((err) => {
        console.log(err, "errloginApi")
        return Promise.reject(err);
    })
}

export const googleLoginApi = (obj) => (dispatch, getState) => {
    let body = JSON.stringify(obj)
    return fetchUtil({
        url: "/auth/google/callback",
        method: `POST`,
        body,
        showToast: true
    }).then((response) => {
        if (response.status === 200) {
            let user = response.data.user
            let token = response.data.token
            dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
            return Promise.resolve(response.data.user);
        } else if (response?.data.user?.personal?.auth_status === AUTH_STATUS.NOT_VERIFIED) {
            let user = response.data.user
            dispatch({ type: LOGIN_PENDING, payload: { user } });
            return Promise.resolve(response?.data.user?.personal);
        }
        else {
            return Promise.reject(response?.message);
        }
    }).catch((err) => {
        console.log(err, "ERROR GOOGLE LOGIN API")
        return Promise.reject(err);
    })
}

export const SignUp = (bodyData) => (dispatch) => {
    let body = JSON.stringify(bodyData)
    return fetchUtil({
        url: `/register`,
        method: `POST`,
        body,
        showToast: true
    }).then((response) => {
        if (response.status === 200) {
            let user = response.data.user
            let verifyCode = response.data.verify_code
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: { user, verifyCode }
            })
            return Promise.resolve(response);
        } else {
            return Promise.reject(response.error);
        }
    }).catch((err) => {
        console.log(`((((((((((( --- ERROR IN REGISTER API ---))))))))))) `, err);
        return Promise.reject(err);
    })
}

export const OtpVerification = (bodyData) => (dispatch) => {
    let body = JSON.stringify(bodyData)
    return fetchUtil({
        url: `/register/verify/email/code`,
        method: `POST`,
        body,
        showToast: true
    }).then((response) => {
        if (response.status === 200) {
            let token = response.data.token
            let user = response.data.user
            dispatch({
                type: OTP_SUCCESS,
                payload: { user, token }
            })
            return Promise.resolve(response);
        } else {

            return Promise.reject(response.message);
        }
    }).catch((err) => {
        console.log(`((((((((((( --- ERROR IN REGISTER API ---))))))))))) `, err);
        return Promise.reject(err);
    })
}

export const OtpResendCode = (email) => (dispatch) => {
    let body = JSON.stringify({ email })
    return fetchUtil({
        url: `/register/resend/code`,
        method: `POST`,
        body,
        showToast: true
    }).then((response) => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        console.log(`((((((((((( --- ERROR IN REGISTER API ---))))))))))) `, err);
        return Promise.reject(err);
    })
}


export const ForgotPassword = (obj) => (dispatch) => {
    let body = JSON.stringify(obj)
    return fetchUtil({
        url: `/reset/password`,
        method: `POST`,
        body,
        showToast: true
    }).then((response) => {
        console.log(response, "response")
        if (response.status === 200) {
            let resetCode = response?.data?.reset_code
            dispatch({
                type: FORGOT_PASSWORD,
                payload: resetCode
            })
            return Promise.resolve(resetCode);
        } else {
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        console.log(`((((((((((( --- ERROR IN REGISTER API ---))))))))))) `, err);
        return Promise.reject(err);
    })

}

export const ChangePasswordApi = (obj) => (dispatch) => {
    let body = JSON.stringify(obj)
    return fetchUtil({
        url: `/reset/new-password`,
        method: `POST`,
        body,
        showToast: true
    }).then((response) => {
        console.log(response, "response")
        if (response.status === 200) {
            return Promise.resolve(response.message);
        } else {
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        console.log(`((((((((((( --- ERROR IN ChangePassword API ---))))))))))) `, err);
        return Promise.reject(err);
    })
}



export const saveFcmToken = (token) => (dispatch, getState) => {
    dispatch({
        type: SAVE_FCM_TOKEN,
        payload: { fcmToken: token }
    })
}


export const SignOutApi = () => (dispatch, getState) => {
    fetchUtil({
        url: `/logout`,
        method: `GET`,
        token: getToken(),
        showToast: true
    }).then((response) => {
        if (response.status === API_RESPONSE_STATUS.SUCCESS) {
            return Promise.resolve(response);
        }
        else {
            return Promise.reject(false);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })

    dispatch({ type: LOGOUT_SUCCESS });
}

export const FreeSubscription = () => (dispatch, getState) => {
    return (
        dispatch({ type: FREE_SUBSCRIBED })
    )

}