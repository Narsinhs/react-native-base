import { LOGOUT_SUCCESS, SLUG_SUCCESS } from "../actions"

const intialState = {
    allSlug: []
}

const SlugReducer = (state = intialState, action) => {
    switch (action.type) {
        case SLUG_SUCCESS: {
            return {
                ...state,
                allSlug: action.payload
            }
        }
        case LOGOUT_SUCCESS: {
            return intialState
        }
        default: {
            return state
        }
    }
}
export default SlugReducer