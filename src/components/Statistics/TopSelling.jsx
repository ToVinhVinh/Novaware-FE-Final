import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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

const TopSellingProducts = ({ orders, products }) => {
  const classes = useStyles();
  const [top10SellingProducts, setTop10SellingProducts] = useState([]);

  useEffect(() => {
    const calculateTopSelling = () => {
        const productSalesCount = {};
        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            const product = products.find((p) => p._id === item.product);
            if (product) {
              productSalesCount[item.product] = {
                name: product.name,
                count: (productSalesCount[item.product]?.count || 0) + item.qty,
              };
            }
          });
        });

        const topSellingProducts = Object.entries(productSalesCount)
          .map(([productId, { name, count }]) => ({
            productId,
            name,
            quantity: count,
          }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 10);

          setTop10SellingProducts(topSellingProducts);
      };

      calculateTopSelling();
  }, [orders, products]);

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography variant="h6" className={classes.title}>
        Top Selling Products
      </Typography>
      <List>
        <ListItem>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={top10SellingProducts}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="quantity"
                fill="#8884d8"
                name="Quantity Sold"
              />
            </BarChart>
          </ResponsiveContainer>
        </ListItem>
      </List>
    </Paper>
  );
};

export default TopSellingProducts;