import { Box, FormLabel, Tooltip, Chip, Typography } from "@mui/material";
import { InfoOutlined as InfoIcon } from "@mui/icons-material";

import { TagsContainer, TagInput } from "../PolicyFormStyledComponents";

const PolicyTagsManager = ({
  tags,
  tagInput,
  handleTagInputChange,
  handleTagInputKeyDown,
  handleDeleteTag,
}) => {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <FormLabel sx={{ color: "#4a5568", fontWeight: 500, mr: 1 }}>
          Tags
        </FormLabel>
        <Tooltip
          title="Use keywords to ensure this policy is easily searchable when people need it."
          placement="top-start"
          arrow
        >
          <InfoIcon
            sx={{
              color: "action.active",
              fontSize: 18,
              cursor: "pointer",
            }}
          />
        </Tooltip>
      </Box>
      <TagsContainer>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleDeleteTag(tag)}
            color="primary"
            variant="outlined"
            sx={{
              backgroundColor: "#eff6ff",
              borderColor: "#667eea",
              color: "#667eea",
              "& .MuiChip-deleteIcon": {
                color: "#667eea",
                "&:hover": { color: "#5a6fd8" },
              },
            }}
          />
        ))}
        <TagInput
          type="text"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
          placeholder={
            tags.length === 0
              ? "Type and press Enter to add tags"
              : "Add another tag..."
          }
        />
      </TagsContainer>
      <Typography
        variant="caption"
        sx={{ color: "#718096", mt: 1, display: "block" }}
      >
        Type a tag and press Enter to add it. Press Backspace to remove the last
        tag.
      </Typography>
    </Box>
  );
};

export default PolicyTagsManager;
