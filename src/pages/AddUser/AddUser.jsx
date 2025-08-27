import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { httpClient } from "../../utils/httpClientSetup";
import { publicClient } from "../../utils/publicClient";
import CompanyLogo from "../../assets/bluewheelerslogo-operationsmanuals.png";

const AddUser = () => {
  const { id: userId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!userId || !token) {
        setSnackbar({
          open: true,
          message: "Missing user ID or token.",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      try {
        const payload = { id: userId, token };
        const { data } = await publicClient.post("users/validate-token", payload);

        if (data.success) {
          setTokenValid(true);
        } else {
          setSnackbar({
            open: true,
            message: data.message || "Invalid token.",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Token validation failed.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!tokenValid) return;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const payload = {
        id: userId,
        token,
        password,
        password_confirmation: confirmPassword,
      };

      const { data } = await publicClient.post("/users/set-password", payload);

      if (data.success) {
        setSnackbar({
          open: true,
          message: "Password updated successfully!",
          severity: "success",
        });

        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Failed to update password.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Something went wrong. Please try again.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!tokenValid) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Invalid or expired token. Please check your email link.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#eef2f7",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          overflow: "hidden",
          p: { xs: 3, sm: 4 },
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box component="img" src={CompanyLogo} alt="Logo" sx={{ width: "160px" }} />
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Create Your Password 🔐
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please create a secure password to complete your account setup.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {errorMessage && (
            <Typography color="error" sx={{ mt: 1, mb: 1 }}>
              {errorMessage}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.3, fontSize: "1rem", fontWeight: "bold", borderRadius: 3 }}
          >
            Submit
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddUser;
