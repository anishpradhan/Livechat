
import auth from './auth';
import message from './message';
import { combineReducers } from "redux";

const allReducers = combineReducers({
    auth: auth,
    message: message
});

export default allReducers;