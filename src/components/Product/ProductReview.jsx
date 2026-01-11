import {
  Avatar,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Link,
  Button,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Rating from "@material-ui/lab/Rating";
import Alert from "@material-ui/lab/Alert";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useCreateReview } from "../../hooks/api/useProduct";
import { useCreateUserInteraction } from "../../hooks/api/useUserInteraction";
import Message from "../Message";
import Loader from "../Loader";
import female30 from "../../assets/images/female30.webp";
import female40 from "../../assets/images/female40.webp";
import female50 from "../../assets/images/female50.webp";
import male30 from "../../assets/images/male30.webp";
import male40 from "../../assets/images/male40.webp";
import male50 from "../../assets/images/male50.webp";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 0,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    borderRadius: "50%",
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  comment: {
    marginTop: theme.spacing(1),
    whiteSpace: "pre-line",
    fontSize: "15px",
    fontWeight: "400",
    color: theme.palette.text.primary,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  },
  rating: {
    fontSize: "1.2rem",
  },
  textField: {
    borderRadius: theme.spacing(1),
  },
  submitButton: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1, 3),
    width: "100px",
  },
  cardContent: {
    padding: "0 !important",
    "&:last-child": {
      paddingBottom: "0 !important",
    },
  },
}));

const ProductReview = ({ reviews, productId }) => {
  const classes = useStyles();
  const avatarImages = [female30, female40, female50, male30, male40, male50];
  const selectAvatar = (key) => {
    const seed = String(key || "");
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    const index = avatarImages.length ? hash % avatarImages.length : 0;
    return avatarImages[index] || male30;
  };
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userId = userInfo?._id || userInfo?.id || "";

  const createReviewMutation = useCreateReview();
  const createInteraction = useCreateUserInteraction();
  const { isLoading: loadingProductReview, isSuccess: successProductReview, error: errorProductReview } = createReviewMutation;

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (comment.trim()) {
      setMessage("");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        await createReviewMutation.mutateAsync({
          id: productId,
          body: { rating, comment }
        });

        // Track REVIEW interaction
        if (userId && productId) {
          createInteraction.mutate({
            product_id: productId,
            interaction_type: 'review',
            rating: rating || 5,
            user_id: userId,
          });
        }

        setRating(0);
        setComment("");
      } catch (error) {
        console.error("Failed to create review:", error);
      }
    } else {
      setMessage("Please write a comment!");
    }
  };

  return (
    <>
      <div className='w-full flex items-center justify-center gap-4 my-10'>
        <div className='h-[1px] bg-primary flex-1'></div>
        <Typography variant="h5" align="center" className="tracking-widest">Reviews</Typography>
        <div className='h-[1px] bg-primary flex-1'></div>
      </div>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Reviews ({reviews.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box width="100%">
            {reviews.length === 0 && (
              <Message severity="info">No reviews</Message>
            )}
            {reviews.map((review) => (
              <Card className={classes.card} key={review._id} elevation={0}>
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Avatar
                        className={classes.avatar}
                        alt="avatar"
                        src={selectAvatar(review.name || review._id)}
                      />
                    </Grid>
                    <Grid item xs>
                      <div className={classes.reviewHeader}>
                        <Typography variant="h6" style={{ marginRight: "8px" }}>
                          {review.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {review.createdAt.substring(0, 10)}
                        </Typography>
                      </div>
                      <Rating
                        name="rating"
                        value={review.rating}
                        precision={0.5}
                        readOnly
                        className={classes.rating}
                      />
                      <Typography
                        variant="body1"
                        className={classes.comment}
                        color="textPrimary"
                      >
                        {review.comment}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Write a review</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box width="100%">
            <Card className={classes.card} elevation={0}>
              <CardContent className={classes.cardContent}>
                <Grid container>
                  <Grid item xs={12}>
                    {loadingProductReview && <Loader />}
                    {errorProductReview && <Message>{errorProductReview.message || String(errorProductReview)}</Message>}
                    {userInfo ? (
                      <form onSubmit={handleSubmitReview} className={classes.form}>
                        <Rating
                          name="rating-value"
                          value={rating}
                          precision={0.5}
                          onChange={(event, newValue) => {
                            setRating(newValue);
                          }}
                          className={classes.rating}
                        />
                        <TextField
                          variant="outlined"
                          label="Comment"
                          multiline
                          fullWidth
                          value={comment}
                          error={!!message}
                          helperText={message}
                          onChange={handleCommentChange}
                          className={classes.textField}
                        />
                        <Button
                          variant="contained"
                          color="secondary"
                          type="submit"
                          className={classes.submitButton}
                        >
                          Submit
                        </Button>
                      </form>
                    ) : (
                      <Alert severity="info">
                        Please{" "}
                        <Link
                          component={RouterLink}
                          to={`/login?redirect=/product?id=${productId}`}
                        >
                          login
                        </Link>{" "}
                        to write a review
                      </Alert>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ProductReview;
