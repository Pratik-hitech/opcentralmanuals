import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Link as MuiLink,
  Container,
  Divider,
} from "@mui/material";
import { PlayCircle, Link as LinkIcon } from "@mui/icons-material";
import RichTextContent from "../RichTextContent";
import { getVimeoVideoId, getYoutubeVideoId } from "../../utils";

const PolicyPreview = ({
  title,
  content,
  tags = [],
  videos = [],
  links = [],
}) => {
  const renderVideo = (video, index) => {
    const renderVideoPreview = () => {
      const videoSrc =
        video.type === "upload" && video.file
          ? URL.createObjectURL(video.file)
          : video.reference_url;

      if (video.type === "youtube" && video.reference_url) {
        const videoId = getYoutubeVideoId(video.reference_url);
        if (videoId) {
          return (
            <Box
              sx={{
                position: "relative",
                paddingTop: "56.25%" /* 16:9 ratio */,
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                }}
              />
            </Box>
          );
        }
      } else if (video.type === "vimeo" && video.reference_url) {
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
              />
            </Box>
          );
        }
      } else if (video.type === "upload" && videoSrc) {
        return (
          <Box sx={{ position: "relative", paddingTop: "56.25%", mb: 2 }}>
            <video
              controls
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "8px", // optional, for rounded edges
                backgroundColor: "#000", // avoids white flash before video loads
              }}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        );
      }
      return null;
    };

    return (
      <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {video.title}
        </Typography>
        {video.description && (
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            {video.description}
          </Typography>
        )}
        {renderVideoPreview()}
        {video.reference_url && (
          <Box sx={{ mt: 2, mb: 2 }}>
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
        )}
        <Chip label={video.type} size="small" variant="outlined" />
      </Paper>
    );
  };

  const renderLink = (link, index) => {
    const linkName = link.data?.name || link.data?.title || "Unnamed";
    return (
      <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LinkIcon fontSize="small" />
          <Typography>{linkName}</Typography>
          {/* {link.data?.url && (
            <MuiLink href={link.data.url} target="_blank" rel="noopener">
              View
            </MuiLink>
          )} */}
        </Box>
        <Chip label={link.type} size="small" variant="outlined" />
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {title || "Policy Preview"}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {content && <RichTextContent content={content} />}
        {videos.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Videos
            </Typography>
            {videos.map((video, index) => renderVideo(video, index))}
          </Box>
        )}
        {tags.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" />
              ))}
            </Box>
          </Box>
        )}
        {links.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Links
            </Typography>
            {links.map((link, index) => renderLink(link, index))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PolicyPreview;
