import { Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useGetContentSections } from "../../hooks/api/useContentSection";

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 760, md: 960, lg: 1200, xl: 1400 },
  },
});

const HomeBanner = () => {
  const { data: bannersResponse, isLoading: loading, error: queryError } = useGetContentSections({ type: "banner" });
  
  const banners = bannersResponse?.data?.contentSections || [];
  const error = queryError?.message || (queryError ? String(queryError) : null);
  
  if (loading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;

  const flatBanners = banners?.flat();
  const filteredBanners = flatBanners?.filter((b) => b.type === "banner");

  return (
    <div className="home-banner">
      <ThemeProvider theme={theme}>
        <Grid container spacing={4}>
          {filteredBanners.slice(0, 2).map((banner, index) => (
            <Grid item xs={12} sm={6} key={banner._id}>
              <div className={`banner__inner banner__inner--right`}>
                <img
                  src={banner.images?.[0] || "https://via.placeholder.com/300"}
                  alt="banner img"
                  className="banner__image"
                />
                <div className="banner__content">
                  <div className="content__wrapper">
                    <div className="content__subtitle">{banner.subtitle}</div>
                    <h2 className="content__title">{banner.title}</h2>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className="content__button"
                      component={Link}
                      to={`/shop?category=${index === 0 ? "LCK" : "LPL"}`} // Thay đổi giá trị category dựa vào index
                    >
                      {banner.button_text || "SHOP NOW"}
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default HomeBanner;
