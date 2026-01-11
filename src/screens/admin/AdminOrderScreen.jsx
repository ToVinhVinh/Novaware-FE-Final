import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import { useGetOrder, useUpdateOrderToDelivered, useConfirmOrder } from "../../hooks/api/useOrder";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import InfoIcon from "@material-ui/icons/Info";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import SettingsIcon from "@material-ui/icons/Settings";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import EventIcon from "@material-ui/icons/Event";
import PaymentIcon from "@material-ui/icons/Payment";
import AssignmentIcon from "@material-ui/icons/Assignment";
import clsx from "clsx";
import StepConnector from "@material-ui/core/StepConnector";
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Link,
  Divider,
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Breadcrumbs,
  Chip,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Meta from "../../components/Meta";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,0.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <ShoppingBasketIcon />,
    2: <CheckCircleIcon />,
    3: <LocalShippingIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 64,
    justifyContent: "center",
  },
  breadcrumbsContainer: {
    padding: theme.spacing(2, 0),
  },
  card: {
    marginBottom: theme.spacing(3),
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    overflow: "visible",
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: theme.spacing(1),
      color: theme.palette.secondary.main,
    },
  },
  statusChip: {
    fontWeight: 600,
  },
  productImage: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 8,
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(1, 0),
    alignItems: "center",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2, 0),
    borderTop: `2px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(1),
    alignItems: "center",
  },
  actionButton: {
    marginBottom: theme.spacing(2),
  },
  stepper: {
    backgroundColor: "transparent",
    padding: theme.spacing(3, 0),
  },
  infoLabel: {
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
    "& svg": {
      fontSize: "0.9rem",
      marginRight: 4,
    },
  },
  infoValue: {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
  },
  paidChip: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  unpaidChip: {
    backgroundColor: "#fff3e0",
    color: "#ef6c00",
  },
  deliveredChip: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
  },
  confirmedChip: {
    backgroundColor: "#f3e5f5",
    color: "#7b1fa2",
  },
  pendingChip: {
    backgroundColor: "#f5f5f5",
    color: "#616161",
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
        await confirmOrderMutation.mutateAsync(order.id || order._id);
      } catch (error) {
        toast.error("Failed to confirm order");
      }
    }
  };

  const deliverHandler = async () => {
    if (order) {
      try {
        await deliverOrderMutation.mutateAsync(order.id || order._id);
      } catch (error) {
        toast.error("Failed to deliver order");
      }
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    if (newStatus === "confirmed") {
      handleConfirm();
    } else if (newStatus === "delivered") {
      deliverHandler();
    }
  };

  // Calculate items price
  if (!loading && order) {
    const orderItems = order?.items || order?.orderItems || [];
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + (item.price_sale || item.priceSale || 0) * item.qty,
      0
    );
    order.itemsPrice = itemsPrice.toFixed(2);
  }

  // Determine active step for progress
  const getActiveStep = () => {
    if (!order) return 0;
    if (order.is_delivered || order.isDelivered) return 2;
    if (order.is_processing || order.isProcessing) return 1;
    return 0;
  };

  const steps = ["Order Placed", "Confirmed", "Delivered"];

  return (
    <Container disableGutters style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Grid
        container
        component={Paper}
        elevation={0}
        className={classes.container}
      >
        {loading ? (
          <Loader />
        ) : error ? (
          <Message>{error}</Message>
        ) : (
          order && (
            <div className="bg-[#f5f5f5] w-full">
              <Meta title={`Order ${order.id || order._id}`} />
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                style={{ marginBottom: 24 }}
              >
                <Link color="inherit" component={RouterLink} to="/admin/dashboard">
                  Dashboard
                </Link>
                <Link color="inherit" component={RouterLink} to="/admin/orders">
                  Orders Management
                </Link>
                <Typography color="textPrimary">Order Details</Typography>
              </Breadcrumbs>

              <Grid container spacing={3}>
                {/* Left Column - Order Details */}
                <Grid item xs={12} lg={8}>
                  {/* Order Progress Timeline */}
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h6" className={classes.sectionTitle}>
                        <AssignmentIcon /> Order Progress
                      </Typography>
                      <Stepper
                        alternativeLabel
                        activeStep={getActiveStep()}
                        connector={<ColorlibConnector />}
                        className={classes.stepper}
                      >
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>
                              {label}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </CardContent>
                  </Card>

                  {/* Order Information */}
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h6" className={classes.sectionTitle}>
                        <InfoIcon /> Order Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography className={classes.infoLabel}>
                            <AssignmentIcon /> Order ID
                          </Typography>
                          <Typography className={classes.infoValue}>
                            {order.id || order._id}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography className={classes.infoLabel}>
                            <EventIcon /> Created Date
                          </Typography>
                          <Typography className={classes.infoValue}>
                            {new Date(order.created_at || order.createdAt).toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography className={classes.infoLabel}>
                            <PaymentIcon /> Payment Method
                          </Typography>
                          <Typography className={classes.infoValue}>
                            {order.payment_method || order.paymentMethod}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography className={classes.infoLabel}>
                            <InfoIcon /> Payment Status
                          </Typography>
                          <Chip
                            label={order.is_paid || order.isPaid ? "Paid" : "Unpaid"}
                            className={clsx(classes.statusChip, {
                              [classes.paidChip]: order.is_paid || order.isPaid,
                              [classes.unpaidChip]: !(order.is_paid || order.isPaid),
                            })}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Customer & Shipping Information */}
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h6" className={classes.sectionTitle}>
                        <AccountCircleIcon /> Customer & Shipping
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography className={classes.infoLabel}>
                            <AccountCircleIcon /> Customer
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Typography className={classes.infoValue}>
                              {order.user
                                ? `${order.user.name} (${order.user.email})`
                                : `User ID: ${order.user_id}`}
                            </Typography>
                            {order.user && (
                              <Box ml={1} mb={2}>
                                <EmailIcon fontSize="small" color="action" />
                              </Box>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography className={classes.infoLabel}>
                            <LocalShippingIcon /> Shipping Address
                          </Typography>
                          <Typography className={classes.infoValue}>
                            {Object.values(
                              order.shipping_address || order.shippingAddress || {}
                            )
                              .filter((value) => typeof value === "string")
                              .join(", ")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography className={classes.infoLabel}>
                            <PhoneIcon /> Phone Number
                          </Typography>
                          <Typography className={classes.infoValue}>
                            {(order.shipping_address || order.shippingAddress)
                              ?.recipient_phone_number ||
                              (order.shipping_address || order.shippingAddress)
                                ?.recipientPhoneNumber ||
                              "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h6" className={classes.sectionTitle}>
                        <ShoppingBasketIcon /> Order Items
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Product</TableCell>
                              <TableCell align="center">Size</TableCell>
                              <TableCell align="center">Color</TableCell>
                              <TableCell align="center">Qty</TableCell>
                              <TableCell align="right">Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(order.items || order.orderItems || []).map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Avatar
                                      variant="square"
                                      src={item.images && item.images[0]}
                                      alt={item.name}
                                      className={classes.productImage}
                                    />
                                    <Typography style={{ marginLeft: 16 }}>
                                      {item.name}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  {(item.size_selected || item.sizeSelected || "N/A").toUpperCase()}
                                </TableCell>
                                <TableCell align="center">
                                  <Box
                                    style={{
                                      width: 24,
                                      height: 24,
                                      backgroundColor: item.color_selected || item.colorSelected,
                                      border: "1px solid #ddd",
                                      borderRadius: 4,
                                      margin: "0 auto",
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">{item.qty}</TableCell>
                                <TableCell align="right">
                                  $
                                  {((item.price_sale || item.priceSale) * item.qty).toFixed(
                                    2
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Right Column - Summary & Actions */}
                <Grid item xs={12} lg={4}>
                  {/* Status Management */}
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h6" className={classes.sectionTitle}>
                        <SettingsIcon /> Status Management
                      </Typography>

                      <Box mb={3}>
                        <Typography className={classes.infoLabel}>Current Status</Typography>
                        <Chip
                          label={
                            order.is_delivered || order.isDelivered
                              ? "Delivered"
                              : order.is_processing || order.isProcessing
                                ? "Confirmed"
                                : "Pending"
                          }
                          className={clsx(classes.statusChip, {
                            [classes.deliveredChip]: order.is_delivered || order.isDelivered,
                            [classes.confirmedChip]:
                              (order.is_processing || order.isProcessing) &&
                              !(order.is_delivered || order.isDelivered),
                            [classes.pendingChip]:
                              !(order.is_processing || order.isProcessing) &&
                              !(order.is_delivered || order.isDelivered),
                          })}
                          icon={
                            order.is_delivered || order.isDelivered ? (
                              <LocalShippingIcon style={{ color: "inherit" }} />
                            ) : order.is_processing || order.isProcessing ? (
                              <CheckCircleIcon style={{ color: "inherit" }} />
                            ) : (
                              <HourglassEmptyIcon style={{ color: "inherit" }} />
                            )
                          }
                        />
                      </Box>

                      <Divider style={{ margin: "16px 0" }} />

                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="status-select-label">Update Status</InputLabel>
                        <Select
                          labelId="status-select-label"
                          id="status-select"
                          value={
                            order.is_delivered || order.isDelivered
                              ? "delivered"
                              : order.is_processing || order.isProcessing
                                ? "confirmed"
                                : "pending"
                          }
                          onChange={handleStatusChange}
                          label="Update Status"
                          disabled={order.is_delivered || order.isDelivered}
                        >
                          <MenuItem value="pending" disabled>
                            Pending
                          </MenuItem>
                          <MenuItem
                            value="confirmed"
                            disabled={order.is_processing || order.isProcessing}
                          >
                            Confirmed
                          </MenuItem>
                          <MenuItem
                            value="delivered"
                            disabled={
                              !(order.is_processing || order.isProcessing) ||
                              order.is_delivered ||
                              order.isDelivered
                            }
                          >
                            Delivered
                          </MenuItem>
                        </Select>
                      </FormControl>

                      {(loadingConfirm || loadingDeliver) && (
                        <Box mt={2}>
                          <Loader />
                        </Box>
                      )}
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h6" className={classes.sectionTitle}>
                        <ReceiptIcon /> Order Summary
                      </Typography>

                      <Box className={classes.priceRow}>
                        <Typography variant="body2">Items:</Typography>
                        <Typography variant="body2">${order.itemsPrice}</Typography>
                      </Box>

                      <Box className={classes.priceRow}>
                        <Typography variant="body2">Shipping:</Typography>
                        <Typography variant="body2">
                          ${order.shipping_price || order.shippingPrice}
                        </Typography>
                      </Box>

                      <Box className={classes.priceRow}>
                        <Typography variant="body2">Tax:</Typography>
                        <Typography variant="body2">
                          ${order.tax_price || order.taxPrice}
                        </Typography>
                      </Box>

                      <Box className={classes.totalRow}>
                        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                          Total:
                        </Typography>
                        <Typography
                          variant="h6"
                          color="secondary"
                          style={{ fontWeight: 800 }}
                        >
                          ${order.total_price || order.totalPrice}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          )
        )}
      </Grid>
    </Container>
  );
};

export default AdminOrderScreen;
