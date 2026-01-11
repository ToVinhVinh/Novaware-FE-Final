import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useCartStore from "../../store/cartStore";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import Meta from "../../components/Meta";
import ProductFormSelect from "../../components/Product/ProductFormSelect";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize?.breadcrumbs,
  },
  largeImage: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    borderRadius: 6,
    overflow: "hidden",
    marginRight: 10,
    border: `1px solid ${theme.palette.divider}`,
    padding: 4,
  },
  cartTotalWrapper: {
    padding: theme.spacing(3),
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    position: "sticky",
    top: theme.spacing(2),
  },
  orderSummaryTitle: {
    fontWeight: 600,
    fontSize: "1.5rem",
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  cartTotal: {
    fontSize: 16,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1, 0),
    "&:last-of-type": {
      marginBottom: 0,
    },
  },
  cartTotalLabel: {
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  cartTotalValue: {
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: "1.1rem",
  },
  totalPriceWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(2, 0),
    marginTop: theme.spacing(1),
    borderTop: `2px solid ${theme.palette.divider}`,
  },
  totalPriceLabel: {
    fontWeight: 600,
    fontSize: "1.2rem",
    color: theme.palette.text.primary,
  },
  totalPriceValue: {
    fontWeight: 600,
    fontSize: "1.5rem",
    color: theme.palette.secondary.main,
  },
  divider: {
    margin: theme.spacing(2, 0),
    width: "100%",
    height: 1,
    backgroundColor: theme.palette.divider,
  },
  empty: {
    padding: 24,
    textAlign: "center",
  },
  tableContainer: {
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
}));

const CartScreen = ({ history }) => {
  const classes = useStyles();
  const { userInfo } = useSelector((state) => state.userLogin);
  const { cartItems, toggleItemSelection, selectAllItems, removeFromCart } = useCartStore();

  // Toggle chọn 1 item
  const handleToggle = (item) => {
    toggleItemSelection(item.product);
  };

  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  const handleSelectAll = () => {
    selectAllItems(!allSelected);
  };

  const removeFromCartHandler = (id, sizeSelected, colorSelected) => {
    removeFromCart(id, sizeSelected, colorSelected);
    toast.success("Product removed from cart successfully!");
  };

  const totalPrice = cartItems
    .filter((item) => item.selected)
    .reduce((acc, item) => acc + (item.qty || 0) * (item.priceSale || item.price || 0), 0);

  const checkoutHandler = () => {
    const selectedProducts = cartItems.filter((item) => item.selected);

    if (selectedProducts.length === 0) {
      toast.warning("Please select at least one product.");
      return;
    }

    if (userInfo) {
      history.push("/shipping");
    } else {
      toast.info("Please login to proceed to checkout.");
    }
  };

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Shopping Cart | FashionShop" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Link color="textPrimary" component={RouterLink} to="/cart">
              Shopping Cart
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          {cartItems.length > 0 ? (
            <TableContainer component={Paper} elevation={0} className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          cartItems.some((item) => item.selected) &&
                          !allSelected
                        }
                        checked={allSelected}
                        onChange={handleSelectAll}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>Products</TableCell>
                    <Hidden smDown>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Size & Quantity & Color</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </Hidden>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item, index) => (
                    <TableRow
                      key={`${item.product}-${item.sizeSelected}-${item.colorSelected}-${index}`}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={!!item.selected}
                          onChange={() => handleToggle(item)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <ListItem disableGutters>
                          <ListItemAvatar>
                            <Avatar
                              variant="square"
                              src={item.images && item.images[0]}
                              alt={item.name}
                              className={classes.largeImage}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.name}
                            secondary={`Size: ${item.sizeSelected}, Color: ${item.colorSelected}`}
                            style={{ marginLeft: 16 }}
                          />
                        </ListItem>

                        <Hidden mdUp>
                          <Divider />
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={2}
                          >
                            <Box>${item.priceSale.toFixed(2)}</Box>
                            <Box>
                              <ProductFormSelect item={item} />
                            </Box>
                            <Box>
                              <IconButton
                                onClick={() =>
                                  removeFromCartHandler(
                                    item.product,
                                    item.sizeSelected,
                                    item.colorSelected
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Hidden>
                      </TableCell>

                      <Hidden smDown>
                        <TableCell align="right">${item.priceSale?.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <ProductFormSelect item={item} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              removeFromCartHandler(
                                item.product,
                                item.sizeSelected,
                                item.colorSelected
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </Hidden>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className={classes.empty}>
              <Typography variant="subtitle1" color="secondary">
                Your cart is empty.{" "}
                <Link to="/" component={RouterLink} color="primary">
                  Go shopping!
                </Link>
              </Typography>
            </div>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} className={classes.cartTotalWrapper}>
            <Typography variant="h5" align="left" className="tracking-widest">Order Summary</Typography>
            <Divider className={classes.divider} />
            <Box
              display="flex"
              justifyContent="space-between"
              className={classes.cartTotal}
            >
              <Typography className={classes.cartTotalLabel}>
                Selected Items:
              </Typography>
              <Typography className={classes.cartTotalValue}>
                {cartItems.filter((item) => item.selected).length}
              </Typography>
            </Box>
            <Box className={classes.totalPriceWrapper}>
              <Typography className={classes.totalPriceLabel}>
                Total Price:
              </Typography>
              <Typography className={classes.totalPriceValue}>
                ${totalPrice?.toFixed(2)}
              </Typography>
            </Box>

            <Box mt={3}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                disabled={cartItems.filter((item) => item.selected).length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartScreen;
