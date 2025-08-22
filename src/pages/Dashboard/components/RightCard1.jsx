// import { Box, Paper, Typography, IconButton, Divider, Grid,Menu,MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import MenuBookIcon from "@mui/icons-material/MenuBook";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// function QuickLinksCard() {

//    const [anchorEl, setAnchorEl] = useState(null);
//   const navigate = useNavigate();
//   const open = Boolean(anchorEl);

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleMenuItemClick = (path) => {
//     handleClose();
//     navigate(path); // Go to the specified route
//   };
//   return (
//     <Paper
//       elevation={2}
//       sx={{
//         padding: 2,
//         borderRadius: 2,
//         boxSizing: "border-box",
//       }}
//     >
//       {/* Header Row */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 1,
//         }}
//       >
//         <Typography variant="subtitle1" fontWeight="bold">
//           QUICK LINKS
//         </Typography>
//         <IconButton size="small" onClick={handleMenuClick}>
//           <MoreVertIcon />
//         </IconButton>

//             <Menu
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <MenuItem onClick={() => handleMenuItemClick("/admin/news/edit")}>
//         Manage Quick Links 
//           </MenuItem>
//           <MenuItem onClick={() => handleMenuItemClick("/admin/news/delete")}>
//             Manage Widget Title
//           </MenuItem>
//         </Menu>
//       </Box>

//       <Divider sx={{ mb: 2 }} />

//       {/* Link Grid */}
//       <Grid container spacing={2} justifyContent="center">
//         <Grid item xs={6} sm={6}>
//           <Box
//            component={Link}
//                 to="/operations/manuals/docs"
//             sx={{
              
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               padding: 1.5,
//               borderRadius: 2,
//               border: "1px solid #ddd",
//               textDecoration: "none",     
//     color: "inherit",     
//             }}
//           >
//             <MenuBookIcon sx={{ color: "#d8d80e", fontSize: 40 }} />
//             <Typography
//               variant="body2"
//               sx={{ mt: 1, fontWeight: 500, textAlign: "center" }}
//             >
//               Operations Manual
//             </Typography>
//           </Box>
//         </Grid>

//         <Grid item xs={6} sm={6}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               padding: 1.5,
//                 px:3.7,
//               borderRadius: 2,
//               border: "1px solid #ddd",
//             }}
//           >
//             <HelpOutlineIcon sx={{ color: "#d8d80e", fontSize: 40 }} />
//             <Typography
//               variant="body2"
//               sx={{ mt: 1, fontWeight: 500, textAlign: "center" }}
//             >
//               System Help
//             </Typography>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// }

// export default QuickLinksCard;

import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext" // 

function QuickLinksCard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const { user } = useAuth(); // get logged-in user info

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    handleClose();
    navigate(path); // Navigate to selected route
  };

  const handleSystemHelpClick = () => {
    const fromEmail = user?.email || "";
    window.location.href = `mailto:office@bluewheelers.com.au?from=${encodeURIComponent(fromEmail)}`;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: 2,
        borderRadius: 2,
        boxSizing: "border-box",
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          QUICK LINKS
        </Typography>
        {/* <IconButton size="small" onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton> */}

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => handleMenuItemClick("/admin/news/edit")}>
            Manage Quick Links
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/admin/news/delete")}>
            Manage Widget Title
          </MenuItem>
        </Menu>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Link Grid */}
      <Grid container spacing={2} justifyContent="center">
        {/* Operations Manual Link */}
        <Grid item xs={6} sm={6}>
          <Box
            component={Link}
            to="/operations/manuals/docs"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 1.5,
              borderRadius: 2,
              border: "1px solid #ddd",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <MenuBookIcon sx={{ color: "#d8d80e", fontSize: 40 }} />
            <Typography
              variant="body2"
              sx={{ mt: 1, fontWeight: 500, textAlign: "center" }}
            >
              Operations Manual
            </Typography>
          </Box>
        </Grid>

        {/* System Help Email */}
        <Grid item xs={6} sm={6}>
          <Box
            onClick={handleSystemHelpClick}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 1.5,
              px: 3.7,
              borderRadius: 2,
              border: "1px solid #ddd",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                transform: "scale(1.03)",
              },
            }}
          >
            <HelpOutlineIcon sx={{ color: "#d8d80e", fontSize: 40 }} />
            <Typography
              variant="body2"
              sx={{ mt: 1, fontWeight: 500, textAlign: "center" }}
            >
              System Help
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default QuickLinksCard;


