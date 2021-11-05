import { combineReducers } from "redux";
import filePath from "./filePath";
import loading from "./loading";
import order from "./order";
import importProduct from "./import";
import product from "./product";
export default combineReducers({
  filePath,
  loading,
  order,
  import: importProduct,
  product,
});
