import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { Link as LinkRouter } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import emptyGif from "../../assets/images/Empty.gif";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    height: "100%",
    padding: 20,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("xs")]: {
      width: 300,
    },
  },
  title: {
    ...theme.mixins.customize.flexMixin("space-between", "center"),
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    borderRadius: 6,
    overflow: "hidden",
    marginRight: 10,
    border: `1px solid ${theme.palette.divider}`,
    padding: 4,
  },
  listProduct: {
    overflowY: "auto",
    maxHeight: "60%",
    marginTop: 10,
    marginBottom: 10,
    "&::-webkit-scrollbar": {
      width: 8,
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.secondary.main,
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(245, 0, 87, 0.04)",
    },
    "& .MuiListItem-container:last-child > .MuiListItem-divider": {
      borderBottom: "none",
    },
  },
  priceTotal: {
    ...theme.mixins.customize.flexMixin("space-between", "center"),
    padding: "10px 0",
  },
  button: {
    margin: "10px 0",
    "& + $button": {
      marginTop: 2,
    },
  },
  empty: {
    ...theme.mixins.customize.centerFlex("column wrap"),
    marginTop: 30,
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  quantityButton: {
    padding: 4,
    minWidth: 32,
    height: 32,
  },
  quantityText: {
    minWidth: 30,
    textAlign: "center",
    fontWeight: 500,
  },
  itemContent: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
}));

const CartPreview = () => {
  const classes = useStyles();
  const { cartItems, isDrawerOpen, removeFromCart, setDrawerOpen, updateItemQty } = useCartStore();

  const [selectedItems, setSelectedItems] = useState([]);

  const removeFromCartHandler = (item) => {
    removeFromCart(item.product, item.sizeSelected, item.colorSelected);
    setSelectedItems((prev) => prev.filter((pid) => !(pid === item.product)));
  };

  const onDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const onDrawerClose = () => {
    setDrawerOpen(false);
  };

  const toggleItemSelection = (productId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleIncreaseQty = (item) => {
    const newQty = (item.qty || 1) + 1;
    updateItemQty(item.product, item.sizeSelected, item.colorSelected, newQty);
  };

  const handleDecreaseQty = (item) => {
    const currentQty = item.qty || 1;
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      updateItemQty(item.product, item.sizeSelected, item.colorSelected, newQty);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      setSelectedItems(cartItems.map((item) => item.product));
    }
  }, [isDrawerOpen, cartItems]);

  return (
    <SwipeableDrawer
      anchor="right"
      open={isDrawerOpen}
      onClose={onDrawerClose}
      onOpen={onDrawerOpen}
    >
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h5" align="center" className="tracking-widest"> Cart ({cartItems.length})</Typography>
          <IconButton color="secondary" onClick={onDrawerClose}>
            <ClearIcon />
          </IconButton>
        </div>
        <Divider variant="fullWidth" />
        {cartItems.length > 0 ? (
          <>
            <List className={classes.listProduct}>
              {cartItems.map((item) => {
                const selectedColor = item.color?.find(
                  (color) =>
                    color.hexCode === item.colorSelected ||
                    color.name === item.colorSelected
                );

                const colorName = selectedColor
                  ? selectedColor.name
                  : item.colorSelected;

                const itemKey = `${item.product}-${item.sizeSelected || ""}-${item.colorSelected || ""}`;

                return (
                  <ListItem divider disableGutters key={itemKey}>
                    <ListItemAvatar style={{ position: "relative" }}>
                      <Avatar
                        variant="square"
                        src={item.images && item.images[0]}
                        alt="product image"
                        className={classes.large}
                      />
                      <Checkbox
                        checked={selectedItems.includes(item.product)}
                        onChange={() => toggleItemSelection(item.product)}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          borderRadius: 4,
                          padding: 2,
                        }}
                        color="primary"
                      />
                    </ListItemAvatar>
                    <div className={classes.itemContent}>
                      <ListItemText
                        primary={item.name}
                        secondary={`$${(item.priceSale || item.price || 0).toFixed(2)} | Size: ${item.sizeSelected?.toUpperCase() || "N/A"
                          } | Color: ${colorName || "N/A"}`}
                      />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div className={classes.quantityControl}>
                          <IconButton
                            size="small"
                            onClick={() => handleDecreaseQty(item)}
                            disabled={item.qty <= 1}
                            className={classes.quantityButton}
                            color="primary"
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body2" className={classes.quantityText}>
                            {item.qty || 1}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleIncreaseQty(item)}
                            className={classes.quantityButton}
                            color="primary"
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </div>
                        <IconButton
                          onClick={() => removeFromCartHandler(item)}
                          color="secondary"
                          size="medium"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  </ListItem>
                );
              })}
            </List>
            <Divider variant="fullWidth" />
            <div className={classes.priceTotal}>
              <Typography variant="subtitle1" component="span">
                Total:
              </Typography>
              <Typography
                variant="subtitle1"
                component="span"
                color="secondary"
                style={{ fontWeight: 600, fontSize: 18 }}
              >
                $
                {cartItems
                  .filter((item) => selectedItems.includes(item.product))
                  .reduce((acc, item) => acc + (item.priceSale || item.price || 0) * (item.qty || 1), 0)
                  .toFixed(2)}
              </Typography>
            </div>
            <Divider variant="fullWidth" />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              className={classes.button}
              component={RouterLink}
              to="/cart"
              onClick={onDrawerClose}
            >
              View Shopping Cart & Checkout
            </Button>
          </>
        ) : (
          <div className={classes.empty}>
            <Typography variant="subtitle1" color="secondary">
              Your cart is empty.{" "}
              <Link
                to="/"
                component={LinkRouter}
                color="primary"
                onClick={onDrawerClose}
              >
                Shopping now!
              </Link>
            </Typography>
            <img src={emptyGif} alt="empty" />
          </div>
        )}
      </div>
    </SwipeableDrawer>
  );
};

export default CartPreview;
