import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LowStockProducts from "../Statistics/LowStockProducts";
import CategoryStatistics from "../Statistics/CategoryStatistics";
import TopCancelled from "./TopCancelled";
import TopSelling from "./TopSelling";

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

const ProductStatistics = ({
  totalProducts,
  numProductsSold,
  totalStock,
  totalStockSold,
  products,
  orders,
}) => {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Product Inventory
          </Typography>
          <Box display="flex" justifyContent="space-around">
            <div>
              <Typography variant="subtitle1">Total Products</Typography>
              <Typography variant="h5">{totalProducts}</Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Products Sold</Typography>
              <Typography variant="h5">{numProductsSold}</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Sales Summary
          </Typography>
          <Box display="flex" justifyContent="space-around">
            <div>
              <Typography variant="subtitle1">Total Stock</Typography>
              <Typography variant="h5">{totalStock}</Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Total Stock Sold</Typography>
              <Typography variant="h5">{totalStockSold}</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>

      {/* low stock */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LowStockProducts products={products} lowStockThreshold={10} />
        </Grid>
      {/* cate statis */}
        <Grid item xs={12} md={6}>
          <CategoryStatistics products={products} orders={orders} />
        </Grid>
      </Grid>
      {/* top 10 selling */}
      <Grid item xs={12}>
        <TopSelling orders={orders} products={products} />
      </Grid>
       {/* top 10 cancel */}
       <Grid item xs={12}>
          <TopCancelled  Cancelled orders={orders} products={products}/>
      </Grid>
    </>
  );
};

export default ProductStatistics;