import React from "react";
import { Box } from "@mui/material";

const DropIndicator = ({ isOver }) => (
  <Box
    sx={{
      height: 2,
      backgroundColor: isOver ? "primary.main" : "transparent",
      margin: "4px 0",
      transition: "background-color 0.2s ease",
    }}
  />
);

export default DropIndicator;
