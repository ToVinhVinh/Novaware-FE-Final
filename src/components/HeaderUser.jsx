import React, { useCallback, useRef, useState } from "react";
import { Avatar, Badge, withStyles } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { logout } from "../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { FiLogIn } from "react-icons/fi";
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaLock, FaComments } from 'react-icons/fa';
import { openAdminChatDrawer } from "../actions/chatActions";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { useGetUserById } from "../hooks/api/useUser";

import male30 from "../assets/images/male30.webp";
import male40 from "../assets/images/male40.webp";
import male50 from "../assets/images/male50.webp";
import female30 from "../assets/images/female30.webp";
import female40 from "../assets/images/female40.webp";
import female50 from "../assets/images/female50.webp";
import defaultAvatar from "../assets/images/userPlaceholder.png";
const StyledBadge = withStyles((theme) => ({
  root: {
    position: "relative",
  },
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  menuItemIcon: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: theme.spacing(1) + 4,
    color: theme.palette.text.secondary,
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    fontSize: 14,
  },
}));

const getAvatarImage = (age, gender) => {
  if (!age || !gender) {
    return defaultAvatar;
  }

  const isMale = gender.toLowerCase() === "male";

  if (age <= 30) {
    return isMale ? male30 : female30;
  } else if (age <= 50) {
    return isMale ? male40 : female40;
  }

  return isMale ? male50 : female50;
};

export default function HeaderUser({
  setLoginModalOpen,
  setRegisterModalOpen,
  setForgotPasswordModalOpen,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { userInfo } = useSelector((state) => state.userLogin);
  const currentUserId = userInfo?._id || "";
  const { data: userResponse } = useGetUserById(currentUserId);
  const fullUser = userResponse?.data?.user;
  const mergedUser = fullUser || userInfo;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const theme = useTheme();
  const iconColor = theme.palette.text.primary;
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const avatarImage = getAvatarImage(mergedUser?.age, mergedUser?.gender);
  const avatarFallback =
    mergedUser?.name?.trim()?.charAt(0)?.toUpperCase() ||
    mergedUser?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleChat = useCallback(() => {
    dispatch(openAdminChatDrawer());
  }, [dispatch]);

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleLoginClick = () => {
    setLoginModalOpen(true);
    setOpen(false);
  };

  const handleRegisterClick = () => {
    setRegisterModalOpen(true);
    setOpen(false);
  };

  const handleForgotPassword = () => {
    setForgotPasswordModalOpen(true);
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <div>
        {userInfo ? (
          <>
            <IconButton ref={anchorRef} onClick={handleToggle}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  src={avatarImage}
                  alt={mergedUser?.name || "Profile"}
                  className={classes.avatar}
                  style={{ backgroundColor: avatarImage ? "transparent" : iconColor }}
                >
                  {!avatarImage && avatarFallback}
                </Avatar>
              </StyledBadge>
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem component={RouterLink} to={userInfo.isAdmin ? "/admin/products" : "/profile"} divider>
                          <FaUser className={classes.menuItemIcon} />
                          View Profile
                        </MenuItem>
                        {/* <MenuItem onClick={handleChat}>
                          <FaComments className={classes.menuItemIcon} />
                          Chat
                        </MenuItem> */}
                        <MenuItem onClick={handleLogout}>
                          <FaSignOutAlt className={classes.menuItemIcon} />
                          Logout
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        ) : (
          <>
            <IconButton ref={anchorRef} onClick={handleToggle}>
              <FiLogIn height={22} color="#444" />
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
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
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        )}
      </div>
    </div>
  );
}