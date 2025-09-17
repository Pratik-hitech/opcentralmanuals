// src/pages/NotFound.jsx
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Box sx={{ textAlign: "center", mt: 10 }}>
    <Typography variant="h3" color="error" gutterBottom>
      404 - Page Not Found
    </Typography>
    <Typography variant="body1" gutterBottom>
      Oops! The page you are looking for does not exist.
    </Typography>
    <Button variant="contained" component={Link} to="/operations/manuals">
      Go to Home
    </Button>
  </Box>
);

export default NotFound;
