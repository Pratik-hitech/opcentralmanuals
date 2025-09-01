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
  CircularProgress,
} from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";

export default function ActivityLog() {
  const { userid } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredActivities, setFilteredActivities] = useState([]);

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      // Use userid from route params to filter activities
      const endpoint = userid ? `activities?user_id=${userid}` : "activities";
      const res = await httpClient(endpoint);
      
      if (res?.data?.success && res.data.data) {
        setActivities(res.data.data);
        setFilteredActivities(res.data.data); // Initialize filtered activities with all activities
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [userid]); // Refetch when userid changes

  // Apply date filters when fromDate or toDate changes
  useEffect(() => {
    const filtered = activities.filter((act) => {
      const actDate = new Date(act.created_at);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate + "T23:59:59") : null; // Include entire end date
      
      if (from && actDate < from) return false;
      if (to && actDate > to) return false;
      return true;
    });
    
    setFilteredActivities(filtered);
  }, [activities, fromDate, toDate]);

  // Export CSV excluding user_agent and primary_id
  const exportCSV = () => {
    if (filteredActivities.length === 0) return;

    // Get all keys except 'user_agent' and 'primary_id'
    const keys = Object.keys(filteredActivities[0]).filter(
      (key) => key !== "user_agent" && key !== "primary_id"
    );

    const rows = filteredActivities.map((act) => 
      keys.map((key) => {
        // Format date fields properly
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

  // Reset filters
  const resetFilters = () => {
    setFromDate("");
    setToDate("");
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, margin: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      ) : filteredActivities.length === 0 ? (
        <Typography>No activities found.</Typography>
      ) : (
        <Table>
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

// import React, { useEffect, useState } from "react";
// import { httpClient } from "../../../utils/httpClientSetup";
// import { useParams } from "react-router-dom";
// import {
//   Paper,
//   Box,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   CircularProgress,
// } from "@mui/material";
// import { SaveAlt } from "@mui/icons-material";
// import { saveAs } from "file-saver";

// export default function ActivityLog() {
//   const { userid } = useParams(); // Extract userid (lowercase) from URL parameters
//   console.log("Extracted userid:", userid); // Debug: see the extracted userid
  
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filterModalOpen, setFilterModalOpen] = useState(false);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // Fetch activities for specific user
//   const fetchActivities = async () => {
//     if (!userid) {
//       console.error("No user ID found in URL parameters");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       console.log("Fetching activities for user:", userid);
//       const res = await httpClient.get(`activities/${userid}`);
//       console.log("API Response:", res);
      
//       if (res?.data?.data) {
//         setActivities(res.data.data);
//       } else if (res?.data) {
//         // Handle case where data might be directly in res.data
//         setActivities(res.data);
//       }
//     } catch (err) {
//       console.error("Error fetching activities:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, [userid]);

//   // Filter activities by date
//   const filteredActivities = activities.filter((act) => {
//     const actDate = new Date(act.created_at);
//     const from = fromDate ? new Date(fromDate) : null;
//     const to = toDate ? new Date(toDate) : null;
//     if (from && actDate < from) return false;
//     if (to && actDate > to) return false;
//     return true;
//   });

//   // Export CSV excluding user_agent and primary_id
//   const exportCSV = () => {
//     if (filteredActivities.length === 0) return;

//     // Get all keys except 'user_agent' and 'primary_id'
//     const keys = Object.keys(filteredActivities[0]).filter(
//       (key) => key !== "user_agent" && key !== "primary_id"
//     );

//     const rows = filteredActivities.map((act) => keys.map((key) => act[key]));
//     const csvContent =
//       [keys, ...rows].map((e) => e.map((v) => `"${v}"`).join(",")).join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, `user_${userid}_activities.csv`);
//     setFilterModalOpen(false);
//   };

//   return (
//     <Paper elevation={3} sx={{ padding: 4, margin: 4 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h5" fontWeight="bold">
//           📋 Activity Log {userid ? `for User #${userid}` : ''}
//         </Typography>
//         <IconButton
//           color="primary"
//           size="large"
//           onClick={() => setFilterModalOpen(true)}
//           disabled={!userid || activities.length === 0}
//         >
//           <SaveAlt fontSize="inherit" />
//         </IconButton>
//       </Box>

//       {!userid ? (
//         <Typography color="error">Error: No user ID specified in URL</Typography>
//       ) : loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//           <CircularProgress />
//         </Box>
//       ) : filteredActivities.length === 0 ? (
//         <Typography>No activities found for this user.</Typography>
//       ) : (
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell><b>Title</b></TableCell>
//               <TableCell><b>Description</b></TableCell>
//               <TableCell><b>Created At</b></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredActivities.map((act) => (
//               <TableRow key={act.id}>
//                 <TableCell>{act.title}</TableCell>
//                 <TableCell>{act.description}</TableCell>
//                 <TableCell>{new Date(act.created_at).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}

//       {/* Export Modal */}
//       <Dialog
//         open={filterModalOpen}
//         onClose={() => setFilterModalOpen(false)}
//         maxWidth="xs"
//         fullWidth
//       >
//         <DialogTitle>Export Activities</DialogTitle>
//         <DialogContent>
//           <Stack spacing={3} mt={1}>
//             <TextField
//               label="From Date"
//               type="date"
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//             <TextField
//               label="To Date"
//               type="date"
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button onClick={() => setFilterModalOpen(false)}>Cancel</Button>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={exportCSV}
//             disabled={filteredActivities.length === 0}
//           >
//             Export
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Paper>
//   );
// }