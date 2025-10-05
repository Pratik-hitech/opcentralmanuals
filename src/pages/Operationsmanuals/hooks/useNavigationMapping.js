import { useState, useEffect, useCallback } from "react";
import { httpClient } from "../../../utils/httpClientSetup";
import { getPathToItem } from "../utils/policyUtils";

const fetchNavigations = async (colId) => {
  try {
    const res = await httpClient.get(`/navigations/tree/${colId}`);
    if (res.data.success) return res.data.data || [];
  } catch (err) {
    console.error("Error fetching navigations:", err);
  }
  return [];
};

const autoMapNavigation = async (
  navId,
  setSelectedCollection,
  setMappedMappings,
  setNavigationTree
) => {
  try {
    const navRes = await httpClient.get(`/navigations/${navId}`);
    if (!navRes.data.success) return;

    const navItem = navRes.data.data;
    const colRes = await httpClient.get(
      `/collections/${navItem.collection_id}`
    );
    if (!colRes.data.success) return;

    const collection = colRes.data.data;
    setSelectedCollection(collection);

    const tree = await fetchNavigations(collection.id);
    setNavigationTree(tree);

    if (tree) {
      const pathTitles = getPathToItem(tree, navItem.id);
      if (pathTitles) {
        const fullPath = [collection.title, ...pathTitles];
        setMappedMappings([
          { navId: navItem.id, fullPath, collectionId: collection.id },
        ]);
      }
    }
  } catch (err) {
    console.error("Error auto-mapping navigation:", err);
  }
};

const autoMapNavigationFromCollection = async (
  collectionId,
  setSelectedCollection,
  setMappedMappings,
  setNavigationTree
) => {
  try {
    const colRes = await httpClient.get(`/collections/${collectionId}`);
    if (!colRes.data.success) return;

    const collection = colRes.data.data;
    setSelectedCollection(collection);

    const tree = await fetchNavigations(collection.id);
    setNavigationTree(tree);

    setMappedMappings([
      {
        navId: null,
        fullPath: [collection.title],
        collectionId: collection.id,
      },
    ]);
  } catch (err) {
    console.error("Error auto-mapping from collection:", err);
  }
};

export const useNavigationMapping = (id, policyId, navigationId) => {
  const [navigationTree, setNavigationTree] = useState([]);
  const [mappedMappings, setMappedMappings] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Auto-map logic
  useEffect(() => {
    if (navigationId) {
      autoMapNavigation(
        navigationId,
        setSelectedCollection,
        setMappedMappings,
        setNavigationTree
      );
    } else if (id && !policyId) {
      autoMapNavigationFromCollection(
        id,
        setSelectedCollection,
        setMappedMappings,
        setNavigationTree
      );
    } else if (id && policyId && mappedMappings.length === 0) {
      autoMapNavigationFromCollection(
        id,
        setSelectedCollection,
        setMappedMappings,
        setNavigationTree
      );
    }
  }, [navigationId, id, policyId]);

  // Expand mapped items
  useEffect(() => {
    if (navigationTree.length === 0) return;

    const initialExpanded = {};
    const traverse = (items) => {
      items.forEach((item) => {
        const isMappedItem = mappedMappings.some((m) => m.navId === item.id);
        const hasMappedChildren = item.children?.some((child) =>
          mappedMappings.some((m) => m.navId === child.id)
        );
        const isAncestor = mappedMappings.some((m) =>
          m.fullPath?.includes(item.title)
        );

        if (isMappedItem || hasMappedChildren || isAncestor) {
          initialExpanded[item.id] = true;
          if (item.children) traverse(item.children);
        }
      });
    };
    traverse(navigationTree);
    setExpandedItems(initialExpanded);
  }, [navigationTree, mappedMappings]);

  const toggleExpand = useCallback((id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const addMapping = useCallback(
    (item) => {
      const pathTitles = getPathToItem(navigationTree, item.id);
      if (pathTitles && selectedCollection) {
        const fullPath = [selectedCollection.title, ...pathTitles];
        setMappedMappings((prev) => [...prev, { navId: item.id, fullPath }]);
      }
    },
    [navigationTree, selectedCollection]
  );

  const removeMapping = useCallback((navId) => {
    setMappedMappings((prev) => prev.filter((m) => m.navId !== navId));
  }, []);

  const isMapped = useCallback(
    (id) => {
      return mappedMappings.some((m) => m.navId === id);
    },
    [mappedMappings]
  );

  return {
    navigationTree,
    mappedMappings,
    expandedItems,
    selectedCollection,
    setSelectedCollection,
    toggleExpand,
    addMapping,
    removeMapping,
    isMapped,
    setMappedMappings,
    setNavigationTree,
  };
};
