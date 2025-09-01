

  
//   import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLoaderData } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   MenuItem,
//   Snackbar,
//   Alert,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   Switch,
//   FormControlLabel
// } from '@mui/material';
// import { ArrowBack } from '@mui/icons-material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { httpClient } from "../../../utils/httpClientSetup";

// const UserForm = () => {
//   console.log('Component rendering...');
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const userData = useLoaderData();
//   const isEditMode = Boolean(id);



//   const [formData, setFormData] = useState({
//     first_name: '',
//     middle_name: '',
//     last_name: '',
//     user_name: '',
//     email: '',
//     role_id: 1,
//     location_id: null,
//     status: 1,
//     activation_email: 0 
//   });

//   const [locations, setLocations] = useState([]);
//   const [loadingLocations, setLoadingLocations] = useState(true);
//   const [locationError, setLocationError] = useState(null);
//    const [roles, setRoles] = useState([]);
// const [loadingRoles, setLoadingRoles] = useState(true);
// const [roleError, setRoleError] = useState(null);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   // Fetch locations
//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         setLoadingLocations(true);
//         const response = await httpClient.get('locations/list');
//         if (response.data && Array.isArray(response.data.data)) {
//           setLocations(response.data.data);
//         } else {
//           throw new Error('Invalid locations data format');
//         }
//       } catch (error) {
//         setLocationError(error.message || 'Failed to load locations');
//         setSnackbar({
//           open: true,
//           message: 'Failed to load locations',
//           severity: 'error'
//         });
//       } finally {
//         setLoadingLocations(false);
//       }
//     };

//     fetchLocations();
//   }, []);
// useEffect(() => {
//   const fetchRoles = async () => {
//     try {
//       setLoadingRoles(true);
//       const response = await httpClient.get("roles/list");
//       if (response.data && Array.isArray(response.data.data)) {
//         setRoles(response.data.data);
//       } else {
//         throw new Error("Invalid roles data format");
//       }
//     } catch (error) {
//       setRoleError(error.message || "Failed to load roles");
//       setSnackbar({
//         open: true,
//         message: "Failed to load roles",
//         severity: "error"
//       });
//     } finally {
//       setLoadingRoles(false);
//     }
//   };

//   fetchRoles();
// }, []);
//   // Populate form in edit mode
//   useEffect(() => {
//     if (isEditMode && userData?.data) {
//       const initialData = {
//         first_name: userData.data.first_name || '',
//         middle_name: userData.data.middle_name || '',
//         last_name: userData.data.last_name || '',
//         user_name: userData.data.user_name || '',
//         email: userData.data.email || '',
//         role_id: userData.data.role_id || 1,
//         location_id: userData.data.location_id || null,
//         status: userData.data.status ?? 1,
//         activation_email: userData.data.activation_email ?? 0 // 👈 Populate switch
//       };
//       setFormData(initialData);
//     }
//   }, [isEditMode, userData]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = isEditMode ? `/users/${id}` : '/users';
//       const method = isEditMode ? 'PUT' : 'POST';

//       const payload = {
//         first_name: formData.first_name,
//         middle_name: formData.middle_name || null,
//         last_name: formData.last_name,
//         user_name: formData.user_name,
//         email: formData.email,
//         role_id: formData.role_id,
//         location_id: formData.location_id,
//         // status: formData.status,
//         activation_email: formData.activation_email 
//       };

//       const response = await httpClient(url, { method, data: payload });
//       if (response.data) {
//         setSnackbar({
//           open: true,
//           message: isEditMode ? 'User updated successfully!' : 'User created successfully!',
//           severity: 'success'
//         });
//         setTimeout(() => navigate('/manage/users'), 2000);
//       } else {
//         throw new Error('Failed to save user');
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || 'Failed to save user',
//         severity: 'error'
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     // Handle switch separately for activation_email
//     if (name === "activation_email") {
//       setFormData((prev) => ({ ...prev, activation_email: checked ? 1 : 0 }));
//       return;
//     }

//     const processedValue =
//       name === 'location_id'
//         ? (value === '' ? null : Number(value))
//         : (type === 'checkbox' ? checked : value);

//     setFormData((prev) => ({
//       ...prev,
//       [name]: processedValue
//     }));
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//    <Box sx={{ width: '85%', mx: 'auto', my: 4 }}>
//   <Paper elevation={3} sx={{ p: 4 }}>
//     <Typography
//       variant="h5"
//       gutterBottom
//       sx={{ mb: 4, display: 'flex', alignItems: 'center' }}
//     >
//       <ArrowBack
//         sx={{
//           mr: 2,
//           cursor: 'pointer',
//           transition: 'all 0.2s ease-in-out',
//           color: '#555', // Default color
//           '&:hover': {
//             color: '#1976d2', // Slightly blue on hover
//             transform: 'scale(1.15)', // Slight zoom-in effect
//           },
//         }}
//         onClick={() => navigate('/manage/users')}
//       />
//       {isEditMode ? 'EDIT USER DETAILS' : 'CREATE NEW USER'}
//     </Typography>

//           <form onSubmit={handleSubmit}>
//             {/* PERSONAL DETAILS */}
//             <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
//               PERSONAL DETAILS
//             </Typography>

//             {[
//               { label: 'First Name *', name: 'first_name', required: true },
//               { label: 'Middle Name', name: 'middle_name' },
//               { label: 'Last Name *', name: 'last_name', required: true },
//               { label: 'Username *', name: 'user_name', required: true },
//               { label: 'Email *', name: 'email', type: 'email', required: true }
//             ].map((field) => (
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }} key={field.name}>
//                 <Typography sx={{ width: '150px', flexShrink: 0 }}>{field.label}</Typography>
//                 <TextField
//                   fullWidth
//                   name={field.name}
//                   type={field.type || 'text'}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   required={field.required}
//                   size="small"
//                 />
//               </Box>
//             ))}

//             <Divider sx={{ my: 2 }} />

//             {/* Role */}
//             {/* Role */}
// <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//   <Typography sx={{ width: '150px', flexShrink: 0 }}>User Role *</Typography>
//   <FormControl fullWidth size="small" disabled={loadingRoles} error={!!roleError}>
//     <InputLabel id="role-select-label">Select Role</InputLabel>
//     <Select
//       labelId="role-select-label"
//       name="role_id"
//       value={formData.role_id}
//       onChange={handleChange}
//       label="Select Role"
//     >
//       {roles.map((role) => (
//         <MenuItem key={role.id} value={role.id}>
//           {role.label}
//         </MenuItem>
//       ))}
//     </Select>
//     {roleError && (
//       <Typography variant="caption" color="error" sx={{ mt: 1 }}>
//         {roleError}
//       </Typography>
//     )}
//   </FormControl>
// </Box>


//             <Divider sx={{ my: 2 }} />

//             {/* Location */}
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//               <Typography sx={{ width: '150px', flexShrink: 0 }}>Location</Typography>
//               <FormControl fullWidth size="small">
//                 <InputLabel id="location-select-label">Select Location</InputLabel>
//                 <Select
//                   labelId="location-select-label"
//                   name="location_id"
//                   value={formData.location_id ?? ''}
//                   onChange={handleChange}
//                   label="Select Location"
//                   disabled={loadingLocations}
//                   error={!!locationError}
//                 >
//                   <MenuItem value="">None</MenuItem>
//                   {locations.map((location) => (
//                     <MenuItem key={location.id} value={location.id}>
//                       {location.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {locationError && (
//                   <Typography variant="caption" color="error" sx={{ mt: 1 }}>
//                     {locationError}
//                   </Typography>
//                 )}
//               </FormControl>
//             </Box>

//             {/* <Divider sx={{ my: 2 }} /> */}

//             {/* Status */}
//             {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//               <Typography sx={{ width: '150px', flexShrink: 0 }}>Status *</Typography>
//               <FormControl fullWidth size="small">
//                 <InputLabel id="status-select-label">Select Status</InputLabel>
//                 <Select
//                   labelId="status-select-label"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   label="Select Status"
//                 >
//                   <MenuItem value={1}>Active</MenuItem>
//                   <MenuItem value={0}>Inactive</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box> */}

//             <Divider sx={{ my: 2 }} />

//             {/* Send Email Switch */}
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//               <Typography sx={{ width: '150px', flexShrink: 0 }}>Send Email</Typography>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={formData.activation_email === 1}
//                     onChange={handleChange}
//                     name="activation_email"
//                     color="primary"
//                   />
//                 }
//                 label={formData.activation_email === 1 ? "Yes" : "No"}
//               />
//             </Box>

//             {/* Buttons */}
//             <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
//               <Button type="submit" variant="contained" color="primary">
//                 {isEditMode ? 'Update User' : 'Create User'}
//               </Button>
//               <Button variant="outlined" onClick={() => navigate('/manage/users')}>
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
//           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export async function userLoader({ params }) {
//   if (!params.id) return null;
//   try {
//     const response = await httpClient.get(`/users/${params.id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.message || 'Failed to load user');
//   }
// }

// export default UserForm;

  
  
  
  
  // ************************************************************


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
  Divider,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { httpClient } from "../../../utils/httpClientSetup";

const UserForm = () => {
  console.log('Component rendering...');
  const navigate = useNavigate();
  const { id } = useParams();
  const userData = useLoaderData();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    user_name: '',
    email: '',
    phone_number: '', // Added phone number field
    job_title: '', // Added job title field
    role_id: 1,
    location_id: null,
    status: 1,
    activation_email: 0 
  });

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [roleError, setRoleError] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await httpClient.get('locations/list');
        if (response.data && Array.isArray(response.data.data)) {
          setLocations(response.data.data);
        } else {
          throw new Error('Invalid locations data format');
        }
      } catch (error) {
        setLocationError(error.message || 'Failed to load locations');
        setSnackbar({
          open: true,
          message: 'Failed to load locations',
          severity: 'error'
        });
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const response = await httpClient.get("roles/list");
        if (response.data && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        } else {
          throw new Error("Invalid roles data format");
        }
      } catch (error) {
        setRoleError(error.message || "Failed to load roles");
        setSnackbar({
          open: true,
          message: "Failed to load roles",
          severity: "error"
        });
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && userData?.data) {
      const initialData = {
        first_name: userData.data.first_name || '',
        middle_name: userData.data.middle_name || '',
        last_name: userData.data.last_name || '',
        user_name: userData.data.user_name || '',
        email: userData.data.email || '',
        phone_number: userData.data.phone_number || '', // Added phone number
        job_title: userData.data.job_title || '', // Added job title
        role_id: userData.data.role_id || 1,
        location_id: userData.data.location_id || null,
        status: userData.data.status ?? 1,
        activation_email: userData.data.activation_email ?? 0
      };
      setFormData(initialData);
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
        user_name: formData.user_name,
        email: formData.email,
        phone_number: formData.phone_number, 
        job_title: formData.job_title, 
        role_id: formData.role_id,
        location_id: formData.location_id,
        // status: formData.status,
        activation_email: formData.activation_email 
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

    // Handle switch separately for activation_email
    if (name === "activation_email") {
      setFormData((prev) => ({ ...prev, activation_email: checked ? 1 : 0 }));
      return;
    }

    const processedValue =
      name === 'location_id'
        ? (value === '' ? null : Number(value))
        : (type === 'checkbox' ? checked : value);

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '85%', mx: 'auto', my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 4, display: 'flex', alignItems: 'center' }}
          >
            <ArrowBack
              sx={{
                mr: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                color: '#555',
                '&:hover': {
                  color: '#1976d2',
                  transform: 'scale(1.15)',
                },
              }}
              onClick={() => navigate('/manage/users')}
            />
            {isEditMode ? 'EDIT USER DETAILS' : 'CREATE NEW USER'}
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* PERSONAL DETAILS */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              PERSONAL DETAILS
            </Typography>

            {[
              { label: 'First Name *', name: 'first_name', required: true },
              { label: 'Middle Name', name: 'middle_name' },
              { label: 'Last Name *', name: 'last_name', required: true },
              { label: 'Username *', name: 'user_name', required: true },
              { label: 'Email *', name: 'email', type: 'email', required: true },
              { label: 'Phone Number', name: 'phone_number', type: 'tel' }, // Added phone number field
              { label: 'Job Title', name: 'job_title' } // Added job title field
            ].map((field) => (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }} key={field.name}>
                <Typography sx={{ width: '150px', flexShrink: 0 }}>{field.label}</Typography>
                <TextField
                  fullWidth
                  name={field.name}
                  type={field.type || 'text'}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  size="small"
                />
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Role */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px', flexShrink: 0 }}>User Role *</Typography>
              <FormControl fullWidth size="small" disabled={loadingRoles} error={!!roleError}>
                <InputLabel id="role-select-label">Select Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  label="Select Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
                {roleError && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {roleError}
                  </Typography>
                )}
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px', flexShrink: 0 }}>Location</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="location-select-label">Select Location</InputLabel>
                <Select
                  labelId="location-select-label"
                  name="location_id"
                  value={formData.location_id ?? ''}
                  onChange={handleChange}
                  label="Select Location"
                  disabled={loadingLocations}
                  error={!!locationError}
                >
                  <MenuItem value="">None</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
                {locationError && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {locationError}
                  </Typography>
                )}
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Send Email Switch */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ width: '150px', flexShrink: 0 }}>Send Email</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.activation_email === 1}
                    onChange={handleChange}
                    name="activation_email"
                    color="primary"
                  />
                }
                label={formData.activation_email === 1 ? "Yes" : "No"}
              />
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

export async function userLoader({ params }) {
  if (!params.id) return null;
  try {
    const response = await httpClient.get(`/users/${params.id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to load user');
  }
}

export default UserForm;