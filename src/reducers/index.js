import { combineReducers } from "redux";
import filePath from "./filePath";
import loading from "./loading";
import order from "./order";
export default combineReducers({ filePath, loading, order });
