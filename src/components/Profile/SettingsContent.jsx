import React, { useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
    minHeight: 500,
    border: `1px solid ${theme.palette.divider}`,
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
}));

const SettingsContent = () => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography variant="h5" style={{ marginBottom: 24 }} className="tracking-widest">
        Settings
      </Typography>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Notifications
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive notifications about orders and updates"
            />
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              color="secondary"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Email Updates"
              secondary="Receive emails about offers and new products"
            />
            <Switch
              checked={emailUpdates}
              onChange={(e) => setEmailUpdates(e.target.checked)}
              color="secondary"
            />
          </ListItem>
        </List>
      </div>

      <Divider />

      <div className={classes.section} style={{ marginTop: 24 }}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Account
        </Typography>
        <List>
          <ListItem button>
            <ListItemText
              primary="Change Password"
              secondary="Update your password"
            />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="Delete Account"
              secondary="Permanently delete your account"
            />
          </ListItem>
        </List>
      </div>

      <Divider />

      <div className={classes.section} style={{ marginTop: 24 }}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Other
        </Typography>
        <List>
          <ListItem button>
            <ListItemText
              primary="Privacy Policy"
              secondary="View our privacy policy"
            />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="Terms of Use"
              secondary="View terms of use"
            />
          </ListItem>
        </List>
      </div>
    </Paper>
  );
};

export default SettingsContent;

