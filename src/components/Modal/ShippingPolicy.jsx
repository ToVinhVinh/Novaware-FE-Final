import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
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
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
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
    background: "linear-gradient(90deg, #FEF5F7, #e0f2fe)",
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
  introText: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  highlightChip: {
    marginTop: theme.spacing(2),
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
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
    backgroundColor: "#fffbeb",
    border: "1px solid #facc15",
    fontSize: 13,
    color: "#92400e",
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

const ShippingPolicy = ({ open, onClose }) => {
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
            <LocalShippingIcon className={classes.titleIcon} />
          </Box>
          <Box>
            <Typography variant="h6">Shipping Policy</Typography>
            <Typography variant="caption" color="textSecondary">
              Fast, safe & reliable delivery with NovaWare
            </Typography>
          </Box>
        </Box>
        <IconButton aria-label="close" onClick={onClose} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className={classes.contentRoot}>
        <Typography variant="body1" className={classes.introText} gutterBottom>
          NovaWare is committed to delivering fast and accurate shipping services for all orders,
          ensuring a smooth and delightful shopping experience.
        </Typography>
        <Typography variant="body1" className={classes.introText} gutterBottom>
          Currently, NovaWare collaborates with the reputable logistics partner{" "}
          <strong>GIAO HÀNG TIẾT KIỆM</strong> to support nationwide and international shipping with
          the following policies:
        </Typography>

        <Chip
          label="Nationwide delivery • Reliable partner • Real-time tracking"
          size="small"
          className={classes.highlightChip}
        />

        <Box className={classes.sectionTitle}>
          <span className={classes.sectionDot} />
          <Typography variant="subtitle1">Delivery Time</Typography>
        </Box>

        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  <strong>For Da Nang City</strong>
                </TableCell>
                <TableCell>
                  Express delivery within <strong>4h to 24h</strong> for pre-order items
                  (excluding Sundays and public holidays).
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  <strong>For Other Provinces / Cities</strong>
                </TableCell>
                <TableCell>
                  Standard delivery within <strong>3–4 days</strong> (excluding Sundays and public
                  holidays).
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box className={classes.noteBox}>
          <Typography variant="body2">
            <strong>Note:</strong> Delivery times may be extended by{" "}
            <strong>3–5 days</strong> during major sale events or peak seasons.
          </Typography>
        </Box>

        <Box className={classes.sectionTitle}>
          <span className={classes.sectionDot} />
          <Typography variant="subtitle1">Delivery Attempts</Typography>
        </Box>

        <Typography variant="body1" className={classes.bulletText} gutterBottom>
          • Shipper will attempt delivery a maximum of <strong>3 times</strong> for each order.
        </Typography>
        <Typography variant="body1" className={classes.bulletText} gutterBottom>
          • In case a delivery attempt fails, the shipper will reschedule for up to{" "}
          <strong>2 additional attempts</strong>, giving you a total of <strong>3 chances</strong> to
          receive your parcel.
        </Typography>
        <Typography variant="body1" className={classes.bulletText} gutterBottom>
          • In case of unforeseen circumstances (natural disasters, major external events, etc.),
          delivery time may change without prior notice.
        </Typography>

        <Divider className={classes.divider} />

        <Box className={classes.sectionTitle}>
          <span className={classes.sectionDot} />
          <Typography variant="subtitle1">Order Status Tracking</Typography>
        </Box>

        <Typography variant="body1" className={classes.bulletText} gutterBottom>
          • You can track your order directly via the <strong>“My Orders”</strong> section on
          NovaWare.
        </Typography>
        <Typography variant="body1" className={classes.bulletText} gutterBottom>
          • For more support, please contact NovaWare customer service via{" "}
          <strong>Fanpage, Instagram</strong>, or our <strong>hotline</strong>.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingPolicy;
