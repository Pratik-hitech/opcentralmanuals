// components/LoadingModal.jsx
import React from "react";
import { Modal, CircularProgress, Box } from "@mui/material";

const LoadingModal = () => (
  <Modal open={true} disableAutoFocus>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
  </Modal>
);

export default LoadingModal;
