import React, { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import ProductCard from "../Product/ProductCard";
import { useGetTopProducts } from "../../hooks/api/useProduct";
import LottieEmpty from "../LottieEmpty";
import Loader from "../Loader";
import StorefrontIcon from "@material-ui/icons/Storefront";

const TopProducts: React.FC = () => {
  const {
    data: productTopRatedResponse,
    isLoading: loadingProductTop,
    error: errorProductTop,
  } = useGetTopProducts();
  const productTopRaw = productTopRatedResponse?.data?.products || [];
  return (
    <div className="mx-auto px-12">
      <div className="w-full flex items-center justify-center gap-4 my-10">
        <div className="h-[1px] bg-primary flex-1"></div>
        <Typography variant="h5" align="center" className="tracking-widest">
          Top Products
        </Typography>
        <div className="h-[1px] bg-primary flex-1"></div>
      </div>
      {loadingProductTop ? (
        <Loader />
      ) : errorProductTop ? (
        <LottieEmpty className="flex justify-center" />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-4 mb-6">
            {productTopRaw &&
              productTopRaw.map((product) => (
                <div key={product._id}>
                  <ProductCard {...product} />
                </div>
              ))}
          </div>
          <div className="flex justify-center my-8">
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/shop?sort_by=rating"
              className="!rounded-full"
            >
              <span className="mr-2">View more</span>
              <StorefrontIcon fontSize="small" className="text-white" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopProducts;
