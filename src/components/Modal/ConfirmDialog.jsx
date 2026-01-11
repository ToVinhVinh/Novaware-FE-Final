import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    makeStyles,
    Box,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    dialog: {
        "& .MuiDialog-paper": {
            borderRadius: 12,
            minWidth: 400,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        },
    },
    dialogTitle: {
        padding: "16px 16px 12px 16px",
        borderBottom: "1px solid #ccc",
        "& .MuiTypography-root": {
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "#F50057",
        },
    },
    dialogContent: {
        padding: "8px 16px 24px 16px",
    },
    messageText: {
        color: "#333",
        fontSize: "1rem",
        lineHeight: 1.5,
    },
    dialogActions: {
        padding: "16px",
        gap: theme.spacing(1),
    },
    cancelButton: {
        textTransform: "none",
        borderRadius: 6,
        padding: "8px 24px",
        backgroundColor: "#f5f5f5",
        borderColor: "#ccc",
        color: "#666",
        border: "1px solid #ccc",
        "&:hover": {
            backgroundColor: "#eeeeee",
            borderColor: "#bbb",
        },
    },
    confirmButton: {
        textTransform: "none",
        borderRadius: 6,
        padding: "8px 24px",
        boxShadow: "none",
        "&:hover": {
            boxShadow: "0 4px 12px rgba(245, 0, 87, 0.2)",
        },
    },
}));

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "secondary",
    loading = false,
    icon: Icon = null,
}) => {
    const classes = useStyles();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className={classes.dialog}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle className={classes.dialogTitle}>
                <Typography variant="h6">{title}</Typography>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="body1" className={classes.messageText}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    className={classes.cancelButton}
                    disabled={loading}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    className={classes.confirmButton}
                    disabled={loading}
                    startIcon={Icon ? <Icon /> : null}
                    style={{
                        backgroundColor: confirmColor === "secondary" ? "#F50057" : undefined,
                        color: confirmColor === "secondary" ? "#fff" : undefined,
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;

