import { Box, Typography, Button } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";

const PolicyFormHeader = ({ navigate }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 2,
          textAlign: "center",
          color: "#2d3748",
          fontWeight: 700,
        }}
      >
        Policy Details
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1, { state: { refresh: true } })}
      >
        Back
      </Button>
    </Box>
  );
};

export default PolicyFormHeader;
