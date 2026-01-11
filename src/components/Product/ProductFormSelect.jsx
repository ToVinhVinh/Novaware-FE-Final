import React, { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { toast } from "react-toastify";
import useCartStore from "../../store/cartStore";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Box,
} from "@material-ui/core";
import { AiOutlineSync } from "react-icons/ai";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Controller } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      marginLeft: theme.spacing(1),
    },
  },
}));

const ProductFormSelect = ({ item, className }) => {
  const classes = useStyles();
  const { addToCart, removeFromCart } = useCartStore();
  const { control, handleSubmit, setValue, watch } = useForm();
  const watchedSize = watch("size");
  const watchedColor = watch("color");
  const variants = item.variants || [];
  const availableSizes = useMemo(() => {
    if (!variants.length) return Object.keys(item.size || {});
    if (!watchedColor) return [...new Set(variants.map(v => v.size.toUpperCase()))];
    
    return [...new Set(variants
      .filter(v => v.color === watchedColor && v.stock > 0)
      .map(v => v.size.toUpperCase())
    )];
  }, [variants, watchedColor, item.size]);

  const availableColors = useMemo(() => {
    if (!variants.length) return item.color || [];
    if (!watchedSize) return item.color || [];
    
    const filteredColors = variants
      .filter(v => v.size.toLowerCase() === watchedSize.toLowerCase() && v.stock > 0)
      .map(v => v.color);
      
    return (item.color || []).filter(c => filteredColors.includes(c.hexCode));
  }, [variants, watchedSize, item.color]);

  useEffect(() => {
    setValue("size", item.sizeSelected?.toUpperCase());
    
    if (item.color && item.color.length > 0) {
      const colorObj = item.color.find(c => c.name === item.colorSelected) || item.color[0];
      setValue("color", colorObj?.hexCode);
    }
    
    setValue("qty", item.qty);
  }, [item, setValue]);

  const updateCartHandler = (data, id) => {
    const selectedColorObj = (item.color || []).find(c => c.hexCode === data.color);
    const selectedColorName = selectedColorObj ? selectedColorObj.name : "";

    const oldSize = item.sizeSelected;
    const oldColor = item.colorSelected;

    const newSize = data.size;
    const newColor = selectedColorName;

    if (oldSize?.toLowerCase() === newSize?.toLowerCase() && oldColor === newColor && item.qty === data.qty) {
      toast.info("No changes");
      return;
    }

    const productData = {
      _id: item.product,
      id: item.product,
      name: item.name,
      productDisplayName: item.name,
      price: item.price,
      sale: item.sale || 0,
      variants: variants, // Pass full variants for correct price/stock lookup
      colors: item.color || [],
      images: item.images || [],
      size: item.size || {},
      countInStock: item.countInStock || 0,
    };

    removeFromCart(id, oldSize, oldColor);
    // Note: addToCart will handle finding the correct price from variants
    addToCart(productData, data.qty, newSize, data.color, newColor);
    toast.success("Cart updated!");
  };

  return (
    <form
      className={clsx(classes.root, className && className)}
      onSubmit={handleSubmit((data) => {
        updateCartHandler(data, item.product);
      })}
    >
      {/* Dropdown chọn kích cỡ */}
      <FormControl variant="outlined" size="small">
        <InputLabel shrink id="size-select-label">
          Size
        </InputLabel>
        <Controller
          name="size"
          control={control}
          defaultValue={item.sizeSelected?.toUpperCase()}
          render={({ field }) => (
            <Select {...field} label="Size" autoWidth>
              {availableSizes.map((value) => (
                <MenuItem value={value} key={value}>
                  {value.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      {/* Dropdown chọn màu sắc */}
      <FormControl variant="outlined" size="small">
        <InputLabel shrink id="color-select-label">
          Color
        </InputLabel>
        <Controller
          name="color"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              {...field}
              label="Color"
              autoWidth
            >
              {availableColors.map((color) => (
                <MenuItem value={color.hexCode} key={color.name}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Box
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: color.hexCode,
                        borderRadius: "50%",
                        marginRight: 8,
                      }}
                    />
                    <span>{color.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      {/* Dropdown chọn số lượng */}
      <FormControl variant="outlined" size="small">
        <InputLabel shrink id="quantity-select-label">
          Qty
        </InputLabel>
        <Controller
          name="qty"
          control={control}
          defaultValue={item.qty}
          render={({ field }) => {
            // Find stock for selected size/color
            const matchingVariant = variants.find(
              v => v.size?.toLowerCase() === watchedSize?.toLowerCase() && v.color === watchedColor
            );
            const maxStock = matchingVariant ? matchingVariant.stock : item.countInStock;
            
            return (
              <Select {...field} label="Qty" autoWidth>
                {Array.from({ length: maxStock || 1 }, (_, i) => i + 1).map((val) => (
                  <MenuItem value={val} key={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            );
          }}
        />
      </FormControl>

      {/* Nút Cập Nhật Giỏ Hàng */}
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        size="small"
        startIcon={<AiOutlineSync color="#fff" />}
        disableElevation
      >
        Update
      </Button>
    </form>
  );
};

export default ProductFormSelect;
