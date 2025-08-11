// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLoaderData } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Button,
//   Divider,
//   Paper,
//   MenuItem,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { format } from 'date-fns';

// const UserForm = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const userData = useLoaderData();
//   const isEditMode = Boolean(id);

//   const [formData, setFormData] = useState({
//     firstName: '',
//     middleName: '',
//     surname: '',
//     username: '',
//     email: '',
//     phoneNumber: '',
//     jobTitle: '',
//     role: 'Admin',
//     location: 'Support Office',
//     canAccessAPI: true,
//     canRaiseSupport: true,
//     addressLine1: '',
//     addressLine2: '',
//     city: '',
//     state: '',
//     postcode: '',
//     country: '',
//     dob: null,
//     gender: '',
//     hiredDate: null,
//     manager: ''
//   });

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   useEffect(() => {
//     if (isEditMode && userData) {
//       setFormData({
//         firstName: userData.firstName || '',
//         middleName: '',
//         surname: userData.lastName || '',
//         username: userData.username || '',
//         email: userData.email || '',
//         phoneNumber: userData.phone || '',
//         jobTitle: userData.brand || '',
//         role: userData.role || 'Admin',
//         location: userData.location || 'Support Office',
//         canAccessAPI: true,
//         canRaiseSupport: true,
//         addressLine1: '',
//         addressLine2: '',
//         city: '',
//         state: '',
//         postcode: '',
//         country: '',
//         dob: null,
//         gender: '',
//         hiredDate: null,
//         manager: ''
//       });
//     }
//   }, [isEditMode, userData]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = isEditMode 
//         ? `https://6888d05fadf0e59551bb8590.mockapi.io/api/v1/users/${id}`
//         : 'https://6888d05fadf0e59551bb8590.mockapi.io/api/v1/users';
      
//       const method = isEditMode ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           firstName: formData.firstName,
//           lastName: formData.surname,
//           username: formData.username,
//           email: formData.email,
//           role: formData.role,
//           location: formData.location,
//           activated: true,
//           brand: formData.jobTitle,
//           phone: formData.phoneNumber,
//           address: {
//             line1: formData.addressLine1,
//             line2: formData.addressLine2,
//             city: formData.city,
//             state: formData.state,
//             postcode: formData.postcode,
//             country: formData.country
//           },
//           dob: formData.dob ? format(formData.dob, 'yyyy-MM-dd') : null,
//           gender: formData.gender,
//           hiredDate: formData.hiredDate ? format(formData.hiredDate, 'yyyy-MM-dd') : null,
//           manager: formData.manager
//         })
//       });

//       if (response.ok) {
//         setSnackbar({
//           open: true,
//           message: isEditMode ? 'User updated successfully!' : 'User created successfully!',
//           severity: 'success'
//         });
//         setTimeout(() => navigate('/users'), 2000);
//       } else {
//         throw new Error('Failed to save user');
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message,
//         severity: 'error'
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box sx={{ width: '85%', mx: 'auto', my: 4 }}>
//         <Paper elevation={3} sx={{ p: 4 }}>
//           <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4 }}>
//             {isEditMode ? 'EDIT USER DETAILS' : 'CREATE NEW USER'}
//           </Typography>

//           <form onSubmit={handleSubmit}>
//             <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
//               PERSONAL DETAILS
//             </Typography>

//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//               {/* Basic Information */}
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>First Name *</Typography>
//                 <TextField
//                   fullWidth
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   required
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Middle Name</Typography>
//                 <TextField
//                   fullWidth
//                   name="middleName"
//                   value={formData.middleName}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Surname *</Typography>
//                 <TextField
//                   fullWidth
//                   name="surname"
//                   value={formData.surname}
//                   onChange={handleChange}
//                   required
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Username *</Typography>
//                 <TextField
//                   fullWidth
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Email *</Typography>
//                 <TextField
//                   fullWidth
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Phone Number</Typography>
//                 <TextField
//                   fullWidth
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Job Title</Typography>
//                 <TextField
//                   fullWidth
//                   name="jobTitle"
//                   value={formData.jobTitle}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>User Role *</Typography>
//                 <TextField
//                   select
//                   fullWidth
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   SelectProps={{ native: true }}
//                   required
//                   size="small"
//                 >
//                   <option value="Admin">Admin</option>
//                   <option value="User">User</option>
//                   <option value="Manager">Manager</option>
//                 </TextField>
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               {/* Location */}
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Location(s) *</Typography>
//                 <FormControlLabel
//                   control={
//                     <Checkbox 
//                       checked={formData.location === 'Support Office'} 
//                       onChange={() => setFormData(prev => ({
//                         ...prev,
//                         location: 'Support Office'
//                       }))}
//                     />
//                   }
//                   label="Support Office"
//                 />
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               {/* Permissions */}
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>
//                   Can Access API Documentation
//                 </Typography>
//                 <FormControlLabel
//                   control={
//                     <Checkbox 
//                       checked={formData.canAccessAPI} 
//                       onChange={handleChange}
//                       name="canAccessAPI"
//                     />
//                   }
//                   label="Yes"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>
//                   Can Raise Support Request
//                 </Typography>
//                 <FormControlLabel
//                   control={
//                     <Checkbox 
//                       checked={formData.canRaiseSupport} 
//                       onChange={handleChange}
//                       name="canRaiseSupport"
//                     />
//                   }
//                   label="Yes"
//                 />
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               {/* Address Section */}
//               <Typography variant="subtitle2">ADDRESS DETAILS</Typography>
              
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Address Line 1</Typography>
//                 <TextField
//                   fullWidth
//                   name="addressLine1"
//                   value={formData.addressLine1}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Address Line 2</Typography>
//                 <TextField
//                   fullWidth
//                   name="addressLine2"
//                   value={formData.addressLine2}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>City</Typography>
//                 <TextField
//                   fullWidth
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>State</Typography>
//                 <TextField
//                   fullWidth
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Postcode</Typography>
//                 <TextField
//                   fullWidth
//                   name="postcode"
//                   value={formData.postcode}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Country</Typography>
//                 <TextField
//                   select
//                   fullWidth
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   size="small"
//                 >
//                   <MenuItem value="Australia">Australia</MenuItem>
//                   <MenuItem value="USA">USA</MenuItem>
//                   <MenuItem value="UK">UK</MenuItem>
//                   <MenuItem value="Canada">Canada</MenuItem>
//                 </TextField>
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               {/* Additional Details */}
//               <Typography variant="subtitle2">ADDITIONAL DETAILS</Typography>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Date of Birth</Typography>
//                 <DatePicker
//                   value={formData.dob}
//                   onChange={(newValue) => setFormData({...formData, dob: newValue})}
//                   renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Gender</Typography>
//                 <TextField
//                   select
//                   fullWidth
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   size="small"
//                 >
//                   <MenuItem value="Male">Male</MenuItem>
//                   <MenuItem value="Female">Female</MenuItem>
//                   <MenuItem value="Other">Other</MenuItem>
//                 </TextField>
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Hired Date</Typography>
//                 <DatePicker
//                   value={formData.hiredDate}
//                   onChange={(newValue) => setFormData({...formData, hiredDate: newValue})}
//                   renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 />
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>Manager</Typography>
//                 <TextField
//                   fullWidth
//                   name="manager"
//                   value={formData.manager}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Box>
//             </Box>

//             <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
//               <Button type="submit" variant="contained" color="primary" size="large">
//                 {isEditMode ? 'Update User' : 'Create User'}
//               </Button>
//               <Button variant="outlined" onClick={() => navigate('/users')} size="large">
//                 Cancel
//               </Button>
//             </Box>
//           </form>
//         </Paper>

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         >
//           <Alert 
//             onClose={handleCloseSnackbar} 
//             severity={snackbar.severity}
//             sx={{ width: '100%' }}
//             variant="filled"
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export async function userLoader({ params }) {
//   const response = await fetch(`https://6888d05fadf0e59551bb8590.mockapi.io/api/v1/users/${params.id}`);
//   return response.json();
// }

// export default UserForm;




// ****************************************************

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLoaderData } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { httpClient } from "../../../utils/httpClientSetup";

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userData = useLoaderData();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    role_id: 1,
    location_id: '',
    status: 1
  });

  // Hardcoded location options for now
  const locationOptions = [
    { id: 1, name: 'Nikolaus Ltd Office' },
    { id: 2, name: 'New York Branch' },
    { id: 3, name: 'London HQ' }
  ];

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && userData) {
      setFormData({
        first_name: userData.data.first_name || '',
        middle_name: userData.data.middle_name || '',
        last_name: userData.data.last_name || '',
        email: userData.data.email || '',
        role_id: userData.data.role_id || 1,
        location_id: userData.data.location?.id || userData.location_id || '',
        status: userData.data.status ?? 1
      });
    }
  }, [isEditMode, userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditMode ? `/users/${id}` : '/users';
      const method = isEditMode ? 'PUT' : 'POST';

      const payload = {
        first_name: formData.first_name,
        middle_name: formData.middle_name || null,
        last_name: formData.last_name,
        email: formData.email,
        role_id: formData.role_id,
        location_id: formData.location_id,
        status: formData.status
      };

      const response = await httpClient(url, { method, data: payload });

      if (response.data) {
        setSnackbar({
          open: true,
          message: isEditMode ? 'User updated successfully!' : 'User created successfully!',
          severity: 'success'
        });
        setTimeout(() => navigate('/manage/users'), 2000);
      } else {
        throw new Error('Failed to save user');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save user',
        severity: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '85%', mx: 'auto', my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            {isEditMode ? 'EDIT USER DETAILS' : 'CREATE NEW USER'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              PERSONAL DETAILS
            </Typography>

            {/* First Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px' }}>First Name *</Typography>
              <TextField
                fullWidth
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                size="small"
              />
            </Box>

            {/* Middle Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px' }}>Middle Name</Typography>
              <TextField
                fullWidth
                name="middle_name"
                value={formData.middle_name || ''}
                onChange={handleChange}
                size="small"
              />
            </Box>

            {/* Last Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px' }}>Last Name *</Typography>
              <TextField
                fullWidth
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                size="small"
              />
            </Box>

            {/* Email */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px' }}>Email *</Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                size="small"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Role */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px' }}>User Role *</Typography>
              <TextField
                select
                fullWidth
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                size="small"
              >
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={2}>User</MenuItem>
                <MenuItem value={3}>Manager</MenuItem>
              </TextField>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px' }}>Location *</Typography>
              <TextField
                select
                fullWidth
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                size="small"
              >
                {locationOptions.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px' }}>Status *</Typography>
              <TextField
                select
                fullWidth
                name="status"
                value={formData.status}
                onChange={handleChange}
                size="small"
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </TextField>
            </Box>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button type="submit" variant="contained" color="primary">
                {isEditMode ? 'Update User' : 'Create User'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/manage/users')}>
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

// Loader function to fetch user by ID in edit mode
export async function userLoader({ params }) {
  if (!params.id) return null;
  try {
    const response = await httpClient.get(`/users/${params.id}`);
    return response.data;
  } catch (error) {
    console.error('Loader Error:', error);
    throw new Error(error.message || 'Failed to load user');
  }
}

export default UserForm;
