import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { cartReducer, cartOpenDrawerReducer } from "./reducers/cartReducers";
import { snackbarReducer } from "./reducers/snackbarReducers";
import { chatReducer } from "./reducers/chatReducers";
import { filterReducer } from "./reducers/filterReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
  userForgotPasswordReducer,
  userVerifyCodeReducer,
  userResetPasswordReducer,
} from "./reducers/userReducers";
import {
  favoriteDrawerReducer,
} from "./reducers/favoriteReducers";
import thunk from "redux-thunk";

const reducers = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  userForgotPassword: userForgotPasswordReducer,
  userVerifyCode: userVerifyCodeReducer,
  userResetPassword: userResetPasswordReducer,
  cart: cartReducer,
  cartOpenDrawer: cartOpenDrawerReducer,
  snackbarState: snackbarReducer,
  filter: filterReducer,
  chat: chatReducer,
  favoriteDrawer: favoriteDrawerReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middlewares = [thunk];

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
