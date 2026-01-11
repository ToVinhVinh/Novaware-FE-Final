import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    padding: "6px 10px", 
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

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
  table: {
    minWidth: 350,
  },
  tableContainer: {
    maxHeight: 220,
    overflowY: "auto",
  },
}));

const CategoryStatistics = ({ products, orders }) => {
  const classes = useStyles();

  const calculateCategoryStats = () => {
    const categoryStats = {};

    products.forEach((product) => {
      const category = product.category;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          sales: 0,
          quantitySold: 0,
          stock: 0,
        };
      }
      categoryStats[category].stock += product.countInStock;
    });

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const product = products.find((p) => p._id === item.product);
        if (product) {
          const category = product.category;
          categoryStats[category].sales += item.price * item.qty;
          categoryStats[category].quantitySold += item.qty;
        }
      });
    });

    return categoryStats;
  };

  const categoryStats = calculateCategoryStats();

  return (
    <Grid item xs={12}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h6" className={classes.title}>
          Category Statistics
        </Typography>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="category statistics">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell align="center">
                  Quantity Sold
                </StyledTableCell>
                <StyledTableCell align="center">Stock</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {Object.entries(categoryStats).map(
                ([category, { quantitySold, stock }]) => (
                  <StyledTableRow key={category}>
                    <StyledTableCell component="th" scope="row">
                      {category}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {quantitySold}
                    </StyledTableCell>
                    <StyledTableCell align="center">{stock}</StyledTableCell>
                  </StyledTableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
};

export default CategoryStatistics;