import React, { useState, useEffect } from "react";
import { useResetPassword } from "../../hooks/api/useAuth";
import { useLocation, useHistory } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Modal,
  Backdrop,
  Fade,
} from "@material-ui/core";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";

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

const ResetPasswordModal = ({ open, onClose, resetTokenFromProp }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const resetToken = resetTokenFromProp || (location.state && location.state.resetToken);

  const resetPasswordMutation = useResetPassword();
  const { isLoading: loading, error, isSuccess } = resetPasswordMutation;

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password reset successfully!");
      onClose();
    }
  }, [isSuccess, history, onClose]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setMessage("Passwords do not match");
    } else {
      if (resetToken) {
        try {
          await resetPasswordMutation.mutateAsync({ body: { password }, resetToken: resetToken });
        } catch (error) {
          console.error("Reset password failed:", error);
        }
      } else {
        toast.error("Reset token not found. Please go back to forgot password and try again.");
        setMessage("Reset token not found. Please go back to forgot password and try again.");
      }
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
              Reset Password
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </Container>
      </Fade>
    </Modal>
  );
};

export default ResetPasswordModal;