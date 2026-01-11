import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Grid,
  Breadcrumbs,
  Link,
  makeStyles,
} from "@material-ui/core";
import { useGetUserById } from "../../hooks/api/useUser";
import { useGetMyOrders } from "../../hooks/api/useOrder";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Meta from "../../components/Meta";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ProfileSidebar from "../../components/Profile/ProfileSidebar";
import ProfileContent from "../../components/Profile/ProfileContent";
import OrdersContent from "../../components/Profile/OrdersContent";
import FavoritesContent from "../../components/Profile/FavoritesContent";
import OutfitSuggestionsContent from "../../components/Profile/OutfitSuggestionsContent";
import SettingsContent from "../../components/Profile/SettingsContent";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  contentGrid: {
    paddingLeft: "0px !important",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: "0px !important",
    },
  },
}));

const ProfileScreen = ({ history }) => {
  const classes = useStyles();
  const [selectedItem, setSelectedItem] = useState("profile");

  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  const currentUserId = userInfo?._id || "";

  const { data: userResponse, isLoading: loading, error } = useGetUserById(currentUserId);
  const user = userResponse?.data?.user;

  // Get user ID for orders query
  const userId = userInfo?._id || userInfo?.id || currentUserId;
  const { data: ordersResponse, isLoading: loadingOrders, error: errorOrders } = useGetMyOrders(
    userId ? { user_id: userId } : undefined
  );
  const orders = ordersResponse?.data?.orders || [];

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
  }, [history, userInfo]);

  const handleItemClick = (itemId) => {
    setSelectedItem(itemId);
  };

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <Message>{error}</Message>;
    }

    switch (selectedItem) {
      case "profile":
        return <ProfileContent user={user} onItemClick={handleItemClick} />;
      case "orders":
        return (
          <OrdersContent
            orders={orders}
            loadingOrders={loadingOrders}
            errorOrders={errorOrders}
          />
        );
      case "favorites":
        return <FavoritesContent />;
      case "outfit-suggestions":
        return <OutfitSuggestionsContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <ProfileContent user={user} />;
    }
  };

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Profile" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            style={{ marginBottom: 24 }}
          >
            <Link color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Link color="textPrimary" component={RouterLink} to="/profile">
              Profile
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={3}>
          <ProfileSidebar
            selectedItem={selectedItem}
            onItemClick={handleItemClick}
          />
        </Grid>
        <Grid item xs={12} lg={9} className={classes.contentGrid}>
          {renderContent()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileScreen;
