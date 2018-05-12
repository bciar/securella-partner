const partnerReducer = (state = {
  loggedIn: false
}, action) => {
  switch (action.type) {
    case "SET_LOGIN_STATE":
      state = {
        loggedIn: action.payload
      };
      break;
    default:
      break;
    }

   return state ;
};

export default partnerReducer;
