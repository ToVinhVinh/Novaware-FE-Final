import React, { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import SearchIcon from "../assets/icons/search.svg?react";
import CartIcon from "../assets/icons/cart.svg?react";
import useCartStore from "../store/cartStore";
import { logout } from "../actions/userActions";
import { openChatDrawer } from "../actions/chatActions";
import { useGetFavorites } from "../hooks/api/useUser";
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaLock } from 'react-icons/fa';
import { openFavoriteDrawer } from "../actions/favoriteActions";
import {
  filterClearAll,
} from "../actions/filterActions";
import {
  Drawer,
  Hidden,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  MenuItem,
  MenuList,
} from "@material-ui/core";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import logo from "../assets/images/logo.png";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import HeaderUser from "./HeaderUser.jsx";
import SearchBox from "./SearchBox.jsx";
import FavoritePreview from '../components/Drawer/FavoritePreview';
import CategoryDropdown from "./Header/CategoryDropdown";

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    transition: "all .2s",
    boxShadow: "0px 2px 8px -1px rgb(0 0 0 / 10%)",
    paddingRight: "0 !important",
  },
  headerScrolled: {
    backgroundColor: theme.palette.background.default,
    boxShadow: "0px 2px 8px -1px rgb(0 0 0 / 10%)",
    transition: "all .2s",
  },
  menuButton: {
    display: "none",
    marginRight: theme.spacing(2),
    "@media(max-width: 740px)": {
      display: "block",
    },
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: "auto",
  },
  logo: {
    maxWidth: 140,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 120,
      marginLeft: 16,
    },
  },
  navMenu: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      flexBasis: "unset",
      maxWidth: "unset",
    },
  },
  drawer: {
    width: 250,
  },
  navList: {
    display: "flex",
    alignItems: "center",
  },
  navListMobile: {
    width: "250px",
    marginTop: 50,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    "& .MuiListItem-root": {
      width: "100%",
      justifyContent: "center",
    },
  },
  sectionDesktop: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: "auto",
    [theme.breakpoints.down("sm")]: {
      flexBasis: "unset",
      maxWidth: "unset",
      flexGrow: 1,
    },
  },
  closeButton: {
    position: "fixed",
    top: 10,
    left: 20,
  },
  menuItem: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: "8px 16px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      width: 0,
      height: '2px',
      backgroundColor: 'black',
      transition: 'width 0.3s ease-out, left 0.3s ease-out',
    },
    '&:hover::after': {
      width: '100%',
      left: 0,
    },
  },
  menuItemSelected: {
    backgroundColor: `${theme.palette.action.selected} !important`,
  },
  menuPaper: {
    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    border: `1px solid ${theme.palette.divider}`,
    width: '90vw',
    maxWidth: '90vw',
  },
  brandsMenuList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gridAutoRows: 'minmax(32px, auto)',
    columnGap: theme.spacing(2),
    rowGap: theme.spacing(1),
    padding: theme.spacing(1, 2),
  },
  brandGroupColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(0.5),
    minWidth: 0,
  },
  letterItem: {
    fontWeight: 600,
    color: '#f50057',
    cursor: 'default',
    '&.Mui-disabled': {
      opacity: 1,
      color: '#f50057',
    },
  },
  letterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: '8px 16px',
  },
  letterText: {
    fontWeight: 600,
    color: '#f50057',
    whiteSpace: 'nowrap',
  },
  letterDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#f50057',
    opacity: 0.4,
  },
  menuItemText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    display: 'block',
  },
  menuItemIcon: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: theme.spacing(1) + 4,
    color: theme.palette.text.secondary,
  },
}));

const Header = ({
  setLoginModalOpen,
  setRegisterModalOpen,
  setForgotPasswordModalOpen,
}) => {
  const dispatch = useDispatch();
  const { cartItems, setDrawerOpen } = useCartStore();
  const { userInfo } = useSelector((state) => state.userLogin);
  const [mobile, setMobile] = useState(false);
  const [openSearchDrawer, setOpenSearchDrawer] = useState(false);

  // Custom hooks
  const onMobile = useMediaQuery("(max-width:740px)");
  const location = useLocation();
  const { pathname } = location;
  const currentPath = pathname.split("/")[1];

  const { data: favoritesResponse } = useGetFavorites(userInfo?._id || "");

  const favoriteItems = favoritesResponse?.data?.favoriteItems || [];

  // scroll effect
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    target: window ? window : undefined,
    threshold: 80,
  });
  const classes = useStyles({ mobile });
  const theme = useTheme();
  const iconColor = theme.palette.text.primary;

  // Handlers for drawer
  const handleChatClick = useCallback(() => {
    dispatch(openChatDrawer());
  }, [dispatch]);

  const handleCloseDrawer = useCallback(() => {
    setMobile(false);
  }, []);

  const handleLoginClick = () => {
    setLoginModalOpen(true);
    if (onMobile) {
      setMobile(false);
    }
  };

  const handleRegisterClick = () => {
    setRegisterModalOpen(true);
    if (onMobile) {
      setMobile(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordModalOpen(true);
    if (onMobile) {
      setMobile(false);
    }
  };

  // Category interactions handled within CategoryDropdown

  const handleAllCategoriesClick = () => {
    dispatch(filterClearAll());
    handleCloseDrawer();
  };

  const handleAllBrandsClick = () => {
    dispatch(filterClearAll());
    handleCloseDrawer();
  };

  const handleFavoriteClick = () => {
    dispatch(openFavoriteDrawer());
  };

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.header, trigger && classes.headerScrolled)}
    >
      <Toolbar>
        {/* Logo */}
        <Link to="/" className={classes.logoWrapper}>
          <img src={logo} alt="logo" className={classes.logo} />
        </Link>
        {/* Navigation Menu */}
        <Toolbar className={classes.navMenu}>
          {/* Mobile Menu */}
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => setMobile(!mobile)}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Menu */}
          {!onMobile ? (
            <MenuList className={classes.navList}>
              <MenuItem
                component={Link}
                to="/"
                className={classes.menuItem}
                selected={currentPath === ""}
              >
                Home
              </MenuItem>
              <MenuItem
                component={Link}
                to="/shop"
                className={classes.menuItem}
                selected={currentPath === "shop"}
              >
                Shop
              </MenuItem>
              {/* Categories Menu */}
              <CategoryDropdown
                menuItemClassName={classes.menuItem}
              />
              <MenuItem
                component={Link}
                to="/about-us"
                className={classes.menuItem}
                selected={currentPath === "about-us"}
              >
                About Us
              </MenuItem>
            </MenuList>
          ) : (
            // Mobile Drawer Menu
            <Drawer
              variant="temporary"
              anchor="left"
              className={classes.drawer}
              open={mobile}
              onClose={handleCloseDrawer}
              ModalProps={{
                keepMounted: true,
                disablePortal: true,
              }}
            >
              <MenuList className={classes.navListMobile}>
                <MenuItem
                  component={Link}
                  to="/"
                  onClick={handleCloseDrawer}
                  selected={currentPath === ""}
                >
                  Home
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/shop"
                  onClick={handleCloseDrawer}
                  selected={
                    currentPath === "shop" &&
                    !pathname.includes("category") &&
                    !pathname.includes("brand")
                  }
                >
                  Shop
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/shop"
                  onClick={() => {
                    handleAllCategoriesClick();
                    handleCloseDrawer();
                  }}
                  selected={
                    currentPath === "shop" && pathname.includes("category=all")
                  }
                >
                  Categories
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/about-us"
                  onClick={handleCloseDrawer}
                  selected={currentPath === "about-us"}
                >
                  About Us
                </MenuItem>
                {userInfo ? (
                  <div style={{ width: "100%" }}>
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleCloseDrawer}
                    >
                      <FaUser className={classes.menuItemIcon} />
                      {userInfo.name || "Profile"}
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(logout())}>
                      <FaSignOutAlt className={classes.menuItemIcon} />
                      Logout
                    </MenuItem>
                  </div>
                ) : (
                  <>
                    <MenuItem onClick={handleLoginClick}>
                      <FaSignInAlt className={classes.menuItemIcon} />
                      Login
                    </MenuItem>
                    <MenuItem onClick={handleRegisterClick}>
                      <FaUserPlus className={classes.menuItemIcon} />
                      Register
                    </MenuItem>
                    <MenuItem onClick={handleForgotPassword}>
                      <FaLock className={classes.menuItemIcon} />
                      Forgot Password
                    </MenuItem>
                  </>
                )}
              </MenuList>
              <IconButton
                edge="start"
                className={classes.closeButton}
                onClick={() => setMobile(false)}
                color="inherit"
                aria-label="close drawer"
              >
                <CloseIcon />
              </IconButton>
            </Drawer>
          )}
        </Toolbar>

        {/* Desktop Actions Section */}
        <div className={classes.sectionDesktop}>
          <IconButton color="inherit" onClick={() => setOpenSearchDrawer(true)}>
            <SearchIcon style={{ fill: iconColor }} height={22} width={22} />
          </IconButton>

          {/* Search Drawer */}
          <Drawer
            anchor="top"
            open={openSearchDrawer}
            onClose={() => setOpenSearchDrawer(false)}
          >
            <SearchBox
              role="searchDrawer"
              setOpenSearchDrawer={setOpenSearchDrawer}
            />
          </Drawer>
          {/* Cart */}
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
          >
            <Badge badgeContent={cartItems.length} color="secondary" overlap="rectangular">
              <CartIcon />
            </Badge>
          </IconButton>
          {/* User Section */}
          <Hidden smDown>
            <HeaderUser
              setLoginModalOpen={setLoginModalOpen}
              setRegisterModalOpen={setRegisterModalOpen}
              setForgotPasswordModalOpen={setForgotPasswordModalOpen}
            />
          </Hidden>
        </div>
        <FavoritePreview />
      </Toolbar>
    </AppBar>
  );
};

export default Header;