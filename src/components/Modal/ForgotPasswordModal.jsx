import React, { useState, useEffect } from "react";
import { useForgotPassword, useVerifyCode } from "../../hooks/api/useAuth";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Modal,
  Backdrop,
  Fade,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
  },
}));

const ForgotPasswordModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const classes = useStyles();

  const forgotPasswordMutation = useForgotPassword();
  const { isLoading: loading, error, isSuccess, data: forgotPasswordResponse } = forgotPasswordMutation;
  const message = forgotPasswordResponse?.data?.message;

  const verifyCodeMutation = useVerifyCode();
  const { isLoading: verifyLoading, error: verifyError, isSuccess: verifySuccess, data: verifyCodeResponse } = verifyCodeMutation;
  const verifyResetToken = verifyCodeResponse?.data?.resetToken;

  useEffect(() => {
    if (isSuccess) {
      if (message) {
        toast.success(message);
      }
      setShowCodeInput(true);
    }
  }, [isSuccess, message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (verifySuccess && verifyResetToken) {
      toast.success("Code verified successfully!");
      setResetToken(verifyResetToken);
      onClose();
    }
  }, [verifySuccess, verifyResetToken, onClose]);

  useEffect(() => {
    if (verifyError) {
      toast.error(verifyError);
    }
  }, [verifyError]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPasswordMutation.mutateAsync({ email });
    } catch (error) {
      console.error("Forgot password failed:", error);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyCodeMutation.mutateAsync({ email, code });
    } catch (error) {
      console.error("Verify code failed:", error);
    }
  };

  return (
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
        <Container component="main" maxWidth="xs">
          <div className={classes.root}>
            <Typography component="h1" variant="h5">
              Forgot Password
            </Typography>
            {!showCodeInput ? (
              <form onSubmit={handleEmailSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </Button>
              </form>
            ) : (
              <Box mt={3}>
                <form onSubmit={handleCodeSubmit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="code"
                    label="Verification Code"
                    name="code"
                    autoFocus
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                </form>
              </Box>
            )}
          </div>
        </Container>
      </Fade>
    </Modal>
  );
};

export default ForgotPasswordModal;