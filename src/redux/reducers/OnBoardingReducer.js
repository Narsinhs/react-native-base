import { ON_BOARD_SUCCESS } from '../actions/index'

const initialState = {
    isOneBoardSuccess: false
}

const OnBoardingReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_BOARD_SUCCESS: {
            return {
                ...state,
                isOneBoardSuccess: true
            }
        }
        default:
            return state
    }
}

export default OnBoardingReducer