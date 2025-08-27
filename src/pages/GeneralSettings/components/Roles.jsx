import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Skeleton,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  TablePagination,
  TextField,
  InputAdornment,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { Edit, Delete, ContentCopy, Search } from "@mui/icons-material";
import { httpClient } from "../../../utils/httpClientSetup";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../../context/PermissionsContext";

const RolesTable = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { canEditRole, canDeleteRole } = usePermission(); // updated context

  // Data state
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);

  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    roleId: null,
    roleName: ""
  });

  // Notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch roles
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.get("roles");
      if (response.data?.success) {
        setRoles(response.data.data);
        setFilteredRoles(response.data.data);
      } else {
        setError(response.data?.message || "Failed to fetch roles");
      }
    } catch (err) {
      setError(err.message || "Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoles(roles);
    } else {
      setFilteredRoles(
        roles.filter(role =>
          role.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setPage(0);
  }, [searchTerm, roles]);

  const handleDelete = async () => {
    setIsActionLoading(true);
    try {
      const response = await httpClient.delete(`roles/${deleteDialog.roleId}`);
      if (response.data?.success) {
        setSnackbar({ open: true, message: "Role deleted successfully", severity: "success" });
        fetchRoles();
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to delete role", severity: "error" });
    } finally {
      setIsActionLoading(false);
      setDeleteDialog({ open: false, roleId: null, roleName: "" });
    }
  };

  const handleClone = async (roleId) => {
    setIsActionLoading(true);
    try {
      const roleResponse = await httpClient.get(`roles/${roleId}`);
      if (roleResponse.data?.success) {
        const roleData = roleResponse.data.data;
        const newRole = { ...roleData, name: `${roleData.name}-copy` };
        delete newRole.id;
        delete newRole.created_at;
        delete newRole.updated_at;

        const createResponse = await httpClient.post("roles", newRole);
        if (createResponse.data?.success) {
          setSnackbar({ open: true, message: "Role cloned successfully", severity: "success" });
          fetchRoles();
        }
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to clone role", severity: "error" });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  const renderSkeletonRows = () =>
    Array(rowsPerPage).fill(0).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell sx={{ px: 3 }}><Skeleton variant="text" width={isMobile ? 120 : 200} /></TableCell>
        <TableCell sx={{ px: 3 }}>
          <Box display="flex" gap={2}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </TableCell>
      </TableRow>
    ));

  const formatRoleName = (name) => name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const isAdminRole = (roleName) => roleName.toLowerCase() === 'admin';

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 500, color: theme.palette.text.primary }}>
        List of Roles
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}
        sx={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size={isMobile ? "small" : "medium"}
          onClick={() => navigate("/general-settings/roles/create")}
          sx={{ minWidth: isMobile ? '100%' : 'auto' }}
        >
          {isMobile ? "Add Role" : "Create New Roles"}
        </Button>

        <TextField
          size="small"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth={isMobile}
          InputProps={{
            sx: { fontSize: isMobile ? "14px" : "inherit", height: isMobile ? "40px" : "auto" },
            endAdornment: (<InputAdornment position="end"><Search /></InputAdornment>)
          }}
          sx={{ width: isMobile ? '100%' : 300, backgroundColor: theme.palette.background.paper }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} variant="filled">{error}</Alert>}

      <Box sx={{ overflowX: "auto", backgroundColor: theme.palette.background.paper, borderRadius: 1, boxShadow: theme.shadows[1] }}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ px: 3, py: 2, fontWeight: 600 }}>Role Name</TableCell>
              <TableCell sx={{ px: 3, py: 2, fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? renderSkeletonRows() :
              filteredRoles.length > 0 ? filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(role => (
                <TableRow key={role.id} hover>
                  <TableCell sx={{ px: 3, py: 2, textTransform: 'capitalize' }}>
                    {formatRoleName(role.name)}
                  </TableCell>
                  <TableCell sx={{ px: 3, py: 2 }}>
                    <Box display="flex" gap={2}>
                      <Tooltip title={isAdminRole(role.name) ? "Cannot edit Admin role" : "Edit role"} arrow>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => !isAdminRole(role.name) && navigate(`edit/${role.id}`)}
                            sx={{
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              p: 1,
                              color: theme.palette.primary.main,
                              opacity: isAdminRole(role.name) ? 0.5 : 1,
                              '&:hover': { backgroundColor: theme.palette.primary.light, color: theme.palette.primary.contrastText }
                            }}
                            disabled={isAdminRole(role.name)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Clone role" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleClone(role.id)}
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            p: 1,
                            color: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.secondary.light, color: theme.palette.secondary.contrastText }
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={isAdminRole(role.name) ? "Cannot delete Admin role" : "Delete role"} arrow>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => !isAdminRole(role.name) && setDeleteDialog({ open: true, roleId: role.id, roleName: role.name })}
                            sx={{
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              p: 1,
                              color: theme.palette.error.main,
                              opacity: isAdminRole(role.name) ? 0.5 : 1,
                              '&:hover': { backgroundColor: theme.palette.error.light, color: theme.palette.error.contrastText }
                            }}
                            disabled={isAdminRole(role.name)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              )) :
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ px: 3, py: 4 }}>No roles found</TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRoles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2, '& .MuiTablePagination-toolbar': { px: 0 } }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the role "{formatRoleName(deleteDialog.roleName)}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

      {isActionLoading && (
        <Box position="fixed" top={0} left={0} right={0} bottom={0} display="flex" justifyContent="center" alignItems="center" bgcolor="rgba(0,0,0,0.1)" zIndex={9999}>
          <CircularProgress />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ '& .MuiSnackbarContent-root': { width: '100%' } }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RolesTable;
