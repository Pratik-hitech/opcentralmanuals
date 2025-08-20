import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import GeneralSystem from "./GeneralSystem";
import SystemPermissions from "./SystemPermissions";

const System = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Paper
      sx={{
        width: { xs: "95%", sm: "90%", md: "80%" },
        minHeight: 400,
        mx: "auto",
        mt: 0,
        p: 3,
        border: "1px solid rgba(0,0,0,0.2)", // slightly darker border
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)", // subtle shadow
        borderRadius: 2,
      }}
    >
      {/* Title */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        System Settings
      </Typography>

      {/* Horizontal Tabs with equal width */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        <Tab label="General" sx={{ flex: 1 }} />
        <Tab label="Permissions" sx={{ flex: 1 }} />
      </Tabs>

      {/* Content below tabs */}
      <Box sx={{ p: 2 }}>
        {selectedTab === 0 && <GeneralSystem />}
        {selectedTab === 1 && <SystemPermissions />}
      </Box>
    </Paper>
  );
};

export default System;
