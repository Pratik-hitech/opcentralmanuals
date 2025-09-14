import React from "react";
import { Box } from "@mui/material";
import { getYouTubeVideoId, getVimeoVideoId } from "../../utils/videoUtils";

/**
 * Responsive video component that handles YouTube, Vimeo, and uploaded videos
 * Maintains proper aspect ratio and prevents distortion
 *
 * @param {Object} video - Video object with type, reference_url, and optionally file
 * @param {string} title - Video title for accessibility
 * @param {Object} sx - Additional styling props
 */
const ResponsiveVideo = ({ video, title, sx = {} }) => {
  // Render video preview based on type
  const renderVideoPreview = () => {
    if (video.type === "youtube") {
      const videoId = getYouTubeVideoId(video.reference_url);
      if (videoId) {
        return (
          <Box
            sx={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              ...sx,
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title || video.title}
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
          <Box
            sx={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              ...sx,
            }}
          >
            <iframe
              src={`https://player.vimeo.com/video/${videoId}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={title || video.title}
            ></iframe>
          </Box>
        );
      }
    } else if (video.type === "upload") {
      // For uploaded videos, we can use either a file object or reference_url
      const videoSrc = video.file
        ? URL.createObjectURL(video.file)
        : video.reference_url;

      if (videoSrc) {
        return (
          <Box
            sx={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              ...sx,
            }}
          >
            <video
              controls
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        );
      }
    }
    return null;
  };

  return renderVideoPreview();
};

export default ResponsiveVideo;
