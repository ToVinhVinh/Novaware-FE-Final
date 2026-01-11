import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
  CART_OPEN_DRAWER_PREVIEW,
  CART_TOGGLE_SELECT_ITEM,
  CART_SELECT_ALL_ITEMS,
} from "../constants/cartConstants";

import { USER_LOGOUT } from "../constants/userConstants";

const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: "",
};

// Hàm tạo key duy nhất cho mỗi item
const getItemKey = (item) =>
  `${item.product}-${item.sizeSelected}-${item.colorSelected}`;

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };

    case CART_TOGGLE_SELECT_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          getItemKey(item) === action.payload
            ? { ...item, selected: !item.selected }
            : item
        ),
      };

    case CART_SELECT_ALL_ITEMS:
      return {
        ...state,
        cartItems: state.cartItems.map((item) => ({
          ...item,
          selected: action.payload,
        })),
      };

    case "SET_SELECTED_CART_ITEMS":
      return {
        ...state,
        cartItems: state.cartItems.map((item) => ({
          ...item,
          selected: action.payload.includes(getItemKey(item)),
        })),
      };

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      };

    case USER_LOGOUT:
      return {
        ...state,
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "",
      };

    default:
      return state;
  }
};

export const cartOpenDrawerReducer = (state = false, action) => {
  switch (action.type) {
    case CART_OPEN_DRAWER_PREVIEW:
      return action.payload;
    default:
      return state;
  }
};
