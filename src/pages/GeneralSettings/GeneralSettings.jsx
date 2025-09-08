// import React from "react";
// import { Outlet } from "react-router-dom";
// import { Link, useLocation } from "react-router-dom";
// import { Box, Paper, Tabs, Tab, styled, Container, Typography } from "@mui/material";

// const EqualWidthTab = styled(Tab)(({ theme }) => ({
//   flex: 1,
//   maxWidth: "none",
//   textTransform: "uppercase",
//   fontWeight: theme.typography.fontWeightMedium,
//   fontSize: "0.75rem",
//   padding: theme.spacing(1.8),
//   minHeight: "auto",
//   color: theme.palette.text.secondary,
//   "&.Mui-selected": {
//     color: theme.palette.text.primary,
//     fontWeight: theme.typography.fontWeightBold,
//     backgroundColor: theme.palette.action.selected,
//   },
//   "&:hover": {
//     backgroundColor: theme.palette.action.hover,
//   },
// }));

// const GeneralSettings = () => {
//   const location = useLocation();
//   const tabs = ["roles", "system", "security", "branding"];
//   const currentTab = tabs.includes(location.pathname.split("/").pop())
//     ? location.pathname.split("/").pop()
//     : "roles"; // Set 'roles' as default if path doesn't match any tab

//   return (
//     <Container maxWidth="lg" sx={{ py: 2 }}>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
//           General Settings
//         </Typography>
//       </Box>
      
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           mb: 3,
//         }}
//       >
//         <Paper
//           elevation={0}
//           sx={{
//             width: "100%",
//             maxWidth: 800, // Slightly wider to accommodate 4 tabs
//             bgcolor: "background.default",
//             borderRadius: 0,
//             borderBottom: "1px solid",
//             borderColor: "divider",
//           }}
//         >
//           <Tabs
//             value={currentTab}
//             variant="fullWidth"
//             indicatorColor="primary"
//             textColor="inherit"
//             sx={{
//               minHeight: "48px",
//               "& .MuiTabs-indicator": {
//                 height: 2,
//               },
//             }}
//           >
//             <EqualWidthTab
//               label="Roles"
//               value="roles"
//               component={Link}
//               to="./roles"
//             />
//             <EqualWidthTab
//               label="System"
//               value="system"
//               component={Link}
//               to="./system"
//             />
//             <EqualWidthTab
//               label="Security"
//               value="security"
//               component={Link}
//               to="./security"
//             />
//             <EqualWidthTab
//               label="Branding"
//               value="branding"
//               component={Link}
//               to="./branding"
//             />
//           </Tabs>
//         </Paper>
//       </Box>

//       <Box sx={{ p: 2 }}>
//         <Outlet />
//       </Box>
//     </Container>
//   );
// };

// export default GeneralSettings;



import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { Box, Paper, Tabs, Tab, styled, Container, Typography } from "@mui/material";
import { usePermission } from "../../context/PermissionsContext"
import PermissionDenied from "../../components/PermissionDenied/PermissionDenied";


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

const GeneralSettings = () => {
  const location = useLocation();
  const { hasPermission, isAdmin } = usePermission();
  const tabs = ["roles", "system", "security", "branding"];
  const currentTab = tabs.includes(location.pathname.split("/").pop())
    ? location.pathname.split("/").pop()
    : "roles";

  // Check if user has permission to access general settings
  // Admins automatically have access, otherwise check manage_system_setting permission
  const canAccessSettings = isAdmin() || hasPermission('manage_system_setting');

  return (
    <Container maxWidth="fit-content" sx={{ py: 0 }}>
      <Box sx={{ mb: 0 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          General Settings
        </Typography>
      </Box>
      
      {canAccessSettings ? (
        <>
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
                maxWidth: 800,
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
                  label="Roles"
                  value="roles"
                  component={Link}
                  to="./roles"
                  disabled={!isAdmin() && !hasPermission('manage_users')}
                />
                {/* <EqualWidthTab
                  label="System"
                  value="system"
                  component={Link}
                  to="./system"
                  disabled={!isAdmin() && !hasPermission('manage_system_setting')}
                /> */}
                {/* <EqualWidthTab
                  label="Security"
                  value="security"
                  component={Link}
                  to="./security"
                  disabled={!isAdmin() && !hasPermission('manage_system_setting')}
                /> */}
                {/* <EqualWidthTab
                  label="Branding"
                  value="branding"
                  component={Link}
                  to="./branding"
                  disabled={!isAdmin() && !hasPermission('manage_system_setting')}
                /> */}
              </Tabs>
            </Paper>
          </Box>

          <Box sx={{ p: 2 }}>
            <Outlet />
          </Box>
        </>
      ) : (
        // <PermissionDenied message = "You don't have permission to access this section."/>
        <PermissionDenied />
      )}
    </Container>
  );
};

export default GeneralSettings;