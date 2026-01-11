import React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  makeStyles,
} from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { FaUserCircle, FaTshirt, FaHandHoldingHeart } from "react-icons/fa";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import luxurybrand from '../../assets/images/luxury-brand.jpg'
import localbrand from '../../assets/images/local-brand.jpg'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
  },
  breadcrumbsContainer: {
    marginBottom: theme.spacing(4),
  },
  section: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(5),
  },
  title: {
    marginBottom: theme.spacing(5),
    fontWeight: 500,
    textAlign: "center",
  },
  sectionTitle: {
    marginBottom: theme.spacing(4),
    fontWeight: 400,
    textAlign: "center",
  },
  contentText: {
    fontSize: '1.1rem', // Tăng kích thước font chữ của nội dung
    lineHeight: 1.8,
  },
  cardGrid: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  card: {
    maxWidth: 345,
    margin: "auto",
  },
  media: {
    height: 200,
  },
  missionGrid: {
    marginTop: theme.spacing(4),
    spacing: 1, // Giảm khoảng cách giữa các phần tử Grid
  },
  missionIcon: {
    fontSize: 40,
    color: theme.palette.text.secondary,
  },
  iconBox: {
    textAlign: "center",
  },
  missionLabel: {
    marginTop: theme.spacing(1),
    fontWeight: 500,
    fontSize: "1rem",
  },
}));

const AboutUs = () => {
  const classes = useStyles();

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      {/* Breadcrumbs */}
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Link color="textPrimary" component={RouterLink} to="/about-us">
              About Us
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>

      {/* Tiêu đề chính */}
      <Typography variant="h3" className={classes.title}>
        About Novaware
      </Typography>

      {/* Phần giới thiệu chung */}
      <Typography variant="body1" className={classes.contentText} align="center" paragraph>
        Welcome to Novaware, your one-stop destination for fashion that
        transcends labels and boundaries. Whether you're looking for high-end
        luxury brands or discovering the unique flair of local labels, we bring
        the best of both worlds together in one place.
      </Typography>

      {/* Sứ mệnh */}
      <Box className={classes.section}>
        <Typography variant="h5" className={classes.sectionTitle}>
          Our Mission
        </Typography>
        <Typography variant="body1" className={classes.contentText} align="center" paragraph>
          At Novaware, our mission is to democratize fashion by making premium
          and exclusive styles accessible to everyone. We curate a collection
          that embraces diversity—from the biggest names in haute couture to the
          rising stars in local brands. By creating a marketplace that
          celebrates creativity and style in all its forms, we aim to inspire
          our customers to explore, express, and embrace their personal style
          with confidence.
        </Typography>
      </Box>

      {/* Hình ảnh minh họa */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        className={classes.cardGrid}
      >
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.media}
              image={luxurybrand}
              title="High-End Fashion"
            />
            <CardContent>
              <Typography gutterBottom variant="h5">
                Luxury Brands
              </Typography>
              <Typography variant="body2" color="textSecondary">
                From global luxury giants to exclusive labels, we offer a
                selection that brings the world's finest designs to you.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.media}
              image={localbrand}
              title="Local Brands"
            />
            <CardContent>
              <Typography gutterBottom variant="h5">
                Local Brands
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Discover the hidden gems in fashion—unique designs from
                up-and-coming local brands that redefine individuality and
                creativity.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Giá trị cốt lõi */}
      <Box className={classes.section}>
        <Typography variant="h5" className={classes.sectionTitle}>
          Our Values
        </Typography>
        <Typography variant="body1" className={classes.contentText} align="center" paragraph>
          We believe fashion is more than just clothing; it’s a means of
          self-expression and a reflection of who you are. That's why we strive
          to offer a diverse and dynamic collection, where everyone can find
          something that resonates with their personal style. Our values revolve
          around:
        </Typography>
        <ul style={{ textAlign: "left", margin: "0 auto", maxWidth: "600px" }}>
          <li>
            <strong>Inclusivity:</strong> Making luxury and everyday fashion
            available for everyone.
          </li>
          <li>
            <strong>Quality:</strong> Partnering only with trusted brands to
            ensure our customers receive the best quality.
          </li>
          <li>
            <strong>Community:</strong> Supporting local designers and
            empowering their growth in the fashion ecosystem.
          </li>
        </ul>
      </Box>

      {/* Đội ngũ */}
      <Box className={classes.section}>
        <Typography variant="h5" className={classes.sectionTitle}>
          Meet Our Team
        </Typography>
        <Typography variant="body1" className={classes.contentText} align="center" paragraph>
          Our dedicated team is passionate about fashion and committed to
          creating a seamless shopping experience for you. From our curators who
          handpick every product to our support staff who assist you at every
          step, we are here to make your journey with Novaware exceptional.
        </Typography>
      </Box>

      {/* Section WHAT WE WANT */}
      <Box className={classes.section}>
        <Typography variant="h5" className={classes.sectionTitle}>
          What We Want
        </Typography>
        <ul style={{ textAlign: "left", margin: "0 auto", maxWidth: "600px" }}>
          <li>
            <strong>Self-Expression:</strong> Empowering individuals to embrace
            their unique identities and pursue their passions without
            limitations.
          </li>
          <li>
            <strong>Fashion:</strong> Provide high-quality fashion at affordable
            prices.
          </li>
          <li>
            <strong>Responsibility:</strong> Build a socially responsible
            business.
          </li>
        </ul>
      </Box>

      <Box className={classes.section}>
        <Grid
          container
          justifyContent="center"
          className={classes.missionGrid}
        >
          {/* Self-expression */}
          <Grid item xs={12} md={2}>
            <Box className={classes.iconBox}>
              <FaUserCircle className={classes.missionIcon} />
              <Typography className={classes.missionLabel}>
                Self-expression
              </Typography>
            </Box>
          </Grid>

          {/* Fashion */}
          <Grid item xs={12} md={2}>
            <Box className={classes.iconBox}>
              <FaTshirt className={classes.missionIcon} />
              <Typography className={classes.missionLabel}>Fashion</Typography>
            </Box>
          </Grid>

          {/* Responsibility */}
          <Grid item xs={12} md={2}>
            <Box className={classes.iconBox}>
              <FaHandHoldingHeart className={classes.missionIcon} />
              <Typography className={classes.missionLabel}>
                Responsibility
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutUs;
