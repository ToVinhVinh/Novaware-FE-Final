import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetOrders } from "../../hooks/api/useOrder";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link,
  Chip,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import {
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlineEye,
} from "react-icons/ai";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import InfoIcon from "@material-ui/icons/Info";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { formatToVietnamTime } from "../../utils/dateUtils";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  button: {
    padding: "6px 0",
    minWidth: "30px",
    "& .MuiButton-startIcon": {
      margin: 0,
    },
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    paddingTop: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
    marginTop: 0,
  },
  dataGrid: {
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  filterContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
  },
  statusChip: {
    margin: theme.spacing(0.5),
    padding: "0 6px",
    fontWeight: 600,
    height: 24,
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
  filterSection: {
    marginBottom: theme.spacing(2),
  },
  orderingSelect: {
    minWidth: 200,
    marginTop: theme.spacing(2),
  },
  lineClampTwo: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textAlign: "left",
  },
  chipPaid: {
    backgroundColor: "#dcfce7 !important",
    color: "#166534 !important",
  },
  chipUnpaid: {
    backgroundColor: "#fee2e2 !important",
    color: "#991b1b !important",
  },
  chipConfirmed: {
    backgroundColor: "#dbeafe !important",
    color: "#1e40af !important",
  },
  chipWaiting: {
    backgroundColor: "#f3f4f6 !important",
    color: "#4b5563 !important",
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
  chipActive: {
    backgroundColor: "#f0fdf4 !important",
    color: "#166534 !important",
  },
}));

const OrderListScreen = ({ history }) => {
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const queryParams = {
    pageNumber: page + 1,
    perPage: pageSize,
  };

  if (search) {
    queryParams.search = search;
  }

  const { data: ordersResponse, isLoading: loading, error } = useGetOrders(queryParams);
  const ordersData = ordersResponse?.data?.orders || [];

  // Transform orders data to match DataGrid format
  const orders = ordersData.map((order) => ({
    ...order,
    id: order.id || order._id,
    user_id: order.user_id,
    payment_method: order.payment_method,
    total_price: order.total_price,
    is_paid: order.is_paid,
    paid_at: order.paid_at,
    is_delivered: order.is_delivered,
    delivered_at: order.delivered_at,
    is_cancelled: order.is_cancelled,
    is_processing: order.is_processing,
    created_at: order.created_at,
    items_count: order.items?.length || 0,
  }));

  const totalOrders = ordersResponse?.data?.count || 0;

  // Filter orders based on selected filters
  const filteredOrders = orders.filter((order) => {
    let statusMatch = true;
    let paymentMatch = true;

    if (selectedStatus.length > 0) {
      statusMatch = selectedStatus.some((status) => {
        if (status === "paid") return order.is_paid;
        if (status === "unpaid") return !order.is_paid;
        if (status === "delivered") return order.is_delivered;
        if (status === "pending") return !order.is_delivered && !order.is_cancelled;
        if (status === "cancelled") return order.is_cancelled;
        if (status === "processing") return order.is_processing;
        return false;
      });
    }

    if (selectedPaymentMethod.length > 0) {
      paymentMatch = selectedPaymentMethod.includes(order.payment_method);
    }

    return statusMatch && paymentMatch;
  });

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      width: 220,
      sortable: false,
    },
    {
      field: "created_at",
      headerName: "Date",
      width: 180,
      sortable: false,
      valueFormatter: ({ value }) => {
        if (!value) return "N/A";
        return formatToVietnamTime(value);
      },
    },
    {
      field: "payment_method",
      headerName: "Payment",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "COD" ? "default" : "primary"}
          variant="outlined"
        />
      ),
    },
    {
      field: "total_price",
      headerName: "Total",
      width: 120,
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueFormatter: ({ value }) => `$${Number(value || 0).toFixed(2)}`,
    },
    {
      field: "items_count",
      headerName: "Items",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "is_paid",
      headerName: "Payment",
      width: 120,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          icon={params.value ? <CheckCircleIcon style={{ color: "#166534" }} /> : <CancelIcon style={{ color: "#991b1b" }} />}
          label={params.value ? "Paid" : "Unpaid"}
          size="small"
          className={`${classes.statusChip} ${params.value ? classes.chipPaid : classes.chipUnpaid}`}
        />
      ),
    },
    {
      field: "is_processing",
      headerName: "Confirmed",
      width: 140,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          icon={params.value ? <CheckCircleIcon style={{ color: "#1e40af" }} /> : <InfoIcon style={{ color: "#4b5563" }} />}
          label={params.value ? "Confirmed" : "Waiting"}
          size="small"
          className={`${classes.statusChip} ${params.value ? classes.chipConfirmed : classes.chipWaiting}`}
        />
      ),
    },
    {
      field: "is_delivered",
      headerName: "Delivery",
      width: 140,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          icon={params.value ? <CheckCircleIcon style={{ color: "#065f46" }} /> : <HourglassEmptyIcon style={{ color: "#ea580c" }} />}
          label={params.value ? "Delivered" : "Pending"}
          size="small"
          className={`${classes.statusChip} ${params.value ? classes.chipDelivered : classes.chipPending}`}
        />
      ),
    },
    {
      field: "is_cancelled",
      headerName: "Status",
      width: 140,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          icon={params.value ? <CancelIcon style={{ color: "#991b1b" }} /> : <CheckCircleIcon style={{ color: "#065f46" }} />}
          label={params.value ? "Cancelled" : "Active"}
          size="small"
          className={`${classes.statusChip} ${params.value ? classes.chipCancelled : classes.chipActive}`}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AiOutlineEye />}
            className={classes.button}
            component={RouterLink}
            to={`/admin/order/${id}`}
          />
        );
      },
    },
  ];

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleStatusToggle = (status) => {
    setSelectedStatus((prev) => {
      const isCurrentlySelected = prev.includes(status);
      if (isCurrentlySelected) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
    setPage(0);
  };

  const handlePaymentMethodToggle = (method) => {
    setSelectedPaymentMethod((prev) => {
      const isCurrentlySelected = prev.includes(method);
      if (isCurrentlySelected) {
        return prev.filter((m) => m !== method);
      } else {
        return [...prev, method];
      }
    });
    setPage(0);
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  const statusOptions = [
    { value: "paid", label: "Paid", bg: "#dcfce7", color: "#166534" },
    { value: "unpaid", label: "Unpaid", bg: "#fee2e2", color: "#991b1b" },
    { value: "delivered", label: "Delivered", bg: "#d1fae5", color: "#065f46" },
    { value: "pending", label: "Pending", bg: "#ffedd5", color: "#9a3412" },
    { value: "processing", label: "Processing", bg: "#dbeafe", color: "#1e40af" },
    { value: "cancelled", label: "Cancelled", bg: "#fef2f2", color: "#991b1b" },
  ];

  const paymentMethods = ["Stripe", "COD", "PayPal"];

  return (
    <Container disableGutters style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Dashboard | Orders" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <div>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              style={{ marginBottom: 24 }}
            >
              <Link color="inherit" component={RouterLink} to="/admin/orders">
                Dashboard
              </Link>
              <Typography color="textPrimary">Orders Management</Typography>
            </Breadcrumbs>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              mb={2}
            >
              <TextField
                variant="outlined"
                size="small"
                className="bg-white"
                placeholder="Search orders by ID..."
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AiOutlineSearch />
                    </InputAdornment>
                  ),
                }}
              />
              <Box display="flex" style={{ gap: "16px" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AiOutlineFilter />}
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                >
                  Filter Orders
                </Button>
              </Box>
            </Box>
            <Collapse in={isFilterExpanded}>
              <Box className={classes.filterContainer}>
                {/* Status Filter */}
                <Box className={classes.filterSection}>
                  <Typography variant="subtitle2" gutterBottom>
                    Filter by Status:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {statusOptions.map((status) => {
                      const isSelected = selectedStatus.includes(status.value);
                      return (
                        <Chip
                          key={status.value}
                          label={status.label}
                          className={classes.statusChip}
                          clickable
                          onClick={() => handleStatusToggle(status.value)}
                          onDelete={isSelected ? () => handleStatusToggle(status.value) : undefined}
                          style={{
                            backgroundColor: isSelected ? status.bg : "#f3f4f6",
                            color: isSelected ? status.color : "#4b5563",
                            transition: "all 0.2s ease"
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>

                {/* Payment Method Filter */}
                <Box className={classes.filterSection}>
                  <Typography variant="subtitle2" gutterBottom>
                    Filter by Payment Method:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {paymentMethods.map((method) => {
                      const isSelected = selectedPaymentMethod.includes(method);
                      return (
                        <Chip
                          key={method}
                          label={method}
                          className={classes.statusChip}
                          clickable
                          onClick={() => handlePaymentMethodToggle(method)}
                          onDelete={isSelected ? () => handlePaymentMethodToggle(method) : undefined}
                          style={{
                            backgroundColor: isSelected ? "#e0e7ff" : "#f3f4f6",
                            color: isSelected ? "#3730a3" : "#4b5563",
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </Collapse>
            <div style={{ clear: "both" }}></div>
          </div>
        </Grid>
      </Grid>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.message || String(error)}</Message>
      ) : (
        <Grid container>
          <Grid
            item
            xs={12}
            component={Paper}
            className={classes.dataGrid}
            elevation={0}
          >
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              pagination
              paginationMode="client"
              page={page}
              pageSize={pageSize}
              rowsPerPageOptions={[10, 20, 50, 100]}
              rowCount={filteredOrders.length}
              onPageChange={(params) => {
                const nextPage = typeof params === "number" ? params : params.page;
                setPage(nextPage);
              }}
              onPageSizeChange={(params) => {
                const nextPageSize =
                  typeof params === "number" ? params : params.pageSize;
                setPageSize(nextPageSize);
                setPage(0);
              }}
              onRowClick={(params) => {
                const targetUrl = `/admin/order/${params.row.id}`;
                window.open(targetUrl, "_blank", "noopener,noreferrer");
              }}
              autoHeight
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default OrderListScreen;
