import axios from 'axios';
import {
  FAVORITE_ADD_REQUEST,
  FAVORITE_ADD_SUCCESS,
  FAVORITE_ADD_FAIL,
  FAVORITE_REMOVE_REQUEST,
  FAVORITE_REMOVE_SUCCESS,
  FAVORITE_REMOVE_FAIL,
  FAVORITE_LIST_REQUEST,
  FAVORITE_LIST_SUCCESS,
  FAVORITE_LIST_FAIL,
  FAVORITE_OPEN_DRAWER,
  FAVORITE_CLOSE_DRAWER,
} from '../constants/favoriteConstants';

export const openFavoriteDrawer = () => ({
  type: FAVORITE_OPEN_DRAWER
});

export const closeFavoriteDrawer = () => ({
  type: FAVORITE_CLOSE_DRAWER
});

export const addToFavorites = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FAVORITE_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.post(`/api/users/${userInfo._id}/favorites`, { productId }, config);

    dispatch({ type: FAVORITE_ADD_SUCCESS });
    dispatch(listFavorites()); 
  } catch (error) {
    dispatch({
      type: FAVORITE_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const removeFromFavorites = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FAVORITE_REMOVE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/users/${userInfo._id}/favorites/${productId}`, config);

    dispatch({ type: FAVORITE_REMOVE_SUCCESS });
    dispatch(listFavorites()); 
  } catch (error) {
    dispatch({
      type: FAVORITE_REMOVE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listFavorites = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FAVORITE_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/${userInfo._id}/favorites`, config);

    dispatch({
      type: FAVORITE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FAVORITE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};