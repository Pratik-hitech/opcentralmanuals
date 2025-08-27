import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Typography,
  TableContainer,
  Box,
  Skeleton,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { httpClient } from "../../../utils/httpClientSetup";

const SystemPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    setLoading(true);
    httpClient("roles")
      .then((res) => {
        setRoles(res?.data?.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setLoading(false);
        showSnackbar("Error fetching roles", "error");
      });
  };

  const handleCheckboxChange = (roleId, field, value) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? { 
              ...role, 
              permissions: { 
                ...role.permissions, 
                [field]: value ? "1" : "0" 
              } 
            }
          : role
      )
    );
  };

  const handleSelectChange = (roleId, field, value) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? { 
              ...role, 
              permissions: { 
                ...role.permissions, 
                [field]: value.toString() 
              } 
            }
          : role
      )
    );
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    
    try {
      // Update each role that has changes
      const updatePromises = roles.map(role => 
        httpClient(`roles/${role.id}`, {
          method: "PUT",
          data: {
            permissions: role.permissions
          }
        })
      );
      
      await Promise.all(updatePromises);
      showSnackbar("Permissions updated successfully!", "success");
    } catch (error) {
      console.error("Error updating permissions:", error);
      showSnackbar("Error updating permissions", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await httpClient(`roles/${roleId}`, {
          method: "DELETE"
        });
        
        showSnackbar("Role deleted successfully", "success");
        fetchRoles(); // Refresh the list
      } catch (error) {
        console.error("Error deleting role:", error);
        showSnackbar("Error deleting role", "error");
      }
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const renderSkeletonRow = () => (
    <TableRow>
      {Array.from({ length: 10 }).map((_, idx) => (
        <TableCell key={idx}>
          <Skeleton
            variant="rectangular"
            width={idx === 0 ? "80%" : 24} 
            height={24}
          />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <>
      <Paper
        sx={{
          p: 2,
          border: "1px solid #bbb",
          boxShadow: 2,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            System Permissions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveChanges}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>

        <TableContainer component={Box} sx={{ overflowX: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Manage System Settings</TableCell>
                <TableCell>Regional Manager</TableCell>
                <TableCell>Manage Locations &amp; Details</TableCell>
                <TableCell>Manage Users</TableCell>
                <TableCell>Can Delete Users/Locations</TableCell>
                <TableCell>Can Tag User Groups</TableCell>
                <TableCell>Manage Custom Fields</TableCell>
                <TableCell>Manage System Fields</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <React.Fragment key={idx}>{renderSkeletonRow()}</React.Fragment>
                  ))
                : roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.label || role.name}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={role.permissions?.manage_system_setting === "1"}
                          onChange={(e) =>
                            handleCheckboxChange(
                              role.id,
                              "manage_system_setting",
                              e.target.checked
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={role.permissions?.regional_manager === "1"}
                          onChange={(e) =>
                            handleCheckboxChange(
                              role.id,
                              "regional_manager",
                              e.target.checked
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={role.permissions?.location_details || "0"}
                          onChange={(e) =>
                            handleSelectChange(role.id, "location_details", e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="0">Across All</MenuItem>
                          <MenuItem value="1">Users Locations</MenuItem>
                          <MenuItem value="2">Users Managed Regions</MenuItem>
                          <MenuItem value="3">No</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={role.permissions?.user_details || "0"}
                          onChange={(e) =>
                            handleSelectChange(role.id, "user_details", e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="0">Across All</MenuItem>
                          <MenuItem value="1">Users Locations</MenuItem>
                          <MenuItem value="2">Users Managed Regions</MenuItem>
                          <MenuItem value="3">No</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={role.permissions?.location_delete === "1"}
                          onChange={(e) =>
                            handleCheckboxChange(
                              role.id,
                              "location_delete",
                              e.target.checked
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={role.permissions?.can_tag_user_groups === "1"}
                          onChange={(e) =>
                            handleCheckboxChange(
                              role.id,
                              "can_tag_user_groups",
                              e.target.checked
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={role.permissions?.manage_custom_fields === "1"}
                          onChange={(e) =>
                            handleCheckboxChange(
                              role.id,
                              "manage_custom_fields",
                              e.target.checked
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={role.permissions?.manage_system_fields === "1"}
                          onChange={(e) =>
                            handleCheckboxChange(
                              role.id,
                              "manage_system_fields",
                              e.target.checked
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="error"
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={saving}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SystemPermissions;