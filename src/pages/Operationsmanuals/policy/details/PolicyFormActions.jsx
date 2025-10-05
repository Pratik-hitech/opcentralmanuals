import { Box, Button, Typography, CircularProgress } from "@mui/material";

const PolicyFormActions = ({
  isSubmitting,
  isEdit,
  handleUpdateClick,
  handleSubmit,
  setShowPreview,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        pt: 2,
      }}
    >
      <Button
        variant="outlined"
        onClick={() => setShowPreview(true)}
        disabled={isSubmitting}
      >
        Preview
      </Button>
      <Button
        variant="contained"
        disabled={isSubmitting}
        onClick={isEdit ? handleUpdateClick : handleSubmit}
      >
        {isSubmitting ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircularProgress size={18} color="inherit" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {isEdit ? "Updating" : "Saving"}
            </Typography>
          </Box>
        ) : isEdit ? (
          "Update"
        ) : (
          "Save"
        )}
      </Button>
    </Box>
  );
};

export default PolicyFormActions;
