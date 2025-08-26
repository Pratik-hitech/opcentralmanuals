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
  CircularProgress,
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
  const [dialogMode, setDialogMode] = useState("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchNavigations = async () => {
    try {
      const response = await httpClient.get(`/navigations?collection_id=${id}`);
      const data = response.data.data || [];
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
    handleMenuClose();
    navigate(`/manuals/edit/${id}/policies/create/details`);
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

  const buildNavigationTree = (items) => {
    const itemMap = {};
    items &&
      items.forEach((item) => {
        itemMap[item.id] = { ...item, children: [] };
      });

    const rootItems = [];
    items &&
      items.forEach((item) => {
        if (item.parent_id === null) {
          rootItems.push(itemMap[item.id]);
        } else if (itemMap[item.parent_id]) {
          itemMap[item.parent_id].children.push(itemMap[item.id]);
        }
      });

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

  const handleAddClick = (event, item) => {
    event.stopPropagation();
    setCurrentItem(item);
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleMoreVertClick = (event, item) => {
    event.stopPropagation();
    setCurrentItem(item);
    setMoreMenuAnchorEl(event.currentTarget);
  };

  const handleAddSubSectionClick = () => {
    setAddMenuAnchorEl(null);
    setDialogMode("create");
    setIsModalOpen(true);
  };

  const handleAddPolicyClick = () => {
    setAddMenuAnchorEl(null);
    navigate(
      `/manuals/edit/${id}/policies/create/details?navigationId=${currentItem.id}`
    );
  };

  const handleEditClick = (item = null) => {
    setMoreMenuAnchorEl(null);
    const itemToEdit = item || currentItem;
    if (itemToEdit && itemToEdit?.table !== null) {
      navigate(
        `/manuals/edit/${id}/policies/edit/${itemToEdit?.primary_id}/details`
      );
    } else {
      setDialogMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = () => {
    setMoreMenuAnchorEl(null);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await httpClient.delete(`/navigations/${currentItem.id}`);
      setSnackbar({
        open: true,
        message: "Item deleted successfully",
        severity: "success",
      });
      await fetchNavigations();
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

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleSaveSuccess = async () => {
    try {
      await fetchNavigations();
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

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderNavigationItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isPolicy = item.table !== null;

    return (
      <React.Fragment key={item.id}>
        <Box sx={{ ml: depth * 3, mb: 0.5 }}>
          <ListItem
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor:
                depth === 0
                  ? "#f5f5f5"
                  : depth > 0 && !isPolicy
                  ? "#fafafa"
                  : "white",
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
            <Box sx={{ display: "flex", gap: 1 }}>
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
              {isPolicy && (
                <>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(item);
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
        sx={{ width: "70%", display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Content
        </Typography>
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loading && <CircularProgress sx={{ my: 2 }} />}
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
      <CreateSectionDialog
        open={isModalOpen}
        onClose={handleModalClose}
        mode={dialogMode}
        id={id}
        item={currentItem}
        onSaveSuccess={handleSaveSuccess}
      />
      <Menu
        anchorEl={addMenuAnchorEl}
        open={Boolean(addMenuAnchorEl)}
        onClose={() => setAddMenuAnchorEl(null)}
      >
        <MenuItem onClick={handleAddSubSectionClick}>Add Sub Section</MenuItem>
        <MenuItem onClick={handleAddPolicyClick}>Add Policy</MenuItem>
      </Menu>
      <Menu
        anchorEl={moreMenuAnchorEl}
        open={Boolean(moreMenuAnchorEl)}
        onClose={() => setMoreMenuAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEditClick()}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
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
