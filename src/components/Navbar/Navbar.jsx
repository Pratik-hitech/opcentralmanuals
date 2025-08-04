import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import banner from "../../assets/banner.jpg"
import Logo from "../../assets/logo.png"
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ...imports remain the same
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const openAdmin = Boolean(adminAnchorEl);
  const openProfile = Boolean(profileAnchorEl);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAdminClick = (event) => setAdminAnchorEl(event.currentTarget);
  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAdminAnchorEl(null);
    setProfileAnchorEl(null);
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#FFD700" : "#fff",
    textDecoration: "none",
    fontWeight: isActive ? "500" : "400",
  });

  const drawerMenu = (
   <Box sx={{ width: 250, background: "black", height: "100vh", color: "white" }}
     onClick={toggleDrawer(false)}
     onKeyDown={toggleDrawer(false)}
>
  <List>
    <ListItem button component={NavLink} to="/dashboard" style={navLinkStyle}>
      <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: "bold" }} />
    </ListItem>
    <ListItem button component={NavLink} to="/operations/manuals" style={navLinkStyle}>
      <ListItemText primary="Operations Manual" primaryTypographyProps={{ fontWeight: "bold" }} />
    </ListItem>
    <ListItem button component={NavLink} to="/reporting" style={navLinkStyle}>
      <ListItemText primary="Reporting" primaryTypographyProps={{ fontWeight: "bold" }} />
    </ListItem>

    <ListItem disableGutters>
      <ListItemText
        primary="Admin"
        primaryTypographyProps={{ fontWeight: "bold", pl: 2, pt: 1 }}
      />
    </ListItem>

    <ListItem button component={NavLink} to="/manage/news" style={navLinkStyle} sx={{ pl: 4 }}>
      <ListItemText primary="News Content" primaryTypographyProps={{ fontWeight: "bold" }} />
    </ListItem>
    <ListItem button component={NavLink} to="/manage/users" style={navLinkStyle} sx={{ pl: 4 }}>
      <ListItemText primary="User Management" primaryTypographyProps={{ fontWeight: "bold" }} />
    </ListItem>
    <ListItem button component={NavLink} to="/location" style={navLinkStyle} sx={{ pl: 4 }}>
      <ListItemText primary="Location Management" primaryTypographyProps={{ fontWeight: "bold" }} />
    </ListItem>
  </List>

  <Divider sx={{ my: 1, borderColor: "#444" }} />

  <List>
  <ListItem button>
    <ListItemText primary="System Settings" primaryTypographyProps={{ fontWeight: "bold" }} />
  </ListItem>
  <ListItem button>
    <ListItemText primary="Support" primaryTypographyProps={{ fontWeight: "bold" }} />
  </ListItem>
  <ListItem>
   <Button
  fullWidth
  onClick={handleLogout}
  variant="outlined"
  sx={{
    fontWeight: "bold",
    textTransform: "none",
    borderColor: "#FAF7F3",
    color: "#FAF7F3",
    "&:hover": {
      backgroundColor: "#FAF7F3",
      color: "black",
      borderColor: "#FAF7F3"
    }
  }}
>
  Logout
</Button>
  </ListItem>
</List>

</Box>


  );

  return (
    <>
      <Box sx={{ width: "100%", height: "100%", overflow: "hidden", mb: "0.1rem" }}>
        <img
          src={banner}
          alt="Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Logo */}
       <Link to="/dashboard" style={{ display: "inline-block" }}>   <Box
          
    component="img"
    src={Logo}
    alt="Logo"
    sx={{ height: 40, cursor: "pointer" }}
  />
  </Link>

          {/* Center & Right */}
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerMenu}
              </Drawer>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/dashboard"
                  style={navLinkStyle}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/operations/manuals"
                  style={navLinkStyle}
                >
                  Operations Manual
                </Button>
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/reporting/manuals"
                  style={navLinkStyle}
                >
                  Reporting
                </Button>
                <Button
                  color="inherit"
                  onClick={handleAdminClick}
                  endIcon={<ArrowDropDownIcon />}
                  component="span"
                >
                  Admin
                </Button>
                <Menu
                  id="admin-menu"
                  anchorEl={adminAnchorEl}
                  open={openAdmin}
                  onClose={handleClose}
                  PaperProps={{ onMouseLeave: handleClose }}
                  disableAutoFocusItem
                >
                  <MenuItem component={NavLink} to="/manage/news" onClick={handleClose}>
                    News Content
                  </MenuItem>
                  <MenuItem component={NavLink} to="/manage/users" onClick={handleClose}>
                    User Management
                  </MenuItem>
                  <MenuItem component={NavLink} to="/location" onClick={handleClose}>
                    Location Management
                  </MenuItem>
                </Menu>
              </Box>

              <IconButton color="inherit" onClick={handleProfileClick}>
                <AccountCircle sx={{ fontSize: 32 }} />
              </IconButton>
              <Menu anchorEl={profileAnchorEl} open={openProfile} onClose={handleClose}>
                <MenuItem onClick={handleClose}>System Settings</MenuItem>
                <MenuItem onClick={handleClose}>Support</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
