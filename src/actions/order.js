import { ADD_ORDER_DATA } from "../constants/actionTypes";

export const addOrderData = (orderData) => (dispatch) => {
  dispatch({ type: ADD_ORDER_DATA, orderData });
};
