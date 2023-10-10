import { FETCHING_USER_INFO, FETCHING_USER_INFO_SUCCESS, FETCHING_USER_INFO_FAILED, LOGIN_SUCCESS, LOGOUT_SUCCESS, SIGNUP_SUCCESS, LOGIN_PENDING, OTP_SUCCESS, FORGOT_PASSWORD, FREE_SUBSCRIBED } from "../actions/index"

const initialState = {
    authorize: false,
    user: {},
    verifyCode: null,
    token: null,
    resetCode: null,
    userInfoLoading: false
}

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCHING_USER_INFO: {
            return {
                ...state,
                userInfoLoading: true
            }
        }
        case FETCHING_USER_INFO_SUCCESS: {
            return {
                ...state,
                authorize: action.payload.user?.personal?.is_subscribed ? true : false,
                userInfoLoading: false,
                user: action.payload.user,
                token: action.payload.token,
            }
        }
        case FETCHING_USER_INFO_FAILED: {
            return {
                ...state,
                userInfoLoading: false,
            }
        }
        case LOGIN_SUCCESS: {
            return {
                ...state,
                authorize: action.payload.user?.personal?.is_subscribed ? true : false,
                user: action.payload.user,
                token: action.payload.token,
            }
        }
        case LOGIN_PENDING: {
            return {
                ...state,
                user: action.payload.user,
            }
        }
        case OTP_SUCCESS: {
            return {
                ...state,
                // authorize: false,
                user: action.payload.user,
                token: action.payload.token,
            }
        }
        case FREE_SUBSCRIBED: {
            return {
                ...state,
                authorize: true,
            }
        }

        case FORGOT_PASSWORD: {
            return {
                ...state,
                resetCode: action.payload,
            }
        }
        case SIGNUP_SUCCESS: {
            return {
                ...state,
                authorize: false,
                user: action.payload.user,
                verifyCode: action.payload.verifyCode,
            }
        }
        case LOGOUT_SUCCESS: {
            return initialState
        }
        default:
            return state
    }
}

export default AuthReducer