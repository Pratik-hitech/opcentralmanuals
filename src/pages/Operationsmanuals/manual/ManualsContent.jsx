import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  ArrowDropDown,
  UnfoldMore as UnfoldMoreIcon,
  UnfoldLess as UnfoldLessIcon,
} from "@mui/icons-material";

import { useNotification } from "../../../hooks/useNotification";
import CreateSectionDialog from "./CreateSectionDialog";
import { useNavigations } from "./hooks/useNavigations";
import NavigationTree from "./components/NavigationTree";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import { AddMenu, MoreMenu, CreateMenu } from "./components/ActionMenus";

const ManualsContent = () => {
  const [createMenuAnchorEl, setCreateMenuAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState(null);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [dialogMode, setDialogMode] = useState("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const showNotification = useNotification();

  const {
    navigations,
    loading,
    error,
    fetchNavigations,
    handleDragEnd,
    deleteNavigationItem,
  } = useNavigations();

  useEffect(() => {
    if (navigations.length > 0) {
      const initialExpandedItems = {};
      const traverseAndSetExpanded = (items) => {
        items &&
          items.forEach((item) => {
            if (item?.children && item?.children?.length > 0) {
              initialExpandedItems[item?.id] = true;
            }
            traverseAndSetExpanded(item?.children);
          });
      };
      traverseAndSetExpanded(navigations);
      setExpandedItems(initialExpandedItems);
    }
  }, [navigations]);

  const handleCreateClick = (event) => {
    setCreateMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setCreateMenuAnchorEl(null);
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
    let url = `/manuals/edit/${id}/policies/create/details`;
    if (currentItem.id) {
      url += `?navigationId=${currentItem.id}`;
    }
    navigate(url);
  };

  const handleEditClick = (item = null) => {
    setMoreMenuAnchorEl(null);
    const itemToEdit = item || currentItem;
    if (itemToEdit && itemToEdit?.table !== null) {
      let url = `/manuals/edit/${id}/policies/edit/${itemToEdit?.primary_id}/details`;
      if (itemToEdit?.parent_id) {
        url += `?navigationId=${itemToEdit?.parent_id}`;
      }
      navigate(url);
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
    if (!currentItem) return;
    setDeleteLoading(true);
    try {
      await deleteNavigationItem(currentItem.id);
    } catch (e) {
      // error is handled in the hook
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleSaveSuccess = async () => {
    try {
      await fetchNavigations();

      showNotification(
        "success",
        `Section ${dialogMode === "edit" ? "updated" : "created"} successfully`
      );
    } catch (error) {
      showNotification("warning", "Section saved but failed to refresh list");
    }
  };

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
        <Grid
          container
          spacing={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Tooltip
                  title={
                    Object.values(expandedItems).every(Boolean)
                      ? "Collapse All"
                      : "Expand All"
                  }
                >
                  <IconButton
                    onClick={() => {
                      const allExpanded =
                        Object.values(expandedItems).every(Boolean);
                      const newExpandedItems = {};
                      const traverseAndSetExpanded = (items, expand) => {
                        items.forEach((item) => {
                          if (item.children && item.children.length > 0) {
                            newExpandedItems[item.id] = !expand;
                          }
                          traverseAndSetExpanded(item.children || [], expand);
                        });
                      };
                      traverseAndSetExpanded(navigations, allExpanded);
                      setExpandedItems(newExpandedItems);
                    }}
                  >
                    {Object.values(expandedItems).every(Boolean) ? (
                      <UnfoldLessIcon />
                    ) : (
                      <UnfoldMoreIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <div>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowDropDown />}
                    onClick={handleCreateClick}
                  >
                    Create
                  </Button>
                  <CreateMenu
                    anchorEl={createMenuAnchorEl}
                    onClose={handleMenuClose}
                    onSectionClick={handleSectionClick}
                    onPolicyClick={handlePolicyClick}
                  />
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
                {!loading && !error && navigations.length > 0 && (
                  <NavigationTree
                    navigationTree={navigations}
                    expandedItems={expandedItems}
                    toggleExpand={toggleExpand}
                    handleAddClick={handleAddClick}
                    handleMoreVertClick={handleMoreVertClick}
                    handleEditClick={handleEditClick}
                    setCurrentItem={setCurrentItem}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    handleDragEnd={handleDragEnd}
                  />
                )}
                {!loading && !error && navigations.length === 0 && (
                  <Typography>No navigation items found</Typography>
                )}
              </Box>
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
      <AddMenu
        anchorEl={addMenuAnchorEl}
        onClose={() => setAddMenuAnchorEl(null)}
        onAddSubSection={handleAddSubSectionClick}
        onAddPolicy={handleAddPolicyClick}
      />
      <MoreMenu
        anchorEl={moreMenuAnchorEl}
        onClose={() => setMoreMenuAnchorEl(null)}
        onEdit={() => handleEditClick()}
        onDelete={handleDeleteClick}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        item={currentItem}
      />
    </Container>
  );
};

export default ManualsContent;
