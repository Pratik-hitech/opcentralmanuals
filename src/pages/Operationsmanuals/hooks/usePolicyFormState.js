import { useState, useCallback } from "react";

export const usePolicyFormState = () => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [embeddedPdf, setEmbeddedPdf] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleContentChange = useCallback((content) => {
    setFormData((prev) => ({ ...prev, content }));
  }, []);

  const handleTagInputChange = useCallback((e) => {
    setTagInput(e.target.value);
  }, []);

  const handleTagInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && tagInput.trim()) {
        e.preventDefault();
        if (!tags.includes(tagInput.trim())) {
          setTags((prev) => [...prev, tagInput.trim()]);
        }
        setTagInput("");
      } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
        setTags((prev) => prev.slice(0, -1));
      }
    },
    [tagInput, tags]
  );

  const handleDeleteTag = useCallback((tagToDelete) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToDelete));
  }, []);

  // Video handlers
  const handleVideoAdd = useCallback((videoData) => {
    setVideos((prev) => [...prev, videoData]);
  }, []);

  const handleVideoEdit = useCallback((index, updatedVideoData) => {
    setVideos((prev) => {
      const updated = [...prev];
      updated[index] = updatedVideoData;
      return updated;
    });
  }, []);

  const handleVideoRemove = useCallback((index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    formData,
    setFormData,
    tags,
    tagInput,
    videos,
    isVideoEnabled,
    selectedLinks,
    embeddedPdf,
    setEmbeddedPdf,
    setVideos,
    setIsVideoEnabled,
    setSelectedLinks,
    setTags,
    handleChange,
    handleContentChange,
    handleTagInputChange,
    handleTagInputKeyDown,
    handleDeleteTag,
    handleVideoAdd,
    handleVideoEdit,
    handleVideoRemove,
  };
};
