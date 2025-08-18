import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  styled,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  ToggleButton,
  TextField,
  ToggleButtonGroup,
  DialogActions,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  Close,
  VideoLibrary,
  YouTube,
  Movie,
  PlayCircleOutline,
} from "@mui/icons-material";

const VideoCard = styled(Card)(({ theme }) => ({
  //   background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "1px solid #e1e5e9",
}));

const VideoToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: 12,
  padding: "16px 24px",
  border: "2px solid #e0e4e7",
  color: "#4a5568",
  margin: "4px",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  minWidth: 120,
  "&.Mui-selected": {
    backgroundColor: "#667eea",
    color: "white",
    border: "2px solid #667eea",
    "&:hover": {
      backgroundColor: "#5a6fd8",
    },
  },
  "&:hover": {
    backgroundColor: "#f7fafc",
    border: "2px solid #cbd5e0",
  },
}));

const UploadArea = styled(Box)(({ theme }) => ({
  border: "2px dashed #cbd5e0",
  borderRadius: 12,
  padding: "48px 24px",
  textAlign: "center",
  backgroundColor: "#f7fafc",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#667eea",
    backgroundColor: "#edf2f7",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
    border: "1px solid #e2e8f0",
  },
}));

// Add Video Component
const AddVideo = ({ isEnabled, onToggle, onVideoAdd }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoType, setSelectedVideoType] = useState("upload");
  const [videoData, setVideoData] = useState({
    file: null,
    url: "",
    title: "",
    description: "",
  });

  const handleOpenVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setVideoData({
      file: null,
      url: "",
      title: "",
      description: "",
    });
  };

  const handleVideoTypeChange = (event, newType) => {
    if (newType) setSelectedVideoType(newType);
  };

  const handleVideoDataChange = (field, value) => {
    setVideoData({ ...videoData, [field]: value });
  };

  const handleSubmitVideo = () => {
    console.log("Submitting video:", videoData);
    onVideoAdd?.(videoData);
    handleCloseVideoModal();
  };

  return (
    <>
      <Box sx={{ margin: "2rem 0" }}>
        <VideoCard>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: isEnabled ? 2 : 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    background:
                      "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    borderRadius: 2,
                    color: "white",
                  }}
                >
                  <PlayCircleOutline sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#2d3748", fontWeight: 600 }}
                  >
                    Video
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    Add engaging video to your policy
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "#718096" }}>
                  {isEnabled ? "Enabled" : "Disabled"}
                </Typography>
                <Switch
                  checked={isEnabled}
                  onChange={(e) => onToggle(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#667eea",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#667eea",
                    },
                  }}
                />
              </Box>
            </Box>

            {isEnabled && (
              <Box sx={{ textAlign: "center" }}>
                {/* <Chip
                  label="No videos added yet"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    mr: 2,
                    color: "#718096",
                    borderColor: "#e2e8f0",
                  }}
                /> */}
                <Button
                  variant="contained"
                  onClick={handleOpenVideoModal}
                  startIcon={<CloudUpload />}
                  sx={{
                    // background:
                    //   "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 25px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  Add Video
                </Button>
              </Box>
            )}
          </CardContent>
        </VideoCard>
      </Box>

      <StyledDialog
        open={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#2d3748",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <VideoLibrary sx={{ fontSize: 28, color: "#667eea" }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Add Video
            </Typography>
          </Box>
          <IconButton onClick={handleCloseVideoModal} sx={{ color: "#4a5568" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4, backgroundColor: "#ffffff" }}>
          {/* Video Type Selection */}
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 500, color: "#2d3748" }}
            >
              Choose Video Source
            </Typography>
            <ToggleButtonGroup
              value={selectedVideoType}
              exclusive
              onChange={handleVideoTypeChange}
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                "& .MuiToggleButtonGroup-grouped": {
                  border: 0,
                },
              }}
            >
              <VideoToggleButton value="upload">
                <CloudUpload sx={{ fontSize: 24 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Upload File
                </Typography>
              </VideoToggleButton>
              <VideoToggleButton value="youtube">
                <YouTube sx={{ fontSize: 24 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  YouTube
                </Typography>
              </VideoToggleButton>
              <VideoToggleButton value="vimeo">
                <Movie sx={{ fontSize: 24 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Vimeo
                </Typography>
              </VideoToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider sx={{ borderColor: "#e2e8f0", mb: 3 }} />

          {/* Video Input Area */}
          <Box sx={{ mb: 3 }}>
            {selectedVideoType === "upload" ? (
              <UploadArea
                onClick={() => document.getElementById("video-upload").click()}
              >
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleVideoDataChange("file", e.target.files[0])
                  }
                />
                <CloudUpload sx={{ fontSize: 48, mb: 2, color: "#9ca3af" }} />
                <Typography variant="h6" sx={{ mb: 1, color: "#4a5568" }}>
                  {videoData.file
                    ? videoData.file.name
                    : "Drop your video here or click to browse"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#718096" }}>
                  Supports MP4, AVI, MOV and other video formats
                </Typography>
              </UploadArea>
            ) : (
              <TextField
                label={`${
                  selectedVideoType === "youtube" ? "YouTube" : "Vimeo"
                } URL`}
                value={videoData.url}
                onChange={(e) => handleVideoDataChange("url", e.target.value)}
                fullWidth
                placeholder={`Paste your ${
                  selectedVideoType === "youtube" ? "YouTube" : "Vimeo"
                } link here`}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#d1d5db",
                    },
                    "&:hover fieldset": {
                      borderColor: "#9ca3af",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />
            )}
          </Box>

          {/* Video Details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Video Title"
              value={videoData.title}
              onChange={(e) => handleVideoDataChange("title", e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#9ca3af",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />

            <TextField
              label="Description"
              value={videoData.description}
              onChange={(e) =>
                handleVideoDataChange("description", e.target.value)
              }
              fullWidth
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#9ca3af",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Button
            onClick={handleCloseVideoModal}
            sx={{
              color: "#4a5568",
              border: "1px solid #d1d5db",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#f7fafc",
                borderColor: "#9ca3af",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitVideo}
            variant="contained"
            sx={{
              //   background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #5a6fd8 30%, #6b46a3 90%)",
              },
            }}
          >
            Add Video
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default AddVideo;
