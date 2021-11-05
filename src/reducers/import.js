import { ADD_IMPORT_DATA } from "../constants/actionTypes";

const importReducer = (importData = [], action) => {
  switch (action.type) {
    case ADD_IMPORT_DATA:
      return action.importData;

    default:
      return importData;
  }
};

export default importReducer;
