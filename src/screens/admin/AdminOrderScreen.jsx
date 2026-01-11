import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import { GrLocation, GrCreditCard, GrProjects, GrUser } from "react-icons/gr";
import { Link as RouterLink } from "react-router-dom";
import { useGetOrder, useUpdateOrderToDelivered, useConfirmOrder } from "../../hooks/api/useOrder";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Link,
  Divider,
  ListItemText,
  ListItem,
  List,
  ListItemIcon,
  Avatar,
  Box,
  Hidden,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@material-ui/core";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Meta from "../../components/Meta";
import paypalImage from "../../assets/images/paypal.png";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  content: {
    padding: 24,
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    [theme.breakpoints.down("sm")]: {
      padding: 32,
    },
  },
  orderItems: {
    flexWrap: "wrap",
    paddingRight: 0,
  },
  items: {
    flexBasis: "100%",
    marginLeft: 56,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& .MuiTableCell-root": {
      paddingLeft: 0,
    },
    "& .MuiTableCell-head": {
      color: theme.palette.text.primary,
      fontWeight: 400,
    },
  },
  largeImage: {
    width: theme.spacing(6),
    height: theme.spacing(8),
  },
  empty: {
    ...theme.mixins.customize.centerFlex("column wrap"),
    marginTop: 30,
  },
  cartTotalWrapper: {
    marginTop: 22,
    padding: 20,
    fontSize: 16,
    backgroundColor: "#F4F4F4",
  },
  cartTotal: {
    fontSize: 18,
    marginBottom: 8,
    "&:nth-child(2)": {
      color: theme.palette.secondary.main,
    },
  },
  divider: {
    margin: "8px 0",
    width: 80,
    height: 2,
    backgroundColor: "#2a2a2a",
  },
  itemName: {
    ...theme.mixins.customize.textClamp(2),
  },
  dropdownFormControl: {
    marginTop: theme.spacing(1),
    minWidth: 100,
    "& .MuiInputLabel-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {},
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "& .MuiSelect-root": {
        padding: "12px 30px",
      },
    },
  },
}));

const AdminOrderScreen = ({ match, history }) => {
  const classes = useStyles();
  const orderId = match.params.id;

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const { data: orderResponse, isLoading: loading, error } = useGetOrder(orderId);
  const order = orderResponse?.data?.order;

  const deliverOrderMutation = useUpdateOrderToDelivered();
  const { isLoading: loadingDeliver, isSuccess: successDeliver } = deliverOrderMutation;

  const confirmOrderMutation = useConfirmOrder();
  const { isLoading: loadingConfirm, isSuccess: successConfirm } = confirmOrderMutation;

  if (!loading && order) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order?.orderItems.reduce(
        (acc, item) => acc + item.priceSale * item.qty,
        0
      )
    );
  }

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    if (successDeliver) {
      toast.success("Order delivered successfully!");
    }
  }, [successDeliver]);

  useEffect(() => {
    if (successConfirm) {
      toast.success("Order confirmed successfully!");
    }
  }, [successConfirm]);

  const handleConfirm = async () => {
    if (order) {
      try {
        await confirmOrderMutation.mutateAsync(order._id);
      } catch (error) {
        toast.error("Failed to confirm order");
      }
    }
  };

  const deliverHandler = async () => {
    if (order) {
      try {
        await deliverOrderMutation.mutateAsync(order._id);
      } catch (error) {
        toast.error("Failed to deliver order");
      }
    }
  };

  return loading ? (
    <Loader my={200} />
  ) : error ? (
    <Message mt={100}>{error}</Message>
  ) : (
    order && (
      <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
        <Meta title="Dashboard | Orders" />
        <Grid container className={classes.breadcrumbsContainer}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              style={{ textAlign: "center" }}
            >
              Order Management
            </Typography>
          </Grid>
        </Grid>
        <Paper elevation={0} className={classes.content}>
          <Grid container spacing={8}>
            <Grid item xs={12} lg={8}>
              <List>
                <ListItem divider>
                  <ListItemText
                    primary={`Order`}
                    secondary={`id: ${order._id}`}
                  />
                </ListItem>
                {/* user Status */}
                <ListItem divider>
                  <ListItemIcon>
                    <GrUser fontSize={22} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Receiver"
                    secondary={`${order.user.name}, email: ${order.user.email}`}
                  />
                </ListItem>
                {/* shiping Status */}
                <ListItem divider style={{ flexWrap: "wrap" }}>
                  <ListItemIcon>
                    <GrLocation fontSize={22} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Shipping"
                    secondary={
                      <>
                        {Object.values(order.shippingAddress)
                          .filter((value) => typeof value === "string")
                          .join(", ")}
                        {order.shippingAddress.recipientPhoneNumber && (
                          <Typography variant="body2">
                            Recipient's Phone:{" "}
                            {order.shippingAddress.recipientPhoneNumber}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  {order.isDelivered ? (
                    <Message severity="success" mt={8}>
                      Delivered on {new Date(order.deliveredAt).toUTCString()}
                    </Message>
                  ) : (
                    <Message mt={8}>Not Delivered</Message>
                  )}
                </ListItem>

                {/* Processing Status */}
                <ListItem divider style={{ flexWrap: "wrap" }}>
                  <ListItemIcon>
                    <GrProjects fontSize={22} /> {/* Icon tùy bạn chọn */}
                  </ListItemIcon>
                  <ListItemText primary="Processing Status" />
                  {order.isProcessing ? (
                    <Message severity="success" mt={8} mb={8}>
                      Confirmed at {new Date(order.updatedAt).toLocaleString()}
                    </Message>
                  ) : (
                    <Message severity="warning" mt={8} mb={8}>
                      Not Confirmed
                    </Message>
                  )}
                </ListItem>
                {/* payment Status */}
                <ListItem divider style={{ flexWrap: "wrap" }}>
                  <ListItemIcon>
                    <GrCreditCard fontSize={22} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Payment Method"
                    secondary={order.paymentMethod}
                  />
                  <ListItemAvatar>
                    <img src={paypalImage} alt="" width="80px" height="30px" />
                  </ListItemAvatar>
                  {order.isPaid ? (
                    <Message severity="success">
                      Paid on {new Date(order.paidAt).toUTCString()} by{" "}
                      {order.paymentMethod}
                    </Message>
                  ) : (
                    <Message severity="warning">
                      Unpaid by {order.paymentMethod}
                    </Message>
                  )}
                </ListItem>
                {/* order Status */}
                <ListItem className={classes.orderItems}>
                  <ListItemIcon>
                    <GrProjects fontSize={22} />
                  </ListItemIcon>
                  <ListItemText primary="Order Items" />
                  {order.orderItems.length > 0 ? (
                    <div className={classes.items}>
                      <TableContainer component={Paper} elevation={0}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Products</TableCell>
                              <Hidden smDown>
                                <TableCell align="right">Size</TableCell>
                                <TableCell align="right">Color</TableCell>
                                <TableCell align="right">Price</TableCell>
                              </Hidden>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.orderItems.map((item) => {
                              const colorName =
                                item.colors && item.colors.name
                                  ? item.colors.name
                                  : item.colorSelected;

                              return (
                                <TableRow key={item.name}>
                                  <TableCell component="th" scope="item">
                                    <ListItem disableGutters>
                                      <ListItemAvatar>
                                        <Avatar
                                          variant="square"
                                          src={item.images && item.images[0]}
                                          alt="product image"
                                          className={classes.largeImage}
                                        />
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={item.name}
                                        secondary={`Size: ${item.sizeSelected}, Color: ${item.colorSelected}`}
                                        className={classes.itemName}
                                        style={{ marginLeft: 16 }}
                                      />
                                    </ListItem>
                                    <Hidden mdUp>
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mt={2}
                                      >
                                        <Box textAlign="center">
                                          Size:{" "}
                                          {item.sizeSelected.toUpperCase()}
                                        </Box>
                                        <Box textAlign="center">
                                          Color: {item.colorSelected}
                                        </Box>
                                        <Box textAlign="center">
                                          {`${item.qty} x ${item.priceSale} = ${
                                            item.qty * item.priceSale
                                          }`}
                                        </Box>
                                      </Box>
                                    </Hidden>
                                  </TableCell>
                                  <Hidden smDown>
                                    <TableCell align="right">
                                      {item.sizeSelected.toUpperCase()}
                                    </TableCell>
                                    <TableCell align="right">
                                      {colorName}
                                    </TableCell>
                                    <TableCell align="right">
                                      {`${item.qty} x $${item.priceSale} = $${(
                                        item.qty * item.priceSale
                                      ).toFixed(2)}`}
                                    </TableCell>
                                  </Hidden>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  ) : (
                    <div className={classes.empty}>
                      <Typography variant="subtitle1" color="secondary">
                        Your cart is empty.{" "}
                        <Link to="/" component={RouterLink} color="primary">
                          Shopping now!
                        </Link>
                      </Typography>
                    </div>
                  )}
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Paper elevation={0} className={classes.cartTotalWrapper}>
                <Typography variant="h5" style={{ fontSize: 23 }}>
                  Order Summary
                </Typography>
                <Divider className={classes.divider} />
                <List style={{ padding: "10px 20px 20px" }}>
                  <ListItem divider disableGutters>
                    <ListItemText primary="Items:" />
                    <Typography>${order.itemsPrice}</Typography>
                  </ListItem>
                  <ListItem divider disableGutters>
                    <ListItemText primary="Shipping:" />
                    <Typography>${order.shippingPrice}</Typography>
                  </ListItem>
                  <ListItem divider disableGutters>
                    <ListItemText primary="Tax:" />
                    <Typography>${order.taxPrice}</Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Total:" />
                    <Typography color="secondary">
                      ${order.totalPrice}
                    </Typography>
                  </ListItem>
                </List>
                {/* Button process */}
                {loadingConfirm && <Loader />}
                <Button
                  fullWidth
                  variant="contained"
                  color={order.isProcessing ? "default" : "secondary"}
                  onClick={handleConfirm}
                  style={{ marginBottom: 16 }}
                  disabled={order.isProcessing || loadingConfirm}
                >
                  {order.isProcessing ? "Confirmed" : "Mark As Confirmed"}
                </Button>
                {/* Button deli */}
                {loadingDeliver && <Loader />}
                <Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={deliverHandler}
                    disabled={order.isDelivered}
                  >
                    {order.isDelivered ? "Delivered" : "Mark As Delivered"}{" "}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    )
  );
};

export default AdminOrderScreen;
