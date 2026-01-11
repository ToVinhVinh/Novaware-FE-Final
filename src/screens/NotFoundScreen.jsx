import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    textAlign: 'center',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const NotFoundScreen = () => {
  const classes = useStyles();

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Typography variant="h1" className={classes.title}>
        404
      </Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Typography variant="body1">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to="/"
        className={classes.button}
      >
        Go To Homepage
      </Button>
    </Container>
  );
};

export default NotFoundScreen;