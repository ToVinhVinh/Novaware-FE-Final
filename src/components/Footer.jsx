import React from "react";
import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { RiFacebookLine, RiInstagramLine, RiYoutubeLine } from "react-icons/ri";
import { SiZalo } from "react-icons/si";
import { MdPhone, MdEmail, MdAccessTime } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#000",
    color: "#fff",
    padding: theme.spacing(6, 0),
  },
  contentContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  leftSection: {
    flex: "1 1 50%",
    maxWidth: "50%",
    paddingRight: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
      paddingRight: 0,
      marginBottom: theme.spacing(3),
    },
  },
  rightSection: {
    flex: "1 1 50%",
    maxWidth: "50%",
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      maxWidth: "100%",
      gap: theme.spacing(4),
    },
  },
  rightColumn: {
    width: "48%",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  socialColumn: {
    width: "48%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  contactItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1),
  },
  icon: {
    fontSize: "1.5rem",
    marginTop: 2,
  },
  socialIcons: {
    display: "flex",
    gap: theme.spacing(2),
    flexWrap: "wrap",
  },
  socialBtn: {
    color: "#fff",
    border: "1px solid #fff",
    borderRadius: "50%",
    padding: theme.spacing(1),
    fontSize: "1.2rem",
    transition: "0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    "&:hover": {
      backgroundColor: "#fff",
      color: "#000",
    },
  },
  title: {
    fontWeight: 600,
    fontSize: "1.6rem",
    marginBottom: theme.spacing(2),
  },
  desc: {
    fontSize: "1rem",
    color: "#ccc",
    lineHeight: 1.6,
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <Container>
        <div className={classes.contentContainer}>
          <div className={classes.leftSection}>
            <Typography className={classes.title}>
              NOVAWEAR listens to you!
            </Typography>
            <Typography className={classes.desc}>
              We always appreciate and look forward to receiving all feedback
              from customers to further improve our service and product
              experience.
            </Typography>
          </div>
          <div className={classes.rightSection}>
            <div className={classes.rightColumn}>
              <div className={classes.contactItem}>
                <MdPhone className={classes.icon} />
                <div>
                  <strong>Hotline</strong>
                  <br />
                  1900.272737
                </div>
              </div>
              <div className={classes.contactItem}>
                <MdAccessTime className={classes.icon} />
                <div>
                  <strong>Working Hours</strong>
                  <br />
                  8:30 - 22:00 (Every day of the week)
                </div>
              </div>
              <div className={classes.contactItem}>
                <MdEmail className={classes.icon} />
                <div>
                  <strong>Email</strong>
                  <br />
                  novawear@gmail.com
                </div>
              </div>
            </div>
            <div className={classes.socialColumn}>
              <div className={classes.socialIcons}>
                <div className={classes.socialBtn}>
                  <RiFacebookLine />
                </div>
                <div className={classes.socialBtn}>
                  <SiZalo />
                </div>
                <div className={classes.socialBtn}>
                  <RiInstagramLine />
                </div>
                <div className={classes.socialBtn}>
                  <RiYoutubeLine />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
