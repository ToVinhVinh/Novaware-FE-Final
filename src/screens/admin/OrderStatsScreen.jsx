import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from "@material-ui/core";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  AttachMoney,
  Inventory,
} from "@material-ui/icons";
import {
  useGetOverviewStats,
  useGetRevenueChart,
  useGetTopProducts,
  useGetUserDemographics,
  useGetOrderStatus,
  useGetRecentOrders,
  useGetProductCategories,
  useGetSalesByGender,
  useGetOrderStats,
} from "../../hooks/api/useAdminStats";
import { formatToVietnamDate } from '../../utils/dateUtils';
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 40,
    maxWidth: "100%",
  },
  statsCard: {
    height: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    borderRadius: 12,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
    },
  },
  statsCardUsers: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  statsCardProducts: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  statsCardOrders: {
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  statsCardRevenue: {
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  statsIcon: {
    fontSize: 48,
    opacity: 0.9,
  },
  statsValue: {
    fontSize: "2rem",
    fontWeight: 700,
    marginTop: theme.spacing(1),
  },
  statsLabel: {
    fontSize: "0.875rem",
    opacity: 0.9,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  growthBadge: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  chartCard: {
    padding: theme.spacing(3),
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  periodSelect: {
    minWidth: 120,
  },
  tableContainer: {
    maxHeight: 400,
  },
  statusChip: {
    fontWeight: 600,
  },
}));

const COLORS = ["#667eea", "#f5576c", "#4facfe", "#43e97b", "#ffa726", "#ab47bc"];

const OrderStatsScreen = ({ history }) => {
  const classes = useStyles();
  const [revenuePeriod, setRevenuePeriod] = useState("30d");
  const [topProductsLimit, setTopProductsLimit] = useState(10);
  const [topProductsSortBy, setTopProductsSortBy] = useState("revenue");

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  // Fetch all statistics
  const { data: overviewData, isLoading: loadingOverview, error: errorOverview } = useGetOverviewStats();
  const { data: revenueData, isLoading: loadingRevenue } = useGetRevenueChart({ period: revenuePeriod });
  const { data: topProductsData, isLoading: loadingTopProducts } = useGetTopProducts({
    limit: topProductsLimit,
    sort_by: topProductsSortBy,
  });
  const { data: demographicsData, isLoading: loadingDemographics } = useGetUserDemographics();
  const { data: orderStatusData, isLoading: loadingOrderStatus } = useGetOrderStatus();
  const { data: recentOrdersData, isLoading: loadingRecentOrders } = useGetRecentOrders({ limit: 5 });
  const { data: categoriesData, isLoading: loadingCategories } = useGetProductCategories();
  const { data: salesByGenderData, isLoading: loadingSalesByGender } = useGetSalesByGender();

  React.useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  if (loadingOverview) {
    return <Loader />;
  }

  if (errorOverview) {
    return <Message>{errorOverview?.message || "Failed to load statistics"}</Message>;
  }

  const overview = overviewData?.data;

  // Transform revenue chart data
  const revenueChartData = revenueData?.data?.labels?.map((label, index) => ({
    date: new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: revenueData.data.datasets[0]?.data[index] || 0,
    orders: revenueData.data.datasets[1]?.data[index] || 0,
  })) || [];

  // Transform demographics data
  const genderChartData = demographicsData?.data?.gender?.labels?.map((label, index) => ({
    name: label,
    value: demographicsData.data.gender.data[index],
  })) || [];

  const ageChartData = demographicsData?.data?.age_groups?.labels?.map((label, index) => ({
    name: label,
    value: demographicsData.data.age_groups.data[index],
  })) || [];

  // Transform order status data
  const paymentStatusData = orderStatusData?.data?.payment_status?.labels?.map((label, index) => ({
    name: label,
    value: orderStatusData.data.payment_status.data[index],
  })) || [];

  const fulfillmentStatusData = orderStatusData?.data?.fulfillment_status?.labels?.map((label, index) => ({
    name: label,
    value: orderStatusData.data.fulfillment_status.data[index],
  })) || [];

  // Transform categories data
  const categoriesChartData = categoriesData?.data?.labels?.map((label, index) => ({
    name: label,
    value: categoriesData.data.data[index],
  })) || [];

  // Transform sales by gender data
  const salesByGenderChartData = salesByGenderData?.data?.labels?.map((label, index) => ({
    gender: label,
    revenue: salesByGenderData.data.data[index],
  })) || [];

  const statsCards = [
    {
      title: "Total Users",
      value: overview?.totals?.users || 0,
      thisMonth: overview?.this_month?.new_users || 0,
      growth: overview?.growth?.users_percent || 0,
      icon: <People className={classes.statsIcon} />,
      className: classes.statsCardUsers,
    },
    {
      title: "Total Products",
      value: overview?.totals?.products || 0,
      icon: <Inventory className={classes.statsIcon} />,
      className: classes.statsCardProducts,
    },
    {
      title: "Total Orders",
      value: overview?.totals?.orders || 0,
      thisMonth: overview?.this_month?.orders || 0,
      growth: overview?.growth?.orders_percent || 0,
      icon: <ShoppingCart className={classes.statsIcon} />,
      className: classes.statsCardOrders,
    },
    {
      title: "Total Revenue",
      value: `$${(overview?.totals?.revenue || 0).toLocaleString()}`,
      thisMonth: `$${(overview?.this_month?.revenue || 0).toLocaleString()}`,
      growth: overview?.growth?.revenue_percent || 0,
      icon: <AttachMoney className={classes.statsIcon} />,
      className: classes.statsCardRevenue,
    },
  ];

  return (
    <Container className={classes.container}>
      <Meta title="Dashboard | Statistics" />

      <Typography variant="h4" gutterBottom style={{ fontWeight: 700, marginBottom: 32 }}>
        📊 Dashboard Statistics
      </Typography>

      {/* Overview Stats Cards */}
      <Grid container spacing={3} style={{ marginBottom: 32 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className={`${classes.statsCard} ${card.className}`}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography className={classes.statsLabel}>{card.title}</Typography>
                    <Typography className={classes.statsValue}>{card.value}</Typography>
                    {card.thisMonth && (
                      <Typography variant="body2" style={{ marginTop: 4, opacity: 0.9 }}>
                        This month: {card.thisMonth}
                      </Typography>
                    )}
                    {card.growth !== undefined && (
                      <Box className={classes.growthBadge}>
                        {card.growth >= 0 ? (
                          <TrendingUp fontSize="small" />
                        ) : (
                          <TrendingDown fontSize="small" />
                        )}
                        <Typography variant="body2" style={{ fontWeight: 600 }}>
                          {card.growth >= 0 ? "+" : ""}{card.growth.toFixed(1)}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Revenue Chart */}
      <Grid container spacing={3} style={{ marginBottom: 32 }}>
        <Grid item xs={12}>
          <Paper className={classes.chartCard}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography className={classes.sectionTitle}>📈 Revenue Trend</Typography>
              <FormControl variant="outlined" size="small" className={classes.periodSelect}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={revenuePeriod}
                  onChange={(e) => setRevenuePeriod(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="7d">Last 7 Days</MenuItem>
                  <MenuItem value="30d">Last 30 Days</MenuItem>
                  <MenuItem value="90d">Last 90 Days</MenuItem>
                  <MenuItem value="1y">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {loadingRevenue ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis yAxisId="left" stroke="#667eea" />
                  <YAxis yAxisId="right" orientation="right" stroke="#4facfe" />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }}
                    formatter={(value, name) => [
                      name === "revenue" ? `$${value.toFixed(2)}` : value,
                      name === "revenue" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#667eea"
                    strokeWidth={3}
                    dot={{ fill: "#667eea", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#4facfe"
                    strokeWidth={3}
                    dot={{ fill: "#4facfe", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Top Products & Recent Orders */}
      <Grid container spacing={3} style={{ marginBottom: 32 }}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.chartCard}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography className={classes.sectionTitle}>🏆 Top Products</Typography>
              <Box display="flex" gap={1}>
                <FormControl variant="outlined" size="small" style={{ minWidth: 100 }}>
                  <Select
                    value={topProductsSortBy}
                    onChange={(e) => setTopProductsSortBy(e.target.value)}
                  >
                    <MenuItem value="revenue">Revenue</MenuItem>
                    <MenuItem value="quantity">Quantity</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" style={{ minWidth: 80 }}>
                  <Select
                    value={topProductsLimit}
                    onChange={(e) => setTopProductsLimit(e.target.value)}
                  >
                    <MenuItem value={5}>Top 5</MenuItem>
                    <MenuItem value={10}>Top 10</MenuItem>
                    <MenuItem value={20}>Top 20</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {loadingTopProducts ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer className={classes.tableContainer}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProductsData?.data?.products?.map((product, index) => (
                      <TableRow key={product.product_id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap style={{ maxWidth: 200 }}>
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{product.quantity}</TableCell>
                        <TableCell align="right" style={{ fontWeight: 600, color: "#43e97b" }}>
                          ${product.revenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={classes.chartCard}>
            <Typography className={classes.sectionTitle} style={{ marginBottom: 16 }}>
              🕒 Recent Orders
            </Typography>
            {loadingRecentOrders ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer className={classes.tableContainer}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrdersData?.data?.orders?.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            #{order.id.slice(-8)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {formatToVietnamDate(order.created_at)}
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 600 }}>
                          ${order.total_price.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={order.is_delivered ? "Delivered" : order.is_paid ? "Paid" : "Pending"}
                            size="small"
                            className={classes.statusChip}
                            style={{
                              backgroundColor: order.is_delivered ? "#dcfce7" : order.is_paid ? "#dbeafe" : "#fee2e2",
                              color: order.is_delivered ? "#166534" : order.is_paid ? "#1e40af" : "#991b1b",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/admin/orders"
                size="small"
              >
                View All Orders
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Demographics & Order Status */}
      <Grid container spacing={3} style={{ marginBottom: 32 }}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.chartCard}>
            <Typography className={classes.sectionTitle}>👥 User Demographics</Typography>
            {loadingDemographics ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    By Gender
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={genderChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      >
                        {genderChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    By Age Group
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={ageChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      >
                        {ageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={classes.chartCard}>
            <Typography className={classes.sectionTitle}>📦 Order Status</Typography>
            {loadingOrderStatus ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Payment Status
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        label
                      >
                        {paymentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Fulfillment Status
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={fulfillmentStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        label
                      >
                        {fulfillmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Product Categories & Sales by Gender */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.chartCard}>
            <Typography className={classes.sectionTitle}>📂 Product Categories</Typography>
            {loadingCategories ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoriesChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {categoriesChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={classes.chartCard}>
            <Typography className={classes.sectionTitle}>💰 Sales by Gender</Typography>
            {loadingSalesByGender ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByGenderChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="gender" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Bar dataKey="revenue" name="Revenue">
                    {salesByGenderChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderStatsScreen;
