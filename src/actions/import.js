import { ADD_IMPORT_DATA } from "../constants/actionTypes";

export const addImportData = (importData) => (dispatch) => {
  dispatch({ type: ADD_IMPORT_DATA, importData });
};
