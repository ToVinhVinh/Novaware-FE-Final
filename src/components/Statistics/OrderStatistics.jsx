import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { format, startOfDay, isSameDay } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import OrderSummary from "../Statistics/OrderSummary";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: "15px",
    transition: "0.2s",
    "&:hover": {
      boxShadow: theme.shadows[8],
      cursor: "pointer",
    },
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  formControl: {
    width: "150px",
  },
  datePickerContainer: {
    marginBottom: theme.spacing(2),
  },
  datePicker: {
    alignItems: "center",
    width: "15%",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: theme.spacing(2),
  },
}));

const OrderStatistics = ({
  dailyStats,
  monthlyStats,
  chartData,
  filterStatus,
  handleFilterChange,
  selectedDate,
  handleDateChange,
  totalOrders,
  totalDeliveredOrders,
  totalCancelledOrders,
  averageDailyRevenue,
  dailyCancelled,
  monthlyCancelled,
  orders,
}) => {
  const classes = useStyles();

  // chon ngay
  const calculateSelectedDateStats = useCallback(
    (selectedDate) => {
      if (!selectedDate || !orders) {
        return { count: 0, revenue: 0, delivered: 0, cancelled: 0 };
      }

      const startOfSelectedDate = startOfDay(selectedDate);

      const { count, revenue, delivered, cancelled } = orders.reduce(
        (acc, order) => {
          const orderDate = new Date(order.createdAt);
          if (isSameDay(orderDate, startOfSelectedDate)) {
            acc.count++;
            acc.revenue += order.totalPrice;
            if (order.isDelivered) {
              acc.delivered++;
            }
            if (order.isCancelled) {
              acc.cancelled++;
            }
          }
          return acc;
        },
        { count: 0, revenue: 0, delivered: 0, cancelled: 0 }
      );

      return { count, revenue, delivered, cancelled };
    },
    [orders]
  );
  const [selectedDateStats, setSelectedDateStats] = useState(
    calculateSelectedDateStats(selectedDate)
  );
  useEffect(() => {
    setSelectedDateStats(calculateSelectedDateStats(selectedDate));
  }, [selectedDate, calculateSelectedDateStats]);

  return (
    <>
      <OrderSummary
        totalOrders={totalOrders}
        totalDeliveredOrders={totalDeliveredOrders}
        totalCancelledOrders={totalCancelledOrders}
        averageDailyRevenue={averageDailyRevenue}
      />
      <Grid item xs={12}>
        <TextField
          className={classes.datePicker}
          label="Select Date"
          type="date"
          value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      </Grid>
      {/* select date */}
      <Grid item xs={12}>
        <Paper
          elevation={3}
          className={`${classes.paper} ${classes.datePickerContainer}`}
        >
          <Typography variant="h6" className={classes.title}>
            {selectedDate
              ? format(selectedDate, "dd/MM/yyyy")
              : "Selected Date"}
          </Typography>
          <Box className={classes.statsContainer}>
            <div>
              <Typography variant="subtitle1">Order Count</Typography>
              <Typography variant="h5">{selectedDateStats.count}</Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Revenue</Typography>
              <Typography variant="h5">
                $
                {selectedDateStats.revenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Delivered</Typography>
              <Typography variant="h5">
                {selectedDateStats.delivered}
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Cancelled</Typography>
              <Typography variant="h5">
                {selectedDateStats.cancelled}
              </Typography>
            </div>
          </Box>
        </Paper>
      </Grid>

      {/* filter theo ngay */}
      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <InputLabel id="filter-status-label">Filter by Status</InputLabel>
          <Select
            labelId="filter-status-label"
            id="filter-status"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* today stats */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Today
          </Typography>
          <Box display="flex" justifyContent="space-around">
            <div>
              <Typography variant="subtitle1">Order Count</Typography>
              <Typography variant="h5">{dailyStats.count}</Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Revenue</Typography>
              <Typography variant="h5">
                $
                {dailyStats.revenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Cancelled</Typography>
              <Typography variant="h5">{dailyCancelled}</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>
      {/* this month stats */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            This Month
          </Typography>
          <Box display="flex" justifyContent="space-around">
            <div>
              <Typography variant="subtitle1">Order Count</Typography>
              <Typography variant="h5">{monthlyStats.count}</Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Revenue</Typography>
              <Typography variant="h5">
                $
                {monthlyStats.revenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Cancelled</Typography>
              <Typography variant="h5">{monthlyCancelled}</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>
      {/* last 7 day*/}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Last 7 Days - Order Count
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.dailyOrderCount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Order Count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Last 7 Days - Revenue
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* lat 6 month */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Last 6 Months - Order Count
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyOrderCount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Order Count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Last 6 Months - Revenue
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </>
  );
};

export default OrderStatistics;
