import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useGetUserById } from "../../hooks/api/useUser";
import { useSelector } from "react-redux";
import Message from "../Message";
import Loader from "../Loader";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FavoriteIcon from "@material-ui/icons/Favorite";
import StarIcon from "@material-ui/icons/Star";
import PaymentIcon from "@material-ui/icons/Payment";
import CallMadeIcon from "@material-ui/icons/CallMade";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
    minHeight: 500,
    border: `1px solid ${theme.palette.divider}`,
  },
  tableContainer: {
    marginTop: 16,
    maxHeight: 600,
    border: `1px solid ${theme.palette.divider}`,
  },
  table: {
    minWidth: 650,
    borderCollapse: "collapse",
  },
  tableCell: {
    border: `1px solid ${theme.palette.divider}`,
  },
  interactionChip: {
    fontWeight: 500,
    textTransform: "capitalize",
    paddingLeft: 8,
    paddingRight: 8,
  },
  detailButton: {
    textTransform: "none",
    fontSize: "0.875rem",
  },
  ratingCell: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
}));

const getInteractionIcon = (type) => {
  const iconColor = getInteractionColor(type).color;
  switch (type) {
    case "view":
      return <VisibilityIcon fontSize="small" style={{ color: iconColor }} />;
    case "cart":
      return <ShoppingCartIcon fontSize="small" style={{ color: iconColor }} />;
    case "like":
      return <FavoriteIcon fontSize="small" style={{ color: iconColor }} />;
    case "review":
      return <StarIcon fontSize="small" style={{ color: iconColor }} />;
    case "purchase":
      return <PaymentIcon fontSize="small" style={{ color: iconColor }} />;
    default:
      return null;
  }
};

const getInteractionColor = (type) => {
  switch (type) {
    case "view":
      return {
        backgroundColor: "#e3f2fd",
        color: "#1976d2",
      };
    case "cart":
      return {
        backgroundColor: "#e1f5fe",
        color: "#0288d1",
      };
    case "like":
      return {
        backgroundColor: "#fce4ec",
        color: "#c2185b",
      };
    case "review":
      return {
        backgroundColor: "#fff3e0",
        color: "#f57c00",
      };
    case "purchase":
      return {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
      };
    default:
      return {
        backgroundColor: "#f5f5f5",
        color: "#616161",
      };
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const FavoritesContent = () => {
  const classes = useStyles();
  const history = useHistory();
  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  const currentUserId = userInfo?._id || "";

  const { data: userResponse, isLoading: loading, error } = useGetUserById(currentUserId);
  const interactionHistory = useMemo(() => {
    const raw =
      userResponse?.data?.user?.interaction_history ||
      userResponse?.data?.user?.interactionHistory ||
      [];

    return raw
      .map((interaction) => ({
        ...interaction,
        productId: interaction.productId || interaction.product_id || "",
        interactionType: interaction.interactionType || interaction.interaction_type || "",
      }))
      .filter((interaction) => interaction.productId && interaction.interactionType);
  }, [userResponse]);

  const sortedHistory = useMemo(() => {
    return [...interactionHistory].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [interactionHistory]);

  const handleViewProduct = (productId) => {
    history.push(`/product?id=${productId}`);
  };

  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography variant="h5" style={{ marginBottom: 24 }} className="tracking-widest">
        Interacted Products
      </Typography>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : !sortedHistory.length ? (
        <Message mt={8} severity="info">
          You haven't interacted with any products yet.
        </Message>
      ) : (
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>Action</TableCell>
                <TableCell className={classes.tableCell}>Interaction Type</TableCell>
                <TableCell className={classes.tableCell} align="center">Rating</TableCell>
                <TableCell className={classes.tableCell}>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedHistory.map((interaction) => (
                <TableRow key={interaction._id} hover>
                  <TableCell className={classes.tableCell}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleViewProduct(interaction.productId)}
                      className={classes.detailButton}
                      endIcon={<CallMadeIcon />}
                    >
                      View details
                    </Button>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Chip
                      icon={getInteractionIcon(interaction.interactionType)}
                      label={interaction.interactionType}
                      size="small"
                      className={classes.interactionChip}
                      style={getInteractionColor(interaction.interactionType)}
                    />
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center">
                    {interaction.rating !== null && interaction.rating !== undefined ? (
                      <Box className={classes.ratingCell}>
                        <StarIcon fontSize="small" style={{ color: "#ffc107" }} />
                        <Typography variant="body2">{interaction.rating}</Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell className={classes.tableCell}>{formatTimestamp(interaction.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default FavoritesContent;

