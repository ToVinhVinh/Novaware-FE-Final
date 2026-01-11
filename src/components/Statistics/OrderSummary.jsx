import React from "react";
import { Grid, Paper, Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
}));

const OrderSummary = ({
  totalOrders,
  totalDeliveredOrders,
  totalCancelledOrders,
  averageDailyRevenue,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h6" className={classes.title}>
          Order Summary
        </Typography>
        <Box display="flex" justifyContent="space-around">
          <div>
            <Typography variant="subtitle1">Total Orders</Typography>
            <Typography variant="h5">{totalOrders}</Typography>
          </div>
          <div>
            <Typography variant="subtitle1">Delivered Orders</Typography>
            <Typography variant="h5">{totalDeliveredOrders}</Typography>
          </div>
          <div>
            <Typography variant="subtitle1">Cancelled Orders</Typography>
            <Typography variant="h5">{totalCancelledOrders}</Typography>
          </div>
          <div>
            <Typography variant="subtitle1">Average Daily Revenue</Typography>
            <Typography variant="h5">
              $
              {averageDailyRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Typography>
          </div>
        </Box>
      </Paper>
    </Grid>
  );
};

export default OrderSummary;