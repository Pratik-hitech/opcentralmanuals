import React, { useState } from "react";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, List, Typography } from "@mui/material";
import NavigationItem from "./NavigationItem";

const NavigationTree = ({
  navigationTree,
  expandedItems,
  toggleExpand,
  handleAddClick,
  handleMoreVertClick,
  handleEditClick,
  setCurrentItem,
  setDeleteDialogOpen,
  handleDragEnd,
}) => {
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);

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

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };
  
  const onDragEnd = (event) => {
    handleDragEnd(event);
    setActiveId(null);
    setOverId(null);
  }

  const findItem = (id, items) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(id, item.children);
        if (found) return found;
      }
    }
    return null;
  };
  
  const activeItem = activeId ? findItem(activeId, navigationTree) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={onDragEnd}
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
        {activeItem ? (
          <Box
            sx={{
              border: "2px dashed",
              borderColor: "primary.main",
              borderRadius: 1,
              padding: 2,
              backgroundColor: "rgba(25, 118, 210, 0.1)",
            }}
          >
            <Typography>{activeItem.title}</Typography>
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default NavigationTree;
