import { LOADING_TRUE, LOADING_FALSE } from "../constants/actionTypes";

export const setLoading = (booleanValue) => (dispatch) => {
  booleanValue
    ? dispatch({ type: LOADING_TRUE })
    : dispatch({ type: LOADING_FALSE });
};
