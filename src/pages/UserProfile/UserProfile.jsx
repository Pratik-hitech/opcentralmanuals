import React from "react";
import { Outlet, useLocation, Link, useParams } from "react-router-dom";
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
  "&.Mui-selected": {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
    backgroundColor: theme.palette.action.selected,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserProfile = () => {
  const location = useLocation();
  const { userid } = useParams(); // Changed from id to userid to match route param

  // Get current tab from URL
  const pathParts = location.pathname.split('/');
  const currentTab = pathParts[pathParts.length - 1];
  const validTabs = ["activitylog", "filemanager", "opmanuals"];
  const activeTab = validTabs.includes(currentTab) ? currentTab : "";

  if (!userid) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h6" color="error">
          No user selected
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h6" mb={2}>
        {/* User Profile - ID: {userid} */}
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
                height: 2,
              },
            }}
          >
            <EqualWidthTab
              label="Personal Details"
              value=""
              component={Link}
              to={`/users/profile/${userid}`}
            />
            <EqualWidthTab
              label="Activity Log"
              value="activitylog"
              component={Link}
              to={`/users/profile/${userid}/activitylog`}
            />
            {/* <EqualWidthTab
              label="File Manager"
              value="filemanager"
              component={Link}
              to={`/users/profile/${userid}/filemanager`}
            /> */}
            {/* <EqualWidthTab
              label="Op Manuals"
              value="opmanuals"
              component={Link}
              to={`/users/profile/${userid}/opmanuals`}
            /> */}
          </Tabs>
        </Paper>
      </Box>

      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default UserProfile;