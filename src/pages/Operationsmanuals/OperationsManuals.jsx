// import React from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   Divider,
//   Stack,
//   Paper,
//   Tooltip,
//   Menu,MenuItem
// } from "@mui/material";
// import ListIcon from "@mui/icons-material/List";
// import FolderIcon from "@mui/icons-material/Folder";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import EditIcon from "@mui/icons-material/Edit";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // Replace with actual image path
// import BlueWheelersLogo from "../../assets/bluewheelerslogo-operationsmanuals.png";

// const LogoCard = ({ image, title }) => {

  
//   return (
//     <Box
//       sx={{
//         position: "relative",
//         width: "100%",
//         maxWidth: 320,
//         border: "1px solid #ccc",
//         borderRadius: 2,
//         overflow: "hidden",
//         "&:hover .overlay": {
//           opacity: 1,
//         },
//         "&:hover .actions": {
//           opacity: 1,
//           transform: "translateY(0)",
//         },
//       }}
//     >
//       <Box
//         component="img"
//         src={image}
//         alt={title}
//         sx={{ width: "100%", display: "block" }}
//       />

//       {/* Overlay on hover */}
//       <Box
//         className="overlay"
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           height: "100%",
//           width: "100%",
//           bgcolor: "rgba(0,0,0,0.4)",
//           opacity: 0,
//           transition: "opacity 0.3s ease",
//           zIndex: 1,
//         }}
//       />

//       {/* Buttons on hover */}
//       <Box
//         className="actions"
//         sx={{
//           position: "absolute",
//           bottom: 8,
//           left: 0,
//           width: "100%",
//           display: "flex",
//           justifyContent: "center",
//           gap: 1,
//           opacity: 0,
//           transform: "translateY(20px)",
//           transition: "all 0.3s ease",
//           zIndex: 2,
//         }}
//       >
//         <Tooltip title="View">
//           <Link to="./docs">
//             <IconButton size="small" color="primary" sx={{ bgcolor: "white" }}>
//               <VisibilityIcon fontSize="small" />
//             </IconButton>
//           </Link>
//         </Tooltip>
//         <Tooltip title="Edit">
//           <Link to="/manuals/edit">
//             <IconButton size="small" color="secondary" sx={{ bgcolor: "white" }}>
//               <EditIcon fontSize="small" />
//             </IconButton>
//           </Link>
//         </Tooltip>
//         <Tooltip title="Delete">
//           <Link to="/manuals/delete">
//             <IconButton size="small" color="error" sx={{ bgcolor: "white" }}>
//               <DeleteIcon fontSize="small" />
//             </IconButton>
//           </Link>
//         </Tooltip>
//       </Box>
//     </Box>
//   );
// };

// const OperationsManuals = () => {
//         const [anchorEl, setAnchorEl] = useState(null);
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
//     <Box sx={{ p: { xs: 2, md: 3 } }}>
//       <Paper
//         elevation={3}
//         sx={{
//           p: { xs: 2, md: 3 },
//           borderRadius: 3,
//           border: "1px solid #ddd",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//           position: "relative",
//           backgroundColor: "#FAF7F3",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             flexDirection: { xs: "column", sm: "row" },
//             gap: 2,
//           }}
//         >
//           <Typography variant="h6" fontWeight="bold">
//             OPERATIONS MANUALS
//           </Typography>

//           <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
//             <IconButton sx={{ bgcolor: "#E0CD00", color: "white" , "&:hover": { bgcolor: "#c7b800" }}}>
//               <ListIcon />
//             </IconButton>
//             <Button
//             component = {Link}
//             to = "/manuals/create"
//               variant="contained"
//               sx={{
//                 bgcolor: "#E0CD00",
//                 "&:hover": { bgcolor: "#c7b800" },
//                 color: "white",
//                 fontWeight: "bold",
//               }}
//             >
//               Create Manual
//             </Button>
//             <IconButton sx={{ bgcolor: "#E0CD00", color: "white" , "&:hover": { bgcolor: "#c7b800" }}}>
//               <FolderIcon />
//             </IconButton>
//             <IconButton onClick={handleMenuClick}>
//               <MoreVertIcon />
//             </IconButton>

//                  <Menu
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/policies/all")}>
//         All Policies
//           </MenuItem>
//           <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/")}>
//             Manage Drafts
//           </MenuItem>
//            <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/")}>
//             Manage Tags
//           </MenuItem>
//            <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/")}>
//             Manage Order
//           </MenuItem>
//           <Divider sx={{ height: "1px", bgcolor: "rgba(0, 0, 0, 0.1)" }} />

//           <MenuItem onClick={() => handleMenuItemClick("/operations/manuals/")}>
//             Settings
//           </MenuItem>

//         </Menu>
//           </Stack>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         {/* Logos Grid */}
//         <Box
//           sx={{
//             mt: 4,
//             display: "flex",
//             flexWrap: "wrap",
//             gap: 3,
//             justifyContent: { xs: "center", sm: "flex-start" },
//           }}
//         >
//           <LogoCard image={BlueWheelersLogo} title="Blue Wheelers" />
//           {/* <LogoCard
//             image="https://upload.wikimedia.org/wikipedia/commons/9/90/Dog_icon.png"
//             title="Dash Dogwash"
//           /> */}
//         </Box>

//         {/* Footer */}
//         <Box sx={{ mt: 6}}>
//           <Typography variant="subtitle1" fontWeight="medium">
//             OPERATIONS AND PROCEDURES MANUAL
//           </Typography>
//         </Box>

//         {/* Top Right 3-dot Icon */}
//         {/* <IconButton
//           sx={{
//             position: "absolute",
//             top: 16,
//             right: 16,
//             bgcolor: "#f5f5f5",
//             boxShadow: 1,
//             "&:hover": {
             
//             },
//           }}
//         >
//           <MoreVertIcon />
//         </IconButton> */}
//       </Paper>
//     </Box>
//   );
// };

// export default OperationsManuals;


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
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import FolderIcon from "@mui/icons-material/Folder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AppsIcon from "@mui/icons-material/Apps";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlueWheelersLogo from "../../assets/bluewheelerslogo-operationsmanuals.png";

// Mock API function - replace with actual API call
const fetchManuals = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 1,
      title: "Blue Wheelers",
      thumbnail: BlueWheelersLogo,
      policies: 12,
      lastUpdated: "2023-05-15"
    },
    {
      id: 2,
      title: "Dash Dogwash",
      thumbnail: "https://upload.wikimedia.org/wikipedia/commons/9/90/Dog_icon.png",
      policies: 8,
      lastUpdated: "2023-06-20"
    },
    {
      id: 3,
      title: "City Logistics",
      thumbnail: "https://cdn-icons-png.flaticon.com/512/2777/2777154.png",
      policies: 15,
      lastUpdated: "2023-04-10"
    },
    {
      id: 4,
      title: "Fast Movers",
      thumbnail: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
      policies: 5,
      lastUpdated: "2023-07-01"
    }
  ];
};

const LogoCard = ({ image, title, policies, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

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
          {/* <Link to={`./docs/${title.toLowerCase().replace(/\s+/g, '-')}`}> */}
                 <Link to={`./docs`}>
            <IconButton size="small" color="primary" sx={{ bgcolor: "white" }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="More actions">
          <IconButton 
            size="small" 
            color="secondary" 
            sx={{ bgcolor: "white" }}
            onClick={handleMenuClick}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Title at bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "rgba(0,0,0,0.7)",
          color: "white",
          p: 1,
          zIndex: 1,
        }}
      >
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
        <Typography variant="caption">
          {policies} {policies === 1 ? "policy" : "policies"}
        </Typography>
      </Box>

      {/* Action menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem 
          component={Link}
          to={`/manuals/edit/${title.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={handleMenuClose}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Manual</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{title}" manual? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              onDelete();
              setDeleteConfirmOpen(false);
            }} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const OperationsManuals = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewMode, setViewMode] = useState("tiles");
  const [manuals, setManuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  });
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const loadManuals = async () => {
      try {
        const data = await fetchManuals();
        setManuals(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching manuals:", error);
        setLoading(false);
        showSnackbar("Failed to load manuals", "error");
      }
    };

    loadManuals();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    handleClose();
    navigate(path);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "tiles" ? "table" : "tiles");
  };

  const handleDeleteManual = (id) => {
    try {
      // Simulate API call
      const manualToDelete = manuals.find(m => m.id === id);
      
      // In a real app, you would call an API here
      // await deleteManualAPI(id);
      
      setManuals(manuals.filter(manual => manual.id !== id));
      showSnackbar(`"${manualToDelete.title}" manual deleted successfully`, "success");
    } catch (error) {
      console.error("Error deleting manual:", error);
      showSnackbar("Failed to delete manual", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading manuals...</Typography>
      </Box>
    );
  }

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
            <Tooltip title={viewMode === "tiles" ? "Table view" : "Tile view"}>
              <IconButton 
                onClick={toggleViewMode}
                sx={{ bgcolor: "#E0CD00", color: "white", "&:hover": { bgcolor: "#c7b800" } }}
              >
                {viewMode === "tiles" ? <ViewListIcon /> : <AppsIcon />}
              </IconButton>
            </Tooltip>
            
            <Button
              component={Link}
              to="/manuals/create"
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
            
            <IconButton component={Link} to= "/file-manager" sx={{ bgcolor: "#E0CD00", color: "white", "&:hover": { bgcolor: "#c7b800" } }}>
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

        {viewMode === "tiles" ? (
          // Tile View
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {manuals.map((manual) => (
              <LogoCard 
                key={manual.id}
                image={manual.thumbnail}
                title={manual.title}
                policies={manual.policies}
                onDelete={() => handleDeleteManual(manual.id)}
              />
            ))}
          </Box>
        ) : (
          // Table View
          <Box sx={{ mt: 4 }}>
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell>Thumbnail</TableCell>
                    <TableCell>Manual Name</TableCell>
                    <TableCell>Policies</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {manuals
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((manual) => (
                      <TableRow key={manual.id}>
                        <TableCell>
                          <Avatar 
                            src={manual.thumbnail} 
                            alt={manual.title}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">
                            {manual.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{manual.policies}</TableCell>
                        <TableCell>{manual.lastUpdated}</TableCell>
                        <TableCell align="right">
                          <TableActions 
                            manual={manual} 
                            onDelete={() => handleDeleteManual(manual.id)} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={manuals.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            OPERATIONS AND PROCEDURES MANUAL
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Separate component for table row actions
const TableActions = ({ manual, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Tooltip title="View">
          <IconButton 
            size="small"
            component={Link}
            to={`./docs/${manual.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="More actions">
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Action menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem 
          component={Link}
          to={`/manuals/edit/${manual.title.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={handleMenuClose}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Manual</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{manual.title}" manual? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              onDelete();
              setDeleteConfirmOpen(false);
            }} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OperationsManuals;