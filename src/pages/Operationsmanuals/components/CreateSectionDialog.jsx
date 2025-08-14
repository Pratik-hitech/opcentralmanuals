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
} from "@mui/material";
import { Close } from "@mui/icons-material";

const CreateSectionDialog = ({
  open,
  onClose,
  mode = "create",
  item = null,
}) => {
  const [sectionTitle, setSectionTitle] = useState("");

  // Update title when item changes (for edit mode)
  useEffect(() => {
    if (mode === "edit" && item) {
      setSectionTitle(item.title || "");
    } else {
      setSectionTitle("");
    }
  }, [mode, item, open]);

  const handleSaveSection = () => {
    if (mode === "edit") {
      // Edit logic
      console.log("Editing section:", sectionTitle, "ID:", item?.id);
    } else {
      // Create logic
      console.log("Creating section:", sectionTitle);
    }
    handleClose();
  };

  const handleClose = () => {
    setSectionTitle("");
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
          <IconButton onClick={handleClose} size="small">
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
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSaveSection}
          variant="contained"
          disabled={!sectionTitle.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSectionDialog;
