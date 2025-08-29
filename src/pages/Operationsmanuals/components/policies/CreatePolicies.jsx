import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Paper, Tabs, Tab, styled, Container } from "@mui/material";

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

const CreatePolicies = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the current tab from URL
  const pathSegments = location.pathname.split("/");
  const currentTab = pathSegments[pathSegments.length - 1];

  // Define valid tabs
  const validTabs = ["details", "permissions", "verification"];

  // Redirect to details if no valid tab is active
  React.useEffect(() => {
    if (!validTabs.includes(currentTab)) {
      navigate("details", { replace: true });
    }
  }, [currentTab, navigate]);

  return (
    <Container maxWidth={false} sx={{ py: 2, px: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            width: "70%",
            bgcolor: "background.default",
            borderRadius: 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tabs
            value={validTabs.includes(currentTab) ? currentTab : "details"}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="inherit"
            sx={{
              minHeight: "48px",
              "& .MuiTabs-indicator": { height: 2 },
            }}
          >
            <EqualWidthTab
              label="Details"
              value="details"
              component={Link}
              to="details"
            />
            <EqualWidthTab
              label="Permissions"
              value="permissions"
              component={Link}
              to="permissions"
            />
            <EqualWidthTab
              label="Verification"
              value="verification"
              component={Link}
              to="verification"
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

export default CreatePolicies;
