import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  Article,
  MoreVert as MoreVertIcon,
  DragIndicator,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DropIndicator from "./DropIndicator";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";


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

export default NavigationItem;
