import React, { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
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
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import {
  MoreVert,
  Search,
  BarChart,
  FilterList,
  Download,
  ExpandMore,
  Person,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { httpClient } from "../../utils/httpClientSetup";

export async function loader({ request }) {
  try {
    const response = await httpClient.get("users");
    return { users: response.data.data };
  } catch (error) {
    console.error("Loader Error:", error);
    throw new Error(error.message || "Failed to load users");
  }
}

const ManageUsers = () => {
  const navigate = useNavigate();
  const { users: initialUsers } = useLoaderData();

  const [allUsers, setAllUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("active");

  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Helper function to display data or N/A if null/undefined
  const displayValue = (value) => value || "N/A";

  // Filter users based on tab and search term
 // Filter users based on tab and search term
useEffect(() => {
  let filtered = allUsers;
  
  // Filter by status first
  filtered = filtered.filter(user => 
    tab === "active" ? user.status === 1 : user.status === 0
  );
  
  // Then filter by search term if exists
  if (searchTerm.trim() !== "") {
    filtered = filtered.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  setFilteredUsers(filtered);
  setPage(0); // Reset to first page when filters change
}, [allUsers, tab, searchTerm]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
  const handleMenuClose = (setter) => () => setter(null);

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? filteredUsers.map((u) => u.id) : []);
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

  const handleToggleActivation = async (userId, currentStatus) => {
    setIsActionLoading(true);
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await httpClient.put(`/users/${userId}`, { status: newStatus });
      
      // Update the allUsers state
      setAllUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      setSnackbar({
        open: true,
        message: `User ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update user status",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkStatusChange = async (activate) => {
    setIsActionLoading(true);
    try {
      await Promise.all(
        selected.map(id => 
          httpClient.put(`/users/${id}`, { status: activate ? 1 : 0 })
        )
      );
      
      // Update all users
      setAllUsers(prevUsers => 
        prevUsers.map(user => 
          selected.includes(user.id) ? { ...user, status: activate ? 1 : 0 } : user
        )
      );
      
      setSnackbar({
        open: true,
        message: `${selected.length} user(s) ${activate ? 'activated' : 'deactivated'} successfully`,
        severity: "success",
      });
      setSelected([]);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || `Failed to ${activate ? 'activate' : 'deactivate'} users`,
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      handleMenuClose(setBulkAnchorEl)();
    }
  };

  const exportData = (type) => {
    const data = filteredUsers.map((user) => ({
      "First Name": displayValue(user.first_name),
      "Middle Name": displayValue(user.middle_name),
      "Last Name": displayValue(user.last_name),
      "Full Name": displayValue(user.name),
      Username: displayValue(user.user_name),
      Email: displayValue(user.email),
      "Company ID": user.company_id,
      "Role ID": user.role_id,
      "Location ID": user.location_id,
      "Location Name": user.location ? displayValue(user.location.name) : "N/A",
      "Verified At": user.email_verified_at || "Not Verified",
      Status: user.status === 1 ? "Active" : "Inactive",
      "Created At": new Date(user.created_at).toLocaleString(),
      "Updated At": new Date(user.updated_at).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    const fileType = type === "csv" ? "csv" : "xlsx";
    const wbout =
      type === "csv"
        ? XLSX.utils.sheet_to_csv(ws)
        : XLSX.write(wb, { bookType: fileType, type: "array" });
    const blob = new Blob([wbout], {
      type:
        type === "csv" ? "text/csv;charset=utf-8;" : "application/octet-stream",
    });
    saveAs(blob, `users_export.${fileType}`);
    setDownloadAnchorEl(null);
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setIsBulkDelete(false);
    setOpenDeleteModal(true);
    handleMenuClose(setRowMenuAnchorEl)();
  };

  const handleBulkDeleteClick = () => {
    setIsBulkDelete(true);
    setOpenDeleteModal(true);
    handleMenuClose(setBulkAnchorEl)();
  };

  const confirmDelete = async () => {
    setIsActionLoading(true);
    try {
      if (isBulkDelete) {
        await Promise.all(
          selected.map((id) => httpClient.delete(`/users/${id}`))
        );

        setAllUsers((prev) => prev.filter((u) => !selected.includes(u.id)));
        setSelected([]);

        setSnackbar({
          open: true,
          message: `${selected.length} users deleted successfully`,
          severity: "success",
        });
      } else {
        await httpClient.delete(`/users/${userToDelete}`);

        setSnackbar({
          open: true,
          message: "User deleted successfully",
          severity: "success",
        });
        setAllUsers((prev) => prev.filter((u) => u.id !== userToDelete));
        setSelected((prev) => prev.filter((id) => id !== userToDelete));
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete user(s)",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenDeleteModal(false);
      setUserToDelete(null);
      setIsBulkDelete(false);
    }
  };

  const renderSkeletonRows = () => {
    return Array(rowsPerPage)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton variant="rectangular" width={20} height={20} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={80} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={150} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={120} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={80} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={80} />
          </TableCell>
          <TableCell>
            <Skeleton variant="circular" width={32} height={32} />
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <Box p={2}>
      {/* Header with controls */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" gap={1}>
          {selected.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              endIcon={<ExpandMore />}
              onClick={handleMenuOpen(setBulkAnchorEl)}
            >
              Bulk Actions
            </Button>
          )}
          {/* <IconButton>
            <BarChart />
          </IconButton> */}
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/users/create")}
          >
            Create User
          </Button>

          <Tabs value={tab} onChange={handleTabChange} sx={{ ml: 2 }}>
            <Tab label="Active" value="active" />
            <Tab label="Inactive" value="archived" />
          </Tabs>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
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
          {/* <IconButton>
            <FilterList />
          </IconButton> */}
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

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                onChange={handleSelectAll}
                checked={
                  selected.length === filteredUsers.length &&
                  filteredUsers.length > 0
                }
              />
            </TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Verified</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(user.id)}
                      onChange={() => handleSelect(user.id)}
                    />
                  </TableCell>
                  <TableCell>{displayValue(user.first_name)}</TableCell>
                  <TableCell>{displayValue(user.last_name)}</TableCell>
                  <TableCell>{displayValue(user.name)}</TableCell>
                  <TableCell>{displayValue(user.user_name)}</TableCell>
                  <TableCell>{displayValue(user.email)}</TableCell>
                  <TableCell>
                    {user.location ? displayValue(user.location.name) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.status === 1}
                      onChange={() => handleToggleActivation(user.id, user.status)}
                      color="primary"
                      disabled={isActionLoading}
                    />
                    {user.status === 1 ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    {user.email_verified_at ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        onClick={() => navigate(`/users/profile/${user.id}`)}
                        size="small"
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {user.name ? user.name.charAt(0) : <Person />}
                        </Avatar>
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          setActiveRowId(user.id);
                          handleMenuOpen(setRowMenuAnchorEl)(e);
                        }}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} align="center">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
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
        <MenuItem onClick={handleBulkDeleteClick}>
          Delete Selected Users
        </MenuItem>
        <MenuItem>Change Roles</MenuItem>
        {/* <MenuItem onClick={() => handleBulkStatusChange(true)}>
          Activate Selected
        </MenuItem>
        <MenuItem onClick={() => handleBulkStatusChange(false)}>
          Deactivate Selected
        </MenuItem> */}
        {/* <MenuItem onClick={() => exportData("csv")}>Export</MenuItem> */}
      </Menu>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose(setAnchorEl)}
      >
        <MenuItem onClick={()=>navigate("/general-settings/roles")}>Manage Roles</MenuItem>
        <MenuItem>Manage Brands</MenuItem>
      </Menu>

      <Menu
        anchorEl={downloadAnchorEl}
        open={Boolean(downloadAnchorEl)}
        onClose={handleMenuClose(setDownloadAnchorEl)}
      >
        <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
        <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
      </Menu>

      <Menu
        anchorEl={rowMenuAnchorEl}
        open={Boolean(rowMenuAnchorEl)}
        onClose={handleMenuClose(setRowMenuAnchorEl)}
      >
        <MenuItem onClick={() => navigate(`/users/${activeRowId}/edit`)}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(activeRowId)}>
          Delete
        </MenuItem>
        {/* <MenuItem>Reset Password</MenuItem> */}
        <MenuItem onClick={() => exportData("csv")}>Export</MenuItem>
      </Menu>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>
          {isBulkDelete ? `Delete ${selected.length} Users?` : "Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isBulkDelete
              ? `Are you sure you want to delete ${selected.length} selected users? This action cannot be undone.`
              : "Are you sure you want to delete this user? This action cannot be undone."}
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
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant= "filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUsers;




// import React, { useState, useEffect } from "react";
// import { useNavigate, useLoaderData } from "react-router-dom";
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
//   Tabs,
//   Tab,
//   Avatar,
// } from "@mui/material";
// import {
//   MoreVert,
//   Search,
//   BarChart,
//   FilterList,
//   Download,
//   ExpandMore,
//   Person,
// } from "@mui/icons-material";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { httpClient } from "../../utils/httpClientSetup";

// // Loader for initial server-side rendering
// export async function loader({ request }) {
//   try {
//     const url = new URL(request.url);
//     const page = url.searchParams.get("page") || 1;
//     const per_page = url.searchParams.get("per_page") || 5;
//     const q = url.searchParams.get("q") || "";

//     let apiUrl = `users?page=${page}&per_page=${per_page}`;
//     if (q) apiUrl += `&q=${encodeURIComponent(q)}`;

//     const response = await httpClient.get(apiUrl);
//     return {
//       users: response.data.data,
//       pagination: response.data.pagination,
//     };
//   } catch (error) {
//     console.error("Loader Error:", error);
//     throw new Error(error.message || "Failed to load users");
//   }
// }

// const ManageUsers = () => {
//   const navigate = useNavigate();
//   const { users: initialUsers, pagination: initialPagination } = useLoaderData();

//   const [users, setUsers] = useState(initialUsers || []);
//   const [pagination, setPagination] = useState(initialPagination || {});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isActionLoading, setIsActionLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [tab, setTab] = useState("active");

//   const [selected, setSelected] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(initialPagination?.current_page - 1 || 0);
//   const [rowsPerPage, setRowsPerPage] = useState(initialPagination?.per_page || 5);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
//   const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
//   const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
//   const [activeRowId, setActiveRowId] = useState(null);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);
//   const [isBulkDelete, setIsBulkDelete] = useState(false);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const displayValue = (value) => value || "N/A";

//   // Fetch users with backend pagination
//   const fetchUsers = async (pageNumber = 1, perPage = rowsPerPage, query = "", status = tab) => {
//     setIsLoading(true);
//     try {
//       let apiUrl = `users?page=${pageNumber}&per_page=${perPage}`;
//       if (query) apiUrl += `&q=${encodeURIComponent(query)}`;
//       if (status) apiUrl += `&status=${status === "active" ? 1 : 0}`;

//       const response = await httpClient.get(apiUrl);
//       setUsers(response.data.data);
//       setPagination(response.data.pagination);
//       setPage(response.data.pagination.current_page - 1);
//     } catch (error) {
//       setError(error.message || "Failed to load users");
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to load users",
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Debounce search & reload tab
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchUsers(1, rowsPerPage, searchTerm, tab);
//     }, 500);
//     return () => clearTimeout(timeoutId);
//   }, [tab, searchTerm]);

//   const handleTabChange = (_, newValue) => {
//     setTab(newValue);
//     setSelected([]);
//   };

//   const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
//   const handleMenuClose = (setter) => () => setter(null);

//   const handleSelectAll = (e) => {
//     setSelected(e.target.checked ? users.map((u) => u.id) : []);
//   };

//   const handleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const handleChangePage = (_, newPage) => {
//     fetchUsers(newPage + 1, rowsPerPage, searchTerm, tab);
//   };

//   const handleChangeRowsPerPage = (e) => {
//     const newRowsPerPage = parseInt(e.target.value, 10);
//     setRowsPerPage(newRowsPerPage);
//     fetchUsers(1, newRowsPerPage, searchTerm, tab);
//   };

//   const handleToggleActivation = async (userId, currentStatus) => {
//     setIsActionLoading(true);
//     try {
//       const newStatus = currentStatus === 1 ? 0 : 1;
//       await httpClient.put(`/users/${userId}`, { status: newStatus });
//       fetchUsers(page + 1, rowsPerPage, searchTerm, tab);
//       setSnackbar({
//         open: true,
//         message: `User ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
//         severity: "success",
//       });
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to update user status",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleBulkStatusChange = async (activate) => {
//     setIsActionLoading(true);
//     try {
//       await Promise.all(
//         selected.map((id) => httpClient.put(`/users/${id}`, { status: activate ? 1 : 0 }))
//       );
//       fetchUsers(page + 1, rowsPerPage, searchTerm, tab);
//       setSnackbar({
//         open: true,
//         message: `${selected.length} user(s) ${activate ? "activated" : "deactivated"} successfully`,
//         severity: "success",
//       });
//       setSelected([]);
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || `Failed to ${activate ? "activate" : "deactivate"} users`,
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       handleMenuClose(setBulkAnchorEl)();
//     }
//   };

//   const exportData = async (type) => {
//     try {
//       const response = await httpClient.get(`users?status=${tab === "active" ? 1 : 0}&q=${searchTerm}`);
//       const allUsers = response.data.data;

//       const data = allUsers.map((user) => ({
//         "First Name": displayValue(user.first_name),
//         "Middle Name": displayValue(user.middle_name),
//         "Last Name": displayValue(user.last_name),
//         "Full Name": displayValue(user.name),
//         Username: displayValue(user.user_name),
//         Email: displayValue(user.email),
//         "Company ID": user.company_id,
//         "Role ID": user.role_id,
//         "Location ID": user.location_id,
//         "Location Name": user.location ? displayValue(user.location.name) : "N/A",
//         "Verified At": user.email_verified_at || "Not Verified",
//         Status: user.status === 1 ? "Active" : "Inactive",
//         "Created At": new Date(user.created_at).toLocaleString(),
//         "Updated At": new Date(user.updated_at).toLocaleString(),
//       }));

//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Users");

//       const fileType = type === "csv" ? "csv" : "xlsx";
//       const wbout =
//         type === "csv"
//           ? XLSX.utils.sheet_to_csv(ws)
//           : XLSX.write(wb, { bookType: fileType, type: "array" });
//       const blob = new Blob([wbout], {
//         type: type === "csv" ? "text/csv;charset=utf-8;" : "application/octet-stream",
//       });
//       saveAs(blob, `users_export.${fileType}`);
//       setDownloadAnchorEl(null);
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to export data",
//         severity: "error",
//       });
//     }
//   };

//   const handleDeleteClick = (id) => {
//     setUserToDelete(id);
//     setIsBulkDelete(false);
//     setOpenDeleteModal(true);
//     handleMenuClose(setRowMenuAnchorEl)();
//   };

//   const handleBulkDeleteClick = () => {
//     setIsBulkDelete(true);
//     setOpenDeleteModal(true);
//     handleMenuClose(setBulkAnchorEl)();
//   };

//   const confirmDelete = async () => {
//     setIsActionLoading(true);
//     try {
//       if (isBulkDelete) {
//         await Promise.all(selected.map((id) => httpClient.delete(`/users/${id}`)));
//         fetchUsers(page + 1, rowsPerPage, searchTerm, tab);
//         setSelected([]);
//         setSnackbar({
//           open: true,
//           message: `${selected.length} users deleted successfully`,
//           severity: "success",
//         });
//       } else {
//         await httpClient.delete(`/users/${userToDelete}`);
//         fetchUsers(page + 1, rowsPerPage, searchTerm, tab);
//         setSnackbar({
//           open: true,
//           message: "User deleted successfully",
//           severity: "success",
//         });
//         setSelected((prev) => prev.filter((id) => id !== userToDelete));
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to delete user(s)",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       setOpenDeleteModal(false);
//       setUserToDelete(null);
//       setIsBulkDelete(false);
//     }
//   };

//   const renderSkeletonRows = () =>
//     Array(rowsPerPage)
//       .fill(0)
//       .map((_, index) => (
//         <TableRow key={`skeleton-${index}`}>
//           <TableCell>
//             <Skeleton variant="rectangular" width={20} height={20} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={100} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={100} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={100} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={80} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={150} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={120} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={80} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={80} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="circular" width={32} height={32} />
//           </TableCell>
//         </TableRow>
//       ));

//   return (
//     <Box p={2}>
//       {/* Header, Tabs & Search */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Box display="flex" gap={1}>
//           {selected.length > 0 && (
//             <Button
//               variant="contained"
//               color="primary"
//               endIcon={<ExpandMore />}
//               onClick={handleMenuOpen(setBulkAnchorEl)}
//             >
//               Bulk Actions
//             </Button>
//           )}
//           <IconButton>
//             <BarChart />
//           </IconButton>
//           <Button
//             variant="contained"
//             color="warning"
//             onClick={() => navigate("/users/create")}
//           >
//             Create User
//           </Button>
//           <Tabs value={tab} onChange={handleTabChange} sx={{ ml: 2 }}>
//             <Tab label="Active" value="active" />
//             <Tab label="Archived" value="archived" />
//           </Tabs>
//         </Box>

//         <Box display="flex" alignItems="center" gap={1}>
//           <TextField
//             size="small"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <IconButton onClick={handleMenuOpen(setDownloadAnchorEl)}>
//             <Download />
//           </IconButton>
//           <IconButton>
//             <FilterList />
//           </IconButton>
//           <IconButton onClick={handleMenuOpen(setAnchorEl)}>
//             <MoreVert />
//           </IconButton>
//         </Box>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {/* User Table */}
//       <Table size="small">
//         <TableHead>
//           <TableRow>
//             <TableCell>
//               <Checkbox
//                 onChange={handleSelectAll}
//                 checked={selected.length === users.length && users.length > 0}
//                 indeterminate={selected.length > 0 && selected.length < users.length}
//               />
//             </TableCell>
//             <TableCell>First Name</TableCell>
//             <TableCell>Last Name</TableCell>
//             <TableCell>Full Name</TableCell>
//             <TableCell>Username</TableCell>
//             <TableCell>Email</TableCell>
//             <TableCell>Location</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Verified</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {isLoading
//             ? renderSkeletonRows()
//             : users.length > 0
//             ? users.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell>
//                     <Checkbox
//                       checked={selected.includes(user.id)}
//                       onChange={() => handleSelect(user.id)}
//                     />
//                   </TableCell>
//                   <TableCell>{displayValue(user.first_name)}</TableCell>
//                   <TableCell>{displayValue(user.last_name)}</TableCell>
//                   <TableCell>{displayValue(user.name)}</TableCell>
//                   <TableCell>{displayValue(user.user_name)}</TableCell>
//                   <TableCell>{displayValue(user.email)}</TableCell>
//                   <TableCell>{user.location ? displayValue(user.location.name) : "N/A"}</TableCell>
//                   <TableCell>
//                     <Switch
//                       checked={user.status === 1}
//                       onChange={() => handleToggleActivation(user.id, user.status)}
//                       color="primary"
//                       disabled={isActionLoading}
//                     />
//                     {user.status === 1 ? "Active" : "Inactive"}
//                   </TableCell>
//                   <TableCell>{user.email_verified_at ? "Yes" : "No"}</TableCell>
//                   <TableCell>
//                     <Box display="flex" alignItems="center" gap={1}>
//                       <IconButton
//                         onClick={() => navigate(`/users/profile/${user.id}`)}
//                         size="small"
//                       >
//                         <Avatar sx={{ width: 32, height: 32 }}>
//                           {user.name ? user.name.charAt(0) : <Person />}
//                         </Avatar>
//                       </IconButton>
//                       <IconButton
//                         onClick={(e) => {
//                           setActiveRowId(user.id);
//                           handleMenuOpen(setRowMenuAnchorEl)(e);
//                         }}
//                         size="small"
//                       >
//                         <MoreVert />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))
//             : (
//               <TableRow>
//                 <TableCell colSpan={10} align="center">
//                   No users found
//                 </TableCell>
//               </TableRow>
//             )}
//         </TableBody>
//       </Table>

//       {/* Backend Pagination */}
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={pagination?.total || 0}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       {/* Menus, Delete Dialog & Snackbar */}
//       <Menu
//         anchorEl={bulkAnchorEl}
//         open={Boolean(bulkAnchorEl)}
//         onClose={handleMenuClose(setBulkAnchorEl)}
//       >
//         <MenuItem onClick={handleBulkDeleteClick}>Delete Selected Users</MenuItem>
//         <MenuItem>Change Roles</MenuItem>
//         <MenuItem onClick={() => handleBulkStatusChange(true)}>Activate Selected</MenuItem>
//         <MenuItem onClick={() => handleBulkStatusChange(false)}>Deactivate Selected</MenuItem>
//         <MenuItem onClick={() => exportData("csv")}>Export</MenuItem>
//       </Menu>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose(setAnchorEl)}
//       >
//         <MenuItem>Manage Roles</MenuItem>
//         <MenuItem>Manage Brands</MenuItem>
//       </Menu>

//       <Menu
//         anchorEl={downloadAnchorEl}
//         open={Boolean(downloadAnchorEl)}
//         onClose={handleMenuClose(setDownloadAnchorEl)}
//       >
//         <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
//         <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
//       </Menu>

//       <Menu
//         anchorEl={rowMenuAnchorEl}
//         open={Boolean(rowMenuAnchorEl)}
//         onClose={handleMenuClose(setRowMenuAnchorEl)}
//       >
//         <MenuItem onClick={() => handleDeleteClick(activeRowId)}>Delete</MenuItem>
//       </Menu>

//       <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             {isBulkDelete
//               ? `Are you sure you want to delete ${selected.length} selected users?`
//               : "Are you sure you want to delete this user?"}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
//           <Button color="error" onClick={confirmDelete} disabled={isActionLoading}>
//             {isActionLoading ? <CircularProgress size={20} /> : "Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ManageUsers;

