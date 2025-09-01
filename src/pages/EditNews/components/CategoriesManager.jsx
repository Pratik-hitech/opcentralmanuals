// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   CircularProgress,
//   Snackbar,
//   Alert
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CloseIcon from "@mui/icons-material/Close";
// import { httpClient } from "../../../utils/httpClientSetup"

// const ManageCategoriesModal = ({ open, onClose, onCategoriesUpdated }) => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newCategory, setNewCategory] = useState("");

//   const [editingId, setEditingId] = useState(null);
//   const [editingValue, setEditingValue] = useState("");

//   // Snackbar state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };
//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   // fetch categories
//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const { data } = await httpClient.get("/categories/list");
//       setCategories(data.data || []);
//     } catch (err) {
//       console.error("Error fetching categories", err);
//       showSnackbar("Failed to load categories", "error");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (open) fetchCategories();
//   }, [open]);

//   // add new category
//   const handleAddCategory = async () => {
//     if (!newCategory.trim()) return;
//     try {
//       await httpClient.post("/categories", { title: newCategory });
//       setNewCategory("");
//       fetchCategories();
//       onCategoriesUpdated();
//       showSnackbar("Category added successfully", "success");
//     } catch (err) {
//       console.error("Error adding category", err);
//       showSnackbar("Failed to add category", "error");
//     }
//   };

//   // delete category
//   const handleDelete = async (id) => {
//     try {
//       await httpClient.delete(`/categories/${id}`);
//       fetchCategories();
//       onCategoriesUpdated();
//       showSnackbar("Category deleted successfully", "success");
//     } catch (err) {
//       console.error("Error deleting category", err);
//       showSnackbar("Failed to delete category", "error");
//     }
//   };

//   // start editing
//   const startEditing = (cat) => {
//     setEditingId(cat.id);
//     setEditingValue(cat.title);
//   };

//   // cancel editing
//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditingValue("");
//   };

//   // save editing
//   const saveEditing = async () => {
//     if (!editingValue.trim()) return;
//     try {
//       await httpClient.put(`/categories/${editingId}`, { title: editingValue });
//       setEditingId(null);
//       setEditingValue("");
//       fetchCategories();
//       onCategoriesUpdated();
//       showSnackbar("Category updated successfully", "success");
//     } catch (err) {
//       console.error("Error editing category", err);
//       showSnackbar("Failed to update category", "error");
//     }
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//         <DialogTitle>Manage Categories</DialogTitle>
//         <DialogContent dividers>
//           {loading ? (
//             <CircularProgress />
//           ) : (
//             <List>
//               {categories.map((cat) => (
//                 <ListItem
//                   key={cat.id}
//                   secondaryAction={
//                     editingId === cat.id ? (
//                       <>
//                         <IconButton edge="end" onClick={saveEditing}>
//                           <SaveIcon />
//                         </IconButton>
//                         <IconButton edge="end" onClick={cancelEditing}>
//                           <CloseIcon />
//                         </IconButton>
//                       </>
//                     ) : (
//                       <>
//                         <IconButton edge="end" onClick={() => startEditing(cat)}>
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton edge="end" onClick={() => handleDelete(cat.id)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </>
//                     )
//                   }
//                 >
//                   {editingId === cat.id ? (
//                     <TextField
//                       value={editingValue}
//                       onChange={(e) => setEditingValue(e.target.value)}
//                       size="small"
//                     />
//                   ) : (
//                     <ListItemText primary={cat.title} />
//                   )}
//                 </ListItem>
//               ))}
//             </List>
//           )}

//           <TextField
//             label="New Category"
//             fullWidth
//             margin="normal"
//             value={newCategory}
//             onChange={(e) => setNewCategory(e.target.value)}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleAddCategory}
//             sx={{ mt: 1 }}
//           >
//             Add Category
//           </Button>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default ManageCategoriesModal;


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

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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

  // fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await httpClient.get("/categories");
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

  // delete category confirmation
  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  // execute delete after confirmation
  const executeDelete = async () => {
    try {
      await httpClient.delete(`/categories/${categoryToDelete.id}`);
      fetchCategories();
      onCategoriesUpdated();
      showSnackbar("Category deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting category", err);
      showSnackbar("Failed to delete category", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  // cancel delete
  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
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
                        <IconButton 
                          edge="end" 
                          onClick={() => startEditing(cat)}
                          disabled={isEditing}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          onClick={() => confirmDelete(cat)}
                          disabled={isEditing}
                        >
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
                      autoFocus
                    />
                  ) : (
                    <ListItemText 
                      primary={cat.title} 
                      secondary={cat.news_count ? `${cat.news_count} news articles` : "No news articles"}
                    />
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
            disabled={isEditing}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            sx={{ mt: 1 }}
            disabled={isEditing || !newCategory.trim()}
          >
            Add Category
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
          {categoryToDelete && (
            categoryToDelete.news_count === 0 ? (
              <p>Are you sure you want to delete the category "{categoryToDelete.title}"?</p>
            ) : (
              <p>
                This category is related to {categoryToDelete.news_count} news article(s). 
                Are you sure you want to delete the category "{categoryToDelete.title}"?
              </p>
            )
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

export default ManageCategoriesModal;