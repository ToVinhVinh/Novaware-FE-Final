import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import {
  Group as GroupIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Assessment as AssessmentIcon,
  LocalShipping as LocalShippingIcon,
  Chat as ChatIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(13),
    backgroundColor: "#f5f5f5",
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "left",
    color: theme.palette.text.secondary,
    borderRadius: "10px",
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.15)",
    },
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize: "2rem",
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    textAlign: "center",
    fontWeight: 600,
    padding: theme.spacing(2),
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
  },
}));

const DashboardScreen = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.sectionTitle}>
        Admin Management
      </Typography>

      <Grid container spacing={3}>
        {/* Manage Users */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper className={classes.paper}>
            <GroupIcon className={classes.icon} color="secondary" />
            <Typography variant="h6" component="h2">
              Manage Users
            </Typography>
            <Button variant="contained" className={classes.button}>
              <Link to="/admin/users" className={classes.link}>
                Go to User List
              </Link>
            </Button>
          </Paper>
        </Grid>

        {/* Manage Brands */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper className={classes.paper}>
            <StoreIcon className={classes.icon} color="secondary" />
            <Typography variant="h6" component="h2">
              Manage Brands
            </Typography>
            <Button variant="contained" className={classes.button}>
              <Link to="/admin/brands" className={classes.link}>
                Go to Brand List
              </Link>
            </Button>
          </Paper>
        </Grid>

        {/* Manage Categories */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper className={classes.paper}>
            <CategoryIcon className={classes.icon} color="secondary" />
            <Typography variant="h6" component="h2">
              Manage Categories
            </Typography>
            <Button variant="contained" className={classes.button}>
              <Link to="/admin/categories" className={classes.link}>
                Go to Category List
              </Link>
            </Button>
          </Paper>
        </Grid>

        {/* Manage Products */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper className={classes.paper}>
            <ShoppingBasketIcon className={classes.icon} color="secondary" />
            <Typography variant="h6" component="h2">
              Manage Products
            </Typography>
            <Button variant="contained" className={classes.button}>
              <Link to="/admin/products" className={classes.link}>
                Go to Product List
              </Link>
            </Button>
          </Paper>
        </Grid>

        {/* Manage Orders */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper className={classes.paper}>
            <LocalShippingIcon className={classes.icon} color="secondary" />
            <Typography variant="h6" component="h2">
              Manage Orders
            </Typography>
            <Button variant="contained" className={classes.button}>
              <Link to="/admin/orders" className={classes.link}>
                Go to Order List
              </Link>
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper className={classes.paper}>
            <AssessmentIcon className={classes.icon} color="secondary" />
            <Typography variant="h6" component="h2">
              Statistics
            </Typography>
            <Button variant="contained" className={classes.button}>
              <Link to="/admin/statistics" className={classes.link}>
                Go to Statistics
              </Link>
            </Button>
          </Paper>
        </Grid>
        {/* Chat with Admin */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper className={classes.paper}>
            <ChatIcon className={classes.icon} color="secondary" />
            <Typography variant="h6" component="h2">
              Chat
            </Typography>
            <Button variant="contained" className={classes.button}>
              <Link to="/admin/chat" className={classes.link}>
                Go to Chat
              </Link>
            </Button>
          </Paper>
        </Grid>
        {/* Chat with Admin */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper className={classes.paper}>
            <ViewCarouselIcon className={classes.icon} color="secondary" />
            <Typography variant="h6" component="h2">
              Edit banner, slider
            </Typography>
            <Button variant="contained" className={classes.button}>
              <Link to="/admin/home-content" className={classes.link}>
                Got to edit
              </Link>
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardScreen;