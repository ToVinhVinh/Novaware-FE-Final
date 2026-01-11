import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Paper, makeStyles } from "@material-ui/core";
import {
  Person as PersonIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Favorite as FavoriteIcon,
  Style as StyleIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: "100%",
    border: `1px solid ${theme.palette.divider}`,
  },
  listItem: {
    marginBottom: 4,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.secondary.dark,
      },
      "& .MuiListItemIcon-root": {
        color: theme.palette.secondary.contrastText,
      },
    },
  },
  listItemIcon: {
    minWidth: 40,
  },
}));

const menuItems = [
  { id: "profile", label: "Profile", icon: <PersonIcon /> },
  { id: "orders", label: "Orders", icon: <ShoppingBasketIcon /> },
  { id: "favorites", label: "Interaction History", icon: <FavoriteIcon /> },
  { id: "outfit-suggestions", label: "Saved Outfits", icon: <StyleIcon /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon /> },
];

const ProfileSidebar = ({ selectedItem, onItemClick }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.sidebar} elevation={0}>
      <List component="nav" aria-label="profile navigation">
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            button
            selected={selectedItem === item.id}
            onClick={() => onItemClick(item.id)}
            className={classes.listItem}
          >
            <ListItemIcon className={classes.listItemIcon}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ProfileSidebar;

