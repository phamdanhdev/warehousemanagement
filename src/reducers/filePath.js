import { ADD_EXCEL_PATH } from "../constants/actionTypes";

const filePathReducer = (filePath = { excelFilePath: "" }, action) => {
  switch (action.type) {
    case ADD_EXCEL_PATH:
      return { ...filePath, excelFilePath: action.filePath };

    default:
      return filePath;
  }
};

export default filePathReducer;
