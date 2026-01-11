import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useGetUserById, useUpdateUser } from "../../hooks/api/useUser";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Breadcrumbs,
  Link,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    paddingTop: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
    marginTop: 0,
  },
  formContainer: {
    padding: theme.spacing(3),
    marginTop: 0,
  },
  interactionHistoryContainer: {
    padding: theme.spacing(3),
    paddingTop: 0,
    marginTop: 0,
  },
  form: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: theme.spacing(3),
    display: "flex",
    gap: theme.spacing(2),
    justifyContent: "flex-end",
  },
  tableContainer: {
    marginTop: theme.spacing(4),
  },
  tableTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
  tableHeader: {
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600,
  },
}));

const UserEditScreen = () => {
  const classes = useStyles();
  const { userId } = useParams();
  const history = useHistory();
  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const { data: userResponse, isLoading: loading, error } = useGetUserById(userId);
  const user = userResponse?.data?.user;

  const updateUserMutation = useUpdateUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        age: user.age || "",
        height: user.height || "",
        weight: user.weight || "",
        isAdmin: user.isAdmin || false,
      });
    }
  }, [user]);

  useEffect(() => {
    if (updateUserMutation.isSuccess) {
      toast.success("Update user successfully!");
      history.push("/admin/users");
    } else if (updateUserMutation.error) {
      toast.error(
        updateUserMutation.error.message || "An error occurred while updating the user"
      );
    }
  }, [updateUserMutation.isSuccess, updateUserMutation.error, history]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateBody = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender || undefined,
        age: formData.age ? Number(formData.age) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        isAdmin: formData.isAdmin,
      };

      Object.keys(updateBody).forEach(
        (key) => updateBody[key] === undefined && delete updateBody[key]
      );

      await updateUserMutation.mutateAsync({
        id: userId,
        body: updateBody,
      });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "-";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      return timestamp;
    }
  };

  const formatInteractionType = (type) => {
    if (!type) return "-";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const renderInteractionTypeChip = (type) => {
    if (!type) return "-";

    const typeLower = type.toLowerCase();
    let icon = null;
    let label = type.charAt(0).toUpperCase() + type.slice(1);
    let color = "default";

    switch (typeLower) {
      case "purchase":
        icon = <ShoppingCartIcon style={{ fontSize: 16 }} />;
        color = "primary";
        break;
      case "cart":
        icon = <AddShoppingCartIcon style={{ fontSize: 16 }} />;
        color = "secondary";
        break;
      case "like":
        icon = <ThumbUpIcon style={{ fontSize: 16 }} />;
        color = "primary";
        break;
      case "view":
        icon = <VisibilityIcon style={{ fontSize: 16 }} />;
        color = "default";
        break;
      default:
        return label;
    }

    return (
      <Chip
        icon={icon}
        label={label}
        variant="outlined"
        color={color}
        size="small"
        style={{ paddingLeft: 10, paddingRight: 10 }}
      />
    );
  };

  return (
    <Container disableGutters style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Dashboard | Edit User" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <div>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              style={{ marginBottom: 24 }}
            >
              <Link color="inherit" component={RouterLink} to="/admin/products">
                Dashboard
              </Link>
              <Link color="inherit" component={RouterLink} to="/admin/users">
                Users Management
              </Link>
              <Typography color="textPrimary">Edit User</Typography>
            </Breadcrumbs>
          </div>
        </Grid>
      </Grid>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.message || String(error)}</Message>
      ) : (
        <Grid container>
          <Grid item xs={12}>
            <Paper className={classes.formContainer} elevation={0}>
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 0, max: 150 }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Height (cm)"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 0 }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 0 }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="isAdmin"
                            checked={formData.isAdmin}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label="Is Admin"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Box className={classes.buttonContainer}>
                  <Button
                    variant="outlined"
                    color="default"
                    onClick={() => history.push("/admin/users")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={updateUserMutation.isLoading}
                  >
                    {updateUserMutation.isLoading ? "Updating..." : "Update User"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
          {user?.interaction_history && user.interaction_history.length > 0 && (
            <Grid item xs={12}>
              <Paper className={classes.interactionHistoryContainer} elevation={0}>
                <Typography variant="h6" gutterBottom>
                  Interaction History
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHeader}>Product ID</TableCell>
                        <TableCell className={classes.tableHeader}>Interaction Type</TableCell>
                        <TableCell className={classes.tableHeader}>Timestamp</TableCell>
                        <TableCell className={classes.tableHeader}>Usage</TableCell>
                        <TableCell className={classes.tableHeader}>Base Colour</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {user.interaction_history.map((interaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{interaction.product_id || "-"}</TableCell>
                          <TableCell>{renderInteractionTypeChip(interaction.interaction_type)}</TableCell>
                          <TableCell>{formatTimestamp(interaction.timestamp)}</TableCell>
                          <TableCell>{interaction.usage || "-"}</TableCell>
                          <TableCell>{interaction.baseColour || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default UserEditScreen;

