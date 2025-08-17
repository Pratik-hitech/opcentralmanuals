import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  Grid,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add,
  ArrowDropDown,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  Article,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import CreateSectionDialog from "./CreateSectionDialog";
import { httpClient } from "../../../utils/httpClientSetup";

const ManualsContent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [navigations, setNavigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState(null);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [dialogMode, setDialogMode] = useState("create"); // 'create' or 'edit'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { id } = useParams(); // Extracts manual ID from route
  const navigate = useNavigate();

  // Fetch navigations from API
  const fetchNavigations = async () => {
    try {
      const response = await httpClient.get("/navigations?collection_id=1");
      const data = response.data.data || []; // Handle array structure
      setNavigations(data);
      return data;
    } catch (error) {
      console.error("Error fetching navigations:", error);
      setError("Failed to load navigations");
      throw error;
    }
  };

  useEffect(() => {
    const loadNavigations = async () => {
      try {
        await fetchNavigations();
      } catch (error) {
        console.error("Error loading navigations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNavigations();
  }, []);

  // Handle Create button click
  const handleCreateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSectionClick = () => {
    handleMenuClose();
    setDialogMode("create");
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handlePolicyClick = () => {
    navigate(`/manuals/edit/${id}/policies/create/details`);
    handleMenuClose();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Build hierarchical navigation structure
  const buildNavigationTree = (items) => {
    // Create a map of all items by their ID
    const itemMap = {};
    items &&
      items.forEach((item) => {
        itemMap[item.id] = { ...item, children: [] };
      });

    // Build the tree structure
    const rootItems = [];
    items &&
      items.forEach((item) => {
        if (item.parent_id === null) {
          // Top-level section
          rootItems.push(itemMap[item.id]);
        } else if (itemMap[item.parent_id]) {
          // Child item - add to parent's children
          itemMap[item.parent_id].children.push(itemMap[item.id]);
        }
      });

    // Sort items by order within each level
    const sortItems = (items) => {
      return (
        items &&
        items
          .sort((a, b) => a.order - b.order)
          .map((item) => ({
            ...item,
            children: sortItems(item.children),
          }))
      );
    };

    return sortItems(rootItems);
  };

  // Initialize expandedItems to auto-expand items with children
  useEffect(() => {
    if (navigations.length > 0) {
      const initialExpandedItems = {};
      const traverseAndSetExpanded = (items) => {
        items.forEach((item) => {
          if (item.children && item.children.length > 0) {
            initialExpandedItems[item.id] = true;
          }
          traverseAndSetExpanded(item.children);
        });
      };
      traverseAndSetExpanded(buildNavigationTree(navigations));
      setExpandedItems(initialExpandedItems);
    }
  }, [navigations]);

  // Handle Add icon click
  const handleAddClick = (event, item) => {
    event.stopPropagation();
    setCurrentItem(item);
    setAddMenuAnchorEl(event.currentTarget);
  };

  // Handle More Vert icon click
  const handleMoreVertClick = (event, item) => {
    event.stopPropagation();
    setCurrentItem(item);
    setMoreMenuAnchorEl(event.currentTarget);
  };

  // Handle Add Sub Section
  const handleAddSubSectionClick = () => {
    setAddMenuAnchorEl(null);
    setDialogMode("create");
    setIsModalOpen(true);
  };

  // Handle Add Policy (placeholder)
  const handleAddPolicyClick = () => {
    setAddMenuAnchorEl(null);
    console.log("Add policy under item:", currentItem);
  };

  // Handle Edit
  const handleEditClick = () => {
    setMoreMenuAnchorEl(null);
    setDialogMode("edit");
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDeleteClick = () => {
    setMoreMenuAnchorEl(null);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      await httpClient.delete(`/navigations/${currentItem.id}`);
      setSnackbar({
        open: true,
        message: "Item deleted successfully",
        severity: "success",
      });
      await fetchNavigations(); // Refetch after delete
    } catch (error) {
      console.error("Error deleting item:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete item",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Cancel Delete
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  // Handle successful save/update
  const handleSaveSuccess = async () => {
    try {
      await fetchNavigations(); // Refetch the latest data
      setSnackbar({
        open: true,
        message: `Section ${
          dialogMode === "edit" ? "updated" : "created"
        } successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error refetching navigations:", error);
      setSnackbar({
        open: true,
        message: "Section saved but failed to refresh list",
        severity: "warning",
      });
    }
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render navigation items recursively
  const renderNavigationItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isPolicy = item.table !== null;

    return (
      <React.Fragment key={item.id}>
        {/* Shift entire ListItem to the right */}
        <Box
          sx={{
            ml: depth * 3, // Indentation by shifting the entire box
            mb: 0.5,
          }}
        >
          <ListItem
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor:
                depth === 0
                  ? "#f5f5f5" // Top-level sections
                  : depth > 0 && !isPolicy
                  ? "#fafafa" // Sub-sections
                  : "white", // Policies
            }}
          >
            {isPolicy && (
              <ListItemIcon sx={{ minWidth: 30 }}>
                <Article sx={{ fontSize: 16 }} />
              </ListItemIcon>
            )}

            <ListItemText
              primary={item.title}
              sx={{
                fontWeight: depth === 0 ? "bold" : "normal",
                color: isPolicy ? "#1976d2" : "inherit",
              }}
            />

            {/* Expand/Collapse Icon (only for items with children) */}
            {hasChildren && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.id);
                }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Add Icon with Dropdown (only for sections/sub-sections) */}
              {!isPolicy && (
                <Tooltip title="Add">
                  <IconButton
                    size="small"
                    onClick={(e) => handleAddClick(e, item)}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              )}

              {/* More Vert Icon for Edit and Delete (only for sections/sub-sections) */}
              {!isPolicy && (
                <Tooltip title="More Actions">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMoreVertClick(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* Edit and Delete for Policies (as before) */}
              {isPolicy && (
                <>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentItem(item);
                        handleEditClick();
                      }}
                    >
                      <Edit sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentItem(item);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Delete sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </ListItem>
        </Box>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) =>
                renderNavigationItem(child, depth + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  // Build the navigation tree
  const navigationTree = buildNavigationTree(navigations);

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Content
        </Typography>
        {/* <RichTextEditor value={content} onChange={setContent} /> */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <div>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowDropDown />}
                    onClick={handleCreateClick}
                  >
                    Create
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleSectionClick}>Section</MenuItem>
                    <MenuItem onClick={handlePolicyClick}>Policy</MenuItem>
                  </Menu>
                </div>
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Display Navigations */}
              <Box>
                {loading && <Typography>Loading...</Typography>}
                {error && <Typography color="error">{error}</Typography>}
                {!loading && !error && navigationTree.length > 0 && (
                  <List sx={{ width: "100%" }}>
                    {navigationTree &&
                      navigationTree.map((item) => renderNavigationItem(item))}
                  </List>
                )}
                {!loading && !error && navigationTree.length === 0 && (
                  <Typography>No navigation items found</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
              <h3>Document library</h3>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Section Creation Dialog */}
      <CreateSectionDialog
        open={isModalOpen}
        onClose={handleModalClose}
        mode={dialogMode}
        item={currentItem}
        onSaveSuccess={handleSaveSuccess}
      />

      {/* Add Menu */}
      <Menu
        anchorEl={addMenuAnchorEl}
        open={Boolean(addMenuAnchorEl)}
        onClose={() => setAddMenuAnchorEl(null)}
      >
        <MenuItem onClick={handleAddSubSectionClick}>Add Sub Section</MenuItem>
        <MenuItem onClick={handleAddPolicyClick}>Add Policy</MenuItem>
      </Menu>

      {/* More Actions Menu */}
      <Menu
        anchorEl={moreMenuAnchorEl}
        open={Boolean(moreMenuAnchorEl)}
        onClose={() => setMoreMenuAnchorEl(null)}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{currentItem?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManualsContent;
