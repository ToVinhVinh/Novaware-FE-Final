import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Alert } from "@material-ui/lab";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateContentSection } from "../../hooks/api/useContentSection";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(-14),
    marginLeft: theme.spacing(20),
    width: theme.spacing(150),
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  form: {
    "& > *": {
      marginBottom: 16,
    },
  },
  imagePreview: {
    position: "relative",
    marginTop: 8,
    marginRight: 16,
    width: theme.spacing(71),
    height: theme.spacing(40),
  },
  imageCarouslePreview: {
    width: theme.spacing(146),
    height: theme.spacing(50),
  },
  imagePreviewContainer: {
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    padding: theme.spacing(0.5),
    fontSize: "25px",
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const HomeContentEditScreen = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data: bannersResponse, isLoading: loadingBanners } = useGetContentSections({ type: "banner" });
  const { data: carouselsResponse, isLoading: loadingCarousels } = useGetContentSections({ type: "carousel" });
  
  const banners = bannersResponse?.data?.contentSections || [];
  const carousels = carouselsResponse?.data?.contentSections || [];
  const loading = loadingBanners || loadingCarousels;
  const error = null;

  const updateContentSectionMutation = useUpdateContentSection();

  const [bannerFormData, setBannerFormData] = useState([
    { subtitle: "", title: "", button_text: "", button_link: "" },
    { subtitle: "", title: "", button_text: "", button_link: "" },
  ]);
  const [carouselFormData, setCarouselFormData] = useState({
    subtitle: "",
    title: "",
    button_text: "",
    button_link: "",
  });
  const [bannerPreviewImages, setBannerPreviewImages] = useState([[], []]);
  const [carouselPreviewImages, setCarouselPreviewImages] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    if (banners.length === 2) {
      setBannerFormData(
        banners.map(
          ({
            subtitle = "",
            title = "",
            button_text = "",
            button_link = "",
          }) => ({
            subtitle,
            title,
            button_text,
            button_link,
          })
        )
      );
      setBannerPreviewImages(
        banners.map((banner) =>
          banner.image ? [{ url: banner.image, isNew: false }] : []
        )
      );
    }

    if (carousels.length > 0) {
      const [carousel] = carousels;
      setCarouselFormData({
        subtitle: carousel.subtitle || "",
        title: carousel.title || "",
        button_text: carousel.button_text || "",
        button_link: carousel.button_link || "",
      });
      setCarouselPreviewImages(
        (carousel.images || []).map((url) => ({ url, isNew: false }))
      );
    }
  }, [banners, carousels]);

  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const isCarousel = e.target.id === "carousel-image";

    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
    }));

    if (isCarousel) {
      setCarouselPreviewImages((prev) => [...prev, ...previews]);
    } else {
      const index = parseInt(e.target.id.split("-")[2], 10);
      setBannerPreviewImages((prev) => {
        const updated = [...prev];
        updated[index] = [...updated[index], ...previews];
        return updated;
      });
    }
  };

  const handleRemovePreviewImages = (url, type, index = null) => {
    if (type === "banner") {
      setBannerPreviewImages((prev) => {
        const updated = [...prev];
        updated[index] = updated[index].filter((img) => img.url !== url);
        return updated;
      });
    } else {
      setCarouselPreviewImages((prev) => prev.filter((img) => img.url !== url));
    }
    URL.revokeObjectURL(url);
  };

  const handleBannerFormChange = (index, field, value) => {
    setBannerFormData((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleCarouselFormChange = (field, value) => {
    setCarouselFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteBanner = (index) => {
    const id = banners[index]?._id;
    if (id) dispatch(deleteHomeContent("banner", id));
  };

  const handleDeleteCarousel = () => {
    const id = carousels[0]?._id;
    if (id) dispatch(deleteHomeContent("carousel", id));
  };

  const submitHandler = async (type, index) => {
    setUploading(true);
    try {
      let uploadedImages = [];

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));
        const { data: response } = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImages = response.data.map((item) => item.url);
      }

      if (type === "banner") {
        const form = bannerFormData[index];
        const oldImages = bannerPreviewImages[index]
          .filter((img) => !img.isNew)
          .map((img) => img.url);
        const imageUrl = uploadedImages[0] || (banners[index]?.image ?? "");

        const updated = {
          ...banners[index],
          ...form,
          image: imageUrl,
          images: [...oldImages, ...(uploadedImages || [])],
        };
        if (!updated._id) {
          return;
        }

        try {
          await updateContentSectionMutation.mutateAsync({
            id: updated._id,
            body: updated
          });
          toast.success("Banner đã được cập nhật!");
        } catch (error) {
          toast.error("Cập nhật banner thất bại");
        }
      } else {
        const oldImages = carouselPreviewImages
          .filter((img) => !img.isNew)
          .map((img) => img.url);
        const updated = {
          ...carousels[0],
          ...carouselFormData,
          images: [...oldImages, ...uploadedImages],
        };
        try {
          await updateContentSectionMutation.mutateAsync({
            id: updated._id,
            body: updated
          });
          toast.success("Carousel đã được cập nhật!");
        } catch (error) {
          toast.error("Cập nhật carousel thất bại");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setImages([]);
      setBannerPreviewImages([[], []]);
      setCarouselPreviewImages([]);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Typography variant="h5" align="center" style={{ marginTop: 21 }}>
            Edit Home Content
          </Typography>
        </Grid>
      </Grid>

      {/* Banners */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Banners</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {bannerFormData.map((form, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Typography variant="h6">Banner {index + 1}</Typography>
                <form className={classes.form}>
                  <input
                    type="file"
                    accept="image/*"
                    id={`banner-image-${index}`}
                    style={{ display: "none" }}
                    onChange={handleImagesUpload}
                  />
                  <label htmlFor={`banner-image-${index}`}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<MdCloudUpload />}
                      component="span"
                    >
                      Upload
                    </Button>
                  </label>

                  {bannerPreviewImages[index].map((img) => (
                    <div
                      key={img.url}
                      className={classes.imagePreviewContainer}
                    >
                      <img
                        src={img.url}
                        alt="preview"
                        className={classes.imagePreview}
                      />
                      <IconButton
                        onClick={() =>
                          handleRemovePreviewImages(img.url, "banner", index)
                        }
                        className={classes.closeButton}
                        size="small"
                      >
                        <MdClose />
                      </IconButton>
                    </div>
                  ))}

                  {["subtitle", "title", "button_text", "button_link"].map(
                    (field) => (
                      <TextField
                        key={field}
                        label={field.replace("_", " ").toUpperCase()}
                        value={form[field]}
                        onChange={(e) =>
                          handleBannerFormChange(index, field, e.target.value)
                        }
                        className={classes.formControl}
                        fullWidth
                      />
                    )
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => submitHandler("banner", index)}
                    className={classes.button}
                    disabled={uploading}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteBanner(index)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </form>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Carousel */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Carousel</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <form className={classes.form}>
                <input
                  type="file"
                  accept="image/*"
                  id="carousel-image"
                  style={{ display: "none" }}
                  onChange={handleImagesUpload}
                />
                <label htmlFor="carousel-image">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<MdCloudUpload />}
                    component="span"
                  >
                    Upload
                  </Button>
                </label>

                {carouselPreviewImages.map((img, idx) => (
                  <div key={idx} className={classes.imagePreviewContainer}>
                    <img
                      src={img.url}
                      alt="carousel"
                      className={classes.imageCarouslePreview}
                    />
                    <IconButton
                      onClick={() =>
                        handleRemovePreviewImages(img.url, "carousel")
                      }
                      className={classes.closeButton}
                      size="small"
                    >
                      <MdClose />
                    </IconButton>
                  </div>
                ))}

                {["subtitle", "title", "button_text", "button_link"].map(
                  (field) => (
                    <TextField
                      key={field}
                      label={field.replace("_", " ").toUpperCase()}
                      value={carouselFormData[field]}
                      onChange={(e) =>
                        handleCarouselFormChange(field, e.target.value)
                      }
                      className={classes.formControl}
                      fullWidth
                    />
                  )
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => submitHandler("carousel", 0)}
                  className={classes.button}
                  disabled={uploading}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDeleteCarousel}
                  disabled={loading}
                >
                  Delete
                </Button>
              </form>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default HomeContentEditScreen;
