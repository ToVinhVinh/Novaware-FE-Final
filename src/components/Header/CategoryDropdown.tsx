import React, { useState, useCallback, useEffect } from "react";
import { MenuItem, Typography, Modal, Backdrop, Fade, Paper } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetCategories } from "../../hooks/api/useCategory";
import { filterByCategory } from "../../actions/filterActions";
import LottieLoading from "../LottieLoading";
import {
  FaGem,
  FaTshirt,
  FaShoePrints,
  FaGift,
  FaShoppingBag,
  FaHatCowboy,
  FaClock,
  FaFemale,
} from "react-icons/fa";
import { PiPants } from "react-icons/pi";
import {
  GiFlipFlops,
  GiConverseShoe,
  GiHighHeel,
  GiRunningShoe,
  GiBelt,
  GiUnderwearShorts,
  GiShirt,
  GiSandal,
} from "react-icons/gi";
import { BsBag, BsBackpack } from "react-icons/bs";

type SubCategory = {
  subCategory: string;
  articleTypes: string[];
};

type HierarchyItem = {
  masterCategory: string;
  subCategories: SubCategory[];
};

type CategoryDropdownProps = {
  menuItemClassName?: string;
};

// Icon mapping functions
const getMasterCategoryIcon = (name: string) => {
  const key = name.trim().toLowerCase();
  switch (key) {
    case "accessories":
      return <FaGem />;
    case "apparel":
      return <FaTshirt />;
    case "footwear":
      return <FaShoePrints />;
    case "free items":
      return <FaGift />;
    default:
      return null;
  }
};

const getSubCategoryIcon = (name: string) => {
  const key = name.trim().toLowerCase();
  switch (key) {
    case "bags":
      return <FaShoppingBag />;
    case "belts":
      return <GiBelt />;
    case "headwear":
      return <FaHatCowboy />;
    case "watches":
      return <FaClock />;
    case "bottomwear":
      return <PiPants />;
    case "dress":
      return <FaFemale />;
    case "innerwear":
      return <GiUnderwearShorts />;
    case "topwear":
      return <GiShirt />;
    case "flip flops":
      return <GiFlipFlops />;
    case "sandal":
      return <GiSandal />;
    case "shoes":
      return <FaShoePrints />;
    case "free gifts":
      return <FaGift />;
    default:
      return null;
  }
};

const getArticleTypeIcon = (name: string) => {
  const key = name.trim().toLowerCase();
  switch (key) {
    // Bags
    case "backpacks":
      return <BsBackpack />;
    case "handbags":
      return <BsBag />;
    // Belts
    case "belts":
      return <GiBelt />;
    // Headwear
    case "caps":
      return <FaHatCowboy />;
    // Watches
    case "watches":
      return <FaClock />;
    // Bottomwear
    case "capris":
    case "jeans":
    case "shorts":
    case "skirts":
    case "track pants":
    case "tracksuits":
    case "trousers":
      return <PiPants />;
    // Dress
    case "dresses":
      return <FaFemale />;
    // Innerwear
    case "bra":
      return <GiUnderwearShorts />;
    // Topwear
    case "jackets":
    case "shirts":
    case "sweaters":
    case "sweatshirts":
    case "tops":
    case "tshirts":
    case "tunics":
      return <FaTshirt />;
    // Footwear
    case "flip flops":
      return <GiFlipFlops />;
    case "sandals":
      return <GiSandal />;
    case "sports sandals":
      return <GiSandal />;
    case "casual shoes":
      return <GiConverseShoe />;
    case "flats":
      return <FaShoePrints />;
    case "formal shoes":
      return <GiConverseShoe />;
    case "heels":
      return <GiHighHeel />;
    case "sports shoes":
      return <GiRunningShoe />;
    // Free Items
    case "free gifts":
      return <FaGift />;
    default:
      return null;
  }
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: theme.spacing(8),
  },
  modalPaper: {
    width: "90vw",
    maxWidth: "90vw",
    maxHeight: "80vh",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[24],
    outline: "none",
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
  leftPanel: {
    width: "33.333%",
    borderRight: `1px solid ${theme.palette.divider}`,
    overflowY: "auto",
    backgroundColor: theme.palette.grey[50],
  },
  rightPanel: {
    width: "66.666%",
    padding: theme.spacing(3),
    overflowY: "auto",
  },
  masterCategoryItem: {
    padding: theme.spacing(2),
    cursor: "pointer",
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.selected": {
      backgroundColor: "#DD8190",
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#C9707F",
      },
      "& $masterCategoryIcon": {
        color: "#FFFFFF",
      },
    },
  },
  masterCategoryIcon: {
    fontSize: "1.25rem",
    color: theme.palette.text.secondary,
    display: "flex",
    alignItems: "center",
  },
  masterCategoryText: {
    fontWeight: 500,
    fontSize: "1rem",
  },
  subCategorySection: {
    marginBottom: 0,
    paddingBottom: theme.spacing(2),
    "&:not(:last-child)": {
      borderBottom: `1px solid ${theme.palette.divider}`,
      marginBottom: theme.spacing(2),
    },
  },
  subCategoryTitle: {
    fontWeight: 600,
    fontSize: "1.1rem",
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    "&:hover": {
      color: theme.palette.primary.main,
      "& $subCategoryIcon": {
        color: theme.palette.primary.main,
      },
    },
  },
  subCategoryIcon: {
    fontSize: "1.1rem",
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
  },
  articleTypesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  articleTypeItem: {
    padding: theme.spacing(1, 1.5),
    cursor: "pointer",
    borderRadius: theme.shape.borderRadius,
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    textDecoration: "none",
    backgroundColor: "rgba(221, 129, 144, 0.1)",
    "&:hover": {
      backgroundColor: "rgba(221, 129, 144, 0.2)",
    },
  },
  articleTypeIcon: {
    fontSize: "0.9rem",
    color: "#DB2777",
    display: "flex",
    alignItems: "center",
  },
  articleTypeText: {
    fontSize: "0.9rem",
    color: "#DB2777",
  },
  emptyState: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  textMedium: {
    fontWeight: 400,
  },
}));

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ menuItemClassName }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: categoriesResponse, isLoading, error } = useGetCategories();
  const hierarchy: HierarchyItem[] = (categoriesResponse?.data?.hierarchy as HierarchyItem[]) || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<HierarchyItem | null>(null);

  useEffect(() => {
    if (hierarchy.length > 0 && !selectedMasterCategory) {
      setSelectedMasterCategory(hierarchy[0]);
    }
  }, [hierarchy, selectedMasterCategory]);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setModalOpen(true);
    if (hierarchy.length > 0 && !selectedMasterCategory) {
      setSelectedMasterCategory(hierarchy[0]);
    }
  }, [hierarchy, selectedMasterCategory]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setSelectedMasterCategory(null);
  }, []);

  const handleMasterCategoryClick = useCallback((item: HierarchyItem) => {
    setSelectedMasterCategory(item);
  }, []);

  const handleSubCategoryClick = useCallback((subCategory: string) => {
    dispatch(filterByCategory(subCategory));
    handleClose();
  }, [dispatch, handleClose]);

  const handleArticleTypeClick = useCallback((articleType: string) => {
    dispatch(filterByCategory(articleType));
    handleClose();
  }, [dispatch, handleClose]);

  return (
    <>
      <MenuItem
        className={menuItemClassName}
        aria-haspopup="true"
        onClick={handleOpen}
        disableRipple
      >
        <Typography className={classes.textMedium}>Categories</Typography>
        <ArrowDropDownIcon fontSize="medium" />
      </MenuItem>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className={classes.modal}
      >
        <Fade in={modalOpen}>
          <Paper className={classes.modalPaper}>
            {/* Left Panel - Master Categories */}
            <div className={classes.leftPanel}>
              {isLoading ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <LottieLoading />
                </div>
              ) : error ? (
                <div className={classes.emptyState}>
                  {error instanceof Error ? error.message : String(error)}
                </div>
              ) : (
                hierarchy.map((item, index) => (
                  <div
                    key={`master-${index}`}
                    className={`${classes.masterCategoryItem} ${selectedMasterCategory?.masterCategory === item.masterCategory ? "selected" : ""
                      }`}
                    onClick={() => handleMasterCategoryClick(item)}
                  >
                    <span className={classes.masterCategoryIcon}>
                      {getMasterCategoryIcon(item.masterCategory)}
                    </span>
                    <Typography className={classes.masterCategoryText}>
                      {item.masterCategory}
                    </Typography>
                  </div>
                ))
              )}
            </div>

            {/* Right Panel - Sub Categories and Article Types */}
            <div className={classes.rightPanel}>
              {selectedMasterCategory ? (
                <>
                  {selectedMasterCategory.subCategories.map((subCat, index) => (
                    <div key={`sub-${index}`} className={classes.subCategorySection}>
                      <Typography
                        className={classes.subCategoryTitle}
                        component={Link}
                        to={`/shop?articleType=${encodeURIComponent(subCat.subCategory)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubCategoryClick(subCat.subCategory);
                        }}
                      >
                        <span className={classes.subCategoryIcon}>
                          {getSubCategoryIcon(subCat.subCategory)}
                        </span>
                        {subCat.subCategory}
                      </Typography>
                      {subCat.articleTypes.length > 0 && (
                        <div className={classes.articleTypesGrid}>
                          {subCat.articleTypes.map((articleType, artIndex) => (
                            <Typography
                              key={`article-${index}-${artIndex}`}
                              className={classes.articleTypeItem}
                              component={Link}
                              to={`/shop?articleType=${encodeURIComponent(articleType)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArticleTypeClick(articleType);
                              }}
                            >
                              <span className={classes.articleTypeIcon}>
                                {getArticleTypeIcon(articleType)}
                              </span>
                              <span className={classes.articleTypeText}>
                                {articleType}
                              </span>
                            </Typography>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className={classes.emptyState}>
                  Select a category to view subcategories
                </div>
              )}
            </div>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default CategoryDropdown;


