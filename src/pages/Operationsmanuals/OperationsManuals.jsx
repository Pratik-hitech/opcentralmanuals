import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
  Paper,
  Tooltip,
  Menu,MenuItem
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import FolderIcon from "@mui/icons-material/Folder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Replace with actual image path
import BlueWheelersLogo from "../../assets/bluewheelerslogo-operationsmanuals.png";

const LogoCard = ({ image, title }) => {

  
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 320,
        border: "1px solid #ccc",
        borderRadius: 2,
        overflow: "hidden",
        "&:hover .overlay": {
          opacity: 1,
        },
        "&:hover .actions": {
          opacity: 1,
          transform: "translateY(0)",
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{ width: "100%", display: "block" }}
      />

      {/* Overlay on hover */}
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          bgcolor: "rgba(0,0,0,0.4)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          zIndex: 1,
        }}
      />

      {/* Buttons on hover */}
      <Box
        className="actions"
        sx={{
          position: "absolute",
          bottom: 8,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 1,
          opacity: 0,
          transform: "translateY(20px)",
          transition: "all 0.3s ease",
          zIndex: 2,
        }}
      >
        <Tooltip title="View">
          <Link to="./docs">
            <IconButton size="small" color="primary" sx={{ bgcolor: "white" }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Edit">
          <Link to="/manuals/edit">
            <IconButton size="small" color="secondary" sx={{ bgcolor: "white" }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Delete">
          <Link to="/manuals/delete">
            <IconButton size="small" color="error" sx={{ bgcolor: "white" }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Link>
        </Tooltip>
      </Box>
    </Box>
  );
};

const OperationsManuals = () => {
        const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    handleClose();
    navigate(path); // Go to the specified route
  };
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: "1px solid #ddd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          position: "relative",
          backgroundColor: "#FAF7F3",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            OPERATIONS MANUALS
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <IconButton sx={{ bgcolor: "#E0CD00", color: "white" , "&:hover": { bgcolor: "#c7b800" }}}>
              <ListIcon />
            </IconButton>
            <Button
            component = {Link}
            to = "/manuals/create"
              variant="contained"
              sx={{
                bgcolor: "#E0CD00",
                "&:hover": { bgcolor: "#c7b800" },
                color: "white",
                fontWeight: "bold",
              }}
            >
              Create Manual
            </Button>
            <IconButton sx={{ bgcolor: "#E0CD00", color: "white" , "&:hover": { bgcolor: "#c7b800" }}}>
              <FolderIcon />
            </IconButton>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>

                 <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/policies/all")}>
        All Policies
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/")}>
            Manage Drafts
          </MenuItem>
           <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/")}>
            Manage Tags
          </MenuItem>
           <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/")}>
            Manage Order
          </MenuItem>
          <Divider sx={{ height: "1px", bgcolor: "rgba(0, 0, 0, 0.1)" }} />

          <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/")}>
            Settings
          </MenuItem>

        </Menu>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Logos Grid */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <LogoCard image={BlueWheelersLogo} title="Blue Wheelers" />
          {/* <LogoCard
            image="https://upload.wikimedia.org/wikipedia/commons/9/90/Dog_icon.png"
            title="Dash Dogwash"
          /> */}
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 6}}>
          <Typography variant="subtitle1" fontWeight="medium">
            OPERATIONS AND PROCEDURES MANUAL
          </Typography>
        </Box>

        {/* Top Right 3-dot Icon */}
        {/* <IconButton
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "#f5f5f5",
            boxShadow: 1,
            "&:hover": {
             
            },
          }}
        >
          <MoreVertIcon />
        </IconButton> */}
      </Paper>
    </Box>
  );
};

export default OperationsManuals;
