import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  IconButton,
} from "@material-ui/core";
import { FaTags, FaTrademark, FaBoxOpen } from "react-icons/fa";
import CallMadeIcon from "@material-ui/icons/CallMade";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import LottieLoading from "../LottieLoading.jsx";
import { toast } from "react-toastify";
import { useHybridModelRecommendations } from "../../hooks/api/useRecommend";

const useStyles = makeStyles((theme) => ({
  youMightLikeModal: {
    "& .MuiDialog-paper": {
      maxWidth: "90vw",
      height: "90vh",
      borderRadius: 12,
    },
  },
  youMightLikeModalContent: {
    padding: "0 24px 24px 24px !important",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#ccc",
  },
  gnnLikeSwiper: {
    width: '100%',
    height: 'auto',
    paddingBottom: theme.spacing(3),
    '& .swiper-wrapper': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .swiper-slide': {
      backgroundColor: 'transparent !important',
      background: 'transparent !important',
      boxShadow: 'none !important',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .swiper-slide-shadow, & .swiper-slide-shadow-left, & .swiper-slide-shadow-right, & .swiper-slide-shadow-top, & .swiper-slide-shadow-bottom': {
      display: 'none !important',
      backgroundImage: 'none !important',
      backgroundColor: 'transparent !important',
      opacity: '0 !important',
    },
  },
  card: {
    width: 320,
    height: "auto",
    borderRadius: 6
  },
  media: {
    height: 270,
    backgroundSize: "contain",
    objectFit: "contain"
  },
  layoutContainer: {
    display: "flex",
    gap: theme.spacing(1), // 8px
    alignItems: "flex-start",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  swiperContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: theme.spacing(2),
  },
  explanationContainer: {
    flex: 1,
    padding: theme.spacing(2.5, 3),
    borderRadius: theme.shape.borderRadius,
    backdropFilter: "blur(10px)",
    maxHeight: "80vh",
    overflowY: "auto",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "none",
      width: "100%",
    },
  },
  explanationTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
    color: theme.palette.primary.main,
  },
  explanationSentence: {
    padding: theme.spacing(1.2, 1.5),
    marginBottom: theme.spacing(1),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
    borderLeft: `3px solid ${theme.palette.primary.light}`,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1),
    "&:last-child": {
      marginBottom: 0,
    },
  },
  explanationIcon: {
    color: theme.palette.primary.main,
    fontSize: "1.2rem",
    marginTop: theme.spacing(0.2),
    flexShrink: 0,
  },
  explanationText: {
    fontSize: "0.9rem",
    lineHeight: 1.6,
    color: theme.palette.text.primary,
  },
  dialogTitle: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: "1px solid #e0e0e0",
    margin: 0,
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    color: theme.palette.grey[500],
    "&:hover": {
      color: theme.palette.secondary.main,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
}));

const YouMightAlsoLikeModal = ({ open, onClose, userId, productId }) => {
  const classes = useStyles();
  const [recommendationData, setRecommendationData] = useState(null);

  const getHybridRecommendations = useHybridModelRecommendations();

  // Fetch recommendations when modal opens
  useEffect(() => {
    if (!open || !userId || !productId) {
      setRecommendationData(null);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const requestData = {
          user_id: userId,
          current_product_id: productId,
          top_k_personal: 5,
          top_k_outfit: 10,
          alpha: 0.5, // Default alpha for hybrid model
        };

        const result = await getHybridRecommendations.mutateAsync(requestData);
        setRecommendationData(result);
      } catch (error) {
        toast.error("Failed to load recommendations.");
      }
    };

    fetchRecommendations();
  }, [open, userId, productId]);

  const likeData = useMemo(() => {
    if (!recommendationData) return null;

    const products = recommendationData.personalized?.map((item) => ({
      _id: item.product_id,
      name: item.name || "Product",
      product_id: item.product_id,
      score: item.score,
      reason: item.reason,
      images: [],
      price: 0,
      sale: 0,
      category: null,
      brand: null,
      countInStock: 0,
    })) || [];

    const reasons = recommendationData.personalized
      ?.map((item) => item.reason)
      .filter((r) => r && r.trim().length > 0) || [];

    const explanation = reasons.length > 0
      ? reasons.join(". ") + "."
      : "We recommend these products based on your preferences and similar users' choices.";

    return {
      data: {
        products,
        explanation,
      },
    };
  }, [recommendationData]);

  const explanationSentences = useMemo(() => {
    if (!likeData?.data?.explanation) return [];
    return likeData.data.explanation
      .split(/[。.]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [likeData?.data?.explanation]);

  const renderExplanationText = (text) => {
    const colonIndex = text.indexOf(":");
    if (colonIndex !== -1) {
      const beforeColon = text.substring(0, colonIndex + 1);
      const afterColon = text.substring(colonIndex + 1);
      return (
        <Box component="span" style={{ display: "inline" }}>
          <Typography component="span" className={classes.explanationText} style={{ fontWeight: 600, display: "inline" }}>
            {beforeColon}
          </Typography>
          <Typography component="span" className={classes.explanationText} style={{ display: "inline" }}>
            {afterColon}
          </Typography>
        </Box>
      );
    }
    return <Typography className={classes.explanationText}>{text}</Typography>;
  };

  useEffect(() => {
    if (!open) return;
    if (!userId) {
      toast.info("Please sign in to see personalized recommendations.");
      onClose();
      return;
    }
  }, [open, userId, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      className={classes.youMightLikeModal}
      style={{ zIndex: 9999 }}
      BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.5)" } }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <Typography variant="h5" align="center" className="tracking-widest">
          You Might Also Like
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={classes.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.youMightLikeModalContent}>
        {userId && getHybridRecommendations.isLoading && <LottieLoading />}
        {userId && !getHybridRecommendations.isLoading && !getHybridRecommendations.error && likeData?.data?.products?.length > 0 && (
          <Box>
            <Box className={classes.layoutContainer}>
              {/* Swiper Section - Left */}
              <Box className={classes.swiperContainer}>
                <Swiper
                  effect={"cards"}
                  grabCursor={true}
                  modules={[EffectCards]}
                  className={clsx("gnn-like-swiper", classes.gnnLikeSwiper)}
                  style={{ width: "100%", maxWidth: 400, height: "auto", minHeight: 400 }}
                  cardsEffect={{
                    perSlideOffset: 8,
                    perSlideRotate: 2,
                    slideShadows: false,
                  }}
                >
                  {likeData.data.products.slice(0, 5).map((p, idx) => (
                    <SwiperSlide key={p._id || idx} style={{ backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Card className={classes.card} style={{ margin: "0 auto", width: "100%", maxWidth: 320 }}>
                        <CardActionArea>
                          <CardMedia
                            className={classes.media}
                            image={p.images && p.images.length > 0 ? p.images[0] : "https://via.placeholder.com/180"}
                            title={p.name}
                          />
                          <CardContent>
                            <Typography variant="subtitle2" noWrap>
                              {p.name}
                            </Typography>
                            {p.price > 0 ? (
                              <Typography variant="subtitle2" color="secondary">
                                ${(p.price - (p.price * (p.sale || 0) / 100)).toFixed(2)}
                              </Typography>
                            ) : (
                              <Typography variant="subtitle2" color="textSecondary">
                                Price not available
                              </Typography>
                            )}
                            {(p.category || p.brand || typeof p.countInStock !== 'undefined') && (
                              <Box mt={1} display="flex" alignItems="center" flexWrap="wrap" style={{ gap: 6, rowGap: 6 }}>
                                {p.category && (
                                  <Chip
                                    size="small"
                                    color="primary"
                                    icon={<FaTags style={{ fontSize: 14 }} />}
                                    label={p.category}
                                    style={{ padding: "0 8px" }}
                                  />
                                )}
                                {p.brand && (
                                  <Chip
                                    size="small"
                                    color="primary"
                                    icon={<FaTrademark style={{ fontSize: 14 }} />}
                                    label={p.brand}
                                    style={{ padding: "0 8px" }}
                                  />
                                )}
                                <Chip
                                  size="small"
                                  color={(Number(p.countInStock) || 0) > 0 ? "primary" : "default"}
                                  icon={<FaBoxOpen style={{ fontSize: 14 }} />}
                                  label={`${(Number(p.countInStock) || 0) > 0 ? `${Number(p.countInStock)} in stock` : "Out of stock"}`}
                                  style={{ padding: "0 8px" }}
                                />
                              </Box>
                            )}
                            <Box mt={1}>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="medium"
                                style={{ width: "100%" }}
                                onClick={() => window.open(`/product?id=${p._id || ''}`, "_blank")}
                                endIcon={<CallMadeIcon />}
                              >
                                View details
                              </Button>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>

              {/* Explanation Section - Right */}
              {explanationSentences.length > 0 && (
                <Box className={classes.explanationContainer}>
                  <Typography variant="h6" className={classes.explanationTitle}>
                    Why we recommend for you?
                  </Typography>
                  <Divider style={{ marginBottom: 16 }} />
                  {explanationSentences.map((sentence, index) => (
                    <Box key={index} className={classes.explanationSentence}>
                      <CheckCircleIcon className={classes.explanationIcon} />
                      {renderExplanationText(sentence)}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default YouMightAlsoLikeModal;

