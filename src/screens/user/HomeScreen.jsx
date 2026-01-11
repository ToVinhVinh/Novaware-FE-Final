import Meta from "../../components/Meta";
import HomeCarousel from "../../components/Home/HomeCarousel";
import HomeBanner from "../../components/Home/HomeBanner";
import ProductTabs from "../../components/Product/ProductTabs";
import HomeService from "../../components/Home/HomeService";
import TopProducts from "../../components/Home/TopProducts";

const HomeScreen = () => {
  return (
    <>
      <Meta />
      <HomeCarousel />
      <TopProducts />
      <ProductTabs />
      <HomeService />
    </>
  );
};

export default HomeScreen;
