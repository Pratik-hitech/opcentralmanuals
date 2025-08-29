import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { httpClient } from "../../../utils/httpClientSetup";

const CreateSectionDialog = ({
  open,
  onClose,
  mode = "create",
  id,
  item = null,
  navigations = [],
  onSaveSuccess,
}) => {
  const [sectionTitle, setSectionTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update title when item changes (for edit mode)
  useEffect(() => {
    if (mode === "edit" && item) {
      setSectionTitle(item.title || "");
    } else {
      setSectionTitle("");
    }
    setError("");
  }, [mode, item, open]);

  // Calculate the proper order for new sections/sub-sections
  const calculateOrder = () => {
    if (mode === "edit") {
      // Keep existing order for edits
      return item?.order || 1;
    }

    if (!item) {
      // Creating a top-level section
      const topLevelItems = navigations.filter((nav) => nav.parent_id === null);
      const maxOrder =
        topLevelItems.length > 0
          ? Math.max(...topLevelItems.map((nav) => nav.order || 0))
          : 0;
      return maxOrder + 1;
    } else {
      // Creating a sub-section
      const children = navigations
        .filter((nav) => nav.parent_id === item.id)
        .concat(
          // Also include children from the tree structure if available
          item.children ? item.children : []
        );
      const maxOrder =
        children.length > 0
          ? Math.max(...children.map((child) => child.order || 0))
          : 0;
      return maxOrder + 1;
    }
  };

  const handleSaveSection = async () => {
    if (!sectionTitle.trim()) {
      setError("Title is required");
      return;
    }

    setError("");

    const payload = {
      title: sectionTitle.trim(),
      collection_id: id,
      order: String(calculateOrder()),
    };

    try {
      setLoading(true);

      // Add parent_id only if creating a sub-section
      if (mode === "create" && item) {
        payload.parent_id = item.id;
      } else if (mode === "edit" && item.parent_id) {
        payload.parent_id = item.parent_id;
      }

      if (mode === "edit") {
        // Update existing section
        await httpClient.put(`/navigations/${item.id}`, payload);
      } else {
        // Create new section
        await httpClient.post("/navigations", payload);
      }

      // Notify parent component of successful save
      if (onSaveSuccess) {
        await onSaveSuccess();
      }

      handleClose();
    } catch (err) {
      console.error("Error saving section:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${mode === "edit" ? "update" : "create"} section`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSectionTitle("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {mode === "edit" ? "Edit Section" : "Create Section"}
          </Typography>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          sx={{ mt: 1 }}
          disabled={loading}
          error={!!error && !sectionTitle.trim()}
          helperText={error && !sectionTitle.trim() ? error : ""}
        />
        {error && sectionTitle.trim() && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveSection}
          variant="contained"
          disabled={!sectionTitle.trim() || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : mode === "edit" ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSectionDialog;
