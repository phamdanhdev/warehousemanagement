import {
  ADD_ORDER_PATH,
  ADD_IMPORT_PATH,
  ADD_PRODUCT_PATH,
} from "../constants/actionTypes";

const filePathReducer = (
  filePath = { orderFilePath: "", importFilePath: "", productFilePath: "" },
  action
) => {
  switch (action.type) {
    case ADD_ORDER_PATH:
      return { ...filePath, orderFilePath: action.filePath };

    case ADD_IMPORT_PATH:
      return { ...filePath, importFilePath: action.filePath };

    case ADD_PRODUCT_PATH:
      return { ...filePath, productFilePath: action.filePath };

    default:
      return filePath;
  }
};

export default filePathReducer;
