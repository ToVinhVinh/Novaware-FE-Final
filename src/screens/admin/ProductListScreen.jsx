import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetProducts, useDeleteProduct } from "../../hooks/api/useProduct";
import { useGetCategories } from "../../hooks/api/useCategory";
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
  InputAdornment,
  Breadcrumbs,
  Link,
  Chip,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineFilter,
} from "react-icons/ai";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import ConfirmDialog from "../../components/Modal/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  button: {
    padding: "6px 0",
    minWidth: "30px",
    "& .MuiButton-startIcon": {
      margin: 0,
    },
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
  dataGrid: {
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  imageCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: theme.spacing(1),
    "& img": {
      width: 64,
      height: 64,
      objectFit: "cover",
      borderRadius: theme.shape.borderRadius,
    },
  },
  lineClampTwo: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textAlign: "left",
  },
  filterContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
  },
  categoryChip: {
    margin: theme.spacing(0.5),
  },
  categoryList: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  filterSection: {
    marginBottom: theme.spacing(2),
  },
  orderingSelect: {
    minWidth: 200,
    marginTop: theme.spacing(2),
  },
}));

const ProductListScreen = ({ history }) => {
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [ordering, setOrdering] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    productId: null,
  });

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const { data: categoriesResponse, isLoading: loadingCategories } = useGetCategories();
  const categories = categoriesResponse?.data?.categories || [];

  const queryParams = {
    pageNumber: page + 1,
    pageSize,
  };

  if (search) {
    queryParams.search = search;
  }

  if (selectedCategories.length > 0) {
    queryParams.category = selectedCategories[0];
  }

  if (ordering) {
    queryParams.ordering = ordering;
  }

  const { data: productsResponse, isLoading: loading, error } = useGetProducts(queryParams);
  const productsData = productsResponse?.data?.products || [];
  const products = productsData.map((product, index) => {
    const normalizedId = product._id || product.id || index;
    const normalizedName = product.name || product.productDisplayName || "N/A";

    return {
      ...product,
      id: normalizedId,
      image: product.images?.[0] || product.image || "",
      productDisplayName: normalizedName,
      gender: product.gender || "N/A",
      masterCategory: product.masterCategory || product.category || "N/A",
      subCategory: product.subCategory || "",
      articleType: product.articleType || "",
      baseColour: product.baseColour || "",
      season: product.season || "",
      year: product.year || "",
      usage: product.usage || "",
      rating: product.rating ?? 0,
      sale: product.sale ?? 0,
      created_at: product.created_at || product.createdAt || "",
      updated_at: product.updated_at || product.updatedAt || "",
    };
  });
  const totalProducts = productsResponse?.data?.count || 0;

  const deleteProductMutation = useDeleteProduct();
  const { error: errorDelete, isSuccess: successDelete } = deleteProductMutation;

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      sortable: false,
      valueGetter: (params) => params.row._id || params.row.id || "",
    },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const imageUrl = params.value;
        return (
          <div className={classes.imageCell}>
            {imageUrl ? (
              <img src={imageUrl} alt={params.row.productDisplayName || "Product"} />
            ) : (
              <Typography variant="body2">N/A</Typography>
            )}
          </div>
        );
      },
    },
    {
      field: "productDisplayName",
      sortable: false,
      headerName: "Name",
      width: 360,
      minWidth: 360,
      flex: 0,
      renderCell: (params) => (
        <Typography variant="body2" className={classes.lineClampTwo}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      sortable: false,
    },
    {
      field: "masterCategory",
      headerName: "Category",
      width: 120,
      sortable: false,
    },
    {
      field: "subCategory",
      headerName: "Sub Category",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2" className={classes.lineClampTwo}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "articleType",
      headerName: "Article Type",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2" className={classes.lineClampTwo}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "baseColour",
      headerName: "Base Colour",
      width: 100,
      sortable: false,
    },
    {
      field: "season",
      headerName: "Season",
      width: 100,
      sortable: false,
    },
    {
      field: "year",
      headerName: "Year",
      width: 100,
      align: "right",
      headerAlign: "right",
      sortable: false,
    },
    {
      field: "usage",
      headerName: "Usage",
      width: 100,
      sortable: false,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 100,
      sortable: false,
      align: "right",
      headerAlign: "right",
      valueFormatter: ({ value }) => (value ? Number(value).toFixed(1) : "0.0"),
    },
    {
      field: "sale",
      headerName: "Sale %",
      width: 100,
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueFormatter: ({ value }) => `${value ?? 0} %`,
    },
    {
      field: "action",
      headerName: "Action",
      align: "right",
      headerAlign: "right",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const id = params.row.id || params.getValue(params.id, "_id") || "";
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AiOutlineEdit />}
              className={classes.button}
              component={RouterLink}
              to={`/admin/product/${id}/edit`}
            />
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: 8 }}
              className={classes.button}
              startIcon={<AiOutlineDelete />}
              onClick={() => handleDeleteClick(id)}
            />
          </>
        );
      },
    },
  ];

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      const idString = String(categoryId);
      const isCurrentlySelected = prev.some((id) => String(id) === idString);
      if (isCurrentlySelected) {
        return prev.filter((id) => String(id) !== idString);
      } else {
        return [...prev, categoryId];
      }
    });
    setPage(0);
  };

  const handleOrderingChange = (event) => {
    setOrdering(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    if (successDelete) {
      toast.success("Product deleted successfully!");
    } else if (errorDelete) {
      toast.error(errorDelete.message || String(errorDelete));
    }
  }, [successDelete, errorDelete]);

  const handleDeleteClick = (id) => {
    setConfirmDialog({ open: true, productId: id });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.productId) {
      try {
        await deleteProductMutation.mutateAsync(String(confirmDialog.productId));
        setConfirmDialog({ open: false, productId: null });
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ open: false, productId: null });
  };

  return (
    <Container disableGutters style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Dashboard | Products" />
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
              <Typography color="textPrimary">Products Management</Typography>
            </Breadcrumbs>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              mb={2}
            >
              <TextField
                variant="outlined"
                size="small"
                className="bg-white"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AiOutlineSearch />
                    </InputAdornment>
                  ),
                }}
              />
              <Box display="flex" style={{ gap: "16px" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AiOutlineFilter />}
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                >
                  Filter by Category
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AiOutlinePlus />}
                  component={RouterLink}
                  to="/admin/product/create"
                >
                  Create Product
                </Button>
              </Box>
            </Box>
            <Collapse in={isFilterExpanded}>
              <Box className={classes.filterContainer}>
                {/* Categories Filter */}
                <Box className={classes.filterSection}>
                  {loadingCategories ? (
                    <Typography variant="body2" color="textSecondary">
                      Loading categories...
                    </Typography>
                  ) : categories.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      No categories available
                    </Typography>
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Select Categories:
                      </Typography>
                      <Box className={classes.categoryList}>
                        {categories.map((category) => {
                          const categoryId = category._id || category.id;
                          const isSelected = selectedCategories.some((id) => String(id) === String(categoryId));
                          return (
                            <Chip
                              key={categoryId}
                              label={category.name}
                              className={classes.categoryChip}
                              clickable
                              color={isSelected ? "primary" : "default"}
                              onClick={() => handleCategoryToggle(categoryId)}
                              onDelete={isSelected ? () => handleCategoryToggle(categoryId) : undefined}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Ordering Select */}
                <FormControl variant="outlined" className={classes.orderingSelect} size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={ordering}
                    onChange={handleOrderingChange}
                    label="Sort By"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="name">Name (A-Z)</MenuItem>
                    <MenuItem value="-name">Name (Z-A)</MenuItem>
                    <MenuItem value="price">Price (Low to High)</MenuItem>
                    <MenuItem value="-price">Price (High to Low)</MenuItem>
                    <MenuItem value="createdAt">Date (Oldest First)</MenuItem>
                    <MenuItem value="-createdAt">Date (Newest First)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Collapse>
            <div style={{ clear: "both" }}></div>{" "}
          </div>
        </Grid>
      </Grid>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message>{error?.message || String(error)}</Message>
      ) : (
        <Grid container>
          <Grid
            item
            xs={12}
            component={Paper}
            className={classes.dataGrid}
            elevation={0}
          >
            <DataGrid
              rows={products}
              columns={columns}
              pagination
              paginationMode="server"
              page={page}
              pageSize={pageSize}
              rowsPerPageOptions={[12, 24, 36, 48]}
              rowCount={totalProducts}
              onPageChange={(params) => {
                const nextPage = typeof params === "number" ? params : params.page;
                setPage(nextPage);
              }}
              onPageSizeChange={(params) => {
                const nextPageSize =
                  typeof params === "number" ? params : params.pageSize;
                setPageSize(nextPageSize);
                setPage(0);
              }}
              onRowClick={(params) => {
                const targetUrl = `/admin/product/${params.row.id}/edit`;
                window.open(targetUrl, "_blank", "noopener,noreferrer");
              }}
              autoHeight
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
            />
          </Grid>
        </Grid>
      )}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="secondary"
        loading={deleteProductMutation.isLoading}
      />
    </Container>
  );
};

export default ProductListScreen;
