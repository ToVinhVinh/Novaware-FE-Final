import React, { useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { GrLocation, GrCreditCard, GrProjects, GrUser } from "react-icons/gr";
import { Link as RouterLink } from "react-router-dom";
import { openAdminChatDrawer } from "../../actions/chatActions";
import { useGetOrder, useUpdateOrderToPaid, useCancelOrder } from "../../hooks/api/useOrder";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Breadcrumbs,
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
import axios from "axios";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import paypalImage from "../../assets/images/paypal.png";
import StripePayment from "../../components/StripePayment";
import ConfirmDialog from "../../components/Modal/ConfirmDialog";
import ReviewProductModal from "../../components/Modal/ReviewProductModal";
import { formatToVietnamTime } from "../../utils/dateUtils";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
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
    padding: 4,
    height: 100,
    width: 100,
    borderRadius: 6,
    border: "1px solid #ccc",
    objectFit: "cover",
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

const UserOrderScreen = ({ match, history }) => {
  const classes = useStyles();
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
  });
  const [reviewModal, setReviewModal] = useState({
    open: false,
    product: null,
  });

  const { data: orderResponse, isLoading: loading, error } = useGetOrder(orderId);
  const order = orderResponse?.data?.order;

  const payOrderMutation = useUpdateOrderToPaid();
  const { isLoading: loadingPay, isSuccess: successPay } = payOrderMutation;

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const cancelOrderMutation = useCancelOrder();
  const { isSuccess: successCancel } = cancelOrderMutation;

  const handleOpenChat = () => {
    dispatch(openAdminChatDrawer());
  };

  const normalizedOrder = order ? {
    id: order.id || order._id,
    userId: order.user_id,
    user: order.user,
    items: order.items || order.orderItems || [],
    shippingAddress: order.shippingAddress || order.shipping_address,
    paymentMethod: order.paymentMethod || order.payment_method,
    paymentResult: order.paymentResult || order.payment_result,
    itemsPrice: order.itemsPrice,
    taxPrice: order.taxPrice || order.tax_price,
    shippingPrice: order.shippingPrice || order.shipping_price,
    totalPrice: order.totalPrice || order.total_price,
    isPaid: order.isPaid ?? order.is_paid ?? false,
    paidAt: order.paidAt || order.paid_at,
    isDelivered: order.isDelivered ?? order.is_delivered ?? false,
    deliveredAt: order.deliveredAt || order.delivered_at,
    isCancelled: order.isCancelled ?? order.is_cancelled ?? false,
    isProcessing: order.is_processing ?? false,
    isOutfitPurchase: order.is_outfit_purchase ?? false,
    createdAt: order.createdAt || order.created_at,
    updatedAt: order.updatedAt || order.updated_at,
  } : null;

  // Support both 'items' and 'orderItems' from API response
  const orderItems = normalizedOrder?.items || [];
  const currentUserId = userInfo?._id || userInfo?.id || normalizedOrder?.userId;

  if (!loading && normalizedOrder) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    if (orderItems.length > 0) {
      normalizedOrder.itemsPrice = addDecimals(
        orderItems.reduce(
          (acc, item) => acc + (item.priceSale || item.price_sale || 0) * (item.qty || 0),
          0
        )
      );
    }
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    if (!normalizedOrder?.isPaid && window.paypal) {
      setSdkReady(true);
    }
  }, [orderId, normalizedOrder, userInfo]);

  const handleStripePayment = async (paymentIntent) => {
    try {
      await payOrderMutation.mutateAsync({
        id: orderId,
        body: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          payer: {
            email_address: normalizedOrder?.user?.email || userInfo?.email || "",
          },
        }
      });
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const successPaymentHandler = async (paymentResult) => {
    try {
      await payOrderMutation.mutateAsync({
        id: orderId,
        body: paymentResult
      });
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const handleCancelOrderClick = () => {
    setConfirmDialog({ open: true });
  };

  const handleConfirmCancelOrder = async () => {
    try {
      await cancelOrderMutation.mutateAsync(orderId);
      setConfirmDialog({ open: false });
    } catch (error) {
      console.error("Cancel order failed:", error);
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ open: false });
  };

  const handleOpenReviewModal = (product) => {
    setReviewModal({ open: true, product });
  };

  const handleCloseReviewModal = () => {
    setReviewModal({ open: false, product: null });
  };

  return loading ? (
    <Loader my={200} />
  ) : error ? (
    <Message mt={100}>{error}</Message>
  ) : (
    normalizedOrder && (
      <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
        <Meta title="Order | FashionShop" />
        <Grid container className={classes.breadcrumbsContainer}>
          <Grid item xs={12}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              style={{ marginBottom: 24 }}
            >
              <Link color="inherit" component={RouterLink} to="/">
                Home
              </Link>
              <Link color="textPrimary" component={RouterLink} to="/order">
                Order Details
              </Link>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Paper elevation={0} className={classes.content}>
          <Grid container spacing={8}>
            <Grid item xs={12} lg={8}>
              <List>
                <ListItem divider>
                  <ListItemText
                    primary={`Order`}
                    secondary={`id: ${normalizedOrder.id}`}
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemIcon>
                    <GrUser fontSize={22} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Receiver"
                    secondary={normalizedOrder.user ? `${normalizedOrder.user.name}, email: ${normalizedOrder.user.email}` : "N/A"}
                  />
                </ListItem>
                <ListItem divider style={{ flexWrap: "wrap" }}>
                  <ListItemIcon>
                    <GrLocation fontSize={22} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Shipping"
                    secondary={
                      <>
                        {normalizedOrder.shippingAddress ? Object.values(normalizedOrder.shippingAddress)
                          .filter((value) => typeof value === "string")
                          .join(", ") : "N/A"}
                        {(normalizedOrder.shippingAddress?.recipientPhoneNumber || normalizedOrder.shippingAddress?.recipient_phone_number) && (
                          <Typography variant="body2" component="span">
                            {" "}
                            Recipient's Phone:{" "}
                            {normalizedOrder.shippingAddress.recipientPhoneNumber || normalizedOrder.shippingAddress.recipient_phone_number}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  {normalizedOrder.isDelivered ? (
                    <Message severity="success" mt={8}>
                      {"Delivered on " + (normalizedOrder.deliveredAt ? formatToVietnamTime(normalizedOrder.deliveredAt) : "N/A")}
                    </Message>
                  ) : (
                    <Typography variant="body2" color="textSecondary" mt={2}>
                      Not Delivered
                    </Typography>
                  )}
                </ListItem>

                {/* Processing Status */}
                <ListItem divider style={{ flexWrap: "wrap" }}>
                  <ListItemIcon>
                    <GrProjects fontSize={22} />
                  </ListItemIcon>
                  <ListItemText primary="Processing Status" />
                  {normalizedOrder.isProcessing ? (
                    <Message severity="success" mt={8} mb={8}>
                      {"Confirmed at " + (normalizedOrder.updatedAt ? formatToVietnamTime(normalizedOrder.updatedAt) : "N/A")}
                    </Message>
                  ) : (
                    <Typography variant="body2" color="textSecondary" mt={2} mb={2}>
                      Not Confirmed
                    </Typography>
                  )}
                </ListItem>
                <ListItem divider style={{ flexWrap: "wrap" }}>
                  <ListItemIcon>
                    <GrCreditCard fontSize={22} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Payment Method"
                    secondary={normalizedOrder.paymentMethod || "N/A"}
                  />
                  <ListItemAvatar>
                    <img src={paypalImage} alt="" width="80px" height="30px" />
                  </ListItemAvatar>
                  {normalizedOrder.isPaid ? (
                    <Message severity="success" mt={8}>
                      {"Paid on " + (normalizedOrder.paidAt ? formatToVietnamTime(normalizedOrder.paidAt) : "N/A")}
                    </Message>
                  ) : (
                    <Typography variant="body2" color="textSecondary" mt={2}>
                      Not Paid
                    </Typography>
                  )}
                </ListItem>
                <ListItem className={classes.orderItems}>
                  <ListItemIcon>
                    <GrProjects fontSize={22} />
                  </ListItemIcon>
                  <ListItemText primary="Order Items" />
                  {orderItems.length > 0 ? (
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
                                {normalizedOrder.isDelivered && (
                                  <TableCell align="right">Action</TableCell>
                                )}
                              </Hidden>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {orderItems.map((item, index) => {
                              // Support both camelCase and snake_case
                              const sizeSelected = item.sizeSelected || item.size_selected || "";
                              const colorSelected = item.colorSelected || item.color_selected || "";
                              const priceSale = item.priceSale || item.price_sale || 0;
                              const qty = item.qty || 0;

                              const colorName =
                                item.colors && item.colors.name
                                  ? item.colors.name
                                  : colorSelected;

                              return (
                                <TableRow key={item.product_id ? `${item.product_id}-${index}` : `${item.name}-${index}`}>
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
                                        secondary={`Size: ${sizeSelected}, Color: ${colorSelected}`}
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
                                          {sizeSelected.toUpperCase()}
                                        </Box>
                                        <Box textAlign="center">
                                          Color: {colorSelected}
                                        </Box>
                                        <Box textAlign="center">
                                          {`${qty} x $${priceSale} = $${(qty * priceSale).toFixed(2)}`}
                                        </Box>
                                      </Box>
                                      {normalizedOrder.isDelivered && (
                                        <Box mt={2} display="flex" justifyContent="center">
                                          {(() => {
                                            const getUserID = (u) => {
                                              if (!u) return "";
                                              if (typeof u === "string") return u;
                                              return u._id || u.id || "";
                                            };
                                            const curId = getUserID(userInfo) || getUserID(normalizedOrder?.userId);
                                            const hasReviewed = item.reviews?.some((r) => {
                                              const rId = getUserID(r.user_id) || getUserID(r.user) || getUserID(r.userId) || getUserID(r);
                                              return String(rId).trim() === String(curId).trim() && rId !== "";
                                            });
                                            return (
                                              <Button
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleOpenReviewModal(item)}
                                                disabled={hasReviewed}
                                                fullWidth
                                                style={{
                                                  borderRadius: 6,
                                                  textTransform: "none",
                                                  backgroundColor: hasReviewed ? "#f5f5f5" : "transparent",
                                                }}
                                              >
                                                {hasReviewed ? "Product Reviewed" : "Review Product"}
                                              </Button>
                                            );
                                          })()}
                                        </Box>
                                      )}
                                    </Hidden>
                                  </TableCell>
                                  <Hidden smDown>
                                    <TableCell align="right">
                                      {sizeSelected.toUpperCase()}
                                    </TableCell>
                                    <TableCell align="right">
                                      {colorName}
                                    </TableCell>
                                    <TableCell align="right">
                                      {`${qty} x $${priceSale} = $${(
                                        qty * priceSale
                                      ).toFixed(2)}`}
                                    </TableCell>
                                    {normalizedOrder.isDelivered && (
                                      <TableCell align="right">
                                        {(() => {
                                          const getUserID = (u) => {
                                            if (!u) return "";
                                            if (typeof u === "string") return u;
                                            return u._id || u.id || "";
                                          };
                                          const curId = getUserID(userInfo) || getUserID(normalizedOrder?.userId);
                                          const hasReviewed = item.reviews?.some((r) => {
                                            const rId = getUserID(r.user_id) || getUserID(r.user) || getUserID(r.userId) || getUserID(r);
                                            return String(rId).trim() === String(curId).trim() && rId !== "";
                                          });
                                          return (
                                            <Button
                                              variant="outlined"
                                              color="secondary"
                                              size="small"
                                              onClick={() => handleOpenReviewModal(item)}
                                              disabled={hasReviewed}
                                              style={{
                                                borderRadius: 6,
                                                textTransform: "none",
                                                backgroundColor: hasReviewed ? "#f5f5f5" : "transparent",
                                              }}
                                            >
                                              {hasReviewed ? "Product Reviewed" : "Review Product"}
                                            </Button>
                                          );
                                        })()}
                                      </TableCell>
                                    )}
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
                    <Typography>${normalizedOrder.itemsPrice || "0.00"}</Typography>
                  </ListItem>
                  <ListItem divider disableGutters>
                    <ListItemText primary="Shipping:" />
                    <Typography>${normalizedOrder.shippingPrice || "0.00"}</Typography>
                  </ListItem>
                  <ListItem divider disableGutters>
                    <ListItemText primary="Tax:" />
                    <Typography>${normalizedOrder.taxPrice || "0.00"}</Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Total:" />
                    <Typography color="secondary">
                      ${normalizedOrder.totalPrice || "0.00"}
                    </Typography>
                  </ListItem>
                </List>
                {/* Payment */}
                {!normalizedOrder.isPaid && (
                  <Box style={{ width: "100%" }}>
                    {normalizedOrder.paymentMethod === "PayPal" && (
                      <>
                        {loadingPay && <Loader />}
                        {!sdkReady ? (
                          <Loader />
                        ) : (
                          <PayPalButton
                            amount={normalizedOrder.totalPrice}
                            onSuccess={successPaymentHandler}
                            style={{ width: "100%" }}
                          />
                        )}
                      </>
                    )}

                    {normalizedOrder.paymentMethod === "Stripe" && (
                      <StripePayment
                        orderId={orderId}
                        totalPrice={normalizedOrder.totalPrice}
                        handleStripePayment={handleStripePayment}
                      />
                    )}

                    {normalizedOrder.paymentMethod === "COD" && (
                      <Box
                        p={2}
                        border="1px solid #ccc"
                        borderRadius={4}
                        textAlign="center"
                      >
                        <Typography variant="h6" gutterBottom>
                          Cash On Delivery (COD)
                        </Typography>
                        <Typography>
                          You will pay when you receive the order.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                {!normalizedOrder.isDelivered &&
                  !normalizedOrder.isCancelled &&
                  !normalizedOrder.isProcessing && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCancelOrderClick}
                      fullWidth
                      style={{ marginTop: 16 }}
                    >
                      Cancel Order
                    </Button>
                  )}
                {normalizedOrder.isCancelled && (
                  <>
                    <Message severity="error" mt={8}>
                      This order has been cancelled.
                    </Message>
                    {normalizedOrder.paymentMethod !== "COD" && (
                      <Typography variant="body2" color="textSecondary" mt={8}>
                        If you have paid using online methods, please contact
                        admin{" "}
                        <Link
                          component="button"
                          variant="body2"
                          onClick={handleOpenChat}
                          style={{ color: "blue", textDecoration: "underline" }}
                        >
                          here
                        </Link>{" "}
                        to chat with admin.
                      </Typography>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
        <ConfirmDialog
          open={confirmDialog.open}
          onClose={handleCloseConfirmDialog}
          onConfirm={handleConfirmCancelOrder}
          title="Cancel Order"
          message="Are you sure you want to cancel this order? This action cannot be undone."
          confirmText="Cancel Order"
          cancelText="Keep Order"
          confirmColor="secondary"
          loading={cancelOrderMutation.isLoading}
        />
        <ReviewProductModal
          open={reviewModal.open}
          onClose={handleCloseReviewModal}
          product={reviewModal.product}
          userId={userInfo?._id || userInfo?.id}
          orderId={orderId}
        />
      </Container>
    )
  );
};

export default UserOrderScreen;
