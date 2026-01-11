import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Box,
  Chip,
  Divider,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ReplayIcon from "@material-ui/icons/Replay";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  titleRoot: {
    padding: theme.spacing(2.5, 3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(90deg, #FEF5F7, #fee2e2)",
  },
  titleText: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    fontWeight: 600,
    letterSpacing: 1,
  },
  titleIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: "999px",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  titleIcon: {
    color: theme.palette.secondary.main,
    fontSize: 20,
  },
  closeButton: {
    color: theme.palette.grey[600],
    "&:hover": {
      color: theme.palette.secondary.main,
      backgroundColor: "rgba(0,0,0,0.04)",
    },
  },
  contentRoot: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
  introTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  introText: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  highlightChip: {
    marginTop: theme.spacing(2),
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontWeight: 600,
    borderRadius: 999,
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: theme.palette.secondary.main,
    marginRight: theme.spacing(1.5),
  },
  tableContainer: {
    marginTop: theme.spacing(1),
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(15,23,42,0.05)",
    overflow: "hidden",
  },
  tableHeaderCell: {
    backgroundColor: "#f9fafb",
    fontWeight: 600,
  },
  noteBox: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    border: "1px solid #60a5fa",
    fontSize: 13,
    color: "#1d4ed8",
  },
  bulletText: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
  },
}));

const ReturnPolicy = ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="policy-dialog-title"
      maxWidth="md"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle id="policy-dialog-title" disableTypography className={classes.titleRoot}>
        <Box className={classes.titleText}>
          <Box className={classes.titleIconWrapper}>
            <ReplayIcon className={classes.titleIcon} />
          </Box>
          <Box>
            <Typography variant="h6">Return & Exchange Policy</Typography>
            <Typography variant="caption" color="textSecondary">
              Hassle-free returns & flexible exchanges
            </Typography>
          </Box>
        </Box>
        <IconButton aria-label="close" onClick={onClose} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className={classes.contentRoot}>
        <Typography variant="subtitle1" className={classes.introTitle}>
          1. Conditions for Exchange (Applicable across the NovaWare system)
        </Typography>
        <Typography variant="body1" className={classes.introText} gutterBottom>
          • Exchange is applicable for all products if the item remains in its original condition,
          with tags attached, unused, and undamaged.
        </Typography>
        <Typography variant="body1" className={classes.introText} gutterBottom>
          • Only one exchange is allowed per order. The exchanged product must have an equivalent or
          higher value. Please pay the price difference if applicable.
        </Typography>
        <Typography variant="body1" className={classes.introText} gutterBottom>
          • For refunds caused by order issues, NovaWare will process the refund within{" "}
          <strong>48 working hours</strong> after receiving your request.
        </Typography>

        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  <strong>Clothing Products</strong>
                </TableCell>
                <TableCell>
                  Exchange period: <strong>14 days</strong> from the date the customer receives the
                  parcel.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  <strong>Accessories</strong>
                </TableCell>
                <TableCell>
                  Exchange period: <strong>30 days</strong> from the date the customer receives the
                  parcel.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box className={classes.noteBox}>
          <Typography variant="body2">
            <strong>Note:</strong> If the product is missing its tag, you must provide feedback
            within <strong>1 day</strong> after receipt. Beyond this time, NovaWare will not process
            the exchange. Please provide clear evidence (photos, videos) of the issue so we can
            validate your request.
          </Typography>
        </Box>

        <Box className={classes.sectionTitle}>
          <span className={classes.sectionDot} />
          <Typography variant="subtitle1">2. On‑Site Exchange Service</Typography>
        </Box>

        <Typography variant="body1" className={classes.bulletText} gutterBottom>
          • This service allows a shipper to visit your address for the exchange.
        </Typography>
        <Typography variant="body1" className={classes.bulletText} gutterBottom>
          • Only <strong>one</strong> on‑site exchange is allowed per order.
        </Typography>

        <Divider className={classes.divider} />

        <Box className={classes.sectionTitle}>
          <span className={classes.sectionDot} />
          <Typography variant="subtitle1">3. Shipping Fees</Typography>
        </Box>

        <Typography variant="body1" className={classes.bulletText} gutterBottom>
          a. <strong>Shipping fees supported by NovaWare:</strong>
        </Typography>

        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  <strong>Size mismatch</strong>
                </TableCell>
                <TableCell>NovaWare covers <strong>100%</strong> of the shipping fee.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  <strong>Exchange for a different product</strong>
                </TableCell>
                <TableCell>NovaWare supports <strong>1‑way</strong> shipping fee.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  <strong>Faulty / defective product</strong>
                </TableCell>
                <TableCell>NovaWare supports <strong>2‑way</strong> shipping fee.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="body1" className={classes.bulletText} gutterBottom style={{ marginTop: 12 }}>
          b. <strong>Shipping fees not covered by NovaWare:</strong>
        </Typography>
        <Typography variant="body1" className={classes.bulletText} gutterBottom>
          • For discounted or promotional items, customers are responsible for all shipping fees.
        </Typography>

        <Chip
          label="Transparent policy • Fair support • Customer‑first experience"
          size="small"
          className={classes.highlightChip}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReturnPolicy;
