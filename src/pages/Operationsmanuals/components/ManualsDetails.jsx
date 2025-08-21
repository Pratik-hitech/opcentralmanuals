import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { httpClient } from "../../../utils/httpClientSetup";
import { useNotification } from "../../../hooks/useNotification";

const ManualsDetails = () => {
  const { id } = useParams(); // Get the manual ID from URL params
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    thumbnailPreview: "",
  });

  const showNotification = useNotification();

  // Fetch manual data when component mounts (if in edit mode)
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchManualData();
    }
  }, [id]);

  const fetchManualData = async () => {
    try {
      setFetching(true);
      const response = await httpClient.get(`/collections/${id}`);

      if (response.data.success) {
        const manual = response.data.data;
        setFormData({
          title: manual.title,
          description: manual.description || "",
          thumbnail: null,
          thumbnailPreview: manual.thumbnail || "",
        });
      }
    } catch (err) {
      console.error("Error fetching manual:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch manual";
      showNotification("error", errorMessage);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
      thumbnailPreview: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    if (formData.thumbnail) {
      submitData.append("image", formData.thumbnail);
    }

    try {
      setLoading(true);

      let response;
      if (isEditing) {
        // Use PUT or PATCH for editing
        response = await httpClient.put(`/collections/${id}`, submitData);
      } else {
        // Use POST for creating new
        response = await httpClient.post("/collections", submitData);
      }

      const { data } = response;
      if (data.success) {
        showNotification(
          "success",
          data.message ||
            `Manual ${isEditing ? "updated" : "saved"} successfully`
        );

        if (!isEditing) {
          // Reset form only for new entries
          setFormData({
            title: "",
            description: "",
            thumbnail: null,
            thumbnailPreview: "",
          });
        }
      }
    } catch (err) {
      console.error("Error saving manual:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditing ? "update" : "save"} manual`;
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "65%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2, textAlign: "center" }}
        >
          {isEditing ? "Edit Manual" : "Create Manual"}
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              variant="outlined"
              size="medium"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle1">Thumbnail Image</Typography>

              {formData.thumbnailPreview ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexDirection: "column",
                  }}
                >
                  <Box
                    component="img"
                    src={formData.thumbnailPreview}
                    alt="Thumbnail preview"
                    sx={{
                      maxHeight: 150,
                      maxWidth: "100%",
                      borderRadius: 1,
                    }}
                  />
                  <Button
                    onClick={handleRemoveThumbnail}
                    color="error"
                    variant="outlined"
                    startIcon={<Delete />}
                  >
                    Remove Image
                  </Button>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Upload Thumbnail
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              )}
              <Typography variant="caption" color="text.secondary">
                Optional: Upload a thumbnail image (JPEG, PNG)
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                alignSelf: "center",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={24} color="inherit" />
                  <Typography variant="body2">
                    {isEditing ? "Updating..." : "Saving..."}
                  </Typography>
                </Box>
              ) : isEditing ? (
                "Update Manual"
              ) : (
                "Save Manual"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ManualsDetails;
