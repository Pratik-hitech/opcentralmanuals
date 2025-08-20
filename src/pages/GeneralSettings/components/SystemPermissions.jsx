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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { httpClient } from "../../../utils/httpClientSetup";

const SystemPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    httpClient("roles").then((res) => {
      setRoles(res?.data?.data || []);
      setLoading(false);
    });
  }, []);

  const handleCheckboxChange = (roleId, field, value) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? { ...role, permissions: { ...role.permissions, [field]: value } }
          : role
      )
    );
  };

  const handleSelectChange = (roleId, field, value) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? { ...role, permissions: { ...role.permissions, [field]: value } }
          : role
      )
    );
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
    <Paper
      sx={{
        p: 2,
        border: "1px solid #bbb",
        boxShadow: 2,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        System Permissions
      </Typography>

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
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={role.permissions?.manage_system_settings || false}
                        onChange={(e) =>
                          handleCheckboxChange(
                            role.id,
                            "manage_system_settings",
                            e.target.checked
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={role.permissions?.regional_manager || false}
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
                        value={role.permissions?.location_details ?? 0}
                        onChange={(e) =>
                          handleSelectChange(role.id, "location_details", e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value={0}>Across All</MenuItem>
                        <MenuItem value={1}>Users Locations</MenuItem>
                        <MenuItem value={2}>Users Managed Regions</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={role.permissions?.managed_users ?? 0}
                        onChange={(e) =>
                          handleSelectChange(role.id, "managed_users", e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value={0}>Across All</MenuItem>
                        <MenuItem value={1}>Users Locations</MenuItem>
                        <MenuItem value={2}>Users Managed Regions</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={role.permissions?.can_delete_users_locations || false}
                        onChange={(e) =>
                          handleCheckboxChange(
                            role.id,
                            "can_delete_users_locations",
                            e.target.checked
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={role.permissions?.can_tag_user_groups || false}
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
                        checked={role.permissions?.manage_custom_fields || false}
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
                        checked={role.permissions?.manage_system_fields || false}
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
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SystemPermissions;
