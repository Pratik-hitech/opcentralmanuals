import React from "react";
import { Modal, CircularProgress, Box } from "@mui/material";

const LoadingModal = () => (
  <Modal
    open={true}
    disableAutoFocus
    BackdropProps={{
      sx: {
        backgroundColor: "rgba(0, 0, 0, 0.05)", // Very light and transparent
      },
    }}
    sx={{
      // Remove default focus outline
      outline: "none",
    }}
  >
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress 
        sx={{
          color: "primary.main", // Use your theme's primary color
          // Optional: make the spinner slightly smaller
          width: "40px !important",
          height: "40px !important",
        }}
      />
    </Box>
  </Modal>
);

export default LoadingModal;