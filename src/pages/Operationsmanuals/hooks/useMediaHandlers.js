import { useState, useCallback } from "react";
import { useNotification } from "../../../hooks/useNotification";

export const useMediaHandlers = (
  selectedLinks,
  embeddedPdf,
  setSelectedLinks,
  setEmbeddedPdf
) => {
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [showPdfMediaViewer, setShowPdfMediaViewer] = useState(false);
  const [showImageMediaViewer, setShowImageMediaViewer] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const showNotification = useNotification();

  const handleMediaViewerClose = useCallback(
    (selectedFiles = []) => {
      setShowMediaViewer(false);
      if (selectedFiles.length > 0) {
        const newFileLinks = selectedFiles.map((file) => ({
          type: "file",
          data: file,
        }));
        const uniqueNew = newFileLinks.filter(
          (newLink) =>
            !selectedLinks.some(
              (existing) =>
                existing.type === "file" && existing.data.id === newLink.data.id
            )
        );
        if (uniqueNew.length !== newFileLinks.length) {
          showNotification(
            "warning",
            "Some selected files are already linked."
          );
        }
        if (uniqueNew.length > 0) {
          setSelectedLinks((prev) => [...prev, ...uniqueNew]);
          showNotification("success", `${uniqueNew.length} file(s) linked.`);
        }
      }
    },
    [selectedLinks, setSelectedLinks, showNotification]
  ); // ✅ Now depends on selectedLinks

  const handlePdfMediaViewerClose = useCallback(
    (selectedPdfFiles = []) => {
      setShowPdfMediaViewer(false);
      if (selectedPdfFiles.length > 0) {
        const pdf = selectedPdfFiles[0];
        const isPdf =
          pdf.type === "application/pdf" ||
          pdf.name.toLowerCase().endsWith(".pdf");
        if (!isPdf) {
          showNotification("error", "Please select a PDF file.");
          return;
        }
        if (embeddedPdf && embeddedPdf.id === pdf.id) {
          // ✅ Now embeddedPdf is in scope
          showNotification("info", "This PDF is already embedded.");
        } else {
          setEmbeddedPdf(pdf);
          showNotification("success", "PDF embedded successfully.");
        }
      }
    },
    [embeddedPdf, setEmbeddedPdf, showNotification]
  ); // ✅ Depends on embeddedPdf

  const handleImageMediaViewerClose = useCallback((selectedImageFiles = []) => {
    setShowImageMediaViewer(false);
    if (selectedImageFiles.length > 0) {
      const editor = window.tinymce?.activeEditor;
      if (editor) {
        selectedImageFiles.forEach((img) => {
          const urlPart = img.url.startsWith("/") ? img.url : "/" + img.url;
          // ⚠️ Fix: remove extra space in URL
          const imageUrl = `https://opmanual.franchise.care/uploaded/${img.company_id}${urlPart}`;
          editor.insertContent(
            `<img src="${imageUrl}" alt="${img.name}" style="max-width:100%;height:auto;" />`
          );
        });
      }
    }
  }, []);

  const handleVideoPreview = useCallback((index, videos) => {
    setPreviewVideo(videos[index]);
    setShowVideoPreview(true);
  }, []);

  return {
    showMediaViewer,
    setShowMediaViewer,
    showPdfMediaViewer,
    setShowPdfMediaViewer,
    showImageMediaViewer,
    setShowImageMediaViewer,
    previewVideo,
    setPreviewVideo,
    showVideoPreview,
    setShowVideoPreview,
    handleMediaViewerClose,
    handlePdfMediaViewerClose,
    handleImageMediaViewerClose,
    handleVideoPreview,
  };
};
