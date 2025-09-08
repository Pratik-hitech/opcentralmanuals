import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  styled,
  Container,
  Typography,
} from "@mui/material";

const EqualWidthTab = styled(Tab)(({ theme }) => ({
  flex: 1,
  maxWidth: "none",
  textTransform: "uppercase",
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: "0.75rem",
  padding: theme.spacing(1.8),
  minHeight: "auto",
  color: theme.palette.text.secondary,
  borderRadius: "6px", // Rounded corners for better UI
  margin: theme.spacing(0, 0.5), // <-- Added small gap between tabs
  "&.Mui-selected": {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
    backgroundColor: theme.palette.action.selected,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Loggedinprofile = () => {
  const location = useLocation();

  // Get current tab from URL
  const pathParts = location.pathname.split("/");
  const currentTab = pathParts[pathParts.length - 1];

  // List of valid tabs
  const validTabs = ["user", "useractivity"];
  const activeTab = validTabs.includes(currentTab) ? currentTab : "user";

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h6" mb={2}>
        User Profile
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            width: "80%",
            maxWidth: "none",
            bgcolor: "background.default",
            borderRadius: 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tabs
            value={activeTab}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="inherit"
            sx={{
              minHeight: "48px",
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px",
              },
            }}
          >
            <EqualWidthTab
              label="Personal Details"
              value="user"
              component={Link}
              to={`/profile/user`}
            />
            <EqualWidthTab
              label="Activity Log"
              value="useractivity"
              component={Link}
              to={`/profile/useractivity`}
            />
          </Tabs>
        </Paper>
      </Box>

      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default Loggedinprofile;
