


// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   IconButton,
//   Button,
//   Menu,
//   MenuItem,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   useMediaQuery,
//   TextField,
//   InputAdornment,
//   Badge,
//   Avatar,
//   Stack,
//   ListItemIcon,
//   CircularProgress
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import CloseIcon from "@mui/icons-material/Close";
// import { useTheme } from "@mui/material/styles";
// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import banner from "../../assets/banner.jpg";
// import Logo from "../../assets/logo.png";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import { httpClient } from "../../utils/httpClientSetup";

// const Navbar = () => {
//   const { logout, user } = useAuth();
//   const [adminAnchorEl, setAdminAnchorEl] = useState(null);
//   const [profileAnchorEl, setProfileAnchorEl] = useState(null);
//   const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [notifications, setNotifications] = useState([]);
//   const [loadingNotifications, setLoadingNotifications] = useState(false);
//   const [initialLoad, setInitialLoad] = useState(true);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const navigate = useNavigate();

//   const openAdmin = Boolean(adminAnchorEl);
//   const openProfile = Boolean(profileAnchorEl);
//   const openNotifications = Boolean(notificationsAnchorEl);

//   // Calculate notification count from state
//   const notificationCount = notifications.filter(n => !n.read_at).length;

//   // Fetch notifications on initial load and when menu opens
//   useEffect(() => {
//     if (user?.id && (initialLoad || openNotifications)) {
//       fetchNotifications();
//     }
//   }, [user?.id, openNotifications, initialLoad]);

//   const fetchNotifications = async () => {
//     try {
//       setLoadingNotifications(true);
//       const response = await httpClient.get(`/notifications?user_id=${user.id}`);
//       if (response.data.success) {
//         setNotifications(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoadingNotifications(false);
//       setInitialLoad(false);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     try {
//       // Optimistically update UI
//       setNotifications(prevNotifications => 
//         prevNotifications.map(n => 
//           n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
//         )
//       );
      
//       // Call API (when it's ready)
//       // await httpClient.put(`/notifications/${notificationId}/read`);
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//       // Rollback on error
//       setNotifications(prevNotifications => 
//         prevNotifications.map(n => 
//           n.id === notificationId ? { ...n, read_at: null } : n
//         )
//       );
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleAdminClick = (event) => setAdminAnchorEl(event.currentTarget);
//   const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
//   const handleNotificationsClick = (event) => {
//     setNotificationsAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAdminAnchorEl(null);
//     setProfileAnchorEl(null);
//     setNotificationsAnchorEl(null);
//   };

//   const toggleDrawer = (open) => () => setDrawerOpen(open);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery("");
//     }
//   };

//   const navLinkStyle = ({ isActive }) => ({
//     color: isActive ? "#FFD700" : "#fff",
//     textDecoration: "none",
//     fontWeight: isActive ? "500" : "400",
//   });

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'success':
//         return <CheckCircleOutlineIcon color="success" />;
//       case 'error':
//         return <ErrorOutlineIcon color="error" />;
//       default:
//         return <InfoOutlinedIcon color="info" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const drawerMenu = (
//     <Box sx={{ 
//       width: 250, 
//       background: "black", 
//       height: "100vh", 
//       color: "white",
//       display: "flex",
//       flexDirection: "column"
//     }}>
//       <Box sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         p: 2,
//         borderBottom: "1px solid #444"
//       }}>
//         <Typography variant="subtitle1" sx={{ color: "white" }}>
//           Hi, {user?.first_name || 'User'}
//         </Typography>
//         <IconButton onClick={toggleDrawer(false)} sx={{ color: "white" }}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <List sx={{ flexGrow: 1 }}>
//         <ListItem button component={NavLink} to="/dashboard" style={navLinkStyle}>
//           <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: "bold" }} />
//         </ListItem>
//         <ListItem button component={NavLink} to="/operations/manuals" style={navLinkStyle}>
//           <ListItemText primary="Operations Manual" primaryTypographyProps={{ fontWeight: "bold" }} />
//         </ListItem>
//         <ListItem button component={NavLink} to="/reporting" style={navLinkStyle}>
//           <ListItemText primary="Reporting" primaryTypographyProps={{ fontWeight: "bold" }} />
//         </ListItem>

//         <ListItem disableGutters>
//           <ListItemText
//             primary="Admin"
//             primaryTypographyProps={{ fontWeight: "bold", pl: 2, pt: 1 }}
//           />
//         </ListItem>

//         <ListItem button component={NavLink} to="/manage/news" style={navLinkStyle} sx={{ pl: 4 }}>
//           <ListItemText primary="News Content" primaryTypographyProps={{ fontWeight: "bold" }} />
//         </ListItem>
//         <ListItem button component={NavLink} to="/manage/users" style={navLinkStyle} sx={{ pl: 4 }}>
//           <ListItemText primary="User Management" primaryTypographyProps={{ fontWeight: "bold" }} />
//         </ListItem>
//         <ListItem button component={NavLink} to="/location" style={navLinkStyle} sx={{ pl: 4 }}>
//           <ListItemText primary="Location Management" primaryTypographyProps={{ fontWeight: "bold" }} />
//         </ListItem>
//       </List>

//       <Divider sx={{ my: 1, borderColor: "#444" }} />

//       <List>
//         <ListItem button component={NavLink} to="/general-settings">
//           <ListItemText primary="General Settings" primaryTypographyProps={{ fontWeight: "bold" }} />
//         </ListItem>
//         <ListItem button>
//           <ListItemText primary="Support" primaryTypographyProps={{ fontWeight: "bold" }} />
//         </ListItem>
//         <ListItem>
//           <Button
//             fullWidth
//             onClick={handleLogout}
//             variant="outlined"
//             sx={{
//               fontWeight: "bold",
//               textTransform: "none",
//               borderColor: "#FAF7F3",
//               color: "#FAF7F3",
//               "&:hover": {
//                 backgroundColor: "#FAF7F3",
//                 color: "black",
//                 borderColor: "#FAF7F3"
//               }
//             }}
//           >
//             Logout
//           </Button>
//         </ListItem>
//       </List>
//     </Box>
//   );
// const notificationMenu = (
//   <Menu
//     anchorEl={notificationsAnchorEl}
//     open={openNotifications}
//     onClose={handleClose}
//     PaperProps={{
//       style: {
//         width: 350,
//         maxHeight: 500,
//         padding: 0
//       }
//     }}
//   >
//     <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
//       <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
//         Notifications
//         {notificationCount > 0 && (
//           <Typography component="span" sx={{ 
//             ml: 1,
//             fontSize: '0.75rem',
//             backgroundColor: theme.palette.primary.main,
//             color: 'white',
//             borderRadius: '10px',
//             px: 1,
//             py: 0.5
//           }}>
//             {notificationCount} new
//           </Typography>
//         )}
//       </Typography>
//     </Box>

//     {loadingNotifications ? (
//       <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//         <CircularProgress size={24} />
//       </Box>
//     ) : notifications.length === 0 ? (
//       <Box sx={{ p: 3, textAlign: 'center' }}>
//         <Typography variant="body2" color="textSecondary">
//           No notifications available
//         </Typography>
//       </Box>
//     ) : (
//       <List sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
//         {notifications.map((notification, index) => (
//           <React.Fragment key={notification.id}>
//             <MenuItem 
//               onClick={() => {
//                 markAsRead(notification.id);
//                 handleClose();
//               }}
//               sx={{
//                 backgroundColor: !notification.read_at ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
//                 '&:hover': {
//                   backgroundColor: 'rgba(0, 0, 0, 0.08)'
//                 },
//                 whiteSpace: 'normal', // Allow text to wrap
//                 alignItems: 'flex-start', // Align items to top
//                 py: 1.5 // Add more vertical padding
//               }}
//             >
//               <ListItemIcon sx={{ minWidth: '40px', mt: '4px' }}>
//                 {getNotificationIcon(notification.type)}
//               </ListItemIcon>
//               <Box sx={{ 
//                 flex: 1,
//                 minWidth: 0, // Prevent overflow
//                 overflow: 'hidden' 
//               }}>
//                 <Typography 
//                   variant="subtitle2" 
//                   sx={{ 
//                     fontWeight: !notification.read_at ? 'bold' : 'normal',
//                     mb: 0.5
//                   }}
//                 >
//                   {notification.title}
//                 </Typography>
//                 <Typography 
//                   variant="body2" 
//                   color="textSecondary"
//                   sx={{
//                     wordBreak: 'break-word', // Break long words
//                     display: '-webkit-box', // Enable multiline truncation
//                     WebkitLineClamp: 3, // Limit to 3 lines
//                     WebkitBoxOrient: 'vertical',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis'
//                   }}
//                 >
//                   {notification.message}
//                 </Typography>
//                 <Typography 
//                   variant="caption" 
//                   color="textSecondary" 
//                   sx={{ 
//                     display: 'block', 
//                     mt: 0.5,
//                     fontSize: '0.7rem'
//                   }}
//                 >
//                   {formatDate(notification.created_at)}
//                 </Typography>
//               </Box>
//             </MenuItem>
//             {index < notifications.length - 1 && <Divider />}
//           </React.Fragment>
//         ))}
//       </List>
//     )}
//   </Menu>
// );
  

//   return (
//     <>
//       <Box sx={{ width: "100%", height: "100%", overflow: "hidden", mb: "0.1rem" }}>
//         <img
//           src={banner}
//           alt="Banner"
//           style={{ width: "100%", height: "100%", objectFit: "cover" }}
//         />
//       </Box>

//       <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           <Link to="/dashboard" style={{ display: "inline-block" }}>
//             <Box
//               component="img"
//               src={Logo}
//               alt="Logo"
//               sx={{ height: 40, cursor: "pointer" }}
//             />
//           </Link>

//           {isMobile ? (
//             <>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <form onSubmit={handleSearchSubmit}>
//                   <TextField
//                     size="small"
//                     placeholder="Search..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     sx={{
//                       width: 150,
//                       backgroundColor: 'white',
//                       borderRadius: 1,
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'transparent' },
//                         '&:hover fieldset': { borderColor: 'transparent' },
//                         '&.Mui-focused fieldset': { borderColor: 'transparent' },
//                         height: 36,
//                       },
//                       '& .MuiInputBase-input': {
//                         py: 0.5,
//                         fontSize: '0.875rem'
//                       }
//                     }}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon color="action" fontSize="small" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </form>
                
//                 <IconButton 
//                   color="inherit" 
//                   onClick={handleNotificationsClick}
//                   sx={{ p: 0.5 }}
//                 >
//                   <Badge badgeContent={notificationCount} color="error">
//                     <NotificationsIcon fontSize="small" />
//                   </Badge>
//                 </IconButton>
                
//                 <IconButton color="inherit" onClick={toggleDrawer(true)} sx={{ p: 0.5 }}>
//                   <MenuIcon />
//                 </IconButton>
//               </Box>
              
//               {notificationMenu}
              
//               <Drawer 
//                 anchor="right" 
//                 open={drawerOpen} 
//                 onClose={toggleDrawer(false)}
//                 sx={{ '& .MuiDrawer-paper': { backgroundColor: 'black' } }}
//               >
//                 {drawerMenu}
//               </Drawer>
//             </>
//           ) : (
//             <>
//               <Box sx={{ display: "flex", gap: 2, alignItems: 'center' }}>
//                 <Button
//                   color="inherit"
//                   component={NavLink}
//                   to="/dashboard"
//                   style={navLinkStyle}
//                 >
//                   Dashboard
//                 </Button>
//                 <Button
//                   color="inherit"
//                   component={NavLink}
//                   to="/operations/manuals"
//                   style={navLinkStyle}
//                 >
//                   Operations Manual
//                 </Button>
//                 <Button
//                   color="inherit"
//                   component={NavLink}
//                   to="/reporting/manuals"
//                   style={navLinkStyle}
//                 >
//                   Reporting
//                 </Button>
//                 <Button
//                   color="inherit"
//                   onClick={handleAdminClick}
//                   endIcon={<ArrowDropDownIcon />}
//                   component="span"
//                 >
//                   Admin
//                 </Button>
//                 <Menu
//                   id="admin-menu"
//                   anchorEl={adminAnchorEl}
//                   open={openAdmin}
//                   onClose={handleClose}
//                   PaperProps={{ onMouseLeave: handleClose }}
//                   disableAutoFocusItem
//                 >
//                   <MenuItem component={NavLink} to="/manage/news" onClick={handleClose}>
//                     News Content
//                   </MenuItem>
//                   <MenuItem component={NavLink} to="/manage/users" onClick={handleClose}>
//                     User Management
//                   </MenuItem>
//                   <MenuItem component={NavLink} to="/location" onClick={handleClose}>
//                     Location Management
//                   </MenuItem>
//                 </Menu>
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <form onSubmit={handleSearchSubmit}>
//                   <TextField
//                     size="small"
//                     placeholder="Search..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     sx={{
//                       mr: 1,
//                       backgroundColor: 'white',
//                       borderRadius: 1,
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'transparent' },
//                         '&:hover fieldset': { borderColor: 'transparent' },
//                         '&.Mui-focused fieldset': { borderColor: 'transparent' },
//                       },
//                     }}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon color="action" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </form>

//                 <IconButton 
//                   color="inherit" 
//                   onClick={handleNotificationsClick}
//                   sx={{ p: 0 }}
//                 >
//                   <Badge badgeContent={notificationCount} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>
//                 {notificationMenu}

//                 <Stack 
//                   direction="column" 
//                   alignItems="center" 
//                   sx={{ cursor: 'pointer' }}
//                   onClick={handleProfileClick}
//                 >
//                   <Avatar sx={{ 
//                     width: 32, 
//                     height: 32, 
//                     bgcolor: theme.palette.primary.light 
//                   }}>
//                     {user?.first_name?.charAt(0) || <AccountCircle />}
//                   </Avatar>
//                   <Typography 
//                     variant="caption" 
//                     sx={{ 
//                       color: 'white', 
//                       lineHeight: 1,
//                       mt: 0.5,
//                       fontSize: '0.75rem'
//                     }}
//                   >
//                     Hi, {user?.first_name || 'User'}
//                   </Typography>
//                 </Stack>
//                 <Menu 
//                   anchorEl={profileAnchorEl} 
//                   open={openProfile} 
//                   onClose={handleClose}
//                 >
//                   <MenuItem onClick={handleClose} component={Link} to="/general-settings">
//                     General Settings
//                   </MenuItem>
//                   <MenuItem onClick={handleClose}>Support</MenuItem>
//                   <MenuItem onClick={handleLogout}>Logout</MenuItem>
//                 </Menu>
//               </Box>
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//     </>
//   );
// };

// export default Navbar;



import React, { useState, useEffect } from "react";
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
  TextField,
  InputAdornment,
  Badge,
  Avatar,
  Stack,
  ListItemIcon,
  CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import banner from "../../assets/banner.jpg";
import Logo from "../../assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { httpClient } from "../../utils/httpClientSetup";

const Navbar = () => {
  const { logout, user } = useAuth();
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const openAdmin = Boolean(adminAnchorEl);
  const openProfile = Boolean(profileAnchorEl);
  const openNotifications = Boolean(notificationsAnchorEl);

  // Fetch unread notification count on initial load
  useEffect(() => {
    if (user?.id) {
      fetchNotificationCount();
    }
  }, [user?.id]);

  const fetchNotificationCount = async () => {
    try {
      const response = await httpClient.get("notifications/unread");
      if (response.data.success) {
        setNotificationCount(response.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await httpClient.get("notifications/unread");
      if (response.data.success) {
        setNotifications(response.data.data);
        setNotificationCount(response.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (notifications.length > 0) {
        await httpClient.patch("/notifications/mark-all-read");
        // Clear notifications and reset count
        setNotifications([]);
        setNotificationCount(0);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAdminClick = (event) => setAdminAnchorEl(event.currentTarget);
  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
  
  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    fetchUnreadNotifications();
  };
  
  const handleNotificationsClose = () => {
    markAllAsRead();
    setNotificationsAnchorEl(null);
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#FFD700" : "#fff",
    textDecoration: "none",
    fontWeight: isActive ? "500" : "400",
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlineIcon color="success" />;
      case 'error':
        return <ErrorOutlineIcon color="error" />;
      default:
        return <InfoOutlinedIcon color="info" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const drawerMenu = (
    <Box sx={{ 
      width: 250, 
      background: "black", 
      height: "100vh", 
      color: "white",
      display: "flex",
      flexDirection: "column"
    }}>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderBottom: "1px solid #444"
      }}>
        <Typography variant="subtitle1" sx={{ color: "white" }}>
          Hi, {user?.first_name || 'User'}
        </Typography>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1 }}>
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
         <ListItem button component={NavLink} style={navLinkStyle} to={`/users/profile/${user.id}`} >
          <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: "bold" }} />
        </ListItem>
        <ListItem button component={NavLink} style={navLinkStyle} to="/general-settings">
          <ListItemText primary="General Settings" primaryTypographyProps={{ fontWeight: "bold" }} />
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

  const notificationMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      open={openNotifications}
      onClose={handleNotificationsClose}
      PaperProps={{
        style: {
          width: 350,
          maxHeight: 500,
          padding: 0
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Notifications
          {notificationCount > 0 && (
            <Typography component="span" sx={{ 
              ml: 1,
              fontSize: '0.75rem',
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              borderRadius: '10px',
              px: 1,
              py: 0.5
            }}>
              {notificationCount} new
            </Typography>
          )}
        </Typography>
      </Box>

      {loadingNotifications ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            No new notifications
          </Typography>
        </Box>
      ) : (
        <List sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <MenuItem 
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  },
                  whiteSpace: 'normal',
                  alignItems: 'flex-start',
                  py: 1.5
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px', mt: '4px' }}>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <Box sx={{ 
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden' 
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 0.5
                    }}
                  >
                    {notification.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{
                      wordBreak: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="textSecondary" 
                    sx={{ 
                      display: 'block', 
                      mt: 0.5,
                      fontSize: '0.7rem'
                    }}
                  >
                    {formatDate(notification.created_at)}
                  </Typography>
                </Box>
              </MenuItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Menu>
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
          <Link to="/dashboard" style={{ display: "inline-block" }}>
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{ height: 40, cursor: "pointer" }}
            />
          </Link>

          {isMobile ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <form onSubmit={handleSearchSubmit}>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      width: 150,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused fieldset': { borderColor: 'transparent' },
                        height: 36,
                      },
                      '& .MuiInputBase-input': {
                        py: 0.5,
                        fontSize: '0.875rem'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
                
                <IconButton 
                  color="inherit" 
                  onClick={handleNotificationsClick}
                  sx={{ p: 0.5 }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
                
                <IconButton color="inherit" onClick={toggleDrawer(true)} sx={{ p: 0.5 }}>
                  <MenuIcon />
                </IconButton>
              </Box>
              
              {notificationMenu}
              
              <Drawer 
                anchor="right" 
                open={drawerOpen} 
                onClose={toggleDrawer(false)}
                sx={{ '& .MuiDrawer-paper': { backgroundColor: 'black' } }}
              >
                {drawerMenu}
              </Drawer>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 2, alignItems: 'center' }}>
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
                  onClose={() => setAdminAnchorEl(null)}
                  PaperProps={{ onMouseLeave: () => setAdminAnchorEl(null) }}
                  disableAutoFocusItem
                >
                  <MenuItem component={NavLink} to="/manage/news" onClick={() => setAdminAnchorEl(null)}>
                    News Content
                  </MenuItem>
                  <MenuItem component={NavLink} to="/manage/users" onClick={() => setAdminAnchorEl(null)}>
                    User Management
                  </MenuItem>
                  <MenuItem component={NavLink} to="/location" onClick={() => setAdminAnchorEl(null)}>
                    Location Management
                  </MenuItem>
                </Menu>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <form onSubmit={handleSearchSubmit}>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      mr: 1,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused fieldset': { borderColor: 'transparent' },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>

                <IconButton 
                  color="inherit" 
                  onClick={handleNotificationsClick}
                  sx={{ p: 0 }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                {notificationMenu}

                <Stack 
                  direction="column" 
                  alignItems="center" 
                  sx={{ cursor: 'pointer' }}
                  onClick={handleProfileClick}
                >
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: theme.palette.primary.light 
                  }}>
                    {user?.first_name?.charAt(0) || <AccountCircle />}
                  </Avatar>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'white', 
                      lineHeight: 1,
                      mt: 0.5,
                      fontSize: '0.75rem'
                    }}
                  >
                    Hi, {user?.first_name || 'User'}
                  </Typography>
                </Stack>
                <Menu 
                  anchorEl={profileAnchorEl} 
                  open={openProfile} 
                  onClose={() => setProfileAnchorEl(null)}
                >
                  <MenuItem onClick={() => setProfileAnchorEl(null)} component={Link} to={`/users/profile/${user.id}`}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => setProfileAnchorEl(null)} component={Link} to="/general-settings">
                    General Settings
                  </MenuItem>
                  <MenuItem onClick={() => setProfileAnchorEl(null)}>Support</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;