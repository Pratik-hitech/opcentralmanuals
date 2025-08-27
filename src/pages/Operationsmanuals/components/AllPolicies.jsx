import React, { useState, useEffect } from "react";
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
  Tooltip,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  MoreVert,
  Search,
  Download,
  Visibility,
  Edit,
  FileCopy,
  Archive,
  Delete,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { httpClient } from "../../../utils/httpClientSetup";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const AllPolicies = () => {
  // State declarations
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tabValue, setTabValue] = useState("active");

  const navigate = useNavigate();

  // Fetch policies
  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.get("policies");

      const { data } = response;

      if (data.success) {
        setPolicies(data.data);

        // Filter based on current tab
        const filtered = data.data.filter((policy) =>
          tabValue === "active" ? !policy.archived : policy.archived
        );

        setFilteredPolicies(filtered);
        setSelected([]);
      } else {
        setError("Failed to fetch policies");
      }
    } catch (error) {
      setError(error.message || "Failed to load policies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [tabValue]);

  // Filter policies based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      const filtered = policies.filter((policy) =>
        tabValue === "active" ? !policy.archived : policy.archived
      );
      setFilteredPolicies(filtered);
    } else {
      const filtered = policies.filter(
        (policy) =>
          (tabValue === "active" ? !policy.archived : policy.archived) &&
          (policy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            policy.manuals?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            policy.updatedBy?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPolicies(filtered);
    }
    setPage(0);
  }, [searchTerm, policies, tabValue]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Helper functions
  const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
  const handleMenuClose = (setter) => () => setter(null);

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? filteredPolicies.map((p) => p.id) : []);
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

  const handleEditClick = (id) => {
    setRowMenuAnchorEl(null);

    navigate(`/manuals/edit/${id}/policies/edit/${id}/details`);
  };

  // Archive a policy
  const handleArchivePolicy = async (policyId) => {
    setIsActionLoading(true);
    try {
      const response = await httpClient.put(
        `https://6894256bbe3700414e121f1d.mockapi.io/policies/policies/${policyId}`,
        {
          archived: true,
        }
      );

      if (response.data) {
        setSnackbar({
          open: true,
          message: "Policy archived successfully",
          severity: "success",
        });
        fetchPolicies();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to archive policy",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenArchiveModal(false);
    }
  };

  // Unarchive a policy
  const handleUnarchivePolicy = async (policyId) => {
    setIsActionLoading(true);
    try {
      const response = await httpClient.put(
        `https://6894256bbe3700414e121f1d.mockapi.io/policies/policies/${policyId}`,
        {
          archived: false,
        }
      );

      if (response.data) {
        setSnackbar({
          open: true,
          message: "Policy unarchived successfully",
          severity: "success",
        });
        fetchPolicies();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to unarchive policy",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Bulk archive
  const handleBulkArchive = async () => {
    setIsActionLoading(true);
    try {
      const responses = await Promise.all(
        selected.map((id) =>
          httpClient.put(
            `https://6894256bbe3700414e121f1d.mockapi.io/policies/policies/${id}`,
            {
              archived: true,
            }
          )
        )
      );

      const successfulArchives = responses.filter((response) => response.data);

      if (successfulArchives.length > 0) {
        setSnackbar({
          open: true,
          message: `Successfully archived ${successfulArchives.length} policy(s)`,
          severity: "success",
        });
        fetchPolicies();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to archive policies",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenArchiveModal(false);
    }
  };

  // Bulk unarchive
  const handleBulkUnarchive = async () => {
    setIsActionLoading(true);
    try {
      const responses = await Promise.all(
        selected.map((id) =>
          httpClient.put(
            `https://6894256bbe3700414e121f1d.mockapi.io/policies/policies/${id}`,
            {
              archived: false,
            }
          )
        )
      );

      const successfulUnarchives = responses.filter(
        (response) => response.data
      );

      if (successfulUnarchives.length > 0) {
        setSnackbar({
          open: true,
          message: `Successfully unarchived ${successfulUnarchives.length} policy(s)`,
          severity: "success",
        });
        fetchPolicies();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to unarchive policies",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Clone policy
  const handleClonePolicy = async (policyId) => {
    setIsActionLoading(true);
    try {
      const policyToClone = policies && policies.find((p) => p.id === policyId);
      const response = await httpClient.post(
        "https://6894256bbe3700414e121f1d.mockapi.io/policies/policies",
        { ...policyToClone, title: `${policyToClone.title} (Copy)` }
      );

      if (response.data) {
        setSnackbar({
          open: true,
          message: "Policy cloned successfully",
          severity: "success",
        });
        fetchPolicies();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to clone policy",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      handleMenuClose(setRowMenuAnchorEl)();
    }
  };

  // Delete policy
  const handleDeleteClick = (id) => {
    setPolicyToDelete(id);
    setOpenDeleteModal(true);
    handleMenuClose(setRowMenuAnchorEl)();
  };

  const confirmDelete = async () => {
    setIsActionLoading(true);
    try {
      const response = await httpClient.delete(
        `https://6894256bbe3700414e121f1d.mockapi.io/policies/policies/${policyToDelete}`
      );

      if (response.data) {
        setSnackbar({
          open: true,
          message: "Policy deleted successfully",
          severity: "success",
        });
        fetchPolicies();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete policy",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenDeleteModal(false);
      setPolicyToDelete(null);
    }
  };

  // Export data
  const exportData = (type) => {
    const data = filteredPolicies.map((policy) => ({
      "Policy Name": policy.title,
      Manuals: policy.manuals,
      "Public URL": policy.publicURL,
      Version: policy.version,
      "Updated On": formatDate(policy.updated_at),
      "Updated By": policy.updatedBy,
      Status: policy.archived ? "Archived" : "Active",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Policies");

    const fileType = type === "csv" ? "csv" : "xlsx";
    const wbout =
      type === "csv"
        ? XLSX.utils.sheet_to_csv(ws)
        : XLSX.write(wb, { bookType: fileType, type: "array" });
    const blob = new Blob([wbout], {
      type:
        type === "csv" ? "text/csv;charset=utf-8;" : "application/octet-stream",
    });
    saveAs(blob, `policies_export.${fileType}`);
    setDownloadAnchorEl(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  // Status chip component
  const StatusChip = ({ archived }) => {
    return (
      <Chip
        label={archived ? "Archived" : "Active"}
        color={archived ? "default" : "success"}
        size="small"
      />
    );
  };

  // Skeleton loader
  const renderSkeletonRows = () => {
    return Array(rowsPerPage)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton variant="rectangular" width={20} height={20} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={200} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={150} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={150} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={80} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={120} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={120} />
          </TableCell>
          <TableCell>
            <Skeleton variant="circular" width={32} height={32} />
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
              endIcon={<MoreVert />}
              onClick={handleMenuOpen(setBulkAnchorEl)}
              disabled={isActionLoading}
            >
              Bulk Actions
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            disabled={isActionLoading}
          >
            Create Policy
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            size="small"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isActionLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            onClick={handleMenuOpen(setDownloadAnchorEl)}
            disabled={isActionLoading}
          >
            <Download />
          </IconButton>
          <IconButton
            onClick={handleMenuOpen(setAnchorEl)}
            disabled={isActionLoading}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label="Active"
            value="active"
            disabled={isActionLoading}
            sx={{
              fontWeight: tabValue === "active" ? "bold" : "normal",
              minWidth: 100,
            }}
          />
          <Tab
            label="Archived"
            value="archived"
            disabled={isActionLoading}
            sx={{
              fontWeight: tabValue === "archived" ? "bold" : "normal",
              minWidth: 100,
            }}
          />
        </Tabs>
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
                  selected.length === filteredPolicies.length &&
                  filteredPolicies.length > 0
                }
                disabled={isActionLoading || isLoading}
              />
            </TableCell>
            <TableCell>Policy Name</TableCell>
            <TableCell>Manuals</TableCell>
            <TableCell>Public URL</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Updated On</TableCell>
            <TableCell>Updated By</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            renderSkeletonRows()
          ) : filteredPolicies.length > 0 ? (
            filteredPolicies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(policy.id)}
                      onChange={() => handleSelect(policy.id)}
                      disabled={isActionLoading}
                    />
                  </TableCell>
                  <TableCell>{policy.title}</TableCell>
                  <TableCell>{policy.manuals}</TableCell>
                  <TableCell>
                    <a
                      href={policy.publicURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </TableCell>
                  <TableCell>v{policy.version}</TableCell>
                  <TableCell>{formatDate(policy.updated_at)}</TableCell>
                  <TableCell>{policy.updatedBy}</TableCell>
                  <TableCell>
                    <StatusChip archived={policy.archived} />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Tooltip title="View" placement="top">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            navigate(
                              `/operations/manuals/policies/policy/${policy.id}`
                            )
                          }
                          disabled={isActionLoading}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setActiveRowId(policy.id);
                          handleMenuOpen(setRowMenuAnchorEl)(e);
                        }}
                        disabled={isActionLoading}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No {tabValue === "active" ? "active" : "archived"} policies
                found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPolicies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        disabled={isActionLoading || isLoading}
      />

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkAnchorEl}
        open={Boolean(bulkAnchorEl)}
        onClose={handleMenuClose(setBulkAnchorEl)}
      >
        {tabValue === "active" ? (
          <MenuItem onClick={() => setOpenArchiveModal(true)}>Archive</MenuItem>
        ) : (
          <MenuItem onClick={handleBulkUnarchive}>Unarchive</MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setOpenDeleteModal(true);
            handleMenuClose(setBulkAnchorEl)();
          }}
        >
          Delete
        </MenuItem>
        <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
        <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
      </Menu>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose(setAnchorEl)}
      >
        <MenuItem>Manage Policy Categories</MenuItem>
        <MenuItem onClick={() => exportData("csv")}>Export All as CSV</MenuItem>
        <MenuItem onClick={() => exportData("xlsx")}>
          Export All as Excel
        </MenuItem>
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
        <MenuItem
          onClick={() => handleEditClick(activeRowId)}
          disabled={isActionLoading}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleClonePolicy(activeRowId)}
          disabled={isActionLoading}
        >
          <FileCopy fontSize="small" sx={{ mr: 1 }} /> Clone
        </MenuItem>
        {policies && policies.find((p) => p.id === activeRowId)?.archived ? (
          <MenuItem
            onClick={() => {
              handleUnarchivePolicy(activeRowId);
              handleMenuClose(setRowMenuAnchorEl)();
            }}
            disabled={isActionLoading}
          >
            <Archive fontSize="small" sx={{ mr: 1 }} /> Unarchive
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setPolicyToDelete(activeRowId);
              setOpenArchiveModal(true);
              handleMenuClose(setRowMenuAnchorEl)();
            }}
            disabled={isActionLoading}
          >
            <Archive fontSize="small" sx={{ mr: 1 }} /> Archive
          </MenuItem>
        )}
        <MenuItem
          onClick={() => handleDeleteClick(activeRowId)}
          disabled={isActionLoading}
        >
          <Delete fontSize="small" sx={{ mr: 1, color: "error.main" }} /> Delete
        </MenuItem>
        <MenuItem onClick={() => exportData("csv")} disabled={isActionLoading}>
          Export
        </MenuItem>
      </Menu>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={openArchiveModal}
        onClose={() => setOpenArchiveModal(false)}
      >
        <DialogTitle>
          {selected.length > 1 ? "Archive Policies" : "Archive Policy"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selected.length > 1
              ? `Are you sure you want to archive ${selected.length} selected policies?`
              : "Are you sure you want to archive this policy?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenArchiveModal(false)}
            color="primary"
            disabled={isActionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selected.length > 0) {
                handleBulkArchive();
              } else if (policyToDelete) {
                handleArchivePolicy(policyToDelete);
              }
            }}
            color="error"
            autoFocus
            disabled={isActionLoading}
          >
            {isActionLoading ? "Archiving..." : "Confirm Archive"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>
          {selected.length > 1 ? "Delete Policies" : "Delete Policy"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selected.length > 1
              ? `Are you sure you want to delete ${selected.length} selected policies? This action cannot be undone.`
              : "Are you sure you want to delete this policy? This action cannot be undone."}
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
            onClick={() => {
              if (selected.length > 0) {
                confirmDelete();
              } else if (policyToDelete) {
                confirmDelete();
              }
            }}
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
          bgcolor="rgba(0,0,0.1)"
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
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllPolicies;
