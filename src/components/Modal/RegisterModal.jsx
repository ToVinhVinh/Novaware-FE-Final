import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { useRegister } from "../../hooks/api/useAuth";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { useForm, FormProvider } from "react-hook-form";
import logo from "../../assets/images/logo.png";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import InputController from "../../components/InputController";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    ...theme.mixins.customize.centerFlex(),
    height: "auto",
    fontFamily: "Inter, sans-serif",
    borderRadius: theme.spacing(2),
    overflow: "hidden",
  },
  container: {
    height: "auto",
    width: "450px",
    border: "1px solid #ccc",
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    overflow: "hidden",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.5), 0px 5px 15px rgba(0,0,0,0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    outline: "none",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  content: {
    position: "relative",
    ...theme.mixins.customize.flexMixin("flex-start", "center", "column"),
    padding: theme.spacing(2.5),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    height: "100%",
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
    },
  },
  form: {
    paddingTop: theme.spacing(2),
  },
  backIcon: {
    position: "absolute",
    top: 5,
    left: 0,
  },
  logo: {
    width: "120px",
    marginTop: 8,
  },
}));

const RegisterModal = ({
  open,
  onClose,
  redirect = "/login",
  setLoginModalOpen,
}) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm();
  const { handleSubmit, getValues } = methods;

  const dispatch = useDispatch();

  const registerMutation = useRegister();
  const { isLoading: loading, error, isSuccess, data: registerResponse } = registerMutation;
  const userInfo = registerResponse?.data?.user;

  const handleLoginClick = (e) => {
    e.preventDefault();
    onClose();
    setLoginModalOpen(true);
  };

  useEffect(() => {
    if (isSuccess && userInfo) {
      onClose();
    }
  }, [isSuccess, onClose, userInfo, redirect]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await registerMutation.mutateAsync({ name, email, password });
    } catch (error) {
      console.error("Register failed:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={classes.root}>
            <Grid container component={Paper} className={classes.container}>
              <Grid item sm={12} md={12}>
                <Box className={classes.content}>
                  <img src={logo} alt="" className={classes.logo} />
                  <FormProvider {...methods}>
                    <form
                      className={classes.form}
                      onSubmit={handleSubmit(submitHandler)}
                    >
                      <FormControl fullWidth style={{ marginBottom: 16 }}>
                        <InputController name="name" label="Name" required />
                      </FormControl>
                      <FormControl fullWidth style={{ marginBottom: 16 }}>
                        <InputController
                          name="email"
                          label="Email"
                          required
                          rules={{
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          }}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ marginBottom: 8 }}>
                        <InputController
                          type={showPassword ? "text" : "password"}
                          name="password"
                          label="Password"
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  {showPassword ? <VscEye /> : <VscEyeClosed />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          rules={{
                            minLength: {
                              value: 6,
                              message:
                                "Password must be more than 6 characters",
                            },
                          }}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ marginBottom: 8 }}>
                        <InputController
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          label="Confirm Password"
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  {showPassword ? <VscEye /> : <VscEyeClosed />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          rules={{
                            validate: {
                              matchPassword: (value) =>
                                value !== getValues("password")
                                  ? "Password do not match"
                                  : true,
                            },
                          }}
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        className="!rounded-full !h-10"
                        style={{ marginTop: 16 }}
                      >
                        Sign up
                      </Button>
                    </form>
                  </FormProvider>
                  <Box my={2}>
                    Have an account?{" "}
                    <Link
                      component={RouterLink}

                      onClick={handleLoginClick}
                    >
                      Login
                    </Link>
                  </Box>
                  {loading && <Loader my={0} />}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default RegisterModal;
