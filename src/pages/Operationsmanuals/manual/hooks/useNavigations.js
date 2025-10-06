import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNotification } from "../../../../hooks/useNotification";
import { httpClient } from "../../../../utils/httpClientSetup";
import { arrayMove } from "@dnd-kit/sortable";

export const useNavigations = () => {
  const [navigations, setNavigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const showNotification = useNotification();

  const fetchNavigations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await httpClient.get(`/navigations/tree/${id}`);
      const data = response.data.data || [];
      setNavigations(data);
      setError(null);
      return data;
    } catch (error) {
      console.error("Error fetching navigations:", error);
      setError("Failed to load navigations");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNavigations();
  }, [fetchNavigations]);

  const deleteNavigationItem = async (itemId) => {
    try {
      await httpClient.delete(`/navigations/${itemId}`);

      showNotification("success", "Item deleted successfully");
      await fetchNavigations();
    } catch (error) {
      console.error("Error deleting item:", error);

      showNotification("error", "Failed to delete item");
      throw error; // re-throw to be caught in component
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldNavigations = JSON.parse(JSON.stringify(navigations));

    try {
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

      const newNavs = JSON.parse(JSON.stringify(navigations));
      const draggedResult = findItemAndPath(newNavs, active.id);
      const targetResult = findItemAndPath(newNavs, over.id);

      if (!draggedResult || !targetResult) return;

      const draggedParentPath = draggedResult.path.slice(0, -1);
      const targetParentPath = targetResult.path.slice(0, -1);
      const sameLevel =
        draggedParentPath.length === targetParentPath.length &&
        draggedParentPath.every((val, idx) => val === targetParentPath[idx]);

      if (sameLevel) {
        let parentArray = newNavs;
        let parentItem = null;

        if (draggedParentPath.length > 0) {
          parentItem = newNavs[draggedParentPath[0]];
          for (let i = 1; i < draggedParentPath.length; i++) {
            parentItem = parentItem.children[draggedParentPath[i]];
          }
          parentArray = parentItem.children;
        }

        const draggedIndex = draggedResult.path[draggedResult.path.length - 1];
        const targetIndex = targetResult.path[targetResult.path.length - 1];

        const newArray = arrayMove(parentArray, draggedIndex, targetIndex);

        newArray.forEach((item, index) => {
          if (item && item.id) {
            item.order = index + 1;
          }
        });

        if (parentItem) {
          parentItem.children = newArray;
          setNavigations(newNavs);
        } else {
          setNavigations(newArray);
        }

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
      } else {
        // ... (logic for different levels)
        let newParentArray = newNavs;
        let newParentItem = null;
        if (targetParentPath.length > 0) {
          newParentItem = newNavs[targetParentPath[0]];
          for (let i = 1; i < targetParentPath.length; i++) {
            newParentItem = newParentItem.children[targetParentPath[i]];
          }
          newParentArray = newParentItem.children;
        }

        let oldParentArray = newNavs;
        if (draggedParentPath.length > 0) {
          let oldParentItem = newNavs[draggedParentPath[0]];
          for (let i = 1; i < draggedParentPath.length; i++) {
            oldParentItem = oldParentItem.children[draggedParentPath[i]];
          }
          oldParentArray = oldParentItem.children;
        }

        const draggedIndex = draggedResult.path[draggedResult.path.length - 1];
        const [draggedItem] = oldParentArray.splice(draggedIndex, 1);

        const targetIndex = targetResult.path[targetResult.path.length - 1];
        newParentArray.splice(targetIndex, 0, draggedItem);

        draggedItem.parent_id = newParentItem ? newParentItem.id : null;

        oldParentArray.forEach((item, index) => {
          if (item && item.id) item.order = index + 1;
        });
        newParentArray.forEach((item, index) => {
          if (item && item.id) item.order = index + 1;
        });

        setNavigations(newNavs);

        const formData = new FormData();
        let formDataIndex = 0;
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
        addItemsToFormData(newNavs);
        await httpClient.post(`/navigations/orders/${id}`, formData);
      }

      showNotification("success", "Order updated successfully");
    } catch (error) {
      showNotification("error", "Failed to update item");
      setNavigations(oldNavigations);
    }
  };

  return {
    navigations,
    loading,
    error,
    fetchNavigations,
    handleDragEnd,
    deleteNavigationItem,
  };
};
