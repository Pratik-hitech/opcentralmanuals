import { FormLabel, OutlinedInput } from "@mui/material";

import { FormGrid } from "../PolicyFormStyledComponents";

const PolicyTitleField = ({ formData, handleChange }) => {
  return (
    <FormGrid size={{ xs: 12, md: 6 }}>
      <FormLabel
        htmlFor="title"
        required
        sx={{ color: "#4a5568", fontWeight: 500, mb: 1 }}
      >
        Title
      </FormLabel>
      <OutlinedInput
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter policy title"
        autoComplete="title"
        required
        sx={{
          borderRadius: 2,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d5db",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9ca3af",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#667eea",
          },
        }}
      />
    </FormGrid>
  );
};

export default PolicyTitleField;
