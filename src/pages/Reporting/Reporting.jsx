import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import { Divider } from '@mui/material';
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ReportingOpManuals from "./components/ReportingOpManuals";





export default function Reporting() {
  return (
    <Box p={5} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <Grid container spacing={3}>
        <Grid item size={{xs:12,md:4}}>
          <Card sx={{ height: "max-content" }}>
            <CardContent>
            
              <Typography variant="subtitle2" fontWeight="bold" fontSize={16} gutterBottom>
                MODULE REPORTING
              </Typography>

              <Divider sx={{ my: 2 }} /> 
              <NavLink to="./manuals"  style={({ isActive }) => ({
    textDecoration: 'none',
    color: 'inherit',
  })}>
               {({ isActive }) => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={1}
      bgcolor={isActive ? '#eeeeee':'transparent'  } // active vs default bg
      borderRadius={1}
      mb={1}
      sx={{
        '&:hover': {
          backgroundColor: '#e0e0e0',
        },
      }}
    >
      <Typography fontSize={15}>Operations Manuals</Typography>
      <ChevronRightIcon fontSize="small" />
    </Box>
  )}
</NavLink>

           <NavLink to="./news" style={({ isActive }) => ({
    textDecoration: 'none',
    color: 'inherit',
  })}>
              {({ isActive }) => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={1}
      bgcolor={isActive ? '#eeeeee':'transparent'  } // different default bg
      borderRadius={1}
      sx={{
        '&:hover': {
          backgroundColor: '#f5f5f5ed',
        },
      }}
    >
      <Typography fontSize={15}>News</Typography>
      <ChevronRightIcon fontSize="small" />
    </Box>
  )}
</NavLink>
            </CardContent>
          </Card>
          
        </Grid>
 <Outlet />
      </Grid>
      
    </Box>
    
  );
}
