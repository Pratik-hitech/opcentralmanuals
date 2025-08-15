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
  item = null,
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

  const handleSaveSection = async () => {
    if (!sectionTitle.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title: sectionTitle.trim(),
        collection_id: 1, // TODO: Make this dynamic later
        order: "1", // TODO: Implement proper ordering logic
      };

      // Add parent_id only if creating a sub-section
      if (mode === "create" && item) {
        payload.parent_id = item.id;
      } else if (mode === "edit" && item.parent_id) {
        payload.parent_id = item.parent_id;
      }

      console.log("Payload:", payload);

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
