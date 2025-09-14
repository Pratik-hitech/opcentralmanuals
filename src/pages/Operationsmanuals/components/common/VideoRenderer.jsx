import React from "react";
import { Box, Typography, Paper, Chip, Link as MuiLink } from "@mui/material";
import { PlayCircle } from "@mui/icons-material";
import ResponsiveVideo from "./ResponsiveVideo";

/**
 * Complete video renderer component that displays a video with title, description, and actions
 *
 * @param {Object} video - Video object with type, title, description, reference_url, and optionally file
 * @param {string} key - React key for the component
 */
const VideoRenderer = ({ video, key }) => {
  return (
    <Paper key={key} elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {video.title}
      </Typography>
      {video.description && (
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          {video.description}
        </Typography>
      )}
      <ResponsiveVideo video={video} title={video.title} />
      <Box sx={{ mt: 2, mb: 1 }}>
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

export default VideoRenderer;
