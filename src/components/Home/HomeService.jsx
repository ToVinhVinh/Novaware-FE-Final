import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import DeliveryIcon from "../../assets/icons/delivery-man.svg?react";
import ExchangeIcon from "../../assets/icons/exchange.svg?react";
import ServiceIcon from "../../assets/icons/customer-service.svg?react";

const content = [
  {
    Icon: DeliveryIcon,
    title: "Free Delivery",
    subtitle: "Free Shipping World Wide",
  },
  {
    Icon: ExchangeIcon,
    title: "Exchange Available",
    subtitle: "New online special festival offer",
  },
  {
    Icon: ServiceIcon,
    title: "Customer Support",
    subtitle: "Online service for new customer",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "20px 0 0",
    padding: "20px 0",
    backgroundColor: theme.palette.background.default,
    borderTop: "1px solid #D1D5DB",
    borderBottom: "1px solid #D1D5DB",
    justifyContent: "center",
  },
  card: {
    minWidth: 200,
    textAlign: "center",
    border: "none",
    backgroundColor: "#fafafa",
  },
  topIcon: {
    width: 40,
    height: 40,
    display: "block",
    margin: "0 auto 10px",
    "& path": {
      fill: theme.palette.secondary.main,
    },
  },
  gridItem: {
    borderLeft: "1px solid #D1D5DB",
    "&:first-child": {
      borderLeft: "none",
    },
  },
}));

const HomeService = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      {content.map((item, index) => {
        const { Icon } = item;
        return (
          <Grid item md={3} key={index + 1} className={classes.gridItem}>
            <Card className={classes.card} variant="outlined">
              <CardContent>
                <Icon className={classes.topIcon} />
                <Typography variant="h6" component="h2" gutterBottom noWrap>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  component="p"
                  color="textSecondary"
                  gutterBottom
                  noWrap
                  style={{ textTransform: "capitalize" }}
                >
                  {item.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default HomeService;
