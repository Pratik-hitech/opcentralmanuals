import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  styled,
  FormLabel,
  OutlinedInput,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import RichTextEditor from "../../../../components/RichTextEditor";
import { httpClient } from "../../../../utils/httpClientSetup";
import { useNotification } from "../../../../hooks/useNotification";
import AddVideo from "./AddVideo";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "12px",
  minHeight: "48px",
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
  "&:focus-within": {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
}));

const TagInput = styled("input")(({ theme }) => ({
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  fontSize: "14px",
  minWidth: "120px",
  flex: 1,
  "&::placeholder": {
    color: "#9ca3af",
  },
}));

const PolicyDetails = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "<p>Hello Blue Wheelers!</p>",
  });

  const [tags, setTags] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const showNotification = useNotification();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleVideoAdd = (videoData) => {
    console.log("Video added:", videoData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    tags.forEach((tag, index) => {
      submitData.append(`tags[${index}]`, tag);
    });

    try {
      const response = await httpClient.post("/policies", submitData);
      console.log("Section saved:", response.data);

      const { data } = response;

      if (data.success) {
        showNotification(
          "success",
          data.message || "Details saved successfully"
        );
      }
    } catch (err) {
      console.error("Error saving section:", err);
      const errorMessage =
        err.response?.data?.message || err.message || `Failed to save details`;
    } finally {
      setLoading(false);
    }
  };

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
          sx={{ mb: 2, textAlign: "center", color: "#2d3748", fontWeight: 700 }}
        >
          Policy Details
        </Typography>

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
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Title Field */}
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel
                htmlFor="title"
                required
                sx={{ color: "#4a5568", fontWeight: 500, mb: 1 }}
              >
                Title
              </FormLabel>
              <OutlinedInput
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter policy title"
                autoComplete="title"
                required
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9ca3af",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                }}
              />
            </FormGrid>

            {/* Body Content Field */}
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel
                htmlFor="content"
                required
                sx={{ color: "#4a5568", fontWeight: 500, mb: 1 }}
              >
                Body Content
              </FormLabel>
              <Paper
                sx={{
                  border: "1px solid #d1d5db",
                  borderRadius: 2,
                  minHeight: 200,
                  p: 3,
                  backgroundColor: "#f9fafb",
                }}
              >
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                />
              </Paper>
            </FormGrid>

            <Box>
              <FormLabel
                sx={{
                  color: "#4a5568",
                  fontWeight: 500,
                  mb: 1,
                  display: "block",
                }}
              >
                Tags
              </FormLabel>
              <TagsContainer>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                    sx={{
                      backgroundColor: "#eff6ff",
                      borderColor: "#667eea",
                      color: "#667eea",
                      "& .MuiChip-deleteIcon": {
                        color: "#667eea",
                        "&:hover": {
                          color: "#5a6fd8",
                        },
                      },
                    }}
                  />
                ))}
                <TagInput
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder={
                    tags.length === 0
                      ? "Type and press Enter to add tags"
                      : "Add another tag..."
                  }
                />
              </TagsContainer>
              <Typography
                variant="caption"
                sx={{ color: "#718096", mt: 1, display: "block" }}
              >
                Type a tag and press Enter to add it. Press Backspace to remove
                the last tag.
              </Typography>
            </Box>

            {/* Video Component */}
            <AddVideo
              isEnabled={isVideoEnabled}
              onToggle={setIsVideoEnabled}
              onVideoAdd={handleVideoAdd}
            />

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  background:
                    "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #5a6fd8 30%, #6b46a3 90%)",
                    boxShadow: "0 6px 25px rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                Save Details
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PolicyDetails;
