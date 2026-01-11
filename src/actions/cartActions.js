import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_OPEN_DRAWER_PREVIEW,
} from "../constants/cartConstants";

export const addToCart =
  (id, qty, sizeSelected, colorHex, colorName) =>
  async (dispatch, getState) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);

      // Find the matching variant if variants exist
      let variantPrice = data.price;
      let variantStock = data.countInStock;
      
      if (data.variants && data.variants.length > 0) {
        const matchingVariant = data.variants.find(
          (v) =>
            v.size?.toLowerCase() === sizeSelected?.toLowerCase() &&
            (v.color === colorHex || v.color === colorName)
        );
        
        if (matchingVariant) {
          variantPrice = matchingVariant.price || data.price;
          variantStock = matchingVariant.stock || data.countInStock;
        } else if (data.variants.length > 0) {
          // Use first variant as fallback
          variantPrice = data.variants[0].price || data.price;
          variantStock = data.variants[0].stock || data.countInStock;
        }
      }

      const normalizedSize = sizeSelected ? String(sizeSelected).toLowerCase() : "";
      const normalizedColor = colorName || colorHex || "";

      const newItem = {
        product: data._id || data.id || id,
        name: data.name || data.productDisplayName || "Product",
        qty: Number(qty) || 1,
        sizeSelected: normalizedSize,
        colorSelected: normalizedColor,
        size: data.size,
        color: data.colors,
        images: data.images || [],
        price: variantPrice,
        sale: data.sale || 0,
        priceSale: variantPrice * (1 - (data.sale || 0) / 100),
        countInStock: variantStock,
        selected: true, // Default to selected
      };

      const {
        cart: { cartItems },
      } = getState();

      const existItemIndex = cartItems.findIndex(
        (item) =>
          String(item.product) === String(newItem.product) &&
          String(item.sizeSelected).toLowerCase() === String(newItem.sizeSelected).toLowerCase() &&
          String(item.colorSelected) === String(newItem.colorSelected)
      );

      let updatedCartItems;

      if (existItemIndex !== -1) {
        updatedCartItems = [...cartItems];
        updatedCartItems[existItemIndex] = {
          ...updatedCartItems[existItemIndex],
          qty: updatedCartItems[existItemIndex].qty + newItem.qty,
        };
      } else {
        updatedCartItems = [...cartItems, newItem];
      }

      dispatch({
        type: CART_ADD_ITEM,
        payload: updatedCartItems,
      });

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

export const removeFromCart =
  (id, sizeSelected, colorSelected) => (dispatch, getState) => {
    const {
      cart: { cartItems },
    } = getState();

    const updatedCartItems = cartItems.filter(
      (item) =>
        !(
          item.product === id &&
          item.sizeSelected === sizeSelected &&
          item.colorSelected === colorSelected
        )
    );

    dispatch({
      type: CART_REMOVE_ITEM,
      payload: updatedCartItems,
    });

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

// Lưu địa chỉ giao hàng
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

// Lưu phương thức thanh toán
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

// Mở hoặc đóng cửa sổ xem trước giỏ hàng
export const setOpenCartDrawer = (isOpen) => {
  return { type: CART_OPEN_DRAWER_PREVIEW, payload: isOpen };
};

export const setSelectedCartItems = (selectedKeys) => (dispatch) => {
  dispatch({
    type: "SET_SELECTED_CART_ITEMS",
    payload: selectedKeys, // mảng các key định danh "productId-size-color"
  });
};
