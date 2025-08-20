// src/pages/manage/news/VideoModal.jsx
import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography
} from "@mui/material";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSave: (video) => void  // video = { type, title, description?, file?, reference_url? }
 * - initialData?: optional for editing in future
 */
const VideoModal = ({ open, onClose, onSave, initialData }) => {
  const [video, setVideo] = useState({
    type: "upload",
    title: "",
    description: "",
    reference_url: "",
    file: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setVideo({
        type: initialData.type ?? "upload",
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        reference_url: initialData.reference_url ?? "",
        file: null, // we never hydrate file from server
      });
    } else {
      setVideo({
        type: "upload",
        title: "",
        description: "",
        reference_url: "",
        file: null,
      });
    }
    setErrors({});
  }, [open, initialData]);

  const handleChange = (field, value) => {
    setVideo((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const e = {};
    if (!video.title?.trim()) e.title = "Title is required";
    if (video.type === "upload") {
      if (!video.file && !video.reference_url?.trim()) {
        e.file = "Provide a file or a reference URL";
      }
    } else {
      // youtube or vimeo
      if (!video.reference_url?.trim()) e.reference_url = "Reference URL is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(video);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Video</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={video.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <MenuItem value="upload">Upload</MenuItem>
            <MenuItem value="youtube">YouTube</MenuItem>
            <MenuItem value="vimeo">Vimeo</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Title"
          fullWidth
          value={video.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Description (optional)"
          fullWidth
          multiline
          minRows={2}
          value={video.description}
          onChange={(e) => handleChange("description", e.target.value)}
          sx={{ mb: 2 }}
        />

        {video.type === "upload" ? (
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <Button variant="outlined" component="label">
              {video.file ? "Change File" : "Choose File"}
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => handleChange("file", e.target.files?.[0] ?? null)}
              />
            </Button>
            {video.file && (
              <Typography variant="caption">{video.file.name}</Typography>
            )}
            <TextField
              label="Reference URL (optional)"
              placeholder="https://example.com/video.mp4"
              fullWidth
              value={video.reference_url}
              onChange={(e) => handleChange("reference_url", e.target.value)}
              error={!!errors.file}
              helperText={errors.file}
            />
          </Box>
        ) : (
          <TextField
            label="Reference URL"
            placeholder={
              video.type === "youtube"
                ? "https://www.youtube.com/watch?v=..."
                : "https://vimeo.com/..."
            }
            fullWidth
            value={video.reference_url}
            onChange={(e) => handleChange("reference_url", e.target.value)}
            error={!!errors.reference_url}
            helperText={errors.reference_url}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoModal;
