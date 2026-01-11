import { Grid, Paper, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { useHybridModelRecommendations } from "../../hooks/api/useRecommend";
import ProductCard from "./ProductCard";
import Loader from "../Loader";
import Message from "../Message";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
const parseImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

const ProductRelated = ({ userId, productId }) => {
  const [recommendationData, setRecommendationData] = useState(null);
  const hybridRecommendations = useHybridModelRecommendations();

  useEffect(() => {
    if (!userId || !productId) {
      setRecommendationData(null);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const requestData = {
          user_id: userId,
          current_product_id: productId,
          top_k_personal: 10,
          top_k_outfit: 1,
        };

        const result = await hybridRecommendations.mutateAsync(requestData);
        setRecommendationData(result);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch hybrid related products:", error);
      }
    };

    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, productId]);

  const personalizedProducts = useMemo(() => {
    if (!recommendationData || !Array.isArray(recommendationData.personalized_products)) return [];

    return recommendationData.personalized_products.map((item) => {
      const product = item.product || {};
      const images = parseImages(product.images);

      return {
        _id: item.product_id,
        productId: item.product_id,
        name: item.name,
        productDisplayName: product.productDisplayName || item.name || "Product",
        images,
        price: product.price || 0,
        sale: product.sale || 0,
        rating: product.rating || 0,
        baseColour: product.baseColour,
        articleType: product.articleType,
        variants: product.variants || [],
        countInStock: (product.variants || []).reduce((acc, v) => acc + (v.stock || 0), 0) || (product.countInStock || 0),
      };
    });
  }, [recommendationData]);

  const hybridLoading = hybridRecommendations.isLoading;
  const hybridError = hybridRecommendations.error;
  const hasPersonalized = personalizedProducts.length > 0;
  const productsToRender = hasPersonalized ? personalizedProducts : [];

  const isLoading = hybridLoading;
  let error = null;
  if (!productsToRender.length) {
    const hybridErrorMessage =
      hybridError && (hybridError.message || String(hybridError));
    error = hybridErrorMessage;
  }

  return (
    <>
      <div className='w-full flex items-center justify-center gap-4 my-10'>
        <div className='h-[1px] bg-primary flex-1'></div>
        <Typography variant="h5" align="center" className="tracking-widest">Related Products</Typography>
        <div className='h-[1px] bg-primary flex-1'></div>
      </div>
      <Paper
        style={{ padding: "0px 40px", margin: "0" }}
        elevation={0}
      >
        {isLoading ? (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Loader />
            </Grid>
          </Grid>
        ) : error ? (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Message>{error}</Message>
            </Grid>
          </Grid>
        ) : (
          <>
            <Swiper
              className="related-swiper"
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={3}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                960: { slidesPerView: 3 },
                1280: { slidesPerView: 5 },
              }}
            >
              {productsToRender.map((product) => (
                <SwiperSlide key={product._id || product.productId}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>

            <style>{`
              .related-swiper {
                padding-bottom: 80px !important;
                overflow: visible !important;
              }
              .related-swiper .swiper-button-next,
              .related-swiper .swiper-button-prev {
                width: 40px !important;
                height: 40px !important;
                border-radius: 999px !important;
                background: #ffffff !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                color: #F50057 !important;
                border: 1px solid rgba(245, 0, 87, 0.5) !important;
                top: 40% !important;
              }
              .related-swiper .swiper-button-next:after,
              .related-swiper .swiper-button-prev:after {
                font-size: 14px !important;
                font-weight: 700;
              }
              .related-swiper .swiper-button-next:hover,
              .related-swiper .swiper-button-prev:hover {
                background: #F50057 !important;
                color: #ffffff !important;
                border-color: #F50057 !important;
              }
              .related-swiper .swiper-button-next.swiper-button-disabled,
              .related-swiper .swiper-button-prev.swiper-button-disabled {
                background: #ffffff !important;
                color: #F50057 !important;
                border-color: rgba(245, 0, 87, 0.5) !important;
                opacity: 0.4 !important;
                cursor: default !important;
              }
              .related-swiper .swiper-pagination-bullets {
                position: relative !important;
                bottom: auto !important;
                margin-top: 40px !important;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 6px;
                width: 100% !important;
                left: 0 !important;
              }
              .related-swiper .swiper-pagination-bullet {
                width: 36px !important;
                height: 8px !important;
                background: #e5e7eb !important;
                opacity: 1 !important;
                margin: 0 4px !important;
                border-radius: 999px !important; /* luôn là pill, không tròn */
                transition: background-color 0.2s ease, width 0.2s ease;
              }
              .related-swiper .swiper-pagination-bullet-active {
                background: #F50057 !important;
                width: 52px !important;
              }
            `}</style>
          </>
        )}
      </Paper>
    </>
  );
};

export default ProductRelated;
