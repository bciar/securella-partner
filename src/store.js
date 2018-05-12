import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import { createLogger } from 'redux-logger'
import thunk from "redux-thunk";
import partner from "./reducers/partnerReducer.js";
import app from "./reducers/appReducer.js";
import alarm from "./reducers/alarmReducer.js";

const logger = createLogger({});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(
  combineReducers({
    partner, app, alarm
  }),
  {},
 composeEnhancers(applyMiddleware(logger, thunk))
);
