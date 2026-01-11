import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUpdateProfile } from "../../hooks/api/useUser";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import InputController from "../../components/InputController";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  form: {
    padding: theme.spacing(2),
    "& .MuiInput-underline:before": {
      borderColor: "rgba(224, 224, 224, 1)",
    },
    "& .MuiInput-input": {
      fontFamily: "Inter, sans-serif",
      fontSize: 13,
    },
  },
}));

const UpdateProfileModal = ({ open, onClose, user }) => {
  const classes = useStyles();
  const methods = useForm();
  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setValue("height", user.height || "");
      setValue("weight", user.weight || "");
      setValue("gender", user.gender || "");
    }
  }, [user, setValue]);

  const updateProfileMutation = useUpdateProfile();

  const submitHandler = async (data) => {
    try {
      await updateProfileMutation.mutateAsync({
        height: data.height,
        weight: data.weight,
        gender: data.gender,
      });
      onClose();
      toast.success("Update profile successfully!");
      window.location.reload(); 
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Profile for Size Recommendation</DialogTitle>
      <FormProvider {...methods}>
        <form
          className={classes.form}
          onSubmit={handleSubmit(submitHandler)}
        >
          <DialogContent>
            <FormControl fullWidth style={{ marginBottom: 12 }}>
              <InputController
                name="height"
                label="Height (cm)"
                type="number"
                defaultValue={user?.height}
              />
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: 12 }}>
              <InputController
                name="weight"
                label="Weight (kg)"
                type="number"
                defaultValue={user?.weight}
              />
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: 12 }}>
              <InputController
                name="gender"
                label="Gender"
                control={methods.control}
                defaultValue={user?.gender || ""}
                select
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="secondary">
              Update
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateProfileModal;