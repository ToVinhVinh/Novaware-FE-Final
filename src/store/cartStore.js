import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isDrawerOpen: false,
      shippingAddress: {},
      paymentMethod: "",
      addToCart: (productData, qty, sizeSelected, colorHex, colorName) => {
        const { cartItems } = get();
        let variantPrice = productData.price || 0;
        let variantStock = productData.countInStock || 0;
        
        if (productData.variants && productData.variants.length > 0) {
          const matchingVariant = productData.variants.find(
            (v) =>
              v.size?.toLowerCase() === sizeSelected?.toLowerCase() &&
              (v.color === colorHex || v.color === colorName)
          );
          
          if (matchingVariant) {
            variantPrice = matchingVariant.price || productData.price || 0;
            variantStock = matchingVariant.stock || productData.countInStock || 0;
          } else if (productData.variants.length > 0) {
            variantPrice = productData.variants[0].price || productData.price || 0;
            variantStock = productData.variants[0].stock || productData.countInStock || 0;
          }
        }

        const productId = productData._id || productData.id || "";
        const salePercent = productData.sale || 0;
        const calculatedPriceSale = variantPrice * (1 - salePercent / 100);
        const roundedPriceSale = Math.round(calculatedPriceSale * 100) / 100;

        // Derive sizes and colors from variants if not provided
        let derivedSize = productData.size || {};
        let derivedColor = productData.colors || productData.color || [];

        if (productData.variants && productData.variants.length > 0) {
          // If size is an array or empty, convert to object {sizeName: stock} from variants
          if (Array.isArray(derivedSize) || Object.keys(derivedSize).length === 0) {
            const sizeObj = {};
            productData.variants.forEach(v => {
              const s = (v.size || "M").toUpperCase();
              sizeObj[s] = (sizeObj[s] || 0) + (v.stock || 0);
            });
            derivedSize = sizeObj;
          }

          // If color is empty, derive from variants
          if (!derivedColor || (Array.isArray(derivedColor) && derivedColor.length === 0)) {
            const colorMap = new Map();
            productData.variants.forEach(v => {
              if (v.color && !colorMap.has(v.color)) {
                colorMap.set(v.color, { name: v.color, hexCode: v.color });
              }
            });
            derivedColor = Array.from(colorMap.values());
          }
        }

        // Final fallbacks if still empty (common for products without variants like handbags)
        if (Object.keys(derivedSize).length === 0) {
          derivedSize = { "One Size": productData.countInStock || 1 };
        }
        if (!derivedColor || (Array.isArray(derivedColor) && derivedColor.length === 0)) {
          const fallbackColor = productData.baseColour || "Standard";
          derivedColor = [{ name: fallbackColor, hexCode: fallbackColor }];
        }

        const normalizedSize = sizeSelected ? String(sizeSelected).toUpperCase() : (Object.keys(derivedSize)[0] || "");
        const normalizedColor = colorName || colorHex || (derivedColor[0]?.name || "");

        const newItem = {
          product: productId,
          name: productData.name || productData.productDisplayName || "Product",
          qty: Number(qty) || 1,
          sizeSelected: normalizedSize,
          colorSelected: normalizedColor,
          size: derivedSize,
          color: derivedColor,
          variants: productData.variants || [],
          images: productData.images || [],
          price: Math.round(variantPrice * 100) / 100,
          sale: salePercent,
          priceSale: roundedPriceSale,
          countInStock: variantStock,
          selected: true,
        };

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

        set({ cartItems: updatedCartItems });
        return updatedCartItems;
      },

      // Remove item from cart
      removeFromCart: (productId, sizeSelected, colorSelected) => {
        const { cartItems } = get();
        const updatedCartItems = cartItems.filter(
          (item) =>
            !(
              String(item.product) === String(productId) &&
              String(item.sizeSelected).toLowerCase() === String(sizeSelected).toLowerCase() &&
              String(item.colorSelected) === String(colorSelected)
            )
        );
        set({ cartItems: updatedCartItems });
        return updatedCartItems;
      },

      // Update item quantity
      updateItemQty: (productId, sizeSelected, colorSelected, qty) => {
        const { cartItems } = get();
        const updatedCartItems = cartItems.map((item) => {
          if (
            String(item.product) === String(productId) &&
            String(item.sizeSelected).toLowerCase() === String(sizeSelected).toLowerCase() &&
            String(item.colorSelected) === String(colorSelected)
          ) {
            return { ...item, qty: Number(qty) || 1 };
          }
          return item;
        });
        set({ cartItems: updatedCartItems });
        return updatedCartItems;
      },

      // Update cart item (remove old and add new with different size/color/qty)
      updateCartItem: (oldItem, newProductData, qty, sizeSelected, colorHex, colorName) => {
        const { cartItems, removeFromCart, addToCart } = get();
        
        // Remove old item
        removeFromCart(oldItem.product, oldItem.sizeSelected, oldItem.colorSelected);
        
        // Add new item
        return addToCart(newProductData, qty, sizeSelected, colorHex, colorName);
      },

      // Toggle item selection
      toggleItemSelection: (productId) => {
        const { cartItems } = get();
        const updatedCartItems = cartItems.map((item) =>
          String(item.product) === String(productId)
            ? { ...item, selected: !item.selected }
            : item
        );
        set({ cartItems: updatedCartItems });
      },

      // Select all items
      selectAllItems: (selected) => {
        const { cartItems } = get();
        const updatedCartItems = cartItems.map((item) => ({
          ...item,
          selected: selected,
        }));
        set({ cartItems: updatedCartItems });
      },

      // Open/close cart drawer
      setDrawerOpen: (isOpen) => {
        set({ isDrawerOpen: isOpen });
      },

      // Clear cart
      clearCart: () => {
        set({ cartItems: [] });
      },

      // Save shipping address
      saveShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      // Save payment method
      savePaymentMethod: (method) => {
        set({ paymentMethod: method });
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);

export default useCartStore;

