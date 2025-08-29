// import React from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   IconButton,
//   Grid,
// } from "@mui/material";
// import { Divider } from '@mui/material';
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ScatterChart,
//   Scatter,
// } from "recharts";
// import { Outlet } from "react-router-dom";
// import { NavLink } from "react-router-dom";
// import ReportingOpManuals from "./components/ReportingOpManuals";





// export default function Reporting() {
//   return (
//     <Box p={5} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
//       <Grid container spacing={3}>
//         <Grid item size={{xs:12,md:4}}>
//           <Card sx={{ height: "max-content" }}>
//             <CardContent>
            
//               <Typography variant="subtitle2" fontWeight="bold" fontSize={16} gutterBottom>
//                 MODULE REPORTING
//               </Typography>

//               <Divider sx={{ my: 2 }} /> 
//               <NavLink to="./manuals"  style={({ isActive }) => ({
//     textDecoration: 'none',
//     color: 'inherit',
//   })}>
//                {({ isActive }) => (
//     <Box
//       display="flex"
//       alignItems="center"
//       justifyContent="space-between"
//       p={1}
//       bgcolor={isActive ? '#eeeeee':'transparent'  } // active vs default bg
//       borderRadius={1}
//       mb={1}
//       sx={{
//         '&:hover': {
//           backgroundColor: '#e0e0e0',
//         },
//       }}
//     >
//       <Typography fontSize={15}>Operations Manuals</Typography>
//       <ChevronRightIcon fontSize="small" />
//     </Box>
//   )}
// </NavLink>

//            <NavLink to="./news" style={({ isActive }) => ({
//     textDecoration: 'none',
//     color: 'inherit',
//   })}>
//               {({ isActive }) => (
//     <Box
//       display="flex"
//       alignItems="center"
//       justifyContent="space-between"
//       p={1}
//       bgcolor={isActive ? '#eeeeee':'transparent'  } // different default bg
//       borderRadius={1}
//       sx={{
//         '&:hover': {
//           backgroundColor: '#f5f5f5ed',
//         },
//       }}
//     >
//       <Typography fontSize={15}>News</Typography>
//       <ChevronRightIcon fontSize="small" />
//     </Box>
//   )}
// </NavLink>
//             </CardContent>
//           </Card>
          
//         </Grid>
//  <Outlet />
//       </Grid>
      
//     </Box>
    
//   );
// }


import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Reporting() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract current active tab from URL
  const currentPath = location.pathname.split("/").pop();
  const tabValue = currentPath === "news" ? 1 : 0; // Default to manuals

  const handleTabChange = (_, newValue) => {
    if (newValue === 0) {
      navigate("./manuals");
    } else if (newValue === 1) {
      navigate("./news");
    }
  };

  return (
    <Box p={5} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Stack
        direction={{ xs: "column", md: "row" }} // Stack vertically on small, side-by-side on medium+
        spacing={3} // Gap between sidebar & content
      >
        {/* LEFT SIDE CARD */}
        <Card
          sx={{
            width: { xs: "100%", md: 280 }, // Full width on mobile, fixed on desktop
            height: "max-content",
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              fontSize={16}
              gutterBottom
            >
              MODULE REPORTING
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Tabs Menu */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              orientation="vertical"
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  textAlign: "left",
                  alignItems: "flex-start",
                  fontSize: "15px",
                  fontWeight: 500,
                  textTransform: "none",
                  color: "#555",
                  borderRadius: 1,
                  padding: "8px 12px",
                },
                "& .Mui-selected": {
                  backgroundColor: "#eeeeee",
                  color: "#000",
                  fontWeight: "bold",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#1976d2",
                  width: "4px",
                  borderRadius: "4px",
                  left: 0,
                },
              }}
            >
              <Tab label="Operations Manuals" />
              <Tab label="News" />
            </Tabs>
          </CardContent>
        </Card>

        {/* RIGHT SIDE CONTENT */}
        <Box flex={1}>
          <Outlet />
        </Box>
      </Stack>
    </Box>
  );
}
