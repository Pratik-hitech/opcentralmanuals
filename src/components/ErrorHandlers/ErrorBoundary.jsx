// src/components/ErrorBoundary.jsx
import React from "react";
import { FallbackProps } from "react-error-boundary";
import { Box, Typography, Button } from "@mui/material";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Something went wrong!
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {error.message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={resetErrorBoundary}
      >
        Try Again
      </Button>
    </Box>
  );
};

export default ErrorFallback;
