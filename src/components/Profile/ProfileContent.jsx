import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Badge,
  FormControl,
  Button,
  InputAdornment,
  IconButton,
  makeStyles,
  withStyles,
  Grid,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import {
  FaUser,
  FaEnvelope,
  FaRulerVertical,
  FaWeight,
  FaVenusMars,
  FaLock,
  FaCalendarAlt
} from "react-icons/fa";
import CallMadeIcon from "@material-ui/icons/CallMade";
import { toast } from "react-toastify";
import { useUpdateProfile } from "../../hooks/api/useUser";
import InputController from "../InputController";
import defaultAvatar from "../../assets/images/userPlaceholder.png";
import male30 from "../../assets/images/male30.webp";
import male40 from "../../assets/images/male40.webp";
import male50 from "../../assets/images/male50.webp";
import female30 from "../../assets/images/female30.webp";
import female40 from "../../assets/images/female40.webp";
import female50 from "../../assets/images/female50.webp";

const StyledBadge = withStyles((theme) => ({
  root: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
    minHeight: 500,
    border: `1px solid ${theme.palette.divider}`,
  },
  largeAvatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  profile: {
    position: "relative",
    ...theme.mixins.customize.flexMixin("center", "center", "column"),
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://picsum.photos/800/400)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: 20,
    marginTop: theme.spacing(4),
    minHeight: 180,
    borderRadius: 6,
  },
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
  gridContainer: {
    marginTop: theme.spacing(2),
  },
  gridItem: {
    padding: theme.spacing(1),
  },
  icon: {
    color: theme.palette.text.secondary,
  },
  interactionSection: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1.5),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    backdropFilter: "blur(10px)",
  },
  interactionText: {
    color: "#ccc",
    fontSize: 14,
    flex: 1,
  },
  arrowButton: {
    color: "#ccc",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: theme.spacing(1),
    minWidth: "auto",
    marginLeft: 8,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    "& svg": {
      transform: "rotate(-90deg) scaleY(-1)",
    },
  },
}));

// Function to get avatar image based on age and gender
const getAvatarImage = (age, gender) => {
  if (!age || !gender) {
    return defaultAvatar;
  }

  const genderPrefix = gender.toLowerCase() === "male" ? "male" : "female";

  if (age <= 30) {
    return genderPrefix === "male" ? male30 : female30;
  } else if (age <= 50) {
    return genderPrefix === "male" ? male40 : female40;
  } else {
    return genderPrefix === "male" ? male50 : female50;
  }
};

const ProfileContent = ({ user, onItemClick }) => {
  const classes = useStyles();
  const methods = useForm();
  const { handleSubmit, getValues, setValue } = methods;
  const [showPassword, setShowPassword] = useState(false);

  const updateProfileMutation = useUpdateProfile();
  const { isSuccess: success } = updateProfileMutation;

  const avatarImage = getAvatarImage(user?.age, user?.gender);
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("height", user.height || "");
      setValue("weight", user.weight || "");
      setValue("gender", user.gender || "");
      setValue("age", user.age || "");
    }
  }, [setValue, user]);

  useEffect(() => {
    if (success) {
      toast.success("Profile updated successfully");
    }
  }, [success]);

  const submitHandler = async (data) => {
    if (!user?._id && !user?.id) {
      toast.error("User information not available. Please try again.");
      return;
    }

    try {
      const payload = {
        name: data.name,
        email: data.email,
      };

      if (data.gender && data.gender.trim() !== "") {
        payload.gender = data.gender;
      }

      if (data.password && data.password.trim() !== "") {
        payload.password = data.password;
      }

      if (data.height && data.height !== "") {
        payload.height = Number(data.height);
      }

      if (data.weight && data.weight !== "") {
        payload.weight = Number(data.weight);
      }

      if (data.age && data.age !== "") {
        payload.age = Number(data.age);
      }

      await updateProfileMutation.mutateAsync(payload);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography
        className="tracking-widest"
        variant="h5" style={{ marginBottom: 24 }}>
        Personal Information
      </Typography>
      <Box className={classes.profile}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
        >
          <Avatar
            src={avatarImage}
            className={classes.largeAvatar}
          />
        </StyledBadge>
        <Typography
          className="tracking-widest"
          style={{ marginTop: 40, fontSize: 20, color: "#ccc", }}>{user?.name}</Typography>
        <Typography
          variant="caption"
          style={{ color: "#ccc", fontSize: 14 }}
        >
          {user?.email}
        </Typography>
        {user?.interactionHistory && user.interactionHistory.length > 0 && (
          <Box className={classes.interactionSection}>
            <Typography className={classes.interactionText}>
              You have interacted with{" "}
              <span style={{ fontWeight: "bold", color: "#f50057", fontSize: 20, marginRight: 2, marginLeft: 2 }}>
                {user.interactionHistory.length}
              </span>{" "}
              product{user.interactionHistory.length !== 1 ? 's' : ''}
            </Typography>
            <IconButton
              className={classes.arrowButton}
              onClick={() => onItemClick && onItemClick("favorites")}
              size="small"
            >
              <CallMadeIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
      <FormProvider {...methods}>
        <form
          className={classes.form}
          onSubmit={handleSubmit(submitHandler, (errors) => {
            toast.error("Please fill in all required fields correctly.");
          })}
        >
          <Grid container spacing={2} className={classes.gridContainer}>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <FormControl fullWidth>
                <InputController
                  name="name"
                  label="Name"
                  defaultValue={user?.name}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaUser className={classes.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <FormControl fullWidth>
                <InputController
                  name="email"
                  label="Email"
                  defaultValue={user?.email}
                  required
                  rules={{
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaEnvelope className={classes.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <FormControl fullWidth>
                <InputController
                  name="height"
                  label="Height (cm)"
                  type="number"
                  defaultValue={user?.height}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaRulerVertical className={classes.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <FormControl fullWidth>
                <InputController
                  name="weight"
                  label="Weight (kg)"
                  type="number"
                  defaultValue={user?.weight}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaWeight className={classes.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <FormControl fullWidth>
                <InputController
                  name="age"
                  label="Age"
                  type="number"
                  defaultValue={user?.age}
                  inputProps={{
                    min: 11,
                  }}
                  rules={{
                    validate: {
                      minAge: (value) => {
                        if (!value || value === "") return true; // Allow empty
                        const age = Number(value);
                        if (isNaN(age)) return "Age must be a number";
                        if (age <= 10) return "Age must be greater than 10";
                        return true;
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaCalendarAlt className={classes.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <FormControl fullWidth>
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaVenusMars className={classes.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <FormControl fullWidth>
                <InputController
                  type={showPassword ? "text" : "password"}
                  name="password"
                  label="New Password"
                  rules={{
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaLock className={classes.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <FormControl fullWidth>
                <InputController
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  label="Confirm Password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaLock className={classes.icon} />
                      </InputAdornment>
                    ),
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
                          ? "Passwords do not match"
                          : true,
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className={classes.gridItem}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                style={{ marginTop: 16 }}
              >
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default ProfileContent;

