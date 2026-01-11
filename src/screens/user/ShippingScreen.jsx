import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  InputBase,
  InputLabel,
  FormControl,
  FormHelperText,
  Breadcrumbs,
  Link,
} from "@material-ui/core";
import Banner from "../../assets/images/shipping.svg?react";
import { Link as RouterLink } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import { makeStyles, withStyles, fade } from "@material-ui/core/styles";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { logout } from "../../actions/userActions";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import CheckoutSteps from "../../components/CheckoutSteps";
import Meta from "../../components/Meta";

const Input = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
    "&.Mui-error $input": {
      borderColor: "#f44336",
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  form: {
    "& > *": {
      marginBottom: 16,
    },
  },
  content: {
    padding: 24,
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
}));

const ShippingScreen = ({ history }) => {
  const classes = useStyles();
  const methods = useForm();
  const { handleSubmit, control } = methods;
  const dispatch = useDispatch();
  const { shippingAddress, saveShippingAddress } = useCartStore();
  const { userInfo } = useSelector((state) => state.userLogin);
  const onSubmit = ({
    address,
    city,
    postalCode,
    country,
    recipientPhoneNumber,
  }) => {
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
        recipientPhoneNumber,
    });
    history.push("/payment");
  };

  useEffect(() => {
    if (!userInfo) {
      dispatch(logout());
      history.push(`/login?redirect=shipping`);
    }
  }, [userInfo, dispatch, history]);

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Shipping | FashionShop" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            style={{ marginBottom: 24 }}
          >
            <Link color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Link color="textPrimary" component={RouterLink} to="/shipping">
              Shipping
            </Link>
          </Breadcrumbs>
          <CheckoutSteps step={1} />
        </Grid>
      </Grid>
      <Paper elevation={0} className={classes.content}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Shipping Address:
            </Typography>
            <FormProvider {...methods}>
              <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                {/* Address */}
                <Controller
                  name="address"
                  defaultValue={shippingAddress?.address || ""}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel shrink htmlFor="shipping-address">
                        Address
                      </InputLabel>
                      <Input {...field} id="shipping-address" fullWidth />
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: "(*) Address is required" }}
                />

                {/* City */}
                <Controller
                  name="city"
                  defaultValue={shippingAddress?.city || ""}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel shrink htmlFor="shipping-city">
                        City/Province
                      </InputLabel>
                      <Input {...field} id="shipping-city" fullWidth />
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: "(*) City is required" }}
                />

                {/* Postal Code */}
                <Controller
                  name="postalCode"
                  defaultValue={shippingAddress?.postalCode || ""}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel shrink htmlFor="shipping-postalCode">
                        Postal Code
                      </InputLabel>
                      <Input {...field} id="shipping-postalCode" fullWidth />
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: "(*) Postal code is required" }}
                />

                {/* Country */}
                <Controller
                  name="country"
                  defaultValue={shippingAddress?.country || ""}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel shrink htmlFor="shipping-country">
                        Country
                      </InputLabel>
                      <Input {...field} id="shipping-country" fullWidth />
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: "(*) Country is required" }}
                />

                {/* Recipient's Phone Number */}
                <Controller
                  name="recipientPhoneNumber"
                  defaultValue={shippingAddress?.recipientPhoneNumber || ""}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel
                        shrink
                        htmlFor="shipping-recipientPhoneNumber"
                      >
                        Recipient's Phone Number
                      </InputLabel>
                      <Input
                        {...field}
                        id="shipping-recipientPhoneNumber"
                        fullWidth
                      />
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{
                    required: "(*) Recipient's phone number is required",
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: "Invalid phone number format",
                    },
                  }}
                />

                <Button type="submit" variant="contained" color="secondary">
                  Next Step
                </Button>
              </form>
            </FormProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Banner className={classes.banner} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ShippingScreen;
