import React, { useEffect } from 'react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { USER_UPDATE_RESET } from '../../constants/userConstants';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import {
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    paddingTop: theme.spacing(1),
  },
}));

const UserEditModal = ({ userId, open, handleClose }) => {
  const classes = useStyles();
  const methods = useForm();
  const { handleSubmit, control, reset } = methods;

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (open) {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        reset({
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        })
      }
    }
  }, [dispatch, open, userId, user, reset]);

  useEffect(() => {
    if (successUpdate) {
      toast.success('Update user successfully!');
      dispatch({ type: USER_UPDATE_RESET });
      handleClose();
    } else if (errorUpdate) {
      toast.error(errorUpdate);
    }
  }, [dispatch, successUpdate, errorUpdate, handleClose]);

  const submitHandler = ({ name, email, isAdmin }) => {
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h5" component="h1">
          Edit User
        </Typography>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message>{error}</Message>
        ) : (
          <form
            className={classes.form}
            onSubmit={handleSubmit(submitHandler)}
          >
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth style={{ marginBottom: 16 }}>
                  <TextField
                    label="Name"
                    defaultValue=" "
                    {...field}
                    error={!!error}
                    helperText={error && error.message}
                  />
                </FormControl>
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth style={{ marginBottom: 16 }}>
                  <TextField
                    label="Email"
                    defaultValue=" "
                    {...field}
                    error={!!error}
                    helperText={error && error.message}
                  />
                </FormControl>
              )}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
            />
            <FormControl fullWidth style={{ marginBottom: 16 }}>
              <FormControlLabel
                control={
                  <Controller
                    name="isAdmin"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <Checkbox
                        checked={!!value}
                        onChange={onChange}
                        {...field}
                      />
                    )}
                  />
                }
                label="Is Admin"
              />
            </FormControl>
            {loadingUpdate && <Loader />}
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(submitHandler)}
          variant="contained"
          color="secondary"
          disabled={loadingUpdate}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditModal;