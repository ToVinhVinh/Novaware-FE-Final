import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { logout } from '../../actions/userActions';
import { Link as RouterLink, useLocation, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Toolbar,
  AppBar,
  CssBaseline,
  Button,
  Typography,
  Box,
} from "@material-ui/core";
import clsx from 'clsx';
import logo from "../../assets/images/logo.png";

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// Filled Icons
import {
  Group as GroupIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Assessment as AssessmentIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Receipt as ReceiptIcon,
  ExitToApp as LogoutIcon,
  ThumbUp as RecommendIcon,
} from "@material-ui/icons";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#ffffff',
    color: theme.palette.text.primary,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarShiftClose: {
    width: '100%',
    marginLeft: 0,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    minHeight: 64,
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    maxWidth: 140,
    height: 'auto',
    [theme.breakpoints.down("sm")]: {
      maxWidth: 120,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    maxWidth: drawerWidth,
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
    overflowX: 'hidden',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 1.5),
    justifyContent: 'space-between',
    minHeight: 64,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
  dashboardTitle: {
    fontWeight: 600,
    fontSize: '1.25rem',
    color: theme.palette.text.primary,
    letterSpacing: '0.5px',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: drawerWidth,
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  contentShift: {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  listItem: {
    borderRadius: '8px',
    margin: theme.spacing(0.5, 1.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#e3f2fd',
    },
    transition: 'all 0.2s ease-in-out',
  },
  listItemActive: {
    backgroundColor: '#1976d2',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
    '& .MuiListItemIcon-root': {
      color: '#ffffff',
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
    },
  },
  listItemIcon: {
    minWidth: 40,
    color: theme.palette.text.secondary,
  },
  listItemIconActive: {
    color: '#ffffff',
  },
  listItemText: {
    '& .MuiListItemText-primary': {
      fontSize: '0.95rem',
      fontWeight: 500,
    },
  },
  logoutButton: {
    margin: theme.spacing(1, 1.5),
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    backgroundColor: '#d32f2f',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#c62828',
    },
  },
  shadowBottom: {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
}));

const AdminLayout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  // Menu items (flat structure, no sub-menus)
  const menuItems = [
    // {
    //   text: 'Recommend Products',
    //   icon: <RecommendIcon />,
    //   link: '/admin/products',
    // },
    {
      text: 'Statistics',
      icon: <AssessmentIcon />,
      link: '/admin/statistics',
    },
    {
      text: 'Products Management',
      icon: <ShoppingBasketIcon />,
      link: '/admin/products',
    },
    {
      text: 'Order Management',
      icon: <ReceiptIcon />,
      link: '/admin/orders',
    },
    {
      text: 'Category Management',
      icon: <CategoryIcon />,
      link: '/admin/categories',
    },
    {
      text: 'User Management',
      icon: <GroupIcon />,
      link: '/admin/users',
    },
    {
      text: 'Configuration',
      icon: <SettingsIcon />,
      link: '/admin/home-content',
    },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    dispatch(logout());
    history.push('/');
  };

  const isActive = (link) => {
    const pathname = location.pathname;

    if (link === '/admin/products') {
      return pathname === '/admin/products';
    }

    if (link === '/admin/products') {
      return pathname === '/admin/products' ||
        pathname.match(/^\/admin\/product\/[^/]+$/) ||
        pathname.match(/^\/admin\/product\/[^/]+\/edit$/);
    }

    if (link === '/admin/orders') {
      return pathname === '/admin/orders' ||
        pathname.match(/^\/admin\/order\/[^/]+$/);
    }

    if (link === '/admin/products') {
      return pathname === '/admin/products';
    }

    if (link === '/admin/users') {
      return pathname === '/admin/users' ||
        pathname.match(/^\/admin\/user\/[^/]+\/edit$/);
    }

    return pathname === link;
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
          [classes.appBarShiftClose]: !open,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            className={classes.menuButton}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          {/* Logo */}
          <div className={classes.logoWrapper}>
            <RouterLink to="/">
              <img src={logo} alt="NovaWare" className={classes.logo} />
            </RouterLink>
          </div>

          <Button
            variant='contained'
            color='secondary'
            onClick={handleLogout}
            endIcon={<LogoutIcon />}
          >
            Đăng xuất
          </Button>
        </Toolbar>
      </AppBar>

      {/* Persistent Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={clsx("flex justify-center items-center min-h-16 bg-white", classes.shadowBottom)}>
          <Typography variant="h6" className={classes.dashboardTitle}>
            Admin Panel
          </Typography>
        </div>
        <Divider />

        {/* Menu Items */}
        <List component="nav" style={{ paddingTop: 8 }}>
          {menuItems.map((item, index) => {
            const active = isActive(item.link);
            return (
              <ListItem
                key={index}
                button
                component={RouterLink}
                to={item.link}
                className={clsx(classes.listItem, {
                  [classes.listItemActive]: active,
                })}
              >
                <ListItemIcon
                  className={clsx(classes.listItemIcon, {
                    [classes.listItemIconActive]: active,
                  })}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  className={classes.listItemText}
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <main className={clsx(classes.content, {
        [classes.contentShift]: !open,
      })}>
        <Toolbar />
        <Box>{children}</Box>
      </main>
    </div>
  );
};

export default AdminLayout;

