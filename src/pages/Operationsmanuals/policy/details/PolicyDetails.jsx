import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useNotification } from "../../../../hooks/useNotification";

// Hooks
import { usePolicyFormState } from "../../hooks/usePolicyFormState";
import { usePolicyDataFetching } from "../../hooks/usePolicyDataFetching";
import { useNavigationMapping } from "../../hooks/useNavigationMapping";
import { useMediaHandlers } from "../../hooks/useMediaHandlers";
import { usePolicyDialogs } from "../../hooks/usePolicyDialogs";

// Utils
import { buildSubmitData, submitPolicy } from "../../utils/submitPolicy";
import { getYouTubeVideoId, getVimeoVideoId } from "../../utils/videoUtils";

// UI Components
import PolicyFormHeader from "./PolicyFormHeader";
import PolicyTitleField from "./PolicyTitleField";
import PolicyContentEditor from "./PolicyContentEditor";
import PolicyTagsManager from "./PolicyTagsManager";
import AddVideo from "./AddVideo";
import PolicyLinksManager from "./PolicyLinksManager";
import PolicyMappingsManager from "./PolicyMappingsManager";
import PolicyFormActions from "./PolicyFormActions";
import PolicyMediaViewers from "./PolicyMediaViewers";
import PolicyDialogs from "./PolicyDialogs";

const PolicyDetails = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openDropdown = Boolean(anchorEl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchParams] = useSearchParams();
  const navigationId = searchParams.get("navigationId");
  const { id, policyId } = useParams();
  const navigate = useNavigate();
  const showNotification = useNotification();
  const isEdit = !!policyId;

  // Form state
  const formState = usePolicyFormState();

  // Dialog state
  const dialogState = usePolicyDialogs();

  // Navigation mapping
  const navState = useNavigationMapping(id, policyId, navigationId);

  // Media handlers
  const mediaState = useMediaHandlers(
    formState.selectedLinks, // ✅ pass current selectedLinks
    formState.embeddedPdf, // ✅ pass current embeddedPdf
    formState.setSelectedLinks, // setter
    formState.setEmbeddedPdf // setter
  );

  // Data fetching (passes setters to update form state)
  const dataState = usePolicyDataFetching(
    policyId,
    id,
    navigationId,
    navState.setMappedMappings,
    dialogState.setCurrentVersion || (() => {}), // fallback if not used
    dialogState.setNextVersion || (() => {}),
    {
      setFormData: formState.setFormData,
      setTags: formState.setTags,
      setIsVideoEnabled: formState.setIsVideoEnabled,
      setVideos: formState.setVideos,
      setSelectedLinks: formState.setSelectedLinks,
      setEmbeddedPdf: formState.setEmbeddedPdf,
    }
  );

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  // Policy link handlers
  const handleSelectPolicyLink = () => {
    mediaState.setShowMediaViewer(false);
    dataState.fetchPolicies();
    dialogState.setPolicyLinkToEditIndex(null);
    dialogState.setSelectedPolicyId(null);
    dialogState.setPolicyDialogOpen(true);
    handleCloseDropdown();
  };

  const handleAddPolicyLink = () => {
    if (dialogState.selectedPolicyId) {
      const policyToAdd = dataState.policies.find(
        (p) => p.id === dialogState.selectedPolicyId
      );
      if (policyToAdd) {
        const isDuplicate = formState.selectedLinks.some(
          (link, idx) =>
            link.type === "policy" &&
            link.data.id === policyToAdd.id &&
            idx !== dialogState.policyLinkToEditIndex
        );
        if (isDuplicate) {
          showNotification("warning", "This policy is already linked.");
        } else {
          if (dialogState.policyLinkToEditIndex !== null) {
            const updated = [...formState.selectedLinks];
            updated[dialogState.policyLinkToEditIndex] = {
              type: "policy",
              data: policyToAdd,
            };
            formState.setSelectedLinks(updated);
            showNotification("success", "Policy link updated.");
          } else {
            formState.setSelectedLinks((prev) => [
              ...prev,
              { type: "policy", data: policyToAdd },
            ]);
          }
        }
      }
    }
    dialogState.setPolicyDialogOpen(false);
  };

  const handleEditPolicyLink = (index) => {
    const link = formState.selectedLinks[index];
    if (link?.type === "policy") {
      dataState.fetchPolicies();
      dialogState.setSelectedPolicyId(link.data.id);
      dialogState.setPolicyLinkToEditIndex(index);
      dialogState.setPolicyDialogOpen(true);
    }
  };

  const handleRemoveLink = (index) => {
    formState.setSelectedLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClickCreateLinks = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const submitData = buildSubmitData(
        formState.formData,
        formState.tags,
        formState.selectedLinks,
        formState.videos,
        navState.mappedMappings,
        navState.navigationTree,
        id,
        isEdit,
        dialogState.updateToVersion,
        dialogState.versionNotes
      );

      const success = await submitPolicy(
        submitData,
        policyId,
        isEdit,
        showNotification,
        navigate
      );

      if (success && !isEdit) {
        // Reset form on create
        formState.setFormData({ title: "", content: "" });
        formState.setTags([]);
        formState.setSelectedLinks([]);
        formState.setVideos([]);
        formState.setIsVideoEnabled(false);
        navState.setMappedMappings([]);
        navState.setSelectedCollection(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dataState.loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading details...</Typography>
      </Box>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
        backgroundColor: "#f8fafc",
      }}
    >
      <Box
        sx={{ width: "70%", display: "flex", flexDirection: "column", gap: 3 }}
      >
        <PolicyFormHeader navigate={navigate} />
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <PolicyTitleField
              formData={formState.formData}
              handleChange={formState.handleChange}
            />
            <PolicyContentEditor
              formData={formState.formData}
              handleContentChange={formState.handleContentChange}
              handleImageUpload={() => mediaState.setShowImageMediaViewer(true)}
            />
            <PolicyTagsManager
              tags={formState.tags}
              tagInput={formState.tagInput}
              handleTagInputChange={formState.handleTagInputChange}
              handleTagInputKeyDown={formState.handleTagInputKeyDown}
              handleDeleteTag={formState.handleDeleteTag}
            />
            <AddVideo
              isEnabled={formState.isVideoEnabled}
              onToggle={formState.setIsVideoEnabled}
              onVideoAdd={formState.handleVideoAdd}
              onVideoEdit={formState.handleVideoEdit}
              onVideoRemove={formState.handleVideoRemove}
              onVideoPreview={(index) =>
                mediaState.handleVideoPreview(index, formState.videos)
              }
              videos={formState.videos}
            />
            <PolicyLinksManager
              selectedLinks={formState.selectedLinks}
              handleEditPolicyLink={handleEditPolicyLink}
              handleRemoveLink={handleRemoveLink}
              handleClickCreateLinks={handleClickCreateLinks}
              handleSelectFileLink={() => {
                mediaState.setShowMediaViewer(true);
                handleCloseDropdown();
              }}
              handleSelectPolicyLink={handleSelectPolicyLink}
              // If you use dropdown anchor, add anchorEl logic here
              handleCloseDropdown={handleCloseDropdown}
              anchorEl={anchorEl}
              openDropdown={openDropdown}
            />
            <PolicyMappingsManager
              collections={dataState.collections}
              selectedCollection={navState.selectedCollection}
              navigationTree={navState.navigationTree}
              mappedMappings={navState.mappedMappings}
              expandedItems={navState.expandedItems}
              setSelectedCollection={navState.setSelectedCollection}
              fetchNavigations={navState.setNavigationTree} // or pass a fetch fn if needed
              removeMapping={navState.removeMapping}
              toggleExpand={navState.toggleExpand}
              addMapping={navState.addMapping}
              isMapped={navState.isMapped}
            />
            <PolicyFormActions
              isSubmitting={isSubmitting}
              isEdit={isEdit}
              handleUpdateClick={dialogState.handleUpdateClick}
              handleSubmit={handleSubmit}
              setShowPreview={dialogState.setShowPreview}
            />
          </Box>
        </Paper>
      </Box>

      <PolicyMediaViewers
        showMediaViewer={mediaState.showMediaViewer}
        handleMediaViewerClose={mediaState.handleMediaViewerClose}
        showPdfMediaViewer={mediaState.showPdfMediaViewer}
        handlePdfMediaViewerClose={mediaState.handlePdfMediaViewerClose}
        showImageMediaViewer={mediaState.showImageMediaViewer}
        handleImageMediaViewerClose={mediaState.handleImageMediaViewerClose}
      />

      <PolicyDialogs
        showPolicyDialog={dialogState.showPolicyDialog}
        loadingPolicies={dataState.loadingPolicies}
        policies={dataState.policies}
        selectedPolicyId={dialogState.selectedPolicyId}
        handlePolicyDialogClose={() => dialogState.setPolicyDialogOpen(false)}
        handlePolicySelectChange={(e, newValue) =>
          dialogState.setSelectedPolicyId(newValue?.id || null)
        }
        handleAddPolicyLink={handleAddPolicyLink}
        policyLinkToEditIndex={dialogState.policyLinkToEditIndex}
        updateDialogOpen={dialogState.updateDialogOpen}
        handleUpdateCancel={dialogState.handleUpdateCancel}
        handleUpdateConfirm={() => {
          dialogState.setUpdateDialogOpen(false);
          handleSubmit({ preventDefault: () => {} });
        }}
        updateToVersion={dialogState.updateToVersion}
        setUpdateToVersion={dialogState.setUpdateToVersion}
        versionNotes={dialogState.versionNotes}
        setVersionNotes={dialogState.setVersionNotes}
        nextVersion={"1.1"} // You can pass from dataState if tracked
        currentVersion={"1.0"}
        showVideoPreview={mediaState.showVideoPreview}
        setShowVideoPreview={mediaState.setShowVideoPreview}
        previewVideo={mediaState.previewVideo}
        getYouTubeVideoId={getYouTubeVideoId}
        getVimeoVideoId={getVimeoVideoId}
        showPreview={dialogState.showPreview}
        setShowPreview={dialogState.setShowPreview}
        formData={formState.formData}
        tags={formState.tags}
        videos={formState.videos}
        selectedLinks={formState.selectedLinks}
      />
    </Container>
  );
};

export default PolicyDetails;
