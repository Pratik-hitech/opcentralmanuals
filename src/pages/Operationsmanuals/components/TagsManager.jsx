import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
  Stack,
  Alert,
  Snackbar
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { httpClient } from "../../../utils/httpClientSetup"
import { useAuth } from "../../../context/AuthContext"

const TagsManager = ({ open, onClose }) => {
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState(null);
  const [editTagName, setEditTagName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch tags from API
  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.get("tags");
      if (response.data.success) {
        setTags(response.data.data);
      } else {
        setError(response.data.message || "Failed to load tags");
      }
    } catch (err) {
      setError("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  // Add new tag
  const addTag = async () => {
    if (!newTagName.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.post("tags", {
        title: newTagName.trim(),
        company_id: user.company_id
      });
      
      if (response.data.success) {
        setTags([response.data.data, ...tags]);
        setNewTagName("");
        showSnackbar("Tag added successfully", "success");
      } else {
        setError(response.data.message || "Failed to add tag");
      }
    } catch (err) {
      setError("Failed to add tag");
    } finally {
      setLoading(false);
    }
  };

  // Update existing tag
  const updateTag = async () => {
    if (!editTagName.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.put(`tags/${editingTag.id}`, {
        title: editTagName.trim()
      });
      
      if (response.data.success) {
        setTags(tags.map(tag => 
          tag.id === editingTag.id ? { ...tag, title: editTagName.trim() } : tag
        ));
        cancelEdit();
        showSnackbar("Tag updated successfully", "success");
      } else {
        setError(response.data.message || "Failed to update tag");
      }
    } catch (err) {
      setError("Failed to update tag");
    } finally {
      setLoading(false);
    }
  };

  // Delete tag
  const deleteTag = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.delete(`tags/${id}`);
      
      if (response.data.success) {
        setTags(tags.filter(tag => tag.id !== id));
        showSnackbar("Tag deleted successfully", "success");
      } else {
        setError(response.data.message || "Failed to delete tag");
      }
    } catch (err) {
      setError("Failed to delete tag");
    } finally {
      setLoading(false);
    }
  };

  // Start editing a tag
  const startEdit = (tag) => {
    setEditingTag(tag);
    setEditTagName(tag.title);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTag(null);
    setEditTagName("");
  };

  // Handle form submissions
  const handleAddTag = (e) => {
    e.preventDefault();
    addTag();
  };

  const handleUpdateTag = (e) => {
    e.preventDefault();
    updateTag();
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (open) {
      fetchTags();
    }
  }, [open]);

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            MANAGE GLOBAL TAGS
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Add Tag Form */}
          <Box component="form" onSubmit={handleAddTag} sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                label="Tag Name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<Add />}
                disabled={loading || !newTagName.trim()}
              >
                Add
              </Button>
            </Stack>
          </Box>

          {/* Edit Tag Form (shown when editing) */}
          {editingTag && (
            <Box component="form" onSubmit={handleUpdateTag} sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  label="Edit Tag"
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !editTagName.trim()}
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Tags List */}
          {loading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>Loading tags...</Typography>
            </Box>
          ) : (
            <Paper variant="outlined">
              {tags.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="text.secondary">No tags found</Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {tags.map(tag => (
                    <Box
                      key={tag.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <Typography>{tag.title}</Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => startEdit(tag)}
                          color="primary"
                          disabled={loading}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteTag(tag.id)}
                          color="error"
                          disabled={loading}
                          sx={{ ml: 1 }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
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

export default TagsManager;