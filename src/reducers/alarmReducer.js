const alarmReducer = (state = {
  alarm: false
}, action) => {
  switch (action.type) {
    case "SET_ALARM_STATE":
      state = {
        alarm: action.payload
      };
      break;
    default:
      break;
    }

   return state ;
};

export default alarmReducer;
