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
  Avatar,
  Tabs,
  Tab,
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

// Loader function that fetches data from the mock API
export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "active";
    
    const apiUrl = 'https://6888d05fadf0e59551bb8590.mockapi.io/api/v1/users';
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('API Response:', response.status, response.statusText);
      throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }
    
    const apiUsers = await response.json();
    console.log('API Response:', apiUsers);
    
    // Filter based on status if needed
    const filteredUsers = status === "active" 
      ? apiUsers.filter(user => user.activated) 
      : apiUsers.filter(user => !user.activated);
    
    // Transform the API data
    const transformedUsers = filteredUsers.map(user => ({
      id: user.id,
      lastName: user.LastName || "N/A",
      firstName: user.firstName || "N/A",
      username: user.username || "N/A",
      role: user.role || "User",
      email: user.email || "N/A",
      location: user.location || "N/A",
      activated: user.activated || false,
      brand: user.brand || "N/A",
      avatar: user.avatar || "",
      createdAt: user.createdAt || new Date().toISOString()
    }));
    
    return { users: transformedUsers };
  } catch (error) {
    console.error('Loader Error:', error);
    throw new Error(error.message || "Failed to load users");
  }
}

const ManageUsers = () => {
  const navigate = useNavigate();
  const { users: initialUsers } = useLoaderData();

  // Data state
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("active");

  // UI state
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Menu/dialog state
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, users]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    navigate(`?status=${newValue}`);
  };

  // Menu handlers
  const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
  const handleMenuClose = (setter) => () => setter(null);

  // Row selection
  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? filteredUsers.map((u) => u.id) : []);
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Pagination
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Toggle activation status
  const handleToggleActivation = async (userId, currentStatus) => {
    setIsActionLoading(true);
    try {
      const newStatus = !currentStatus;
      
      const response = await fetch(
        `https://6888d05fadf0e59551bb8590.mockapi.io/api/v1/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ activated: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const updatedUser = await response.json();

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, activated: updatedUser.activated }
          : user
      ));
      setFilteredUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, activated: updatedUser.activated }
          : user
      ));
      
      setSnackbar({
        open: true,
        message: `User ${newStatus ? "activated" : "deactivated"} successfully`,
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

  // Export
  const exportData = (type) => {
    const data = filteredUsers.map((user) => ({
      "Last Name": user.lastName,
      "First Name": user.firstName,
      "Username": user.username,
      "Role": user.role,
      "Email": user.email,
      "Location": user.location,
      "Activated": user.activated ? "Yes" : "No",
      "Brand": user.brand,
      "Created At": user.createdAt,
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

  // Delete actions
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
        // Bulk delete
        const deletePromises = selected.map(id => 
          fetch(`https://6888d05fadf0e59551bb8590.mockapi.io/api/v1/users/${id}`, {
            method: "DELETE",
          })
        );
        
        const responses = await Promise.all(deletePromises);
        const allSuccessful = responses.every(response => response.ok);
        
        if (!allSuccessful) {
          throw new Error("Failed to delete some users");
        }
        
        setUsers(prev => prev.filter(u => !selected.includes(u.id)));
        setFilteredUsers(prev => prev.filter(u => !selected.includes(u.id)));
        setSelected([]);
        
        setSnackbar({
          open: true,
          message: `${selected.length} users deleted successfully`,
          severity: "success",
        });
      } else {
        // Single delete
        const response = await fetch(
          `https://6888d05fadf0e59551bb8590.mockapi.io/api/v1/users/${userToDelete}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        setSnackbar({
          open: true,
          message: "User deleted successfully",
          severity: "success",
        });
        setUsers(prev => prev.filter(u => u.id !== userToDelete));
        setFilteredUsers(prev => prev.filter(u => u.id !== userToDelete));
        setSelected(prev => prev.filter(id => id !== userToDelete));
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

  // Skeleton loader
  const renderSkeletonRows = () => {
    return Array(rowsPerPage).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
        <TableCell><Skeleton variant="text" width={100} /></TableCell>
        <TableCell><Skeleton variant="text" width={100} /></TableCell>
        <TableCell><Skeleton variant="text" width={80} /></TableCell>
        <TableCell><Skeleton variant="text" width={80} /></TableCell>
        <TableCell><Skeleton variant="text" width={150} /></TableCell>
        <TableCell><Skeleton variant="text" width={120} /></TableCell>
        <TableCell><Skeleton variant="text" width={80} /></TableCell>
        <TableCell><Skeleton variant="text" width={80} /></TableCell>
        <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
      </TableRow>
    ));
  };

  return (
    <Box p={2}>
      {/* Header with controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
          <IconButton>
            <BarChart />
          </IconButton>
          <Button 
            variant="contained" 
            color="warning" 
            onClick={() => navigate("/users/create")}
          >
            Create User
          </Button>

          {/* Active/Archived Tabs */}
          <Tabs 
            value={tab} 
            onChange={handleTabChange}
            sx={{ ml: 2 }}
          >
            <Tab label="Active" value="active" />
            <Tab label="Archived" value="archived" />
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
          <IconButton>
            <FilterList />
          </IconButton>
          <IconButton onClick={handleMenuOpen(setAnchorEl)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
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
            <TableCell>Last Name</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Activated</TableCell>
            <TableCell>Brand</TableCell>
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
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.activated}
                      onChange={() => handleToggleActivation(user.id, user.activated)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{user.brand}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        onClick={() => navigate(`/users/profile/${user.id}`)}
                        size="small"
                      >
                        <Box
                          width={32}
                          height={32}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          border="1px solid #ccc"
                          borderRadius={1}
                        >
                          <Person fontSize="small" />
                        </Box>
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

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkAnchorEl}
        open={Boolean(bulkAnchorEl)}
        onClose={handleMenuClose(setBulkAnchorEl)}
      >
        <MenuItem onClick={handleBulkDeleteClick}>Delete Selected Users</MenuItem>
        <MenuItem>Change Roles</MenuItem>
        <MenuItem onClick={() => {
          // Bulk activate
          setUsers(prev => prev.map(user => 
            selected.includes(user.id) ? { ...user, activated: true } : user
          ));
          setFilteredUsers(prev => prev.map(user => 
            selected.includes(user.id) ? { ...user, activated: true } : user
          ));
          setBulkAnchorEl(null);
        }}>
          Activate Selected
        </MenuItem>
        <MenuItem onClick={() => {
          // Bulk deactivate
          setUsers(prev => prev.map(user => 
            selected.includes(user.id) ? { ...user, activated: false } : user
          ));
          setFilteredUsers(prev => prev.map(user => 
            selected.includes(user.id) ? { ...user, activated: false } : user
          ));
          setBulkAnchorEl(null);
        }}>
          Deactivate Selected
        </MenuItem>
        <MenuItem onClick={() => exportData("csv")}>Export</MenuItem>
      </Menu>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose(setAnchorEl)}
      >
        <MenuItem>Manage Roles</MenuItem>
        <MenuItem>Manage Brands</MenuItem>
      </Menu>

      {/* Download Menu */}
      <Menu
        anchorEl={downloadAnchorEl}
        open={Boolean(downloadAnchorEl)}
        onClose={handleMenuClose(setDownloadAnchorEl)}
      >
        <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
        <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
      </Menu>

      {/* Row Actions Menu */}
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
        <MenuItem>Reset Password</MenuItem>
        <MenuItem onClick={() => exportData("csv")}>Export</MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
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

      {/* Action Loader */}
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

      {/* Snackbar Notification */}
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

export default ManageUsers;