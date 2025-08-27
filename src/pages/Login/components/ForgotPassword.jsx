import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { publicClient } from "../../../utils/publicClient"

export default function ForgotPassword({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const emailInputRef = useRef(null);

  // ✅ Automatically focus email input when modal opens
  useEffect(() => {
    if (open && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current.focus();
      }, 150);
    }
  }, [open]);

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setSnackbar({
        open: true,
        message: "Please enter your email",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await publicClient.post("/users/forgot-password", formData);

      if (response.data?.success) {
        setSnackbar({
          open: true,
          message:
            response.data.message ||
            "Password reset link sent to your email!",
          severity: "success",
        });
        setEmail("");
        onClose();
      } else {
        throw new Error(response.data?.message || "Something went wrong");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to send reset link",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Enter your registered email to receive a password reset link.
          </Typography>

          <TextField
            inputRef={emailInputRef} // ✅ Focus input automatically
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
