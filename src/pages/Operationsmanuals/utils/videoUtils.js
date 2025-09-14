/**
 * Utility functions for video handling
 */

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube video URL
 * @returns {string|null} - Video ID or null if invalid
 */
export const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Extract Vimeo video ID from URL
 * @param {string} url - Vimeo video URL
 * @returns {string|null} - Video ID or null if invalid
 */
export const getVimeoVideoId = (url) => {
  const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
};

/**
 * Get aspect ratio for different video types
 * @returns {string} - Aspect ratio as a percentage (e.g., "56.25%" for 16:9)
 */
export const getVideoAspectRatio = () => {
  // Standard 16:9 aspect ratio
  return "56.25%";
};

export default {
  getYouTubeVideoId,
  getVimeoVideoId,
  getVideoAspectRatio,
};
