import React from "react";
import { FormLabel } from "@mui/material";

import RichTextEditor from "../../../../components/RichTextEditor";
import { FormGrid } from "../PolicyFormStyledComponents";

const PolicyContentEditor = ({
  formData,
  handleContentChange,
  handleImageUpload,
}) => {
  return (
    <FormGrid size={{ xs: 12, md: 6 }}>
      <FormLabel
        htmlFor="content"
        required
        sx={{ color: "#4a5568", fontWeight: 500, mb: 1 }}
      >
        Body Content
      </FormLabel>
      <RichTextEditor
        value={formData.content}
        onChange={handleContentChange}
        onImageUpload={handleImageUpload}
      />
    </FormGrid>
  );
};

export default PolicyContentEditor;
