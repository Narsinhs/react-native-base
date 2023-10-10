import { ACKNOWLEDGE_SUBSCRIPTION, ACKNOWLEDGE_SUBSCRIPTION_FAILED, ACKNOWLEDGE_SUBSCRIPTION_SUCCESS } from "../actions/SubscriptionAction"

const initialState = {
    subAcknowledgeLoading: false
}

const SubscriptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACKNOWLEDGE_SUBSCRIPTION:
            return {
                ...state,
                subAcknowledgeLoading: true
            }
        case ACKNOWLEDGE_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                subAcknowledgeLoading: false
            }
        case ACKNOWLEDGE_SUBSCRIPTION_FAILED:
            return {
                ...state,
                subAcknowledgeLoading: false
            }
        default:
            return state
    }
}

export default SubscriptionReducer