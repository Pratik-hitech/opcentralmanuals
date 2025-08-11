// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Checkbox,
//   IconButton,
//   Button,
//   Menu,
//   MenuItem,
//   TextField,
//   InputAdornment,
//   TablePagination,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Skeleton,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Switch,
//   useMediaQuery,
//   useTheme,
//   Toolbar,
//   Typography,
// } from "@mui/material";
// import {
//   MoreVert,
//   Search,
//   BarChart,
//   FilterList,
//   Download,
//   ExpandMore,
//   Edit,
//   Delete,
// } from "@mui/icons-material";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { httpClient } from "../../utils/httpClientSetup";

// const ManageLocations = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const API_ENDPOINT = "https://6888d05fadf0e59551bb8590.mockapi.io/api/v1/location";

//   // Data state
//   const [locations, setLocations] = useState([]);
//   const [filteredLocations, setFilteredLocations] = useState([]);
//   const [isActionLoading, setIsActionLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // UI state
//   const [isLoading, setIsLoading] = useState(true);
//   const [selected, setSelected] = useState([]);
//   const [tab, setTab] = useState("active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 3 : 5);

//   // Menu/dialog state
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
//   const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
//   const [locationToDelete, setLocationToDelete] = useState(null);

//   // Notification
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const fetchLocations = async () => {
//     setIsLoading(true);
//     try {
//       const response = await httpClient.get(API_ENDPOINT);
      
//       if (response.data) {
//         setLocations(response.data);
//         filterLocations(response.data);
//       } else {
//         setError("Failed to fetch locations");
//       }
//     } catch (error) {
//       setError(error.message || "Failed to load locations");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filterLocations = (data) => {
//     let filtered = data;
    
//     // Filter by active/inactive tab
//     filtered = filtered.filter(location => 
//       tab === "active" ? location.active : !location.active
//     );
    
//     // Filter by search term if provided
//     if (searchTerm.trim() !== "") {
//       filtered = filtered.filter(
//         (location) =>
//           location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           location.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           location.suburb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           location.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           location.phone?.toString().includes(searchTerm)
//       );
//     }
    
//     setFilteredLocations(filtered);
//     setPage(0); // Reset to first page when filtering
//   };

//   useEffect(() => {
//     fetchLocations();
//   }, [tab]);

//   useEffect(() => {
//     filterLocations(locations);
//   }, [searchTerm, locations, tab]);

//   // Menu handlers
//   const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
//   const handleMenuClose = (setter) => () => setter(null);

//   // Row selection
//   const handleSelectAll = (e) => {
//     setSelected(e.target.checked ? filteredLocations.map((a) => a.id) : []);
//   };

//   const handleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   // Pagination
//   const handleChangePage = (_, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (e) => {
//     setRowsPerPage(parseInt(e.target.value, 10));
//     setPage(0);
//   };

//   // Toggle active status
//   const handleToggleActive = async (locationId, currentStatus) => {
//     setIsActionLoading(true);
//     try {
//       const newStatus = !currentStatus;
      
//       const response = await httpClient.put(`${API_ENDPOINT}/${locationId}`, {
//         active: newStatus
//       });
      
//       if (response.data) {
//         setSnackbar({
//           open: true,
//           message: `${newStatus ? 'Activated' : 'Deactivated'} location successfully`,
//           severity: "success",
//         });
//         fetchLocations();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to update location status",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   // Bulk activate/deactivate
//   const handleBulkStatusChange = async (activate) => {
//     setIsActionLoading(true);
//     try {
//       const responses = await Promise.all(
//         selected.map(id => 
//           httpClient.put(`${API_ENDPOINT}/${id}`, { active: activate })
//         )
//       );

//       const successfulUpdates = responses.filter(r => r.data);
      
//       if (successfulUpdates.length > 0) {
//         setSnackbar({
//           open: true,
//           message: `${activate ? 'Activated' : 'Deactivated'} ${successfulUpdates.length} location(s) successfully`,
//           severity: "success",
//         });
//         setSelected([]);
//         fetchLocations();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || `Failed to ${activate ? 'activate' : 'deactivate'} locations`,
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       handleMenuClose(setBulkAnchorEl)();
//     }
//   };

//   // Bulk delete
//   const handleBulkDelete = async () => {
//     setIsActionLoading(true);
//     try {
//       const responses = await Promise.all(
//         selected.map(id => httpClient.delete(`${API_ENDPOINT}/${id}`))
//       );

//       const successfulDeletes = responses.filter(r => r.data);
      
//       if (successfulDeletes.length > 0) {
//         setSnackbar({
//           open: true,
//           message: `Deleted ${successfulDeletes.length} location(s) successfully`,
//           severity: "success",
//         });
//         setSelected([]);
//         fetchLocations();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to delete locations",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       setOpenBulkDeleteModal(false);
//     }
//   };

//   // Single delete
//   const handleDeleteClick = (id) => {
//     setLocationToDelete(id);
//     setOpenDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     setIsActionLoading(true);
//     try {
//       const response = await httpClient.delete(`${API_ENDPOINT}/${locationToDelete}`);
      
//       if (response.data) {
//         setSnackbar({
//           open: true,
//           message: "Location deleted successfully",
//           severity: "success",
//         });
//         fetchLocations();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to delete location",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       setOpenDeleteModal(false);
//       setLocationToDelete(null);
//     }
//   };

//   // Export
//   const exportData = (type) => {
//     const data = filteredLocations.map((location) => ({
//       Name: location.name,
//       Location: location.location,
//       Suburb: location.suburb,
//       State: location.state,
//       Phone: location.phone,
//       Status: location.active ? "Active" : "Inactive",
//       "Created At": location.createdAt,
//     }));

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Locations");

//     const fileType = type === "csv" ? "csv" : "xlsx";
//     const wbout =
//       type === "csv"
//         ? XLSX.utils.sheet_to_csv(ws)
//         : XLSX.write(wb, { bookType: fileType, type: "array" });
//     const blob = new Blob([wbout], {
//       type:
//         type === "csv" ? "text/csv;charset=utf-8;" : "application/octet-stream",
//     });
//     saveAs(blob, `locations_export.${fileType}`);
//     setDownloadAnchorEl(null);
//   };

//   // Skeleton loader
//   const renderSkeletonRows = () => {
//     return Array(rowsPerPage).fill(0).map((_, index) => (
//       <TableRow key={`skeleton-${index}`}>
//         <TableCell><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
//         <TableCell><Skeleton variant="text" width={isMobile ? 80 : 150} /></TableCell>
//         {!isMobile && (
//           <>
//             <TableCell><Skeleton variant="text" width={100} /></TableCell>
//             <TableCell><Skeleton variant="text" width={100} /></TableCell>
//             <TableCell><Skeleton variant="text" width={80} /></TableCell>
//           </>
//         )}
//         <TableCell><Skeleton variant="text" width={isMobile ? 60 : 120} /></TableCell>
//         <TableCell><Skeleton variant="text" width={isMobile ? 50 : 80} /></TableCell>
//         <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
//       </TableRow>
//     ));
//   };

//   return (
//     <Box p={isMobile ? 1 : 2}>
//       {/* Header with controls */}
//       <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "flex-start" : "center"} mb={2} gap={1}>
//         <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
//           {selected.length > 0 && (
//             <Button
//               variant="contained"
//               color="primary"
//               size={isMobile ? "small" : "medium"}
//               endIcon={<ExpandMore />}
//               onClick={handleMenuOpen(setBulkAnchorEl)}
//             >
//               {isMobile ? "Actions" : "Bulk Actions"}
//             </Button>
//           )}
//           {!isMobile && (
//             <IconButton size="small">
//               <BarChart />
//             </IconButton>
//           )}
//           <Button 
//             variant="contained" 
//             color="warning" 
//             size={isMobile ? "small" : "medium"}
//             onClick={() => navigate("/manage/location/create")}
//           >
//             {isMobile ? "Create" : "Create Location"}
//           </Button>
//           <Box display="flex" gap={isMobile ? 0.5 : 1}>
//             <Button
//               variant="text"
//               size={isMobile ? "small" : "medium"}
//               onClick={() => setTab("active")}
//               style={{
//                 borderBottom: tab === "active" ? "2px solid #ccc" : "none",
//                 minWidth: isMobile ? "60px" : "auto"
//               }}
//             >
//               Active
//             </Button>
//             <Button
//               variant="text"
//               size={isMobile ? "small" : "medium"}
//               onClick={() => setTab("inactive")}
//               style={{
//                 borderBottom: tab === "inactive" ? "2px solid #ccc" : "none",
//                 minWidth: isMobile ? "70px" : "auto"
//               }}
//             >
//               Inactive
//             </Button>
//           </Box>
//         </Box>

//         <Box display="flex" alignItems="center" gap={1} width={isMobile ? "100%" : "auto"} mt={isMobile ? 1 : 0}>
//           <TextField
//             fullWidth={isMobile}
//             size="small"
//             placeholder="Search locations..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               sx: {
//                 fontSize: isMobile ? "14px" : "inherit",
//                 height: isMobile ? "40px" : "auto"
//               },
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           {!isMobile && (
//             <>
//               <IconButton onClick={handleMenuOpen(setDownloadAnchorEl)}>
//                 <Download />
//               </IconButton>
//               <IconButton>
//                 <FilterList />
//               </IconButton>
//               <IconButton onClick={handleMenuOpen(setAnchorEl)}>
//                 <MoreVert />
//               </IconButton>
//             </>
//           )}
//         </Box>
//       </Box>

//       {/* Error display */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Table */}
//       <Box sx={{ overflowX: "auto" }}>
//         <Table size="small" sx={{ minWidth: isMobile ? "700px" : "100%" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <Checkbox
//                   onChange={handleSelectAll}
//                   checked={
//                     selected.length === filteredLocations.length &&
//                     filteredLocations.length > 0
//                   }
//                 />
//               </TableCell>
//               <TableCell>Name</TableCell>
//               {!isMobile && (
//                 <>
//                   <TableCell>Location</TableCell>
//                   <TableCell>Suburb</TableCell>
//                   <TableCell>State</TableCell>
//                 </>
//               )}
//               <TableCell>Phone</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {isLoading ? (
//               renderSkeletonRows()
//             ) : filteredLocations.length > 0 ? (
//               filteredLocations
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((location) => (
//                   <TableRow key={location.id}>
//                     <TableCell>
//                       <Checkbox
//                         checked={selected.includes(location.id)}
//                         onChange={() => handleSelect(location.id)}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ minWidth: isMobile ? "120px" : "auto" }}>
//                       {location.name}
//                     </TableCell>
//                     {!isMobile && (
//                       <>
//                         <TableCell>{location.location}</TableCell>
//                         <TableCell>{location.suburb}</TableCell>
//                         <TableCell>{location.state}</TableCell>
//                       </>
//                     )}
//                     <TableCell>{location.phone}</TableCell>
//                     <TableCell>
//                       {location.active ? "Active" : "Inactive"}
//                     </TableCell>
//                     <TableCell>
//                       <Box display="flex" alignItems="center" gap={1}>
//                         {!isMobile && (
//                           <Switch
//                             checked={location.active}
//                             onChange={() => handleToggleActive(location.id, location.active)}
//                             color="primary"
//                             size="small"
//                           />
//                         )}
//                         <Box 
//                           sx={{ 
//                             border: '1px solid #ccc', 
//                             borderRadius: 1,
//                             display: 'inline-flex',
//                             padding: '4px'
//                           }}
//                         >
//                           <IconButton
//                             size="small"
//                             onClick={() => navigate(`/manage/location/${location.id}/edit`)}
//                           >
//                             <Edit fontSize="small" />
//                           </IconButton>
//                         </Box>
//                         <Box 
//                           sx={{ 
//                             border: '1px solid #ccc', 
//                             borderRadius: 1,
//                             display: 'inline-flex',
//                             padding: '4px'
//                           }}
//                         >
//                           <IconButton
//                             size="small"
//                             onClick={() => handleDeleteClick(location.id)}
//                           >
//                             <Delete fontSize="small" color="error" />
//                           </IconButton>
//                         </Box>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={isMobile ? 5 : 8} align="center">
//                   No locations found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </Box>

//       {/* Pagination */}
//       <TablePagination
//         rowsPerPageOptions={[3, 5, 10, 25]}
//         component="div"
//         count={filteredLocations.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       {/* Bulk Actions Menu */}
//       <Menu
//         anchorEl={bulkAnchorEl}
//         open={Boolean(bulkAnchorEl)}
//         onClose={handleMenuClose(setBulkAnchorEl)}
//       >
//         {tab === "inactive" && (
//           <MenuItem onClick={() => handleBulkStatusChange(true)}>
//             Activate Selected
//           </MenuItem>
//         )}
//         {tab === "active" && (
//           <MenuItem onClick={() => handleBulkStatusChange(false)}>
//             Deactivate Selected
//           </MenuItem>
//         )}
//         <MenuItem onClick={() => {
//           setOpenBulkDeleteModal(true);
//           handleMenuClose(setBulkAnchorEl)();
//         }}>
//           Delete Selected
//         </MenuItem>
//         <MenuItem onClick={() => exportData("csv")}>Export</MenuItem>
//       </Menu>

//       {/* Settings Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose(setAnchorEl)}
//       >
//         <MenuItem>Manage Location Types</MenuItem>
//       </Menu>

//       {/* Download Menu */}
//       <Menu
//         anchorEl={downloadAnchorEl}
//         open={Boolean(downloadAnchorEl)}
//         onClose={handleMenuClose(setDownloadAnchorEl)}
//       >
//         <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
//         <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
//       </Menu>

//       {/* Single Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteModal}
//         onClose={() => setOpenDeleteModal(false)}
//       >
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this location? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button 
//             onClick={() => setOpenDeleteModal(false)} 
//             color="primary"
//             disabled={isActionLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={confirmDelete}
//             color="error"
//             autoFocus
//             disabled={isActionLoading}
//           >
//             {isActionLoading ? "Deleting..." : "Confirm Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bulk Delete Confirmation Dialog */}
//       <Dialog
//         open={openBulkDeleteModal}
//         onClose={() => setOpenBulkDeleteModal(false)}
//       >
//         <DialogTitle>Confirm Bulk Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete {selected.length} selected location(s)? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button 
//             onClick={() => setOpenBulkDeleteModal(false)} 
//             color="primary"
//             disabled={isActionLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleBulkDelete}
//             color="error"
//             autoFocus
//             disabled={isActionLoading}
//           >
//             {isActionLoading ? "Deleting..." : "Confirm Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Action Loader */}
//       {isActionLoading && (
//         <Box
//           position="fixed"
//           top={0}
//           left={0}
//           right={0}
//           bottom={0}
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           bgcolor="rgba(0,0,0,0.1)"
//           zIndex={9999}
//         >
//           <CircularProgress />
//         </Box>
//       )}

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ManageLocations;




// ********************************

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  Snackbar,
  Alert,
  CircularProgress,
  Switch,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MoreVert,
  Search,
  BarChart,
  FilterList,
  Download,
  ExpandMore,
  Edit,
  Delete,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { httpClient } from "../../utils/httpClientSetup";

const ManageLocations = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Data state
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [tab, setTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 3 : 5);

  // Menu/dialog state
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  // Notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
  const handleMenuClose = (setter) => () => setter(null);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.get("locations");
      
      if (response.data && response.data.success) {
        setLocations(response.data.data);
        filterLocations(response.data.data);
      } else {
        setError(response.data?.message || "Failed to fetch locations");
      }
    } catch (error) {
      setError(error.message || "Failed to load locations");
    } finally {
      setIsLoading(false);
    }
  };

  const filterLocations = (data) => {
    let filtered = data;
    
    // Filter by active/inactive tab (status 1 = active, 0 = inactive)
    filtered = filtered.filter(location => 
      tab === "active" ? location.status === 1 : location.status === 0
    );
    
    // Filter by search term if provided
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (location) =>
          location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.street_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.suburb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.phone?.toString().includes(searchTerm)
      );
    }
    
    setFilteredLocations(filtered);
    setPage(0);
  };

  useEffect(() => {
    fetchLocations();
  }, [tab]);

  useEffect(() => {
    filterLocations(locations);
  }, [searchTerm, locations, tab]);

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? filteredLocations.map((a) => a.id) : []);
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleToggleStatus = async (locationId, currentStatus) => {
    setIsActionLoading(true);
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      
      const response = await httpClient.put(`locations/${locationId}`, {
        status: newStatus
      });
      
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: `${newStatus === 1 ? 'Activated' : 'Deactivated'} location successfully`,
          severity: "success",
        });
        fetchLocations();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update location status",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkStatusChange = async (activate) => {
    setIsActionLoading(true);
    try {
      const newStatus = activate ? 1 : 0;
      const responses = await Promise.all(
        selected.map(id => 
          httpClient.put(`locations/${id}`, { status: newStatus })
        )
      );

      const successfulUpdates = responses.filter(r => r.data && r.data.success);
      
      if (successfulUpdates.length > 0) {
        setSnackbar({
          open: true,
          message: `${activate ? 'Activated' : 'Deactivated'} ${successfulUpdates.length} location(s) successfully`,
          severity: "success",
        });
        setSelected([]);
        fetchLocations();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || `Failed to ${activate ? 'activate' : 'deactivate'} locations`,
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      handleMenuClose(setBulkAnchorEl)();
    }
  };

  const handleBulkDelete = async () => {
    setIsActionLoading(true);
    try {
      const responses = await Promise.all(
        selected.map(id => httpClient.delete(`locations/${id}`))
      );

      const successfulDeletes = responses.filter(r => r.data && r.data.success);
      
      if (successfulDeletes.length > 0) {
        setSnackbar({
          open: true,
          message: `Deleted ${successfulDeletes.length} location(s) successfully`,
          severity: "success",
        });
        setSelected([]);
        fetchLocations();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete locations",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenBulkDeleteModal(false);
    }
  };

  const handleDeleteClick = (id) => {
    setLocationToDelete(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsActionLoading(true);
    try {
      const response = await httpClient.delete(`locations/${locationToDelete}`);
      
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: "Location deleted successfully",
          severity: "success",
        });
        fetchLocations();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete location",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenDeleteModal(false);
      setLocationToDelete(null);
    }
  };

  const exportData = (type) => {
    const data = filteredLocations.map((location) => ({
      Name: location.name,
      Type: location.type,
      "Street Number": location.street_number,
      "Street Name": location.street_name,
      Suburb: location.suburb,
      State: location.state,
      Postcode: location.postcode,
      Country: location.country,
      Email: location.email,
      Phone: location.phone,
      Contact: location.contact,
      Status: location.status === 1 ? "Active" : "Inactive",
      "Created At": location.created_at,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Locations");

    const fileType = type === "csv" ? "csv" : "xlsx";
    const wbout =
      type === "csv"
        ? XLSX.utils.sheet_to_csv(ws)
        : XLSX.write(wb, { bookType: fileType, type: "array" });
    const blob = new Blob([wbout], {
      type:
        type === "csv" ? "text/csv;charset=utf-8;" : "application/octet-stream",
    });
    saveAs(blob, `locations_export.${fileType}`);
    setDownloadAnchorEl(null);
  };

  const renderSkeletonRows = () => {
    return Array(rowsPerPage).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
        <TableCell><Skeleton variant="text" width={isMobile ? 80 : 150} /></TableCell>
        {!isMobile && (
          <>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
          </>
        )}
        <TableCell><Skeleton variant="text" width={isMobile ? 60 : 120} /></TableCell>
        <TableCell><Skeleton variant="text" width={isMobile ? 50 : 80} /></TableCell>
        <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
      </TableRow>
    ));
  };

  return (
    <Box p={isMobile ? 1 : 2}>
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "flex-start" : "center"} mb={2} gap={1}>
        <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
          {selected.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              size={isMobile ? "small" : "medium"}
              endIcon={<ExpandMore />}
              onClick={handleMenuOpen(setBulkAnchorEl)}
            >
              {isMobile ? "Actions" : "Bulk Actions"}
            </Button>
          )}
          <Button 
            variant="contained" 
            color="warning" 
            size={isMobile ? "small" : "medium"}
            onClick={() => navigate("/location/create")}
          >
            {isMobile ? "Create" : "Create Location"}
          </Button>
          <Box display="flex" gap={isMobile ? 0.5 : 1}>
            <Button
              variant="text"
              size={isMobile ? "small" : "medium"}
              onClick={() => setTab("active")}
              style={{
                borderBottom: tab === "active" ? "2px solid #ccc" : "none",
                minWidth: isMobile ? "60px" : "auto"
              }}
            >
              Active
            </Button>
            <Button
              variant="text"
              size={isMobile ? "small" : "medium"}
              onClick={() => setTab("inactive")}
              style={{
                borderBottom: tab === "inactive" ? "2px solid #ccc" : "none",
                minWidth: isMobile ? "70px" : "auto"
              }}
            >
              Inactive
            </Button>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} width={isMobile ? "100%" : "auto"} mt={isMobile ? 1 : 0}>
          <TextField
            fullWidth={isMobile}
            size="small"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              sx: {
                fontSize: isMobile ? "14px" : "inherit",
                height: isMobile ? "40px" : "auto"
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={handleMenuOpen(setDownloadAnchorEl)}>
            <Download />
          </IconButton>
          <IconButton onClick={handleMenuOpen(setAnchorEl)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: isMobile ? "700px" : "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={
                    selected.length === filteredLocations.length &&
                    filteredLocations.length > 0
                  }
                />
              </TableCell>
              <TableCell>Name</TableCell>
              {!isMobile && (
                <>
                  <TableCell>Type</TableCell>
                  <TableCell>Suburb</TableCell>
                  <TableCell>State</TableCell>
                </>
              )}
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              renderSkeletonRows()
            ) : filteredLocations.length > 0 ? (
              filteredLocations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(location.id)}
                        onChange={() => handleSelect(location.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: isMobile ? "120px" : "auto" }}>
                      {location.name}
                    </TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>{`${location.type}`}</TableCell>
                        <TableCell>{location.suburb}</TableCell>
                        <TableCell>{location.state}</TableCell>
                      </>
                    )}
                    <TableCell>{location.phone}</TableCell>
                    <TableCell>
                      {location.status === 1 ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {!isMobile && (
                          <Switch
                            checked={location.status === 1}
                            onChange={() => handleToggleStatus(location.id, location.status)}
                            color="primary"
                            size="small"
                          />
                        )}
                        <Box 
                          sx={{ 
                            border: '1px solid #ccc', 
                            borderRadius: 1,
                            display: 'inline-flex',
                            padding: '4px'
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/location/${location.id}/edit`)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box 
                          sx={{ 
                            border: '1px solid #ccc', 
                            borderRadius: 1,
                            display: 'inline-flex',
                            padding: '4px'
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(location.id)}
                          >
                            <Delete fontSize="small" color="error" />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={isMobile ? 5 : 8} align="center">
                  No locations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        rowsPerPageOptions={[3, 5, 10, 25]}
        component="div"
        count={filteredLocations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Menu
        anchorEl={bulkAnchorEl}
        open={Boolean(bulkAnchorEl)}
        onClose={handleMenuClose(setBulkAnchorEl)}
      >
        {tab === "inactive" && (
          <MenuItem onClick={() => handleBulkStatusChange(true)}>
            Activate Selected
          </MenuItem>
        )}
        {tab === "active" && (
          <MenuItem onClick={() => handleBulkStatusChange(false)}>
            Deactivate Selected
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          setOpenBulkDeleteModal(true);
          handleMenuClose(setBulkAnchorEl)();
        }}>
          Delete Selected
        </MenuItem>
        <MenuItem onClick={() => exportData("csv")}>Export</MenuItem>
      </Menu>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose(setAnchorEl)}
      >
        <MenuItem>Manage Location Types</MenuItem>
        <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
        <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
      </Menu>

      <Menu
        anchorEl={downloadAnchorEl}
        open={Boolean(downloadAnchorEl)}
        onClose={handleMenuClose(setDownloadAnchorEl)}
      >
        <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
        <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
      </Menu>

      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this location? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteModal(false)} 
            color="primary"
            disabled={isActionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            autoFocus
            disabled={isActionLoading}
          >
            {isActionLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openBulkDeleteModal}
        onClose={() => setOpenBulkDeleteModal(false)}
      >
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selected.length} selected location(s)? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenBulkDeleteModal(false)} 
            color="primary"
            disabled={isActionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkDelete}
            color="error"
            autoFocus
            disabled={isActionLoading}
          >
            {isActionLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {isActionLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(0,0,0,0.1)"
          zIndex={9999}
        >
          <CircularProgress />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageLocations;