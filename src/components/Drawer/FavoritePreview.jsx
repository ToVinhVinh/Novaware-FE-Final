import React from "react";
import { Link as LinkRouter, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
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
import { closeFavoriteDrawer } from "../../actions/favoriteActions";
import { useGetFavorites, useRemoveFavorite } from "../../hooks/api/useUser";
import { toast } from "react-toastify";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
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
    height: theme.spacing(15),
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
}));

const FavoritePreview = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const favoriteDrawer = useSelector((state) => state.favoriteDrawer || { open: false });
  const isOpenDrawer = favoriteDrawer.open || false;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { data: favoritesResponse } = useGetFavorites(userInfo?._id || "");
  const favoriteItems = favoritesResponse?.data?.favoriteItems || [];

  const removeFavoriteMutation = useRemoveFavorite();

  const removeFromFavoritesHandler = async (e, productId) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    if (userInfo?._id) {
      try {
        await removeFavoriteMutation.mutateAsync({
          userId: userInfo._id,
          productId: productId
        });
        toast.success("Đã xóa khỏi yêu thích!");
      } catch (error) {
        toast.error("Xóa khỏi yêu thích thất bại");
      }
    } else {
      toast.info("Vui lòng đăng nhập để sử dụng tính năng này");
    }
  };

  const handleItemClick = (productId) => {
    if (productId) {
      const safeProductId = String(productId);
      history.push(`/product?id=${safeProductId}`);
      dispatch(closeFavoriteDrawer());
    }
  };

  const onDrawerClose = () => {
    dispatch(closeFavoriteDrawer());
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={isOpenDrawer}
      onClose={onDrawerClose}
      onOpen={() => { }} // No action needed to open
    >
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h5" component="h2" gutterBottom>
            Favorites ({favoriteItems ? favoriteItems.length : 0})
          </Typography>
          <IconButton color="secondary" onClick={onDrawerClose}>
            <ClearIcon />
          </IconButton>
        </div>
        <Divider variant="fullWidth" />
        {favoriteItems && favoriteItems.length > 0 ? (
          <>
            <List className={classes.listProduct}>
              {favoriteItems.map((item, index) => {
                // Safely extract productId and ensure it's a string
                const rawProductId = item._id || item.productId || item.product?._id;
                const productId = rawProductId ? String(rawProductId) : `item-${index}`;

                const productName = item.name || item.productDisplayName || item.product?.name || "Unknown Product";

                // Safely extract and convert price to number
                const rawPrice = item.price || item.variants?.[0]?.price || item.product?.price || 0;
                const productPrice = typeof rawPrice === 'number' ? rawPrice : (typeof rawPrice === 'string' ? parseFloat(rawPrice) || 0 : 0);

                const productImage = item.images?.[0] || item.product?.images?.[0] || "";
                const productCategory = item.category || item.masterCategory || item.product?.category || "";

                return (
                  <ListItem
                    divider
                    disableGutters
                    key={productId}
                    button
                    onClick={() => handleItemClick(productId)}
                    style={{ cursor: "pointer" }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="square"
                        src={productImage}
                        alt={productName}
                        className={classes.large}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={productName}
                      secondary={`$${productPrice.toFixed(2)}${productCategory ? ` | ${productCategory}` : ''}`}
                      style={{ marginLeft: 10 }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => removeFromFavoritesHandler(e, productId)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
            <Divider variant="fullWidth" />
            {/* You can add more details or buttons here if needed */}
          </>
        ) : (
          <div className={classes.empty}>
            <Typography variant="subtitle1" color="secondary">
              Your favorites list is empty.{" "}
              <Link
                to="/"
                component={LinkRouter}
                color="primary"
                onClick={onDrawerClose}
              >
                Start shopping!
              </Link>
            </Typography>
            <img src={emptyGif} alt="empty" />
          </div>
        )}
      </div>
    </SwipeableDrawer>
  );
};

export default FavoritePreview;
