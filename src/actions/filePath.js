import {
  ADD_ORDER_PATH,
  ADD_PRODUCT_PATH,
  ADD_IMPORT_PATH,
} from "../constants/actionTypes";

export const addOrderPath = (filePath) => (dispatch) => {
  dispatch({ type: ADD_ORDER_PATH, filePath });
};

export const addImportPath = (filePath) => (dispatch) => {
  dispatch({ type: ADD_IMPORT_PATH, filePath });
};

export const addProductPath = (filePath) => (dispatch) => {
  dispatch({ type: ADD_PRODUCT_PATH, filePath });
};
