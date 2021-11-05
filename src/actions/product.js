import { ADD_PRODUCT_DATA } from "../constants/actionTypes";

export const addProductData = (productData) => (dispatch) => {
  dispatch({ type: ADD_PRODUCT_DATA, productData });
};
