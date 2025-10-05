import { useState, useCallback } from "react";

export const usePolicyDialogs = () => {
  const [showPolicyDialog, setPolicyDialogOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [policyLinkToEditIndex, setPolicyLinkToEditIndex] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateToVersion, setUpdateToVersion] = useState(false);
  const [versionNotes, setVersionNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleUpdateClick = useCallback(() => {
    setUpdateDialogOpen(true);
  }, []);

  const handleUpdateCancel = useCallback(() => {
    setUpdateDialogOpen(false);
    setUpdateToVersion(false);
    setVersionNotes("");
  }, []);

  return {
    showPolicyDialog,
    setPolicyDialogOpen,
    selectedPolicyId,
    setSelectedPolicyId,
    policyLinkToEditIndex,
    setPolicyLinkToEditIndex,
    updateDialogOpen,
    setUpdateDialogOpen,
    updateToVersion,
    setUpdateToVersion,
    versionNotes,
    setVersionNotes,
    showPreview,
    setShowPreview,
    handleUpdateClick,
    handleUpdateCancel,
  };
};
