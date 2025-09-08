import React, { useEffect, useState } from "react";
import { httpClient } from "../../utils/httpClientSetup";
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
  CircularProgress,
  TableContainer,
} from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoggedUserActivity() {
  const { user } = useAuth();
  const { userid } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredActivities, setFilteredActivities] = useState([]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const endpoint = `activities?user_id=${user.id}`;
      const res = await httpClient(endpoint);

      if (res?.data?.success && res.data.data) {
        setActivities(res.data.data);
        setFilteredActivities(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [userid]);

  useEffect(() => {
    const filtered = activities.filter((act) => {
      const actDate = new Date(act.created_at);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate + "T23:59:59") : null;

      if (from && actDate < from) return false;
      if (to && actDate > to) return false;
      return true;
    });

    setFilteredActivities(filtered);
  }, [activities, fromDate, toDate]);

  const exportCSV = () => {
    if (filteredActivities.length === 0) return;

    const keys = Object.keys(filteredActivities[0]).filter(
      (key) => key !== "user_agent" && key !== "primary_id"
    );

    const rows = filteredActivities.map((act) =>
      keys.map((key) => {
        if (key === "created_at" || key === "updated_at") {
          return new Date(act[key]).toLocaleString();
        }
        return act[key];
      })
    );

    const csvContent =
      [keys, ...rows].map((e) => e.map((v) => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, userid ? `user-${userid}-activities.csv` : "activities.csv");
    setFilterModalOpen(false);
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={3}
        gap={2}
      >
        <Typography variant="h5" fontWeight="bold">
          📋 Activity Log {userid && `for User ID: ${userid}`}
        </Typography>
        <IconButton
          color="primary"
          size="large"
          onClick={() => setFilterModalOpen(true)}
        >
          <SaveAlt fontSize="inherit" />
        </IconButton>
      </Box>

      {/* Table Section */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      ) : filteredActivities.length === 0 ? (
        <Typography>No activities found.</Typography>
      ) : (
        <TableContainer sx={{ maxHeight: 450, overflowX: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Module</b></TableCell>
                <TableCell><b>IP Address</b></TableCell>
                <TableCell><b>Created At</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredActivities.map((act) => (
                <TableRow key={act.id}>
                  <TableCell>{act.title}</TableCell>
                  <TableCell>{act.description}</TableCell>
                  <TableCell>{act.module}</TableCell>
                  <TableCell>{act.ip_address}</TableCell>
                  <TableCell>
                    {new Date(act.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
            <Button onClick={resetFilters} variant="outlined">
              Reset Filters
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFilterModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={exportCSV}
            disabled={filteredActivities.length === 0}
          >
            Export ({filteredActivities.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}




// import React from 'react'

// const Useractivity = () => {
//   return (
//     <div>Useractivity</div>
//   )
// }

// export default Useractivity