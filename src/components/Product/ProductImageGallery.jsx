import React, { useState, useMemo, memo } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const useStyles = makeStyles((theme) => ({
  sale: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: "2px 8px",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    textTransform: "uppercase",
    lineHeight: 1.5,
    backgroundColor: theme.palette.secondary.main,
    zIndex: 1,
  },
}));

const ProductImageGallery = memo(({ product }) => {
  const classes = useStyles();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const slides = useMemo(
    () =>
      product.images?.map((image) => ({
        src: image,
        alt: product.name,
        thumbnail: image,
      })),
    [product.images, product.name]
  );

  return (
    <>
      {product.images?.length > 0 ? (
        <>
          <Box display="flex !important" flexDirection="row !important">
            {/* Left-side thumbnails */}
            <Box mr={2} style={{ width: 90,  display: "flex", flexDirection: "column", maxHeight: 500, overflowY: "auto" }}>
              {product.images.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  style={{
                    borderRadius: 6,
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    marginBottom: 10,
                    border: index === i ? "2px solid #f50057" : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => setIndex(i)}
                />
              ))}
            </Box>

            {/* Main image */}
            <Box onClick={() => setOpen(true)} style={{ cursor: "pointer", backgroundColor: "#fff", position: "relative", flex: 1 }}>
              <img
                src={product.images[index]}
                alt={product.name}
                style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "contain", borderRadius: 16, border: "1px solid #ccc", }}
              />
              {product.sale > 0 && (
                <div className={classes.sale}>{`- ${product.sale}% `}</div>
              )}
            </Box>
          </Box>

          <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={index}
            slides={slides}
            plugins={[Zoom, Thumbnails]}
            on={{
              view: ({ index: current }) => setIndex(current),
            }}
            thumbnails={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: 4,
              gap: 18,
            }}
          />
        </>
      ) : (
        <Typography>No images available</Typography>
      )}
    </>
  );
});

export default ProductImageGallery;
