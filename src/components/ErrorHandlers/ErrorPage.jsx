// src/pages/ErrorPage.jsx
import React from "react";
import { useRouteError } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  const status = error?.status || 500;
  const message =
    error?.statusText || error?.message || "Something went wrong.";

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
        {status}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default ErrorPage;
