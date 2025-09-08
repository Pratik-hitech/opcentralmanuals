import React from "react";
import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
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

const EditNews = () => {
  const location = useLocation();
  // Set 'details' as default if path doesn't match either tab
  const currentTab = ["details", "permissions"].includes(
    location.pathname.split("/").pop()
  )
    ? location.pathname.split("/").pop()
    : "details";

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 600,
            bgcolor: "background.default",
            borderRadius: 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tabs
            value={currentTab}
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
              label="Details"
              value="details"
              component={Link}
              to="./details"
            />
            {/* <EqualWidthTab
              label="Permissions"
              value="permissions"
              component={Link}
              to="./permissions"
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

export default EditNews;