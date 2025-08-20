import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { useAuth } from "../../../context/AuthContext";
import { httpClient } from "../../../utils/httpClientSetup";

const GeneralSystem = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    company_name: "",
    website_name: "",
    enable_tac: false,
    remainder_send_timer: "",
    columns_per_row: "",
    terms_and_conditions: "## Dummy Terms\n\nThis is placeholder text.",
  });

  const [loading, setLoading] = useState(true);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!user?.company_id) return;
    const fetchData = async () => {
      try {
        const res = await httpClient.get(`companies/${user.company_id}`);
        const data = res.data.data;

        setFormData((prev) => ({
          ...prev,
          company_name: data.company_name || "",
          website_name: data.website_name || "",
          enable_tac: data.enable_tac || false,
          remainder_send_timer: data.remainder_send_timer || "",
          columns_per_row: data.columns_per_row || "",
        }));
      } catch (err) {
        console.error("Error fetching company:", err);
        setSnackbar({
          open: true,
          message: "Failed to fetch company data!",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, enable_tac: e.target.checked }));
  };

  const handleSubmit = async () => {
    try {
      await httpClient.put(`companies/${user.company_id}`, {
        company_name: formData.company_name,
        website_name: formData.website_name,
        enable_tac: formData.enable_tac,
        remainder_send_timer: formData.remainder_send_timer,
        columns_per_row: formData.columns_per_row,
      });
      setSnackbar({
        open: true,
        message: "Updated successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Update failed:", err);
      setSnackbar({
        open: true,
        message: "Update failed!",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          width: "90%",
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          General System Settings
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          {loading ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <TextField
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              fullWidth
            />
          )}

          {loading ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <TextField
              label="Site Name"
              name="website_name"
              value={formData.website_name}
              onChange={handleChange}
              fullWidth
            />
          )}

          {loading ? (
            <Skeleton variant="rectangular" height={40} />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enable_tac}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="Enable User Terms And Conditions"
            />
          )}

          {formData.enable_tac && !loading && (
            <Box data-color-mode="light">
              <MDEditor
                value={formData.terms_and_conditions}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    terms_and_conditions: val,
                  }))
                }
                height={300}
                preview="edit"
              />
            </Box>
          )}

          {loading ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <TextField
              label="Reminder Email Send Time"
              name="remainder_send_timer"
              type="number"
              value={formData.remainder_send_timer}
              onChange={handleChange}
              fullWidth
            />
          )}

          {loading ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <FormControl fullWidth>
              <InputLabel id="tile-view-label">Default Tile View</InputLabel>
              <Select
                labelId="tile-view-label"
                label="Default Tile View"
                name="columns_per_row"
                value={formData.columns_per_row}
                onChange={handleChange}
              >
                <MenuItem value={1}>Large Tiles</MenuItem>
                <MenuItem value={2}>Medium Tiles</MenuItem>
                <MenuItem value={3}>Small Tiles</MenuItem>
                <MenuItem value={4}>List View</MenuItem>
              </Select>
            </FormControl>
          )}

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined">Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GeneralSystem;
