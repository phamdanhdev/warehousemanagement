import { ADD_PRODUCT_DATA } from "../constants/actionTypes";

const productReducer = (productData = [], action) => {
  switch (action.type) {
    case ADD_PRODUCT_DATA:
      return action.productData;

    default:
      return productData;
  }
};

export default productReducer;
