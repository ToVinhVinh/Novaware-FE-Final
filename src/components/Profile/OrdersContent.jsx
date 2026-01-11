import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Link,
  makeStyles,
  Chip,
  Box,
  Avatar,
  Hidden,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import Message from "../Message";
import Loader from "../Loader";
import { formatToVietnamDate } from "../../utils/dateUtils";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    minHeight: 500,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: "#fff",
  },
  tableContainer: {
    borderRadius: theme.spacing(1),
    overflow: "hidden",
  },
  tableHead: {
    backgroundColor: theme.palette.grey[50],
    "& .MuiTableCell-head": {
      fontWeight: 600,
      color: theme.palette.text.primary,
      fontSize: "0.875rem",
    },
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  statusChip: {
    fontWeight: 500,
    fontSize: "0.75rem",
    padding: "2px 8px",
  },
  itemsCell: {
    maxWidth: 300,
  },
  itemPreview: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    "&:last-child": {
      marginBottom: 0,
    },
  },
  itemImage: {
    padding: 4,
    height: 80,
    width: 80,
    borderRadius: 6,
    border: "1px solid #ccc",
    objectFit: "cover",
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: "0.75rem",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemDetails: {
    fontSize: "0.7rem",
    color: theme.palette.text.secondary,
  },
  orderId: {
    fontFamily: "monospace",
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
  dateCell: {
    fontSize: "0.875rem",
  },
  priceCell: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: "0.875rem",
  },
  statusChipBase: {
    fontWeight: 600,
    height: 24,
    padding: "0 6px",
    "& .MuiChip-label": {
      paddingLeft: 4,
      paddingRight: 4,
    },
    "& .MuiChip-icon": {
      fontSize: 16,
      marginLeft: 0,
      marginRight: -2,
    },
  },
  chipPaid: {
    backgroundColor: "#dcfce7 !important",
    color: "#166534 !important",
  },
  chipUnpaid: {
    backgroundColor: "#fee2e2 !important",
    color: "#991b1b !important",
  },
  chipDelivered: {
    backgroundColor: "#d1fae5 !important",
    color: "#065f46 !important",
  },
  chipPending: {
    backgroundColor: "#ffedd5 !important",
    color: "#ea580c !important",
  },
  chipCancelled: {
    backgroundColor: "#fef2f2 !important",
    color: "#991b1b !important",
  },
}));

const OrdersContent = ({ orders, loadingOrders, errorOrders }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.paper} elevation={0}>
      <Typography
        className="tracking-widest"
        variant="h5" style={{ marginBottom: 24 }}>
        My Orders
      </Typography>
      {loadingOrders ? (
        <Loader />
      ) : errorOrders ? (
        <Message>{errorOrders}</Message>
      ) : !orders.length ? (
        <Message mt={8} severity="info">
          You haven't placed any orders yet.{" "}
          <Link component={RouterLink} to="/">
            Shop now!
          </Link>
        </Message>
      ) : (
        <TableContainer className={classes.tableContainer}>
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <Hidden smDown>
                  <TableCell>Items</TableCell>
                </Hidden>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Payment</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                // Support both camelCase and snake_case, and both id and _id
                const orderId = order.id || order._id;
                const createdAt = order.createdAt || order.created_at;
                const totalPrice = order.totalPrice || order.total_price;
                const paidAt = order.paidAt || order.paid_at;
                const deliveredAt = order.deliveredAt || order.delivered_at;
                const isPaid = order.isPaid ?? order.is_paid ?? false;
                const isDelivered = order.isDelivered ?? order.is_delivered ?? false;
                const isCancelled = order.isCancelled ?? order.is_cancelled ?? false;
                const paymentMethod = order.paymentMethod || order.payment_method || "N/A";
                const items = order.items || order.orderItems || [];

                // Determine status
                let statusLabel = "Pending";
                let statusIcon = <HourglassEmptyIcon style={{ color: "#ea580c" }} />;
                let statusClass = classes.chipPending;

                if (isCancelled) {
                  statusLabel = "Cancelled";
                  statusIcon = <CancelIcon style={{ color: "#991b1b" }} />;
                  statusClass = classes.chipCancelled;
                } else if (isDelivered) {
                  statusLabel = "Delivered";
                  statusIcon = <CheckCircleIcon style={{ color: "#065f46" }} />;
                  statusClass = classes.chipDelivered;
                } else if (isPaid) {
                  statusLabel = "Paid";
                  statusIcon = <CheckCircleIcon style={{ color: "#166534" }} />;
                  statusClass = classes.chipPaid;
                }

                return (
                  <TableRow key={orderId} className={classes.tableRow}>
                    <TableCell component="th" scope="order">
                      <Typography className={classes.orderId}>
                        {orderId?.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <Hidden smDown>
                      <TableCell className={classes.itemsCell}>
                        {items.length > 0 ? (
                          <Box>
                            {items.slice(0, 2).map((item, idx) => (
                              <Box key={idx} className={classes.itemPreview}>
                                <Avatar
                                  src={item.images?.[0]}
                                  alt={item.name}
                                  variant="rounded"
                                  className={classes.itemImage}
                                />
                                <Box className={classes.itemInfo}>
                                  <Typography className={classes.itemName}>
                                    {item.name}
                                  </Typography>
                                  <Typography className={classes.itemDetails}>
                                    Qty: {item.qty} • Size: {item.size_selected || item.sizeSelected || "N/A"}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                            {items.length > 2 && (
                              <Typography variant="caption" color="textSecondary">
                                +{items.length - 2} more item(s)
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No items
                          </Typography>
                        )}
                      </TableCell>
                    </Hidden>
                    <TableCell align="right" className={classes.dateCell}>
                      {createdAt ? formatToVietnamDate(createdAt) : "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={paymentMethod}
                        size="small"
                        className={classes.statusChip}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        icon={statusIcon}
                        label={statusLabel}
                        size="small"
                        className={`${classes.statusChipBase} ${statusClass}`}
                      />
                    </TableCell>
                    <TableCell align="right" className={classes.priceCell}>
                      ${totalPrice ? Number(totalPrice).toFixed(2) : "0.00"}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        component={RouterLink}
                        to={`/order/${orderId}`}
                        color="secondary"
                        style={{
                          textTransform: "none",
                          borderRadius: 6,
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </TableContainer>
  );
};

export default OrdersContent;

