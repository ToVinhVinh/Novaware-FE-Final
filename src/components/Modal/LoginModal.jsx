import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";
import { useLogin } from "../../hooks/api/useAuth";
import { useForm, FormProvider } from "react-hook-form";
import { VscEyeClosed, VscEye, VscClose } from "react-icons/vsc";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import cookies from "js-cookie";
import { USER_LOGIN_SUCCESS } from "../../constants/userConstants";
import { socialLogin, handleSocialLoginCallback } from "../../actions/userActions";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import logo from "../../assets/images/logo.png";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import InputController from "../../components/InputController";
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
    paddingTop: theme.spacing(3),
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
  socialButtonsContainer: {
    marginTop: theme.spacing(2),
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: theme.spacing(1.5),
  },
  socialButton: {
    borderRadius: "9999px",
    color: "white",
    fontSize: "13px",
    padding: "8px 16px",
    textTransform: "none",
    fontWeight: 500,
    "&:hover": {
      opacity: 0.9,
    },
  },
  googleButton: {
    backgroundColor: "#EA4335",
    "&:hover": {
      backgroundColor: "#D33B2C",
    },
  },
  facebookButton: {
    backgroundColor: "#1877F2",
    "&:hover": {
      backgroundColor: "#166FE5",
    },
  },
  twitterButton: {
    backgroundColor: "#1DA1F2",
    "&:hover": {
      backgroundColor: "#1A91DA",
    },
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  divider: {
    margin: theme.spacing(2, 0),
    width: "100%",
  },
}));

const decodeJwtPayload = (token) => {
  try {
    if (!token || typeof token !== "string") return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const LoginModal = ({
  open,
  onClose,
  redirect = "/",
  setRegisterModalOpen,
  setForgotPasswordModalOpen,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const methods = useForm();
  const { handleSubmit } = methods;

  const dispatch = useDispatch();
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();

  const loginMutation = useLogin();
  const { isLoading: loading, error, isSuccess, data: loginResponse } = loginMutation;
  const hasRedirected = useRef(false);

  // Reset state khi modal đóng
  useEffect(() => {
    if (!open) {
      hasRedirected.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess && loginResponse?.data && !hasRedirected.current) {
      const { tokens, user } = loginResponse.data;
      const { access, refresh } = tokens || {};

      if (!access) {
        toast.error("Cannot get access token from login response");
        return;
      }

      localStorage.setItem("access_token", access);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("token", JSON.stringify({ token: access, refreshToken: refresh }));
      cookies.set("accessToken", access);

      if (refresh) {
        localStorage.setItem("refreshToken", refresh);
        cookies.set("refreshToken", refresh);
      }

      const decodedPayload = decodeJwtPayload(access);
      const userIdFromToken = decodedPayload?.user_id || decodedPayload?.userId || decodedPayload?._id || decodedPayload?.id || null;
      const userId = user?.id || user?._id || userIdFromToken;

      if (userId) {
        localStorage.setItem("currentUserId", userId);
      }

      const computedUserInfo = {
        _id: userId,
        name: user?.name || user?.username || "",
        email: user?.email || decodedPayload?.email || "",
        isAdmin: Boolean(user?.isAdmin ?? user?.is_staff ?? decodedPayload?.is_admin),
        token: access,
      };

      localStorage.setItem("userInfo", JSON.stringify(computedUserInfo));

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: computedUserInfo,
      });

      hasRedirected.current = true;
      onClose();
      toast.success("Login successfully");

      const isAdmin = computedUserInfo.isAdmin;
      if (isAdmin) {
        history.push("/admin/products");
      } else if (redirect) {
        history.push(redirect);
      } else {
        history.push("/");
      }
    } else if (isSuccess && !loginResponse?.data?.tokens && !hasRedirected.current) {
      toast.error("Cannot process login response");
    }
  }, [isSuccess, loginResponse, dispatch, history, onClose, redirect]);

  const submitHandler = async ({ email, password }) => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      const errorMessage = error?.message || error?.error || "Login failed";
      toast.error(errorMessage);
    }
  };

  const handleCreateAccountClick = (e) => {
    e.preventDefault();
    onClose();
    setRegisterModalOpen(true);
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    onClose();
    setForgotPasswordModalOpen(true);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isSocialLoginCallback = searchParams.has("success");
    if (isSocialLoginCallback) {
      dispatch(handleSocialLoginCallback(searchParams)).then((result) => {
        if (result.success) {
          onClose();
          history.push("/");
        } else {
          console.error(result.error);
        }
      });
    }
  }, [location, dispatch, onClose, history]);

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
                  <IconButton
                    className={classes.closeIcon}
                    onClick={onClose}
                    aria-label="close"
                  >
                    <VscClose />
                  </IconButton>
                  <img src={logo} alt="" className={classes.logo} />
                  <FormProvider {...methods}>
                    <form
                      className={classes.form}
                      onSubmit={handleSubmit(submitHandler)}
                    >
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
                          required
                          rules={{
                            minLength: {
                              value: 6,
                              message:
                                "Password must be more than 6 characters",
                            },
                          }}
                        />
                      </FormControl>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={1}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              color="secondary"
                            />
                          }
                          label="Remember Me"
                        />
                        <Link
                          component={RouterLink}
                          onClick={handleForgotPasswordClick}
                        >
                          Forgot password?
                        </Link>
                      </Box>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        className="!rounded-full !h-10"
                      >
                        Login
                      </Button>
                    </form>
                  </FormProvider>
                  <Box mt={2}>
                    New customer?{" "}
                    <Link
                      component={RouterLink}
                      onClick={handleCreateAccountClick}
                    >
                      Create Account
                    </Link>
                  </Box>
                  <Divider className={classes.divider} />
                  <p>Or login with</p>
                  <Box className={classes.socialButtonsContainer}>
                    <Button
                      className={`${classes.socialButton} ${classes.googleButton}`}
                      onClick={() => dispatch(socialLogin("google"))}
                      startIcon={<FaGoogle />}
                    >
                      Google
                    </Button>
                    <Button
                      className={`${classes.socialButton} ${classes.facebookButton}`}
                      onClick={() => dispatch(socialLogin("facebook"))}
                      startIcon={<FaFacebook />}
                    >
                      Facebook
                    </Button>
                    <Button
                      className={`${classes.socialButton} ${classes.twitterButton}`}
                      onClick={() => dispatch(socialLogin("twitter"))}
                      startIcon={<FaTwitter />}
                    >
                      Twitter
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default LoginModal;