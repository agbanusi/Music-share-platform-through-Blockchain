import { combineReducers } from "redux";
import auth from "./modules/auth/index";

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;
