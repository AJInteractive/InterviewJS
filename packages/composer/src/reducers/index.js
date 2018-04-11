import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import stories from "./stories";
import user from "./user";

const rootReducer = combineReducers({
  stories,
  user,
  routing: routerReducer
});

export default rootReducer;
