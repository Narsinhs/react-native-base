import { LOGOUT_SUCCESS } from "../actions";
import { actions } from "../actions/HuntingDetailAction";

const initialState = {
  huntingDetails: {},
  calenderDetails: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.SET_HUNTING_DETAILS:
      return { ...state, huntingDetails: payload };
    case actions.SET_CALENDER_DETAILS:
      return { ...state, calenderDetails: payload };
    case LOGOUT_SUCCESS: {
      return initialState
    }
    default:
      return state;
  }
};
