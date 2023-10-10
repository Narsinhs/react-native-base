
export const actions = {
  SET_HUNTING_DETAILS: "SET_HUNTING_DETAILS",
  SET_CALENDER_DETAILS: "SET_CALENDER_DETAILS"
}

export const setHuntingDetails = (details) => ({
  type: actions.SET_HUNTING_DETAILS,
  payload: details,
})
export const setCalenderDetails = (details) => ({
  type: actions.SET_CALENDER_DETAILS,
  payload: details,
})