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
import { httpClient } from "../../../utils/httpClientSetup"

const ManageCategoriesModal = ({ open, onClose, onCategoriesUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

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

  // fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await httpClient.get("/categories/list");
      setCategories(data.data || []);
    } catch (err) {
      console.error("Error fetching categories", err);
      showSnackbar("Failed to load categories", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  // add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await httpClient.post("/categories", { title: newCategory });
      setNewCategory("");
      fetchCategories();
      onCategoriesUpdated();
      showSnackbar("Category added successfully", "success");
    } catch (err) {
      console.error("Error adding category", err);
      showSnackbar("Failed to add category", "error");
    }
  };

  // delete category
  const handleDelete = async (id) => {
    try {
      await httpClient.delete(`/categories/${id}`);
      fetchCategories();
      onCategoriesUpdated();
      showSnackbar("Category deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting category", err);
      showSnackbar("Failed to delete category", "error");
    }
  };

  // start editing
  const startEditing = (cat) => {
    setEditingId(cat.id);
    setEditingValue(cat.title);
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
      await httpClient.put(`/categories/${editingId}`, { title: editingValue });
      setEditingId(null);
      setEditingValue("");
      fetchCategories();
      onCategoriesUpdated();
      showSnackbar("Category updated successfully", "success");
    } catch (err) {
      console.error("Error editing category", err);
      showSnackbar("Failed to update category", "error");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Manage Categories</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {categories.map((cat) => (
                <ListItem
                  key={cat.id}
                  secondaryAction={
                    editingId === cat.id ? (
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
                        <IconButton edge="end" onClick={() => startEditing(cat)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" onClick={() => handleDelete(cat.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )
                  }
                >
                  {editingId === cat.id ? (
                    <TextField
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      size="small"
                    />
                  ) : (
                    <ListItemText primary={cat.title} />
                  )}
                </ListItem>
              ))}
            </List>
          )}

          <TextField
            label="New Category"
            fullWidth
            margin="normal"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            sx={{ mt: 1 }}
          >
            Add Category
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
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

export default ManageCategoriesModal;
