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
  DragIndicator,
} from "@mui/icons-material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CreateSectionDialog from "./CreateSectionDialog";
import { httpClient } from "../../../utils/httpClientSetup";

// Drop Indicator Component
const DropIndicator = ({ isOver }) => (
  <Box
    sx={{
      height: 2,
      backgroundColor: isOver ? "primary.main" : "transparent",
      margin: "4px 0",
      transition: "background-color 0.2s ease",
    }}
  />
);

// Updated NavigationItem with drop indicator support
const NavigationItem = ({
  item,
  depth = 0,
  numberingPath = [],
  isSortable = false,
  expandedItems,
  toggleExpand,
  handleAddClick,
  handleMoreVertClick,
  handleEditClick,
  setCurrentItem,
  setDeleteDialogOpen,
  isOver,
  isDragging,
}) => {
  const sortable = useSortable({ id: item?.id || "invalid" });

  if (!item || !item.id) return null;

  const hasChildren =
    item.children && Array.isArray(item.children) && item.children.length > 0;
  const isExpanded = expandedItems[item.id];
  const isPolicy = item.table !== null;
  const currentNumber = numberingPath.join(".");
  const sortedChildren = hasChildren
    ? [...item.children]
        .filter((child) => child && child.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const style = isSortable
    ? {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
        opacity: sortable.isDragging ? 0.5 : 1,
      }
    : {};

  return (
    <React.Fragment key={item.id}>
      <Box
        ref={isSortable ? sortable.setNodeRef : null}
        style={style}
        sx={{
          ml: depth * 3,
          mb: 0.5,
          position: "relative",
        }}
      >
        {/* Drop indicator when item is being dragged over */}
        {isOver && <DropIndicator isOver={isOver} />}

        <ListItem
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            backgroundColor: isDragging
              ? "rgba(25, 118, 210, 0.08)"
              : depth === 0
              ? "#f5f5f5"
              : depth > 0 && !isPolicy
              ? "#fafafa"
              : "white",
            opacity: isDragging ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {isSortable && (
            <IconButton
              size="small"
              {...sortable.listeners}
              {...sortable.attributes}
              sx={{ cursor: isSortable ? "grab" : "default" }}
            >
              <DragIndicator />
            </IconButton>
          )}
          {isPolicy && (
            <ListItemIcon sx={{ minWidth: 30 }}>
              <Article sx={{ fontSize: 16 }} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={`${currentNumber}${currentNumber ? ". " : ""}${
              item.title
            }`}
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
            <SortableContext
              items={sortedChildren
                .filter((child) => child && child.id)
                .map((child) => child.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedChildren
                .filter((child) => child && child.id)
                .map((child, index) => (
                  <NavigationItem
                    key={child.id}
                    item={child}
                    depth={depth + 1}
                    numberingPath={[...numberingPath, index + 1]}
                    isSortable={true}
                    expandedItems={expandedItems}
                    toggleExpand={toggleExpand}
                    handleAddClick={handleAddClick}
                    handleMoreVertClick={handleMoreVertClick}
                    handleEditClick={handleEditClick}
                    setCurrentItem={setCurrentItem}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                  />
                ))}
            </SortableContext>
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
};

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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    setOverId(event.over?.id || null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    try {
      // Find items in the flattened tree
      const findItemAndPath = (items, targetId, currentPath = []) => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (!item || !item.id) continue;

          if (item.id === targetId) {
            return { item, path: [...currentPath, i] };
          }

          if (
            item.children &&
            Array.isArray(item.children) &&
            item.children.length > 0
          ) {
            const result = findItemAndPath(item.children, targetId, [
              ...currentPath,
              i,
            ]);
            if (result) return result;
          }
        }
        return null;
      };

      const draggedResult = findItemAndPath(navigations, active.id);
      const targetResult = findItemAndPath(navigations, over.id);

      if (!draggedResult || !targetResult) return;

      // Check if they're at the same level (same parent path, excluding the last index)
      const draggedParentPath = draggedResult.path.slice(0, -1);
      const targetParentPath = targetResult.path.slice(0, -1);
      const sameLevel =
        draggedParentPath.length === targetParentPath.length &&
        draggedParentPath.every((val, idx) => val === targetParentPath[idx]);

      // Deep clone the navigations to avoid direct mutation
      const newNavigations = JSON.parse(JSON.stringify(navigations));

      if (sameLevel) {
        // Get the parent array
        let parentArray = newNavigations;
        let parentItem = null;

        if (draggedParentPath.length > 0) {
          parentItem = newNavigations[draggedParentPath[0]];
          for (let i = 1; i < draggedParentPath.length; i++) {
            parentItem = parentItem.children[draggedParentPath[i]];
          }
          parentArray = parentItem.children;
        }

        const draggedIndex = draggedResult.path[draggedResult.path.length - 1];
        const targetIndex = targetResult.path[targetResult.path.length - 1];

        // Move the item using arrayMove for better handling
        const newArray = arrayMove(parentArray, draggedIndex, targetIndex);

        // Update orders
        newArray.forEach((item, index) => {
          if (item && item.id) {
            item.order = index + 1;
          }
        });

        // Update the tree
        if (parentItem) {
          parentItem.children = newArray;
        } else {
          setNavigations(newArray);
          return; // Early return as we've already set the state
        }

        // Update state with the modified navigation tree
        setNavigations(newNavigations);

        // Update backend with all items in the path
        const formData = new FormData();
        newArray.forEach((item, index) => {
          if (item && item.id) {
            formData.append(`navigation[${index}][id]`, item.id.toString());
            formData.append(
              `navigation[${index}][order]`,
              item.order.toString()
            );

            if (item?.parent_id) {
              formData.append(
                `navigation[${index}][parent_id]`,
                item.parent_id ? item.parent_id.toString() : ""
              );
            }
          }
        });

        await httpClient.post(`/navigations/orders/${id}`, formData);

        setSnackbar({
          open: true,
          message: "Order updated successfully",
          severity: "success",
        });
      } else {
        // Moving between different levels
        // Determine new parent: target's parent
        let newParentArray = newNavigations;
        let newParentItem = null;
        let newParentPath = [...targetParentPath];

        if (targetParentPath.length > 0) {
          newParentItem = newNavigations[targetParentPath[0]];
          for (let i = 1; i < targetParentPath.length; i++) {
            newParentItem = newParentItem.children[targetParentPath[i]];
          }
          newParentArray = newParentItem.children;
        }

        // Remove dragged item from old parent
        let oldParentArray = newNavigations;
        let oldParentItem = null;
        let oldParentPath = [...draggedParentPath];

        if (draggedParentPath.length > 0) {
          oldParentItem = newNavigations[draggedParentPath[0]];
          for (let i = 1; i < draggedParentPath.length; i++) {
            oldParentItem = oldParentItem.children[draggedParentPath[i]];
          }
          oldParentArray = oldParentItem.children;
        }

        const draggedIndex = draggedResult.path[draggedResult.path.length - 1];
        const draggedItem = oldParentArray[draggedIndex];

        // Remove from old
        oldParentArray.splice(draggedIndex, 1);

        // Insert into new at target's position
        const targetIndex = targetResult.path[targetResult.path.length - 1];
        newParentArray.splice(targetIndex, 0, draggedItem);

        // Update parent_id
        draggedItem.parent_id = newParentItem ? newParentItem.id : null;

        // Update orders for old parent array
        oldParentArray.forEach((item, index) => {
          if (item && item.id) {
            item.order = index + 1;
          }
        });

        // Update orders for new parent array
        newParentArray.forEach((item, index) => {
          if (item && item.id) {
            item.order = index + 1;
          }
        });

        // Update state with the modified navigation tree
        setNavigations(newNavigations);

        // Send FormData for all items in the navigation tree
        const formData = new FormData();
        let formDataIndex = 0;

        // Function to add items to FormData
        const addItemsToFormData = (items) => {
          items.forEach((item) => {
            if (item && item.id) {
              formData.append(
                `navigation[${formDataIndex}][id]`,
                item.id.toString()
              );
              formData.append(
                `navigation[${formDataIndex}][order]`,
                item.order.toString()
              );

              if (item.parent_id) {
                formData.append(
                  `navigation[${formDataIndex}][parent_id]`,
                  item.parent_id.toString()
                );
              }

              formDataIndex++;

              // Recursively add children
              if (
                item.children &&
                Array.isArray(item.children) &&
                item.children.length > 0
              ) {
                addItemsToFormData(item.children);
              }
            }
          });
        };

        // Add all items from the updated navigation tree
        addItemsToFormData(newNavigations);

        await httpClient.post(`/navigations/orders/${id}`, formData);

        setSnackbar({
          open: true,
          message: "Order updated successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error updating item:", error);
      setSnackbar({
        open: true,
        message: "Failed to update item",
        severity: "error",
      });
      await fetchNavigations();
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  const fetchNavigations = async () => {
    try {
      const response = await httpClient.get(`/navigations/tree/${id}`);
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
      traverseAndSetExpanded(navigations);
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
        `/manuals/edit/${id}/policies/edit/${itemToEdit?.primary_id}/details?navigationId=${itemToEdit?.parent_id}`
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
    setDeleteLoading(true);
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
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteLoading(false);
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

  const navigationTree = navigations;

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
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                  >
                    <SortableContext
                      items={navigationTree
                        .filter((item) => item && item.id)
                        .map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <List sx={{ width: "100%" }}>
                        {navigationTree
                          .filter((item) => item && item.id)
                          .sort((a, b) => a.order - b.order)
                          .map((item, index) => (
                            <NavigationItem
                              key={item.id}
                              item={item}
                              depth={0}
                              numberingPath={[index + 1]}
                              isSortable={true}
                              expandedItems={expandedItems}
                              toggleExpand={toggleExpand}
                              handleAddClick={handleAddClick}
                              handleMoreVertClick={handleMoreVertClick}
                              handleEditClick={handleEditClick}
                              setCurrentItem={setCurrentItem}
                              setDeleteDialogOpen={setDeleteDialogOpen}
                              isOver={overId === item.id}
                              isDragging={activeId === item.id}
                            />
                          ))}
                      </List>
                    </SortableContext>

                    <DragOverlay>
                      {activeId ? (
                        <Box
                          sx={{
                            border: "2px dashed",
                            borderColor: "primary.main",
                            borderRadius: 1,
                            padding: 2,
                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                          }}
                        >
                          <Typography>
                            {
                              navigationTree
                                .flatMap((item) => [
                                  item,
                                  ...(item.children || []),
                                ])
                                .find((item) => item.id === activeId)?.title
                            }
                          </Typography>
                        </Box>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
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
              <p>WIP</p>
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
        navigations={navigations}
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
        onClose={deleteLoading ? undefined : handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          {deleteLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={20} />
              <Typography>Deleting item...</Typography>
            </Box>
          ) : (
            <>Are you sure you want to delete "{currentItem?.title}"?</>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
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
