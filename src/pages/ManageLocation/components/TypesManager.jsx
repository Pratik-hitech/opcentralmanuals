import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { httpClient } from "../../../utils/httpClientSetup";

const ManageTypesModal = ({ open, onClose, onTypesUpdated }) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newType, setNewType] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Check if we're in editing mode
  const isEditing = editingId !== null;

  // fetch types
  const fetchTypes = async () => {
    setLoading(true);
    try {
      const { data } = await httpClient.get("/location/types");
      setTypes(data.data || []);
    } catch (err) {
      console.error("Error fetching types", err);
      showSnackbar("Failed to load types", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchTypes();
  }, [open]);

  // add new type
  const handleAddType = async () => {
    if (!newType.trim()) return;
    try {
      await httpClient.post("/location/types", { name: newType });
      setNewType("");
      fetchTypes();
      onTypesUpdated();
      showSnackbar("Type added successfully", "success");
    } catch (err) {
      console.error("Error adding type", err);
      showSnackbar("Failed to add type", "error");
    }
  };

  // delete type confirmation
  const confirmDelete = (type) => {
    setTypeToDelete(type);
    setDeleteConfirmOpen(true);
  };

  // execute delete after confirmation
  const executeDelete = async () => {
    try {
      await httpClient.delete(`/location/types/${typeToDelete.id}`);
      fetchTypes();
      onTypesUpdated();
      showSnackbar("Type deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting type", err);
      showSnackbar("Failed to delete type", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setTypeToDelete(null);
    }
  };

  // cancel delete
  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setTypeToDelete(null);
  };

  // start editing
  const startEditing = (type) => {
    setEditingId(type.id);
    setEditingValue(type.name || type.title);
  };

  // cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue("");
  };

  // save editing
  const saveEditing = async () => {
    if (!editingValue.trim()) return;
    try {
      await httpClient.put(`/location/types/${editingId}`, { name: editingValue });
      setEditingId(null);
      setEditingValue("");
      fetchTypes();
      onTypesUpdated();
      showSnackbar("Type updated successfully", "success");
    } catch (err) {
      console.error("Error editing type", err);
      showSnackbar("Failed to update type", "error");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Manage Types</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {types.map((type) => (
                <ListItem
                  key={type.id}
                  secondaryAction={
                    editingId === type.id ? (
                      <>
                        <IconButton edge="end" onClick={saveEditing}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton edge="end" onClick={cancelEditing}>
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton 
                          edge="end" 
                          onClick={() => startEditing(type)}
                          disabled={isEditing}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          onClick={() => confirmDelete(type)}
                          disabled={isEditing}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )
                  }
                >
                  {editingId === type.id ? (
                    <TextField
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      size="small"
                      autoFocus
                    />
                  ) : (
                    <ListItemText primary={type.name || type.title} />
                  )}
                </ListItem>
              ))}
            </List>
          )}

          <TextField
            label="New Type"
            fullWidth
            margin="normal"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            disabled={isEditing}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddType}
            sx={{ mt: 1 }}
            disabled={isEditing || !newType.trim()}
          >
            Add Type
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isEditing}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          {typeToDelete && (
            <p>Are you sure you want to delete the type "{typeToDelete.name || typeToDelete.title}"?</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={executeDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ManageTypesModal;