import React, { useState, useEffect, useMemo } from "react";
import {
  Paper,
  Typography,
  makeStyles,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGNNModelRecommendations } from "../../hooks/api/useRecommend";
import { useGetUserById, useGetFavorites, useGetOutfits, useDeleteOutfit } from "../../hooks/api/useUser";
import Message from "../Message";
import Loader from "../Loader";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { toast } from "react-toastify";
import ConfirmDialog from "../Modal/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
    minHeight: 500,
    border: `1px solid ${theme.palette.divider}`,
  },
  outfitCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${theme.palette.divider}`,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: theme.shadows[4],
      transform: "translateY(-4px)",
    },
  },
  outfitHeader: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  outfitName: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    flex: 1,
  },
  outfitHeaderTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1),
  },
  outfitInfo: {
    display: "flex",
    gap: theme.spacing(1),
    flexWrap: "wrap",
  },
  productsGrid: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  productCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 6,
    overflow: "hidden",
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: theme.shadows[2],
    },
  },
  productImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    backgroundColor: theme.palette.grey[100],
  },
  productInfo: {
    padding: theme.spacing(1.5),
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: theme.spacing(0.5),
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
  },
  productPrice: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    marginTop: "auto",
  },
  viewButton: {
    textTransform: "none",
  },
  emptyMessage: {
    textAlign: "center",
    padding: theme.spacing(4),
  },
}));

// Helper function to normalize category names
const normalizeCategoryName = (categoryName) => {
  if (!categoryName) return "Other";
  const normalized = categoryName.trim();
  const lower = normalized.toLowerCase();

  const categoryMap = {
    "top": "Tops",
    "tops": "Tops",
    "shirt": "Tops",
    "shirts": "Tops",
    "t-shirt": "Tops",
    "t-shirts": "Tops",
    "apparel_topwear": "Tops",
    "topwear": "Tops",
    "dress": "Dresses",
    "dresses": "Dresses",
    "bottom": "Bottoms",
    "bottoms": "Bottoms",
    "pants": "Bottoms",
    "trousers": "Bottoms",
    "apparel_bottomwear": "Bottoms",
    "bottomwear": "Bottoms",
    "shoe": "Shoes",
    "shoes": "Shoes",
    "footwear": "Shoes",
    "accessory": "Accessories",
    "accessories": "Accessories",
  };

  return categoryMap[lower] || normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
};

const OutfitSuggestionsContent = () => {
  const classes = useStyles();
  const history = useHistory();
  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  const currentUserId = userInfo?._id || "";

  const { data: userResponse } = useGetUserById(currentUserId);
  const user = userResponse?.data?.user;

  const { data: favoritesResponse } = useGetFavorites(currentUserId);
  const favorites = favoritesResponse?.data?.favorites || [];

  const { data: savedOutfitsResponse, isLoading: isLoadingSavedOutfits } = useGetOutfits(currentUserId);
  const savedOutfits = savedOutfitsResponse?.data?.outfits || [];

  const deleteOutfitMutation = useDeleteOutfit();

  const getGNNRecommendations = useGNNModelRecommendations();
  const [recommendationData, setRecommendationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState(null);

  // Fetch recommendations when we have userId and a product ID
  useEffect(() => {
    if (!currentUserId) {
      setRecommendationData(null);
      return;
    }

    const productId = favorites.length > 0 ? favorites[0]._id : null;

    if (!productId) {
      setError(null);
      setRecommendationData(null);
      return;
    }

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const requestData = {
          user_id: currentUserId,
          current_product_id: productId,
          top_k_personal: 5,
          top_k_outfit: 10,
        };

        const result = await getGNNRecommendations.mutateAsync(requestData);
        setRecommendationData(result);
      } catch (err) {
        setError(err?.message || "Failed to load outfit recommendations.");
        setRecommendationData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, favorites.length]);

  // Process outfit recommendations
  const recommendedOutfits = useMemo(() => {
    if (!recommendationData || !recommendationData.outfit) return [];

    const processedOutfits = [];
    const outfitKeys = Object.keys(recommendationData.outfit);

    outfitKeys.forEach((outfitKey) => {
      const outfitCategories = recommendationData.outfit[outfitKey];
      const categories = Object.keys(outfitCategories);
      if (categories.length === 0) return;

      const outfit = {
        name: outfitKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        products: [],
        totalPrice: 0,
        compatibilityScore: recommendationData.outfit_complete_score || 0,
        gender: user?.gender || "Unisex",
        style: "Casual",
        description: `Complete outfit recommendation based on your preferences`,
      };

      categories.forEach((category) => {
        const categoryData = outfitCategories[category];
        if (!categoryData || !categoryData.product) return;

        const normalizedCategory = normalizeCategoryName(category);
        const product = categoryData.product;
        const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;

        const basePrice = variant?.price || product.price || 0;
        const salePercent = variant?.sale || product.sale || 0;
        const finalPrice = basePrice - (basePrice * salePercent / 100);

        outfit.products.push({
          _id: product.id || product._id,
          name: product.productDisplayName || product.name || "Product",
          price: basePrice,
          sale: salePercent,
          finalPrice: finalPrice,
          image: product.images?.[0] || product.image || "",
          images: product.images || [],
        });
      });

      outfit.totalPrice = outfit.products.reduce((sum, p) => sum + (p.price || 0) * (1 - (p.sale || 0) / 100), 0);

      if (outfit.products.length >= 4) {
        processedOutfits.push(outfit);
      }
    });

    return processedOutfits;
  }, [recommendationData, user?.gender]);

  const processedSavedOutfits = useMemo(() => {
    return savedOutfits.map((outfit, index) => ({
      _id: outfit._id || `saved-${index}`,
      name: outfit.name,
      products: (outfit.products || []).map((p) => {
        const basePrice = p.price || 0;
        const salePercent = p.sale || 0;
        const finalPrice = basePrice - (basePrice * salePercent / 100);
        return {
          _id: p.product_id,
          name: p.name,
          price: basePrice,
          sale: salePercent,
          finalPrice: finalPrice,
          image: p.images?.[0] || p.image || "",
          images: p.images || [],
        };
      }),
      totalPrice: outfit.totalPrice || 0,
      compatibilityScore: outfit.compatibilityScore || 0,
      gender: outfit.gender || user?.gender || "Unisex",
      style: outfit.style || "Casual",
      description: outfit.description || `Saved outfit`,
    }));
  }, [savedOutfits, user?.gender]);

  const outfits = useMemo(() => {
    return [...processedSavedOutfits, ...recommendedOutfits];
  }, [processedSavedOutfits, recommendedOutfits]);

  const handleViewProduct = (productId) => {
    history.push(`/product?id=${productId}`);
  };

  const handleOpenDeleteDialog = (outfit, index) => {
    setOutfitToDelete({ outfit, index });
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setOutfitToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!outfitToDelete) return;

    try {
      const outfitId = outfitToDelete.outfit._id;
      if (!outfitId) {
        toast.error("Cannot delete this outfit. Invalid outfit ID.");
        return;
      }

      await deleteOutfitMutation.mutateAsync({
        userId: currentUserId,
        outfitId: outfitId,
      });

      toast.success(`"${outfitToDelete.outfit.name}" has been removed from your saved outfits.`);
      handleCloseDeleteDialog();
    } catch (error) {
      toast.error(error?.message || "Failed to delete outfit. Please try again.");
    }
  };

  if (isLoading || isLoadingSavedOutfits) {
    return (
      <Paper className={classes.paper} elevation={0}>
        <Typography variant="h5" style={{ marginBottom: 24 }} className="tracking-widest">
          Outfit Suggestions
        </Typography>
        <Loader />
      </Paper>
    );
  }

  if (error && processedSavedOutfits.length === 0 && recommendedOutfits.length === 0) {
    return (
      <Paper className={classes.paper} elevation={0}>
        <Typography variant="h5" style={{ marginBottom: 24 }} className="tracking-widest">
          Outfit Suggestions
        </Typography>
        <Message>{error}</Message>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography variant="h5" style={{ marginBottom: 24 }} className="tracking-widest">
        Outfit Suggestions
      </Typography>

      {outfits.length === 0 ? (
        <Box className={classes.emptyMessage}>
          <Message severity="info">
            No outfit suggestions available at the moment. Please check back later.
          </Message>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {outfits.map((outfit, index) => (
            <Grid item xs={12} key={index}>
              <Card className={classes.outfitCard} elevation={0}>
                <Box className={classes.outfitHeader}>
                  <Box className={classes.outfitHeaderTop}>
                    <Box className={classes.outfitInfo}>
                    <Chip
                      label={outfit.style}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={outfit.gender}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                    {index < processedSavedOutfits.length && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => handleOpenDeleteDialog(outfit, index)}
                        style={{
                          textTransform: "none",
                          borderRadius: 6,
                          backgroundColor: "#FEF5F7",
                          borderColor: "#F50057",
                          color: "#F50057",
                          border: "1px solid #F50057",
                        }}
                      >
                        Unsave
                      </Button>
                    )}
                  </Box>
                  
                </Box>

                <Box className={classes.productsGrid}>
                  <Grid container spacing={2}>
                    {outfit.products.map((product) => (
                      <Grid item xs={6} sm={4} md={3} key={product._id}>
                        <Card className={classes.productCard} elevation={0}>
                          <CardMedia
                            component="img"
                            className={classes.productImage}
                            image={product.image || product.images?.[0] || ""}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = "/logo-icon-NovaWare.png";
                            }}
                          />
                          <CardContent className={classes.productInfo}>
                            <Typography variant="body2" className={classes.productName}>
                              {product.name}
                            </Typography>
                            <Box style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
                              <Typography variant="body2" className={classes.productPrice}>
                                ${(product.finalPrice !== undefined ? product.finalPrice : (product.price || 0) - ((product.price || 0) * (product.sale || 0) / 100)).toFixed(2)}
                              </Typography>
                              {product.sale && product.sale > 0 && product.price && (
                                <Typography
                                  variant="caption"
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  ${(product.price || 0).toFixed(2)}
                                </Typography>
                              )}
                            </Box>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<VisibilityIcon />}
                              className={classes.viewButton}
                              onClick={() => handleViewProduct(product._id)}
                              style={{ marginTop: 8 }}
                            >
                              View
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to remove <strong>"{outfitToDelete?.outfit?.name}"</strong> from your saved outfits?
            <br />
            <Typography variant="body2" style={{ color: "#666", marginTop: 8 }}>
              This action cannot be undone.
            </Typography>
          </>
        }
        confirmText="Delete Outfit"
        cancelText="Cancel"
        confirmColor="secondary"
        loading={deleteOutfitMutation.isLoading}
        icon={DeleteOutlineIcon}
      />
    </Paper>
  );
};

export default OutfitSuggestionsContent;
