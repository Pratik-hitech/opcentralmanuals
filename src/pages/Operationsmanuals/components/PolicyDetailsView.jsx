import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Link as MuiLink,
  CircularProgress,
  IconButton,
  Divider,
  Container,
} from "@mui/material";
import {
  Link as LinkIcon,
  Edit as EditIcon,
  ArrowBack,
} from "@mui/icons-material";
import { httpClient } from "../../../utils/httpClientSetup";
import RichTextContent from "./RichTextContent";
import { useAuth } from "../../../context/AuthContext";
import VideoRenderer from "./common/VideoRenderer";

const PolicyDetailsView = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const isAdmin = user?.role?.name === "admin";

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
  const renderVideo = (video, index) => {
    return <VideoRenderer video={video} key={index} />;
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
            {isAdmin && (
              <>
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
              </>
            )}

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
                {policy.videos.map((video, index) => renderVideo(video, index))}
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
