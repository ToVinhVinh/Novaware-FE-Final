import {
  FAVORITE_OPEN_DRAWER,
  FAVORITE_CLOSE_DRAWER,
} from "../constants/favoriteConstants";

export const favoriteDrawerReducer = (state = { open: false }, action) => {
  switch (action.type) {
    case FAVORITE_OPEN_DRAWER:
      return { open: true };
    case FAVORITE_CLOSE_DRAWER:
      return { open: false };
    default:
      return state;
  }
};

