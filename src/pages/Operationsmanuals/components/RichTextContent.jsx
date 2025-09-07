import React from "react";
import { Box } from "@mui/material";

const RichTextContent = ({
  content,
  sx = {},
  className = "rich-text-content",
  component = "div",
  ...props
}) => {
  if (!content) return null;

  const defaultStyles = {
    // Add proper spacing for HTML elements
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      marginTop: "1.5rem",
      marginBottom: "1rem",
      fontWeight: "bold",
      lineHeight: 1.2,
    },
    "& h1": { fontSize: "2rem" },
    "& h2": { fontSize: "1.5rem" },
    "& h3": { fontSize: "1.3rem" },
    "& h4": { fontSize: "1.1rem" },
    "& h5": { fontSize: "1rem" },
    "& h6": { fontSize: "0.9rem" },
    "& p": {
      marginTop: "0",
      marginBottom: "1rem",
      lineHeight: 1.6,
    },
    "& ul, & ol": {
      marginTop: "0",
      marginBottom: "1rem",
      paddingLeft: "2rem",
    },
    "& li": {
      marginBottom: "0.25rem",
      lineHeight: 1.6,
    },
    "& blockquote": {
      margin: "1rem 0",
      padding: "1rem",
      borderLeft: "4px solid #e0e0e0",
      backgroundColor: "#f9f9f9",
      fontStyle: "italic",
    },
    "& hr": {
      margin: "2rem 0",
      border: "none",
      borderTop: "1px solid #e0e0e0",
    },
    "& table": {
      width: "100%",
      marginTop: "1rem",
      marginBottom: "1rem",
      borderCollapse: "collapse",
    },
    "& th, & td": {
      padding: "0.5rem",
      textAlign: "left",
      borderBottom: "1px solid #e0e0e0",
    },
    "& th": {
      fontWeight: "bold",
      backgroundColor: "#f5f5f5",
    },
    "& code": {
      padding: "0.2rem 0.4rem",
      backgroundColor: "#f5f5f5",
      borderRadius: "0.25rem",
      fontFamily: "monospace",
      fontSize: "0.9em",
    },
    "& pre": {
      margin: "1rem 0",
      padding: "1rem",
      backgroundColor: "#f5f5f5",
      borderRadius: "0.25rem",
      overflow: "auto",
      "& code": {
        padding: 0,
        backgroundColor: "transparent",
      },
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      margin: "1rem 0",
    },
    "& a": {
      color: "#1976d2",
      textDecoration: "underline",
      "&:hover": {
        textDecoration: "none",
      },
    },
    // Handle nested elements
    "& div": {
      "& p:last-child": {
        marginBottom: 0,
      },
    },
    // Remove margin from first and last elements to prevent extra spacing
    "& > *:first-of-type": {
      marginTop: 0,
    },
    "& > *:last-child": {
      marginBottom: 0,
    },
  };

  // Merge default styles with custom styles
  const mergedStyles = { ...defaultStyles, ...sx };

  return (
    <Box
      component={component}
      className={className}
      sx={mergedStyles}
      dangerouslySetInnerHTML={{ __html: content }}
      {...props}
    />
  );
};

export default RichTextContent;
