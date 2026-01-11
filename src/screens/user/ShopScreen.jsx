import { useState, useEffect, useRef } from "react";
import {
  removeSearchTerm,
  removeRangePrice,
  removeCategory,
  removeBrand,
  clearGenderFilter,
  clearUsageFilter,
} from "../../actions/filterActions";
import { useFilterProducts } from "../../hooks/api/useProduct";
import {
  Container,
  Link,
  Box,
  Grid,
  Breadcrumbs,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  Chip,
  useMediaQuery,
} from "@material-ui/core";
import { PaginationItem, Pagination } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { RiLayoutGridFill, RiLayoutFill } from "react-icons/ri";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Meta from "../../components/Meta";
import ProductCard from "../../components/Product/ProductCard";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import clsx from "clsx";
import queryString from "query-string";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import ProductFilterBar from "../../components/Product/ProductFilterBar";
import LottieEmpty from "@/components/LottieEmpty";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    marginBottom: 20,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  container: {
    marginBottom: 64,
    border: "1px solid rgba(0, 0, 0, 0.1)",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    "& label": {
      color: theme.palette.text.secondary,
      paddingRight: 12,
    },
    "& .MuiOutlinedInput-input": {
      paddingTop: 6,
      paddingBottom: 6,
      color: theme.palette.text.secondary,
      fontSize: 15,
    },
    "& .MuiInputBase-formControl": {
      borderRadius: 4,
      marginRight: theme.spacing(6),
    },
  },
  layoutIcon: {
    ...theme.mixins.customize.centerFlex("column"),
    padding: 4,
    cursor: "pointer",
    "& + $layoutIcon": {
      marginLeft: 8,
    },
  },
  activeLayout: {
    backgroundColor: theme.palette.background.paper,
    color: "white",
  },
  topFilter: {
    ...theme.mixins.customize.flexMixin(
      "space-between",
      "center",
      "row",
      "wrap"
    ),
    border: "1px solid rgba(0, 0, 0, 0.1)",
    padding: 22,
    marginBottom: theme.spacing(5),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    "& .MuiChip-root": {
      margin: 4,
    },
  },
  pagination: {
    flexBasis: "100%",
    marginTop: 16,
    marginBottom: 16,
    "& .MuiPagination-ul": {
      justifyContent: "flex-end",
    },
  },
  emptyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
    width: "100%",
  },
}));

const ShopScreen = ({ location, history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const onExtraSmallMobile = useMediaQuery("(max-width:460px)");
  const ref = useRef();
  const [activeLayout, setActiveLayout] = useState("moreCol");
  const query = queryString.parse(location.search);
  let { sort_by = "default", page: pageNumber = 1, articleType } = query;
  const filter = useSelector((state) => state.filter);
  const { searchTerm, categories, brands, priceMax, priceMin, gender, usage } =
    filter;
  const filterQuery = {
    keyword: searchTerm || undefined,
    categories: categories?.length ? categories.join(",") : undefined,
    brands: brands?.length ? brands.join(",") : undefined,
    priceMin: priceMin || undefined,
    priceMax: priceMax || undefined,
    gender: gender || undefined,
    usage: usage || undefined,
    sort_by: sort_by || "default",
    articleType: articleType || undefined,
    pageNumber: pageNumber || 1,
    perPage: 9,
  };

  const { data: productsResponse, isLoading: loading, error: queryError } = useFilterProducts(filterQuery);
  const products = productsResponse?.data?.products || [];
  const page = productsResponse?.data?.page || 1;
  const pages = productsResponse?.data?.pages || 1;
  const error = queryError?.message || (queryError ? String(queryError) : null);
  useEffect(() => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, [pageNumber]);

  useEffect(() => {
    if (onExtraSmallMobile) {
      setActiveLayout("fewCol");
    }
  }, [onExtraSmallMobile]);

  const handleChangeLayout = (type) => {
    setActiveLayout(type);
  };

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%", paddingLeft: 64, paddingRight: 64 }}>
      <Meta title="Shop" />
      <Grid container className={classes.breadcrumbsContainer} ref={ref}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            style={{ marginBottom: 24 }}
          >
            <Link color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Link color="textPrimary" component={RouterLink} to="/shop">
              Shop
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid container spacing={4} className={classes.container}>
        <Grid item xs={12} md={3}>
          <ProductFilterBar
            products={products}
            filter={filter}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box className={classes.topFilter}>
            <div>
              <FormControl variant="outlined" className={classes.selectBox}>
                <FormLabel>Sort by</FormLabel>
                <Select
                  value={sort_by}
                  onChange={(e) => {
                    const queryParams = [`sort_by=${e.target.value}`];
                    if (articleType) {
                      queryParams.push(`articleType=${articleType}`);
                    }
                    history.push(`/shop?${queryParams.join("&")}`);
                  }}
                >
                  <MenuItem value="default">Default Sorting</MenuItem>
                  <MenuItem value="latest">Lastest</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="sale">Sale</MenuItem>
                  <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                  <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={{ display: "flex" }}>
              <span
                className={clsx(
                  classes.layoutIcon,
                  activeLayout === "fewCol" && classes.activeLayout
                )}
                onClick={() => handleChangeLayout("fewCol")}
              >
                <RiLayoutFill fontSize={16} />
              </span>
              <span
                className={clsx(
                  classes.layoutIcon,
                  activeLayout === "moreCol" && classes.activeLayout
                )}
                onClick={() => handleChangeLayout("moreCol")}
              >
                <RiLayoutGridFill fontSize={16} />
              </span>
            </div>
            <Box mt={2} style={{ flexBasis: "100%" }}>
              {searchTerm && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Keyword: ${searchTerm}`}
                  onDelete={() => dispatch(removeSearchTerm())}
                />
              )}
              {priceMin && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Above: $${priceMin}`}
                  onDelete={() => dispatch(removeRangePrice("min"))}
                />
              )}
              {priceMax && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Below: $${priceMax}`}
                  onDelete={() => dispatch(removeRangePrice("max"))}
                />
              )}
              {categories.map((category) => (
                <Chip
                  variant="outlined"
                  size="small"
                  key={category}
                  label={category}
                  onDelete={() => dispatch(removeCategory(category))}
                />
              ))}
              {gender && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Gender: ${gender}`}
                  onDelete={() => dispatch(clearGenderFilter())}
                />
              )}
              {usage && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Usage: ${usage}`}
                  onDelete={() => dispatch(clearUsageFilter())}
                />
              )}
              {brands.map((brand) => (
                <Chip
                  variant="outlined"
                  size="small"
                  key={brand}
                  label={brand}
                  onDelete={() => dispatch(removeBrand(brand))}
                />
              ))}
            </Box>
          </Box>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message>{error}</Message>
          ) : products.length !== 0 ? (
            <>
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={product._id}
                  >
                    <ProductCard {...product} />
                  </Grid>
                ))}
                {pages > 1 && (
                  <Grid item xs={12}>
                    <Pagination
                      className={classes.pagination}
                      page={page}
                      count={pages}
                      renderItem={(item) => {
                        const queryParams = [];
                        if (sort_by && sort_by !== "default") {
                          queryParams.push(`sort_by=${sort_by}`);
                        }
                        if (articleType) {
                          queryParams.push(`articleType=${articleType}`);
                        }
                        if (item.page > 0) {
                          queryParams.push(`page=${item.page}`);
                        }
                        const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
                        return (
                          <PaginationItem
                            component={RouterLink}
                            to={`/shop${queryString}`}
                            {...item}
                          />
                        );
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </>
          ) : (
            <LottieEmpty />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShopScreen;
