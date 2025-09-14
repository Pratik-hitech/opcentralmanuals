import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Container,
  Divider,
} from "@mui/material";
import { Link as LinkIcon } from "@mui/icons-material";
import RichTextContent from "../RichTextContent";
import VideoRenderer from "../common/VideoRenderer";

const PolicyPreview = ({
  title,
  content,
  tags = [],
  videos = [],
  links = [],
}) => {
  const renderVideo = (video, index) => {
    return <VideoRenderer video={video} key={index} />;
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
