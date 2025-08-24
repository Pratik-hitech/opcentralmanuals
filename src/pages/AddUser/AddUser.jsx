import React, { useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { httpClient } from "../../utils/httpClientSetup"
import CompanyLogo from "../../assets/bluewheelerslogo-operationsmanuals.png";

const AddUser = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [searchParams] = useSearchParams();
//   const userId = searchParams.get("id");
 const userId = 2;
  const hash = searchParams.get("hash");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await httpClient.put(`users/${userId}`, { password, hash });
      console.log("API Response:", response);

      setSnackbar({
        open: true,
        message: "Password updated successfully!",
        severity: "success",
      });
      // optionally redirect to login page
    } catch (error) {
      console.error("Error updating password:", error);
      setSnackbar({
        open: true,
        message: "Failed to update password. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#eef2f7",
        p: 2,
      }}
    >
      {/* Outer container */}
      <Paper
        elevation={8}
        sx={{
          width: "70%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Left side (Full image background) */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${CompanyLogo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: { xs: "200px", md: "100%" },
          }}
        />

        {/* Right side (Content + Form) */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Your Email Has Been Verified 🎉
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 4, color: "text.secondary" }}
          >
            Please create a secure password to complete your account setup.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 400 }}>
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
        <IconButton
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          edge="end"
        >
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
              sx={{
                mt: 3,
                py: 1.3,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 3,
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar */}
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddUser;
