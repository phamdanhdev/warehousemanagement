import { LOADING_TRUE, LOADING_FALSE } from "../constants/actionTypes";

const loadingReducer = (isLoading = false, action) => {
  switch (action.type) {
    case LOADING_FALSE:
      return false;
    case LOADING_TRUE:
      return true;
    default:
      return isLoading;
  }
};

export default loadingReducer;
