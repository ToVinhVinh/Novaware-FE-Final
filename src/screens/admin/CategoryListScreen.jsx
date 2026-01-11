import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCategories, useDeleteCategory, useCreateCategory, useUpdateCategory } from "../../hooks/api/useCategory";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
} from "@material-ui/core";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import SnackbarMessage from "../../components/SnackbarMessage";
import ConfirmDialog from "../../components/Modal/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: "6px 6px",
    height: "35px",
    minWidth: "35px",
    "& .MuiButton-startIcon": {
      margin: 0,
    },
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  createButton: {
    backgroundColor: theme.palette.secondary.main,
    height: "40px",
    width: "90px",
    fontSize: "13px",
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  container: {
    marginTop: theme.spacing(-10),
  },
  dataGrid: {
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
  },
}));

const CategoryListScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [categoryName, setCategoryName] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    categoryId: null,
  });

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const { data: categoriesResponse, isLoading: loading, error } = useGetCategories();
  const categoriesData = categoriesResponse?.data?.categories || [];
  const categories = categoriesData.map((category) => ({
    ...category,
    id: category._id,
  }));

  const deleteCategoryMutation = useDeleteCategory();
  const { error: errorDelete, isSuccess: successDelete } = deleteCategoryMutation;

  const createCategoryMutation = useCreateCategory();
  const { isLoading: loadingCreate, error: errorCreate, isSuccess: successCreate } = createCategoryMutation;

  const updateCategoryMutation = useUpdateCategory();
  const { isSuccess: successUpdate } = updateCategoryMutation;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    if (successCreate) {
      toast.success("Category created successfully!");
      setCategoryName("");
    }
    if (successUpdate) {
      toast.success("Category updated successfully!");
    }
    if (successDelete) {
      toast.success("Category deleted successfully!");
    }
  }, [successDelete, successCreate, successUpdate]);

  const handleDeleteClick = (id) => {
    setConfirmDialog({ open: true, categoryId: id });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.categoryId) {
      try {
        await deleteCategoryMutation.mutateAsync(confirmDialog.categoryId);
        setConfirmDialog({ open: false, categoryId: null });
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ open: false, categoryId: null });
  };

  const createCategoryHandler = async () => {
    if (categoryName) {
      try {
        await createCategoryMutation.mutateAsync({ name: categoryName });
        setCategoryName("");
      } catch (error) {
        console.error("Failed to create category:", error);
      }
    } else {
      alert("Please enter a category name");
    }
  };

  const saveHandler = async (id, name) => {
    try {
      await updateCategoryMutation.mutateAsync({ id, body: { name } });
      setEditMode(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 2, minWidth: 180 },
    {
      field: "name",
      headerName: "Name",
      flex: 1.8,
      minWidth: 250,
      renderCell: (params) => {
        return editMode === params.id ? (
          <TextField
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            variant="outlined"
            size="small"
          />
        ) : (
          params.value
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" width="100%" height="100%">
          {editMode === params.id ? (
            <IconButton
              color="primary"
              onClick={() => saveHandler(params.id, categoryName)}
            >
              <AiOutlineSave />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AiOutlineEdit />}
              className={classes.button}
              onClick={() => {
                setEditMode(params.id);
                setCategoryName(params.row.name);
              }}
            />
          )}
          <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: 8 }}
            className={classes.button}
            startIcon={<AiOutlineDelete />}
            onClick={() => handleDeleteClick(params.id)}
          />
        </Box>
      ),
    },
  ];

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <SnackbarMessage />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <div>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              style={{ marginBottom: 16 }}
            >
              Category Management
            </Typography>
          </div>
        </Grid>
      </Grid>
      {loading || loadingCreate ? (
        <Loader />
      ) : error || errorCreate ? (
        <Message>{error || errorCreate}</Message>
      ) : (
        <Grid container spacing={2}>
          {/* Create Category Section */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-start" mt={2}>
              <TextField
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                variant="outlined"
                size="small"
                fullWidth
                style={{ marginRight: "10px" }}
              />
              <Button
                variant="contained"
                className={`${classes.createButton}`}
                onClick={createCategoryHandler}
              >
                Create
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            component={Paper}
            className={classes.dataGrid}
            elevation={0}
          >
            <DataGrid
              rows={categories}
              columns={columns}
              pageSize={10}
              autoHeight
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
              disableSelectionOnClick
            />
          </Grid>
        </Grid>
      )}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="secondary"
        loading={deleteCategoryMutation.isLoading}
      />
    </Container>
  );
};

export default CategoryListScreen;
