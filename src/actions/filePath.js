import { ADD_EXCEL_PATH } from "../constants/actionTypes";

export const addExcelFilePath = (filePath) => (dispatch) => {
  dispatch({ type: ADD_EXCEL_PATH, filePath });
};
