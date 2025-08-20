import React, { useEffect, useState } from "react";
import { httpClient } from "../../../utils/httpClientSetup"
import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { saveAs } from "file-saver";

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await httpClient("activities");
      if (res?.data?.data) {
        setActivities(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Filter activities by date
  const filteredActivities = activities.filter((act) => {
    const actDate = new Date(act.created_at);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from && actDate < from) return false;
    if (to && actDate > to) return false;
    return true;
  });

  // Export CSV excluding user_agent and primary_id
  const exportCSV = () => {
    if (filteredActivities.length === 0) return;

    // Get all keys except 'user_agent' and 'primary_id'
    const keys = Object.keys(filteredActivities[0]).filter(
      (key) => key !== "user_agent" && key !== "primary_id"
    );

    const rows = filteredActivities.map((act) => keys.map((key) => act[key]));
    const csvContent =
      [keys, ...rows].map((e) => e.map((v) => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "activities.csv");
    setFilterModalOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, margin: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          📋 Activity Log
        </Typography>
        <IconButton
          color="primary"
          size="large"
          onClick={() => setFilterModalOpen(true)}
        >
          <SaveAlt fontSize="inherit" />
        </IconButton>
      </Box>

      {loading ? (
        <Typography>Loading activities...</Typography>
      ) : filteredActivities.length === 0 ? (
        <Typography>No activities found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Created At</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActivities.map((act) => (
              <TableRow key={act.id}>
                <TableCell>{act.title}</TableCell>
                <TableCell>{act.description}</TableCell>
                <TableCell>{new Date(act.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Export Modal */}
      <Dialog
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Export Activities</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <TextField
              label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFilterModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={exportCSV}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
