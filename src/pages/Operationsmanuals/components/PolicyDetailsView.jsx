import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Link as MuiLink,
  Button,
  CircularProgress,
  IconButton,
  Divider,
  Container,
} from "@mui/material";
import {
  PlayCircle,
  Link as LinkIcon,
  Edit as EditIcon,
  ArrowBack,
} from "@mui/icons-material";
import { httpClient } from "../../../utils/httpClientSetup";
import RichTextContent from "./RichTextContent";

const PolicyDetailsView = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch policy data
  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(`/policies/${policyId}`);
      setPolicy(response.data.data);
    } catch (error) {
      console.error("Error fetching policy:", error);
      setError("Failed to load policy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (policyId) {
      fetchPolicy();
    }
  }, [policyId]);

  // Render video item
  const renderVideo = (video) => {
    // Function to extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    // Function to extract Vimeo video ID from URL
    const getVimeoVideoId = (url) => {
      const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
      const match = url.match(regExp);
      return match && match[1] ? match[1] : null;
    };

    // Render video preview based on type
    const renderVideoPreview = () => {
      if (video.type === "youtube") {
        const videoId = getYouTubeVideoId(video.reference_url);
        if (videoId) {
          return (
            <Box sx={{ mb: 2 }}>
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </Box>
          );
        }
      } else if (video.type === "vimeo") {
        const videoId = getVimeoVideoId(video.reference_url);
        if (videoId) {
          return (
            <Box sx={{ mb: 2 }}>
              <iframe
                src={`https://player.vimeo.com/video/${videoId}`}
                width="100%"
                height="400"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={video.title}
              ></iframe>
            </Box>
          );
        }
      } else if (video.type === "upload") {
        return (
          <Box sx={{ mb: 2 }}>
            <video controls width="100%">
              <source src={video.reference_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        );
      }
      return null;
    };

    return (
      <Paper key={video.id} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {video.title}
        </Typography>
        {video.description && (
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            {video.description}
          </Typography>
        )}
        {renderVideoPreview()}
        <Box sx={{ mb: 1 }}>
          <MuiLink href={video.reference_url} target="_blank" rel="noopener">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PlayCircle color="primary" />
              <Typography>
                {video.type === "youtube" && "Watch on YouTube"}
                {video.type === "vimeo" && "Watch on Vimeo"}
                {video.type === "upload" && "Play Video"}
              </Typography>
            </Box>
          </MuiLink>
        </Box>
        <Chip label={video.type} size="small" variant="outlined" />
      </Paper>
    );
  };

  // Render link item
  const renderLink = (link) => {
    return (
      <Paper key={link.id} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LinkIcon fontSize="small" />
          <MuiLink href={link.url} target="_blank" rel="noopener">
            <Typography>{link.url}</Typography>
          </MuiLink>
        </Box>
        <Chip label={link.type} size="small" variant="outlined" />
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading policy details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header with title and action buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">
            {policy ? policy.title : "Policy Details"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => {
                // Navigate to edit page
                navigate(
                  `/manuals/edit/${policyId}/policies/edit/${policyId}/details`
                );
              }}
              sx={{ border: "1px solid #ccc" }}
            >
              <EditIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ border: "1px solid #ccc" }}
            >
              <ArrowBack />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Policy Content */}
        {policy && (
          <>
            {policy.content && <RichTextContent content={policy.content} />}

            {/* Videos */}
            {policy.videos && policy.videos.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Videos
                </Typography>
                {policy.videos.map((video) => renderVideo(video))}
              </Box>
            )}

            {/* Tags */}
            {policy.tags && policy.tags.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {policy.tags.map((tag) => (
                    <Chip key={tag.id} label={tag.title} variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Links */}
            {policy.links && policy.links.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Links
                </Typography>
                {policy.links.map((link) => renderLink(link))}
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default PolicyDetailsView;
