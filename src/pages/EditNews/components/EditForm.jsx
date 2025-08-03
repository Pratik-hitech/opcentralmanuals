import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useParams, useNavigate } from "react-router-dom";
import { httpClient } from "../../../utils/httpClientSetup";

// const API_BASE = "https://opmanual.franchise.care/php/public/api/v1/news";

const EditForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    video: false,
    featured: false,
    archive: false,
    primaryImage: null,
    attachments: null,
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      httpClient
        .get(`news/${id}`)
        .then((response) => {
          const article = response.data.data;
          setFormData({
            title: article.title || "",
            content: article.content || "",
            category: article.category || "",
            video: article.video || false,
            featured: article.featured || false,
            archive: article.archive || false,
            primaryImage: null,
            attachments: null,
            status : article.status,
            publishedby : article.publishedby
          });
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to load data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("content", formData.content);
    payload.append("category", formData.category);
    // payload.append("video", formData.video);
    // payload.append("featured", formData.featured);
    // payload.append("archive", formData.archive);
    // payload.append("staus", "true");
     payload.append("status", formData.status);
     payload.append("published_by", formData.published_by)

    if (formData.primaryImage)
      payload.append("primaryImage", formData.primaryImage);
    if (formData.attachments) {
      Array.from(formData.attachments).forEach((file, i) => {
        payload.append(`attachments[${i}]`, file);
      });
    }

    try {
      let response;
      if (id) {
        response = await httpClient.post(`news/${id}?_method=PUT`, payload);
        setSuccess("Article updated successfully");
      } else {
        response = await httpClient.post("news", payload);
        setSuccess("Article created successfully");
        navigate(`/news/${response.data.id}/edit`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       height="100vh"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Box
      minHeight="100vh"
      bgcolor={theme.palette.grey[100]}
      p={isMobile ? 2 : 4}
    >
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Paper
        elevation={3}
        sx={{ maxWidth: 800, mx: "auto", p: isMobile ? 2 : 4 }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          {id ? "📰 Edit News Article" : "📰 Create News Article"}
        </Typography>

        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <TextField
            label="Article Title"
            fullWidth
            required
            size={isMobile ? "small" : "medium"}
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <Box>
            <Typography variant="subtitle2">Article Content *</Typography>
            <Box data-color-mode="light">
              <MDEditor
                value={formData.content}
                onChange={(val) => handleChange("content", val)}
                height={isMobile ? 300 : 400}
                preview="edit"
              />
            </Box>
          </Box>

          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              input={<OutlinedInput label="Category" />}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Operations">Operations</MenuItem>
              <MenuItem value="Support">Support</MenuItem>
              <MenuItem value="Announcements">Announcements</MenuItem>
              <MenuItem value="Updates">Updates</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.video}
                onChange={(e) => handleChange("video", e.target.checked)}
              />
            }
            label="Video(s)"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.featured}
                onChange={(e) => handleChange("featured", e.target.checked)}
              />
            }
            label="Featured"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.archive}
                onChange={(e) => handleChange("archive", e.target.checked)}
              />
            }
            label="Auto Archive"
          />

          <Box>
            <Typography variant="subtitle2">Primary Image</Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleChange("primaryImage", e.target.files[0])
                }
              />
            </Button>
            {formData.primaryImage && (
              <Typography variant="caption">
                Selected: {formData.primaryImage.name}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2">Attachments</Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Upload Files
              <input
                hidden
                type="file"
                multiple
                onChange={(e) => handleChange("attachments", e.target.files)}
              />
            </Button>
            {formData.attachments && (
              <Typography variant="caption">
                {formData.attachments.length} file(s) selected
              </Typography>
            )}
          </Box>

          <Divider />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Saving..." : "Submit Article"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EditForm;