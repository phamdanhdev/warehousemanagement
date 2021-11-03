import { ADD_ORDER_DATA } from "../constants/actionTypes";

const orderReducer = (orderData = [], action) => {
  switch (action.type) {
    case ADD_ORDER_DATA:
      return action.orderData;

    default:
      return orderData;
  }
};

export default orderReducer;
