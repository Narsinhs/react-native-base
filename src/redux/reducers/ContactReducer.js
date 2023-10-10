import { CONTACT_FORM_SUCCESS, CONTACT_FORM_FAIL } from "../actions/index"

const initialState = {
    authorize: false,
    token: '',
}

const ContactReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONTACT_FORM_SUCCESS: {
            return {
                ...state,
                authorize: true
            }
        }
        case CONTACT_FORM_FAIL: {
            return {
                ...state,
                //  message
            }
        }
        case CONTACT_FORM_FAIL: {
            return {
                ...state,
                authorize: false
            }
        }
        default:
            return state
    }
}

export default ContactReducer