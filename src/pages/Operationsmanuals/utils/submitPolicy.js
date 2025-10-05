import { httpClient } from "../../../utils/httpClientSetup";

const findNavigationItem = (tree, targetId) => {
  if (!tree) return null;
  for (let item of tree) {
    if (item.id === targetId) return item;
    const child = findNavigationItem(item.children, targetId);
    if (child) return child;
  }
  return null;
};

export const buildSubmitData = (
  formData,
  tags,
  selectedLinks,
  videos,
  mappedMappings,
  navigationTree,
  collectionId,
  isEdit,
  updateToVersion,
  versionNotes
) => {
  const submitData = new FormData();
  submitData.append("title", formData.title);
  submitData.append("content", formData.content);

  tags.forEach((tag, i) => submitData.append(`tags[${i}]`, tag));

  selectedLinks.forEach((link, i) => {
    if (link.type === "file") {
      submitData.append(`links[${i}][type]`, "file");
      submitData.append(`links[${i}][type_id]`, link.data.id);
    } else if (link.type === "policy") {
      submitData.append(`links[${i}][type]`, "policy");
      submitData.append(`links[${i}][type_id]`, link.data?.id);
    }
  });

  videos.forEach((video, i) => {
    submitData.append(`videos[${i}][type]`, video.type);
    submitData.append(`videos[${i}][title]`, video.title);
    if (video.type === "upload") {
      if (video.file) {
        submitData.append(`videos[${i}][file]`, video.file);
      } else if (video.reference_url) {
        submitData.append(`videos[${i}][reference_url]`, video.reference_url);
      }
    } else if (
      (video.type === "youtube" || video.type === "vimeo") &&
      video.reference_url
    ) {
      submitData.append(`videos[${i}][reference_url]`, video.reference_url);
    }
  });

  mappedMappings.forEach((mapping, i) => {
    if (mapping.navId !== null) {
      const item = findNavigationItem(navigationTree, mapping.navId);
      if (item) {
        const navId = item.table === "policies" ? item.parent_id : item.id;
        submitData.append(`navigations[${i}][id]`, navId);
        if (isEdit) {
          submitData.append(`navigations[${i}][order]`, item.order);
        }
      }
    } else {
      submitData.append(`navigations[${i}][id]`, null);
      if (!isEdit) {
        const topLevel = navigationTree.filter((x) => x.parent_id === null);
        const maxOrder = topLevel.reduce(
          (max, curr) => Math.max(max, curr.order || 0),
          0
        );
        submitData.append(`navigations[${i}][order]`, maxOrder + 1);
      }
    }
  });

  submitData.append("collection_id", collectionId);

  if (isEdit && updateToVersion) {
    submitData.append("notes", versionNotes);
  }

  return submitData;
};

export const submitPolicy = async (
  submitData,
  policyId,
  isEdit,
  showNotification,
  navigate
) => {
  try {
    const url = isEdit ? `/policies/${policyId}` : "/policies";
    const response = await httpClient.post(url, submitData);

    if (response.data.success) {
      showNotification(
        "success",
        response.data.message ||
          `Policy ${isEdit ? "updated" : "saved"} successfully`
      );
      setTimeout(() => navigate(-1, { state: { refresh: true } }), 1000);
      return true;
    } else {
      showNotification("error", response.data.message || "Save failed");
      return false;
    }
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || "Failed to save policy";
    showNotification("error", msg);
    return false;
  }
};
