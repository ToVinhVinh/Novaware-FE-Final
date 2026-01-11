import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { useGetCategories } from "../../hooks/api/useCategory";
import { useCreateProduct, useGetProduct } from "../../hooks/api/useProduct";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Paper,
  TextField,
  Container,
  Button,
  Box,
  Grid,
  InputAdornment,
  InputLabel,
  IconButton,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import Meta from "../../components/Meta";
import ProductCard from "../../components/Product/ProductCard";

const useStyles = makeStyles((theme) => ({
  form: {
    "& > *": {
      marginBottom: 16,
    },
    "& .MuiInput-underline:before": {
      borderColor: "rgba(224, 224, 224, 1)",
    },
  },
  container: {
    marginBottom: 64,
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
  },
  size: {
    marginTop: 8,
    "& > div": {
      display: "flex",
      flexBasis: "25%",
      "& > div + div": {
        marginLeft: 16,
      },
      marginTop: 16,
    },
    "& > label": {
      flexBasis: "100%",
    },
  },
  imagePreview: {
    position: "relative",
    marginTop: 8,
    marginRight: 16,
    "& > img": {
      width: 120,
      height: 160,
      objectFit: "cover",
      borderRadius: 6,
    },
    "& .MuiIconButton-root": {
      position: "absolute",
      top: 5,
      right: 5,
    },
  },
  preview: {
    backgroundColor: theme.palette.background.default,
    "& img.MuiCardMedia-media": {
      height: "100%",
    },
  },
  colorBox: {
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: theme.palette.error.main,
    marginTop: 8,
  },
}));

const ProductCreateScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // State
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [sale, setSale] = useState(0);
  const [category, setCategory] = useState("");
  const [sizeS, setSizeS] = useState(0);
  const [sizeM, setSizeM] = useState(0);
  const [sizeL, setSizeL] = useState(0);
  const [sizeXl, setSizeXl] = useState(0);
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState({
    name: "",
    hexCode: "",
  });
  const [totalCountInStock, setTotalCountInStock] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  // Hooks for API data
  const { data: categoriesResponse, isLoading: loadingCategories, error: errorCategories } = useGetCategories();
  const categoriesData = categoriesResponse?.data?.categories || [];

  const createProductMutation = useCreateProduct();
  const { isLoading: loadingCreate, error: errorCreate, isSuccess: successCreate, data: createdProductResponse } = createProductMutation;
  const createdProduct = createdProductResponse?.data?.product;

  // Handlers
  const calculateTotalCountInStock = (size) => {
    let total = 0;
    if (size) {
      total +=
        (parseInt(size.s) || 0) +
        (parseInt(size.m) || 0) +
        (parseInt(size.l) || 0) +
        (parseInt(size.xl) || 0);
    }
    return total;
  };

  useEffect(() => {
    // Tính tổng số lượng tồn kho
    const total = calculateTotalCountInStock({
      s: sizeS,
      m: sizeM,
      l: sizeL,
      xl: sizeXl,
    });
    setTotalCountInStock(total);
  }, [sizeS, sizeM, sizeL, sizeXl]);

  const handleImagesUpload = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    setImages(filesArray);
    const imagesUrl = filesArray.map((image) => URL.createObjectURL(image));
    setPreviewImages(imagesUrl);
    setFormErrors({ ...formErrors, images: false });
  };

  const handleRemovePreviewImages = (removeImage) => {
    const newPreviewImages = previewImages.filter(
      (image) => image !== removeImage
    );
    setPreviewImages(newPreviewImages);
    URL.revokeObjectURL(removeImage);
  };

  const addColorHandler = () => {
    if (newColor.name && newColor.hexCode) {
      const updatedColors = [
        ...colors,
        { name: newColor.name, hexCode: newColor.hexCode },
      ];
      setColors(updatedColors);
      setNewColor({ name: "", hexCode: "" });
      setFormErrors({ ...formErrors, colors: false });
    } else {
      setFormErrors({ ...formErrors, colors: true });
    }
  };

  const removeColorHandler = (index) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
  };

  const handleSetSizeS = (value) => {
    setSizeS(parseInt(value) || 0);
    setFormErrors({ ...formErrors, size: false });
  };

  const handleSetSizeM = (value) => {
    setSizeM(parseInt(value) || 0);
    setFormErrors({ ...formErrors, size: false });
  };

  const handleSetSizeL = (value) => {
    setSizeL(parseInt(value) || 0);
    setFormErrors({ ...formErrors, size: false });
  };

  const handleSetSizeXl = (value) => {
    setSizeXl(parseInt(value) || 0);
    setFormErrors({ ...formErrors, size: false });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Kiểm tra lỗi form
    const errors = {};
    if (!name) errors.name = true;
    if (price < 0) errors.price = true;
    if (sale < 0) errors.sale = true;
    if (!category) errors.category = true;
    if (!description) errors.description = true;
    if (images.length === 0) errors.images = true;
    if (colors.length === 0) errors.colors = true;
    if (sizeS < 0 || sizeM < 0 || sizeL < 0 || sizeXl < 0) errors.size = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Upload ảnh
    let uploadedImages = [];
    if (images.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      setUploading(true);
      try {
        let { data: response } = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedImages = response.data.map((item) => item.url);
      } catch (error) {
        setUploading(false);
        toast.error("Lỗi khi tải hình ảnh");
        return;
      }
    } else {
      uploadedImages = [
        "https://via.placeholder.com/300x400?text=FashionShop",
      ];
    }

    // Tạo product data
    const productData = {
      name,
      price,
      sale,
      images: uploadedImages,
      category,
      description,
      size: { s: sizeS, m: sizeM, l: sizeL, xl: sizeXl },
      colors,
      countInStock: totalCountInStock,
    };

    // Create product using mutation
    try {
      await createProductMutation.mutateAsync(productData);
      toast.success("Product created successfully!");
      history.push("/admin/products");
    } catch (error) {
      toast.error("Failed to create product");
    } finally {
      setUploading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (successCreate && createdProduct) {
      history.push("/admin/products");
    }
  }, [successCreate, createdProduct, history]);

  // Render
  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Create Product" />
      <Grid
        container
        component={Paper}
        elevation={0}
        spacing={8}
        className={classes.container}
      >
        <Grid item xs={12} lg={9}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            style={{ textAlign: "center" }}
          >
            Create Product
          </Typography>
          {loadingCreate && <Loader />}
          {errorCreate && <Message>{errorCreate}</Message>}
          <form onSubmit={submitHandler} className={classes.form}>
            <TextField
              variant="outlined"
              required
              name="name"
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormErrors({ ...formErrors, name: false });
              }}
              fullWidth
              error={formErrors.name}
              helperText={formErrors.name && "Name is required"}
            />
            <Box display="flex" justifyContent="space-between">
              <TextField
                variant="outlined"
                required
                name="price"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                label="Price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setFormErrors({ ...formErrors, price: false });
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                style={{ flexBasis: "50%", marginRight: 8 }}
                error={formErrors.price}
                helperText={formErrors.price && "Price must be greater than 0"}
              />
              <TextField
                variant="outlined"
                required
                name="sale"
                type="number"
                inputProps={{ min: 0 }}
                label="Sale"
                value={sale}
                onChange={(e) => {
                  setSale(e.target.value);
                  setFormErrors({ ...formErrors, sale: false });
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                style={{ flexBasis: "50%", marginLeft: 8 }}
                error={formErrors.sale}
                helperText={formErrors.sale && "Sale must be greater than 0"}
              />
            </Box>
            <div>
              <InputLabel style={{ marginBottom: 8 }}>
                Upload images
              </InputLabel>
              <input
                accept="image/*"
                id="contained-button-file"
                multiple
                onChange={handleImagesUpload}
                type="file"
                hidden
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<MdCloudUpload />}
                  component="span"
                >
                  Upload
                </Button>
              </label>
              <Box my={2} display="flex" flexWrap="wrap">
                {previewImages.map((image) => (
                  <div className={classes.imagePreview} key={image}>
                    <img src={image} alt="" />
                    <IconButton
                      size="small"
                      onClick={() => handleRemovePreviewImages(image)}
                    >
                      <MdClose />
                    </IconButton>
                  </div>
                ))}
              </Box>
              {formErrors.images && (
                <p className={classes.errorText}>
                  Please upload at least one image
                </p>
              )}
            </div>
            <Box>
              <Typography variant="h6">Colors</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Color Name"
                    variant="outlined"
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                    error={formErrors.colors}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Hex Code"
                    variant="outlined"
                    value={newColor.hexCode}
                    onChange={(e) =>
                      setNewColor({ ...newColor, hexCode: e.target.value })
                    }
                    error={formErrors.colors}
                    helperText={
                      formErrors.colors && "Name and Hex Code are required"
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={addColorHandler}
                    variant="contained"
                    color="secondary"
                  >
                    Add Color
                  </Button>
                </Grid>
              </Grid>
              {colors.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1">Added Colors:</Typography>
                  {colors.map((color, index) => (
                    <Box key={index} className={classes.colorBox}>
                      <Typography>
                        {color.name} ({color.hexCode})
                      </Typography>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => removeColorHandler(index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
              {formErrors.colors && colors.length === 0 && (
                <p className={classes.errorText}>
                  Please add at least one color
                </p>
              )}
            </Box>
            <div className={classes.size}>
              <InputLabel>Count In Stock</InputLabel>
              <div>
                <TextField
                  variant="outlined"
                  required
                  type="number"
                  inputProps={{ min: 0 }}
                  name="s"
                  label="Size S"
                  value={sizeS}
                  onChange={(e) => handleSetSizeS(e.target.value)}
                  error={formErrors.size}
                />
                <TextField
                  variant="outlined"
                  required
                  type="number"
                  inputProps={{ min: 0 }}
                  name="m"
                  label="Size M"
                  value={sizeM}
                  onChange={(e) => handleSetSizeM(e.target.value)}
                  error={formErrors.size}
                />
                <TextField
                  variant="outlined"
                  required
                  type="number"
                  inputProps={{ min: 0 }}
                  name="l"
                  label="Size L"
                  value={sizeL}
                  onChange={(e) => handleSetSizeL(e.target.value)}
                  error={formErrors.size}
                />
                <TextField
                  variant="outlined"
                  required
                  type="number"
                  inputProps={{ min: 0 }}
                  name="xl"
                  label="Size XL"
                  value={sizeXl}
                  onChange={(e) => handleSetSizeXl(e.target.value)}
                  error={formErrors.size}
                  helperText={formErrors.size && "Size must be greater than 0"}
                />
              </div>
            </div>
            <TextField
              select
              variant="outlined"
              required
              name="category"
              label="Category"
              fullWidth
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setFormErrors({ ...formErrors, category: false });
              }}
              error={formErrors.category}
              helperText={formErrors.category && "Category is required"}
            >
              {loadingCategories ? (
                <MenuItem disabled>Loading categories...</MenuItem>
              ) : errorCategories ? (
                <MenuItem disabled>Error loading categories</MenuItem>
              ) : (
                categoriesData.map((option) => (
                  <MenuItem key={option._id} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              variant="outlined"
              required
              name="description"
              label="Description"
              fullWidth
              multiline
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setFormErrors({ ...formErrors, description: false });
              }}
              error={formErrors.description}
              helperText={formErrors.description && "Description is required"}
            />
            <Button type="submit" variant="contained" color="secondary">
              Submit
            </Button>
          </form>
          {uploading && <Loader />}
        </Grid>
        <Grid item xs={12} lg={3} className={classes.preview}>
          <ProductCard
            _id=""
            name={name}
            images={
              previewImages.length !== 0
                ? previewImages
                : [
                  "https://via.placeholder.com/300x400?text=NovaWare",
                  "https://via.placeholder.com/300x400?text=NovaWare",
                ]
            }
            price={price}
            sale={sale}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductCreateScreen;