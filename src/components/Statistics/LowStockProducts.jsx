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
  tableContainer: {
    maxHeight: 220,
    overflowY: "auto",
  },
  table: {
    minWidth: 350,
  },
}));

const LowStockProducts = ({ products }) => {
  const classes = useStyles();
  const topLowStockProducts = products
    .slice() 
    .sort((a, b) => a.countInStock - b.countInStock)
    .slice(0, 10);

  return (
    <Grid item xs={12}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h6" className={classes.title}>
          Products Low in Stock
        </Typography>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="low stock products">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Product Name</StyledTableCell>
                <StyledTableCell align="center">In Stock</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {topLowStockProducts.map((product) => (
                <StyledTableRow key={product._id}>
                  <StyledTableCell component="th" scope="row">
                    {product.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.countInStock}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
};

export default LowStockProducts;