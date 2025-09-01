import React from 'react';
import DOMPurify from 'dompurify';

const HtmlRenderer = ({ htmlContent, className = '' }) => {
  if (!htmlContent) return null;
  
  // Sanitize the HTML content
  const cleanHtml = DOMPurify.sanitize(htmlContent);
  
  return (
    <div 
      className={`rendered-html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }} 
    />
  );
};

export default HtmlRenderer;