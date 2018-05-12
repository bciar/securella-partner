const appReducer = (state = {
  loaded: false
}, action) => {
  switch (action.type) {
    case "SET_LOAD_STATE":
      state = {
        loaded: action.payload
      };
      break;
    default:
      break;
    }

   return state ;
};

export default appReducer;
