import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Avatar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import { useCreateReview } from "../../hooks/api/useProduct";
import { useCreateUserInteraction } from "../../hooks/api/useUserInteraction";

const useStyles = makeStyles((theme) => ({
  dialog: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 500,
    },
  },
  dialogTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
  dialogContent: {
    padding: "24px",
  },
  productInfo: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: theme.palette.grey[50],
    borderRadius: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productName: {
    fontWeight: 600,
    marginBottom: 4,
  },
  ratingSection: {
    marginBottom: 24,
  },
  ratingLabel: {
    marginBottom: 8,
    fontWeight: 600,
  },
  commentField: {
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 8,
    padding: "10px 24px",
  },
}));

const ReviewProductModal = ({ open, onClose, product, userId }) => {
  const classes = useStyles();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const createReviewMutation = useCreateReview();
  const createInteraction = useCreateUserInteraction();

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("Please write a comment!");
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        id: product.product_id || product._id,
        body: { rating, comment },
      });

      // Track REVIEW interaction
      if (userId && product.product_id) {
        createInteraction.mutate({
          product_id: product.product_id,
          interaction_type: "review",
          rating: rating,
          user_id: userId,
        });
      }

      toast.success("Review submitted successfully!");
      setRating(5);
      setComment("");
      setError("");
      onClose();
    } catch (error) {
      console.error("Failed to create review:", error);
      toast.error(error?.message || "Failed to submit review. Please try again.");
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (e.target.value.trim()) {
      setError("");
    }
  };

  const imageSrc = product?.images?.[0] || "https://via.placeholder.com/80";

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={classes.dialogTitle}>
        <Typography variant="h6">Write a Review</Typography>
        <IconButton onClick={onClose} className={classes.closeButton} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {/* Product Info */}
        <Box className={classes.productInfo}>
          <Avatar
            variant="square"
            src={imageSrc}
            alt={product?.name}
            className={classes.productImage}
          />
          <Box>
            <Typography className={classes.productName}>{product?.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Size: {product?.sizeSelected || product?.size_selected || "N/A"} | Color:{" "}
              {product?.colorSelected || product?.color_selected || "N/A"}
            </Typography>
          </Box>
        </Box>

        {/* Rating */}
        <Box className={classes.ratingSection}>
          <Typography className={classes.ratingLabel}>Your Rating</Typography>
          <Rating
            name="product-rating"
            value={rating}
            precision={0.5}
            size="large"
            onChange={(event, newValue) => {
              setRating(newValue || 5);
            }}
          />
        </Box>

        {/* Comment */}
        <TextField
          label="Your Review"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={comment}
          onChange={handleCommentChange}
          error={!!error}
          helperText={error}
          placeholder="Share your experience with this product..."
          className={classes.commentField}
        />
      </DialogContent>

      <DialogActions style={{ padding: "16px 24px" }}>
        <Button onClick={onClose} color="default">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          className={classes.submitButton}
          disabled={createReviewMutation.isLoading}
        >
          {createReviewMutation.isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewProductModal;
