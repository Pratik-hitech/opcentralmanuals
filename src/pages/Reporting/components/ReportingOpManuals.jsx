// import React from 'react'
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   IconButton,
//   Grid,
// } from "@mui/material";
// import { Divider } from '@mui/material';
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ScatterChart,
//   Scatter,
// } from "recharts";
// import { Outlet } from "react-router-dom";
// import { NavLink } from "react-router-dom";

// const pieData = [{ name: "Compliance", value: 95.06 }];
// const COLORS = ["#0D47A1"];

// const barData = [
//   "Alexandra Hills",
//   "Armstrong Creek",
//   "Brown Hill",
//   "Caboolture",
//   "Carindale",
//   "Craigieburn (VIC)",
//   "East Cannington",
//   "Ferny Grove",
//   "Goulburn",
//   "Jindalee (QLD)",
//   "Kenmore",
//   "Labrador (QLD)",
//   "Lismore",
//   "McLaren Vale",
//   "Mont Albert North",
//   "Nambour (Parklands)",
//   "Parkdale",
//   "Portarlington (VIC)",
//   "Scarborough (QLD)",
//   "Sippy Downs (NSW)",
//   "Unley",
//   "Vermont (VIC)",
//   "Yarrawba",
// ].map((name) => ({ name, value: 95 + Math.random() * 5 }));

// const scatterData = new Array(40).fill(0).map((_, i) => ({ x: i, y: 95 + Math.random() * 5 }));
// const ReportingOpManuals = () => {
//   return (
//     <div> <Grid container spacing={2}>
//         <Grid item size={{xl:12,xs:12}}>
//           <Card>
//             <CardContent>
//               <Typography variant="subtitle2" fontWeight="bold" fontSize={16}>
//                 OPERATIONS MANUALS
//               </Typography>
//             </CardContent>
//           </Card>
//           </Grid>

//           {/* <Grid container spacing={4} mt={3}> */}
//             <Grid item size={{xs:12,md:4}} >
//               <Card>
//                 <CardContent sx={{ py:2}}>
//                   <Typography variant="subtitle2" fontWeight="bold" textAlign="center" gutterBottom>
//                     OVERALL POLICY COMPLIANCE
//                   </Typography>
//                    <Divider sx={{ my: 2 }} /> 
//                   <ResponsiveContainer width="100%" height={200}>
//                     <PieChart>
//                       <Pie
//                         data={pieData}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={80}
//                         dataKey="value"
//                         startAngle={90}
//                         endAngle={-270}
//                       >
//                         {pieData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <text
//                         x="50%"
//                         y="50%"
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                         fontSize="20"
//                         fontWeight="bold"
//                       >
//                         95.06%
//                       </text>
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item  size={{xs:12,md:8}} >
//               <Card>
//                 <CardContent sx={{ py:1}}>
//                   <Box display="flex" justifyContent="space-between" alignItems="center" mb={0} mt={0}>
//                     <Typography variant="subtitle2" fontWeight="bold">
//                       POLICY COMPLIANCE (BY LOCATION)
//                     </Typography>
                   
//                     <IconButton size="small">
//                       <FilterAltIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                    <Divider sx={{ my: 2 }} /> 
//                   <ResponsiveContainer width="100%" height={200}>
//                     <BarChart data={barData} margin={{ top: 10, bottom: 2 }}>
//                       <XAxis
//                         dataKey="name"
//                         interval={0}
//                         angle={-45}
//                         textAnchor="end"
//                         height={80}
//                         tick={{ fontSize: 10 }}
//                       />
//                       <YAxis domain={[0, 100]} />
//                       <Tooltip />
//                       <Bar dataKey="value" fill="#0D47A1" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             {/* </Grid> */}
//           </Grid>
// <Grid size={12}>


//           <Card >
//             <CardContent>
//               <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//                 POLICY COMPLIANCE (BY STAFF)
//               </Typography>
//              <ResponsiveContainer width="100%" height={100}>
//   <ScatterChart>
//     <XAxis dataKey="x" type="number" hide /> {/* Add this line */}
//     <YAxis dataKey="y" domain={[75, 100]} hide />
//     <Scatter data={scatterData} fill="#0D47A1" />
//   </ScatterChart>
// </ResponsiveContainer>

//             </CardContent>
//           </Card>
//           </Grid>
//         </Grid></div>
//   )
// }

// export default ReportingOpManuals



import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Skeleton
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
} from "recharts";
import { httpClient } from "../../../utils/httpClientSetup"

const COLORS = ["#0D47A1", "#E0E0E0"]; // compliance + remaining

const ReportingOpManuals = () => {
  const [locationData, setLocationData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [overallCompliance, setOverallCompliance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch manual reports data for users
        const usersResponse = await httpClient.get('/reports/manual');
        if (usersResponse.data?.success) {
          const usersData = usersResponse.data.data;
          setUserData(usersData.users || []);
          setOverallCompliance(usersData.compliance || 0);
        }

        // Fetch compliance data by locations
        const locationsResponse = await httpClient.get('/reports/manual/locations');
        if (locationsResponse.data?.success) {
          const locationsData = locationsResponse.data.data;
          setLocationData(locationsData.locations || []);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch reporting data');
        setLoading(false);
        console.error('Error fetching reporting data:', err);
      }
    };

    fetchData();
  }, []);

  // Prepare pie chart data with remaining part
  const pieData = [
    { name: "Compliance", value: overallCompliance },
    { name: "Remaining", value: 100 - overallCompliance }
  ];

  // Prepare scatter data for staff compliance
  const scatterData = userData.map((user, index) => ({
    x: index,
    y: user.compliance,
    name: user.name
  }));

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <Grid container spacing={2}>
        {/* Title */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight="bold" fontSize={16}>
                OPERATIONS MANUALS
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Overall Compliance */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                textAlign="center"
                gutterBottom
              >
                OVERALL POLICY COMPLIANCE
              </Typography>
              <Divider sx={{ my: 2 }} />

              {loading ? (
                <Skeleton variant="circular" width={160} height={160} sx={{ mx: "auto" }} />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="20"
                      fontWeight="bold"
                    >
                      {overallCompliance.toFixed(2)}%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance by Location */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ py: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight="bold">
                  POLICY COMPLIANCE (BY LOCATION)
                </Typography>
                <IconButton size="small">
                  <FilterAltIcon fontSize="small" />
                </IconButton>
              </Box>
              <Divider sx={{ my: 2 }} />

              {loading ? (
                <Skeleton variant="rectangular" width="100%" height={200} />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={locationData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
                  >
                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Compliance']} />
                    <Bar dataKey="compliance" fill="#0D47A1" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance by Staff */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  POLICY COMPLIANCE (BY STAFF)
                </Typography>
                <IconButton size="small">
                  <FilterAltIcon fontSize="small" />
                </IconButton>
              </Box>
              <Divider sx={{ my: 2 }} />

              {loading ? (
                <Skeleton variant="rectangular" width="100%" height={100} />
              ) : (
                <ResponsiveContainer width="100%" height={100}>
                  <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                    <XAxis
                      dataKey="x"
                      type="number"
                      hide
                      domain={[0, userData.length > 0 ? userData.length - 1 : 0]}
                    />
                    <YAxis dataKey="y" domain={[0, 100]} hide />
                    <Tooltip
                      formatter={(value, name) =>
                        name === 'y' ? [`${value}%`, 'Compliance'] : [value, name]
                      }
                      labelFormatter={(value, items) => {
                        if (items && items.length > 0) {
                          const index = items[0].payload.x;
                          return userData[index]?.name || `Staff ${index + 1}`;
                        }
                        return '';
                      }}
                    />
                    <Scatter data={scatterData} fill="#0D47A1" />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReportingOpManuals;
