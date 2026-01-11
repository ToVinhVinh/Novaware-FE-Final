import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import LocalMallIcon from '@material-ui/icons/LocalMall';
import Tooltip from "@material-ui/core/Tooltip";
import ProductModalView from "./ProductModalView";
import useCartStore from "../../store/cartStore";

const ProductCard = (props) => {
  const {
    _id,
    id,
    slug,
    productId: incomingProductId,
    name,
    productDisplayName,
    images,
    price,
    sale,
    variants,
    rating,
    baseColour,
    articleType
  } = props;

  const productId = _id ?? id ?? incomingProductId ?? slug ?? "";
  const displayName = productDisplayName || name || "Product";
  const [openModal, setOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, setDrawerOpen } = useCartStore();
  const variant = variants && variants.length > 0 ? variants[0] : null;

  const basePrice = variant?.price || price || 50; // fallback price
  const finalPrice = basePrice * (1 - (sale || 0) / 100);

  const handleAddToCart = (e, idToAdd) => {
    e.stopPropagation();
    e.preventDefault();
    if (!idToAdd) {
      return;
    }
    const selectedSize = variant?.size || "M";
    const selectedColorHex = variant?.color || "";
    const selectedColorName = selectedColorHex || "";

    const productData = {
      _id: productId,
      id: productId,
      name: displayName,
      productDisplayName: displayName,
      price: basePrice,
      sale: sale || 0,
      variants: variants || [],
      colors: props.colors || [],
      images: images || [],
      size: props.size || [],
      countInStock: variant?.stock || props.countInStock || 0,
      baseColour: baseColour || "",
    };

    setDrawerOpen(true);
    addToCart(productData, 1, selectedSize, selectedColorHex, selectedColorName);
  };


  return (
    <>
      <motion.div
        className="group shadow-md p-2 rounded-xl bg-primary h-full border-2 border-white overflow-hidden transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <RouterLink
          to={productId ? `/product?id=${productId}` : '#'}
          className="flex h-full flex-col"
          onClick={(e) => {
            if (!productId) {
              e.preventDefault();
            }
          }}
        >
          <div className="relative bg-red-500 w-full pb-[100%] overflow-hidden rounded-lg  transition-all duration-300 ease-in-out z-0">
            {sale > 0 && (
              <div className="absolute rounded-lg -top-1 left-0 z-20 border-[2px] border-primary px-2 text-base font-semibold uppercase text-white bg-primary rounded-t-none rounded-bl-none">
                -{Math.round(sale)}%
              </div>
            )}
            {images && images.length > 0 ? (
              <>
                {images[1] && (
                  <motion.img
                    className="absolute inset-0 bg-red-500 h-full w-full object-contain hover:scale-110 transition-all duration-300 ease-in-out rounded-lg"
                    src={images[1]}
                    alt={`${displayName} - back view`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                {/* Front Image with fade on hover */}
                <motion.img
                  className="absolute inset-0 h-full w-full object-contain bg-white hover:scale-110 transition-all duration-300 ease-in-out rounded-lg"
                  src={images[0]}
                  alt={displayName}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isHovered && images[1] ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                />
              </>
            ) : (
              <motion.img
                className="absolute inset-0 h-full w-full object-contain bg-white hover:scale-110 transition-all duration-300 ease-in-out rounded-lg"
                src="https://www.lwf.org/images/emptyimg.png"
                alt="No Image Available"
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered && images[1] ? 0 : 1 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-1 flex-col relative z-10 mt-2">
            <Tooltip title={displayName || ""} arrow>
              <h3 className="text-base leading-6 text-white font-semibold line-clamp-1">
                {displayName}
              </h3>
            </Tooltip>

            {/* Rating display */}
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span style={{ fontSize: "20px" }} key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-white/80">({rating})</span>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2">
              {finalPrice && finalPrice !== 0 && finalPrice !== null && <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  ${finalPrice.toFixed(2)}
                </span>
                {sale > 0 && (
                  <span className="text-base italic text-white/70 line-through">
                    ${basePrice.toFixed(2)}
                  </span>
                )}
              </div>}

              <div className="w-full md:hidden">
                <button
                  onClick={(e) => handleAddToCart(e, productId)}
                  className="mt-2 w-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 active:scale-95 !rounded-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <LocalMallIcon />
                    Add to Cart
                  </span>
                </button>
              </div>
            </div>
            <button
              onClick={(e) => handleAddToCart(e, productId)}
              className="h-10 mt-2 w-full flex items-center gap-2 justify-center border border-white/80 text-white hover:bg-pink-600 hover:border-pink-600 !rounded-full"
            >
              <LocalMallIcon fontSize="small" className="text-white" />
              Add to Cart
            </button>
          </div>
        </RouterLink>
      </motion.div>
      <ProductModalView
        {...props}
        _id={productId || _id}
        productId={productId || _id}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default ProductCard;
