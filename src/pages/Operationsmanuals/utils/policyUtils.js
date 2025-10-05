import { httpClient } from "../../../utils/httpClientSetup";

// Pure utility: find path in tree
export const getPathToItem = (items, targetId, path = []) => {
  if (!items) return null;
  for (let item of items) {
    if (item.id === targetId) {
      return [...path, item.title];
    }
    const childPath = getPathToItem(item.children, targetId, [
      ...path,
      item.title,
    ]);
    if (childPath) return childPath;
  }
  return null;
};

// Transform raw policy API response into UI state
export const transformPolicyData = async (policyData) => {
  const {
    title,
    content,
    tags = [],
    videos = [],
    pdf,
    links = [],
    navigations = [],
    versions = [],
  } = policyData;

  // Tags
  const tagList = tags.map((t) => t.title);

  // Videos
  const videoList = videos || [];

  // Links
  let transformedLinks = links.map((link) => ({
    type: link.type,
    data: {
      id: link.type_id,
      name: link.name,
      title: link.name,
      url: link.url,
    },
  }));

  // Enrich link names
  const enrichedLinks = await Promise.all(
    transformedLinks.map(async (link) => {
      if (link.data.name !== null && link.data.name !== undefined) return link;

      if (link.type === "file") {
        link.data.name = link.data.url.split("/").pop();
        link.data.title = link.data.name;
      } else if (link.type === "policy") {
        try {
          const res = await httpClient.get(`/policies/${link.data.id}`);
          if (res.data.success) {
            link.data.name = res.data.data.title;
            link.data.title = res.data.data.title;
          }
        } catch (err) {
          console.error(`Failed to fetch policy ${link.data.id}:`, err);
        }
      }
      return link;
    })
  );

  // Mappings
  const navigationPromises = navigations.map(async (nav) => {
    try {
      const colRes = await httpClient.get(`/collections/${nav.collection_id}`);
      if (!colRes.data.success) return null;
      const collection = colRes.data.data;

      const treeRes = await httpClient.get(
        `/navigations/tree/${nav.collection_id}`
      );
      if (!treeRes.data.success) return null;
      const tree = treeRes.data.data || [];

      const pathTitles = getPathToItem(tree, nav.id);
      if (pathTitles) {
        return {
          navId: nav.id,
          fullPath: [collection.title, ...pathTitles],
          collectionId: nav.collection_id,
        };
      }
    } catch (err) {
      console.error("Error in mapping resolution:", err);
    }
    return null;
  });

  const resolvedMappings = (await Promise.all(navigationPromises)).filter(
    Boolean
  );

  // Versions
  let currentVer = "1.0";
  let nextVer = "1.1";
  if (versions.length > 0) {
    currentVer = (1.0 + (versions.length - 1) * 0.1).toFixed(1);
    nextVer = (1.0 + versions.length * 0.1).toFixed(1);
  }

  return {
    formData: { title, content },
    tags: tagList,
    videos: videoList,
    selectedLinks: enrichedLinks,
    embeddedPdf: pdf,
    mappedMappings: resolvedMappings,
    currentVersion: currentVer,
    nextVersion: nextVer,
  };
};
