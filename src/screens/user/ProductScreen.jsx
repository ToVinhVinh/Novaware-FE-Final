import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import useCartStore from "../../store/cartStore";
import { Grid, Container, Link, Box } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import Message from "../../components/Message";
import ProductReview from "../../components/Product/ProductReview.jsx";
import ProductRelated from "../../components/Product/ProductRelated.jsx";
import ProductInfo from "../../components/Product/ProductInfo.jsx";
import ProductImageGallery from "../../components/Product/ProductImageGallery.jsx";
import { useGetProduct } from "../../hooks/api/useProduct";
import { useGetUserById } from "../../hooks/api/useUser";
import { useGetFavorites } from "../../hooks/api/useUser";
import { useAddFavorite, useRemoveFavorite } from "../../hooks/api/useUser";
import { useUpdateInteraction } from "../../hooks/api/useUserInteraction";
import LottieLoading from "@/components/LottieLoading";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  productInfo: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: "0 !important",
    },
  },
}));

const ProductScreen = ({ setLoginModalOpen }) => {
  const classes = useStyles();
  const location = useLocation();
  const { addToCart, setDrawerOpen } = useCartStore();

  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('id');

  const { data: productResponse, isLoading: loading, error: productError } = useGetProduct(productId);
  const product = productResponse?.data?.product;

  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  const currentUserId = userInfo?._id || "";

  const { data: userResponse } = useGetUserById(currentUserId);
  const user = userResponse?.data?.user;

  const { data: favoritesResponse } = useGetFavorites(userInfo?._id || "");
  const favoriteItems = favoritesResponse?.data?.favoriteItems || [];

  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  const updateInteraction = useUpdateInteraction(currentUserId);

  const error = productError?.message || (productError ? String(productError) : null);

  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (product?._id && currentUserId) {
      updateInteraction.mutate({
        product_id: product._id,
        interaction_type: 'view',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id, currentUserId]);

  useEffect(() => {
    if (userInfo && favoriteItems && product?._id) {
      const productId = String(product._id);
      const isProductInFavorites = favoriteItems.some(
        (item) => {
          const itemId = item._id ? String(item._id) : null;
          return itemId === productId;
        }
      );
      setIsFavorite(isProductInFavorites);
    }
  }, [userInfo, favoriteItems, product?._id]);

  const addToCartHandler = ({ qty, size, color }) => {
    let colorName = "";
    if (product.colors && product.colors.length > 0) {
      const selectedColor = product.colors.find((c) => c.hexCode === color);
      colorName = selectedColor ? selectedColor.name : color;
    } else {
      colorName = color || "";
    }

    // Sử dụng dữ liệu sản phẩm đã có sẵn, không cần gọi API
    setDrawerOpen(true);
    addToCart(product, qty, size, color, colorName);

    if (currentUserId && product?._id) {
      updateInteraction.mutate({
        product_id: product._id,
        interaction_type: 'cart',
      });
    }

    toast.success("Product added to cart successfully!");
  };

  const handleAddToFavorites = async () => {
    if (!userInfo) {
      toast.info("Please login to add products to your wishlist");
      setLoginModalOpen(true);
      return;
    }

    if (!product?._id) {
      toast.error("Product information is not available");
      return;
    }

    // Optimistically update state
    setIsFavorite(true);
    try {
      await addFavoriteMutation.mutateAsync({
        userId: userInfo._id,
        body: { productId: product._id }
      });
      if (currentUserId) {
        updateInteraction.mutate({
          product_id: product._id,
          interaction_type: 'like',
        });
      }
      toast.success("Product added to favorites successfully!");
    } catch (error) {
      // Revert on error
      setIsFavorite(false);
      toast.error("Failed to add product to favorites");
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (!userInfo) {
      toast.info("Please login to manage your wishlist");
      return;
    }

    if (!product?._id) {
      toast.error("Product information is not available");
      return;
    }

    // Optimistically update state
    setIsFavorite(false);
    try {
      await removeFavoriteMutation.mutateAsync({
        userId: userInfo._id,
        productId: product._id
      });
      toast.info("Product removed from favorites successfully!");
    } catch (error) {
      setIsFavorite(true);
      toast.error("Failed to remove product from favorites");
    }
  };

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      {loading ? (
        <LottieLoading />
      ) : error ? (
        <Message mt={100}>{error}</Message>
      ) : product && product._id ? (
        <>
          <Meta title={product.name} />
          <Grid container className={classes.breadcrumbsContainer}>
            <Grid item>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link color="inherit" component={RouterLink} to="/">
                  Home
                </Link>
                <Link color="inherit" component={RouterLink} to="/">
                  Product
                </Link>
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to={`/product?id=${product._id}`}
                >
                  {product?.productDisplayName || "Not found product"}
                </Link>
              </Breadcrumbs>
            </Grid>
          </Grid>

          <Box
            style={{
              borderRadius: 12,
              backgroundColor: "#fff",
              padding: 24,
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "row",
              gap: 20,
            }}
          >
            <Grid item xs={12} md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <ProductImageGallery product={product} />
            </Grid>
            <Grid item xs={12} md={6} className={classes.productInfo} style={{ paddingRight: 0 }}>
              <ProductInfo
                product={product}
                user={user}
                handleUpdateModalOpen={() => setUpdateModalOpen(true)}
                addToCartHandler={addToCartHandler}
                shippingModalOpen={shippingModalOpen}
                returnModalOpen={returnModalOpen}
                handleShippingClick={() => setShippingModalOpen(true)}
                handleReturnClick={() => setReturnModalOpen(true)}
                handleShippingModalClose={() => setShippingModalOpen(false)}
                handleReturnModalClose={() => setReturnModalOpen(false)}
                updateModalOpen={updateModalOpen}
                handleUpdateModalClose={() => setUpdateModalOpen(false)}
                isFavorite={isFavorite}
                handleAddToFavorites={handleAddToFavorites}
                handleRemoveFromFavorites={handleRemoveFromFavorites}
              />
            </Grid>
          </Box>
{/* 
          <Grid container>
            <Grid item xs={12}>
              <ProductReview reviews={product.reviews} productId={productId} />
            </Grid>
          </Grid> */}

          {userInfo && !userInfo.isAdmin && (
            <Grid container>
              <Grid item xs={12}>
                {product && (
                  <ProductRelated
                    category={product.category}
                    excludeId={product._id}
                    userId={currentUserId}
                    productId={productId}
                  />
                )}
              </Grid>
            </Grid>
          )}
        </>
      ) : null}
    </Container>
  );
};

export default ProductScreen;
