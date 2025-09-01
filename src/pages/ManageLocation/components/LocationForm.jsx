// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   Divider,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Stack,
//   Autocomplete
// } from '@mui/material';
// import {
//   LocationOn as LocationIcon,
//   Phone as PhoneIcon,
//   Email as EmailIcon,
//   Fax as FaxIcon,
//   ArrowBack as ArrowBackIcon,
//   Check as CheckIcon
// } from '@mui/icons-material';
// import { httpClient } from '../../../utils/httpClientSetup';
// import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';



// const australianStates = [
//   { value: 'ACT', label: 'Australian Capital Territory' },
//   { value: 'NSW', label: 'New South Wales' },
//   { value: 'NT', label: 'Northern Territory' },
//   { value: 'QLD', label: 'Queensland' },
//   { value: 'SA', label: 'South Australia' },
//   { value: 'TAS', label: 'Tasmania' },
//   { value: 'VIC', label: 'Victoria' },
//   { value: 'WA', label: 'Western Australia' }
// ];

// const LocationForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);
  
//   // Initialize places autocomplete
//   const {
//     ready,
//     value: addressValue,
//     suggestions: { status, data },
//     setValue: setAddressValue,
//     clearSuggestions
//   } = usePlacesAutocomplete();

//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'branch',
//     street_number: '',
//     street_name: '',
//     suburb: '',
//     state: '',
//     postcode: '',
//     email: '',
//     phone: '',
//     country: '',
//     contact: '',
//     status: 1, // 1 = active, 0 = inactive
//     parent: null,
//     deleted: 0,
//     deleted_at: null,
//     created_by: 1, // Default user ID
//     updated_by: 1  // Default user ID
//   });

//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   const locationTypes = [
//     { value: 'branch', label: 'Branch' },
//     { value: 'office', label: 'Office' },
//     { value: 'warehouse', label: 'Warehouse' },
//     { value: 'showroom', label: 'Showroom' }
//   ];

//   useEffect(() => {
//     if (isEditMode) {
//       const fetchLocation = async () => {
//         setIsLoading(true);
//         try {
//           const response = await httpClient.get(`locations/${id}`);
//           if (response.data && response.data.success) {
//             const locationData = response.data.data;
//             setFormData({
//               name: locationData.name || '',
//               type: locationData.type || 'branch',
//               street_number: locationData.street_number || '',
//               street_name: locationData.street_name || '',
//               suburb: locationData.suburb || '',
//               state: locationData.state || '',
//               postcode: locationData.postcode || '',
//               email: locationData.email || '',
//               phone: locationData.phone || '',
//               country: locationData.country || '',
//               contact: locationData.contact || '',
//               status: locationData.status,
//               parent: locationData.parent || null,
//               deleted: locationData.deleted || 0,
//               deleted_at: locationData.deleted_at || null,
//               created_by: locationData.created_by || 1,
//               updated_by: locationData.updated_by || 1
//             });
            
//             // Set address value for autocomplete if address exists
//             if (locationData.street_number && locationData.street_name) {
//               const fullAddress = `${locationData.street_number} ${locationData.street_name}, ${locationData.suburb}, ${locationData.state} ${locationData.postcode}`;
//               setAddressValue(fullAddress);
//             }
//           } else {
//             setSnackbar({
//               open: true,
//               message: response.data?.message || 'Failed to fetch location data',
//               severity: 'error'
//             });
//           }
//         } catch (error) {
//           setSnackbar({
//             open: true,
//             message: error.message || 'Error loading location',
//             severity: 'error'
//           });
//         } finally {
//           setIsLoading(false);
//         }
//       };
      
//       fetchLocation();
//     }
//   }, [id, isEditMode, setAddressValue]);

//   const handleAddressSelect = async (address) => {
//     setAddressValue(address, false);
//     clearSuggestions();
    
//     try {
//       const results = await getGeocode({ address });
//       const { lat, lng } = await getLatLng(results[0]);
      
//       // Extract address components
//       let streetNumber = '';
//       let streetName = '';
//       let suburb = '';
//       let state = '';
//       let postcode = '';
//       let country = '';
      
//       for (const component of results[0].address_components) {
//         const types = component.types;
//         if (types.includes('street_number')) {
//           streetNumber = component.long_name;
//         } else if (types.includes('route')) {
//           streetName = component.long_name;
//         } else if (types.includes('locality')) {
//           suburb = component.long_name;
//         } else if (types.includes('administrative_area_level_1')) {
//           state = component.short_name;
//         } else if (types.includes('postal_code')) {
//           postcode = component.long_name;
//         } else if (types.includes('country')) {
//           country = component.long_name;
//         }
//       }
      
//       setFormData(prev => ({
//         ...prev,
//         street_number: streetNumber,
//         street_name: streetName,
//         suburb,
//         state,
//         postcode,
//         country
//       }));
      
//     } catch (error) {
//       console.error('Error fetching address details:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validate = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = 'Required';
//     if (!formData.type) newErrors.type = 'Required';
//     if (!formData.street_number.trim()) newErrors.street_number = 'Required';
//     if (!formData.street_name.trim()) newErrors.street_name = 'Required';
//     if (!formData.suburb.trim()) newErrors.suburb = 'Required';
//     if (!formData.state.trim()) newErrors.state = 'Required';
//     if (!formData.postcode.trim()) newErrors.postcode = 'Required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validate()) return;
    
//     setIsSubmitting(true);
//     try {
//       const payload = {
//         ...formData,
//         updated_by: 1 // Set to current user ID in a real app
//       };

//       if (isEditMode) {
//         const response = await httpClient.put(`locations/${id}`, payload);
//         if (response.data && response.data.success) {
//           setSnackbar({
//             open: true,
//             message: 'Location updated successfully',
//             severity: 'success'
//           });
//           setTimeout(() => navigate('/location'), 1500);
//         }
//       } else {
//         payload.created_by = 1; // Set to current user ID in a real app
//         const response = await httpClient.post('locations', payload);
//         if (response.data && response.data.success) {
//           setSnackbar({
//             open: true,
//             message: 'Location created successfully',
//             severity: 'success'
//           });
//           setTimeout(() => navigate('/location'), 1500);
//         }
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || `Failed to ${isEditMode ? 'update' : 'create'} location`,
//         severity: 'error'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
//       <Box display="flex" alignItems="center" mb={4}>
//         <IconButton onClick={() => navigate('/location')} sx={{ mr: 1 }}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h5" component="h1" fontWeight="bold">
//           {isEditMode ? 'Edit Location' : 'Create Location'}
//         </Typography>
//       </Box>

//       <form onSubmit={handleSubmit}>
//         <Stack spacing={3}>
//           {/* Basic Information Section */}
//           <Box>
//             <Typography variant="subtitle1" fontWeight="bold" mb={1}>
//               Basic Information
//             </Typography>
//             <Divider />
            
//             <Stack spacing={2} mt={2}>
//               <Box>
//                 <Typography variant="body2" color="textSecondary" mb={0.5}>
//                   Name *
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   error={!!errors.name}
//                   helperText={errors.name}
//                   size="small"
//                   placeholder="Enter location name"
//                 />
//               </Box>
              
//               <Box>
//                 <Typography variant="body2" color="textSecondary" mb={0.5}>
//                   Type *
//                 </Typography>
//                 <TextField
//                   select
//                   fullWidth
//                   name="type"
//                   value={formData.type}
//                   onChange={handleChange}
//                   error={!!errors.type}
//                   helperText={errors.type}
//                   size="small"
//                 >
//                   {locationTypes.map((type) => (
//                     <MenuItem key={type.value} value={type.value}>
//                       {type.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Box>
              
//               <Box>
//                 <Typography variant="body2" color="textSecondary" mb={0.5}>
//                   Contact Person
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="contact"
//                   value={formData.contact}
//                   onChange={handleChange}
//                   size="small"
//                   placeholder="Enter contact person name"
//                 />
//               </Box>
              
//               <Box>
//                 <Typography variant="body2" color="textSecondary" mb={0.5}>
//                   Phone
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   size="small"
//                   placeholder="Enter phone number"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <PhoneIcon fontSize="small" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Box>
              
//               <Box>
//                 <Typography variant="body2" color="textSecondary" mb={0.5}>
//                   Email
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   size="small"
//                   placeholder="Enter email address"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <EmailIcon fontSize="small" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Box>
              
//               <Box>
//                 <Typography variant="body2" color="textSecondary" mb={0.5}>
//                   Country
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   size="small"
//                   placeholder="Enter country"
//                 />
//               </Box>
//             </Stack>
//           </Box>

//           {/* Address Section */}
//           <Box>
//             <Typography variant="subtitle1" fontWeight="bold" mb={1}>
//               Address Information
//             </Typography>
//             <Divider />
            
//             <Stack spacing={2} mt={2}>
//               <Box>
//                 <Typography variant="body2" color="textSecondary" mb={0.5}>
//                   Search Address
//                 </Typography>
//                 <Autocomplete
//                   freeSolo
//                   disableClearable
//                   options={status === "OK" ? data.map((suggestion) => suggestion.description) : []}
//                   value={addressValue}
//                   onChange={(_, newValue) => handleAddressSelect(newValue)}
//                   onInputChange={(_, newInputValue) => setAddressValue(newInputValue)}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Start typing address..."
//                       InputProps={{
//                         ...params.InputProps,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <LocationIcon fontSize="small" />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   )}
//                 />
//               </Box>
              
//               <Box display="flex" gap={2}>
//                 <Box flex={1}>
//                   <Typography variant="body2" color="textSecondary" mb={0.5}>
//                     Street Number *
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     name="street_number"
//                     value={formData.street_number}
//                     onChange={handleChange}
//                     error={!!errors.street_number}
//                     helperText={errors.street_number}
//                     size="small"
//                     placeholder="Number"
//                   />
//                 </Box>
//                 <Box flex={2}>
//                   <Typography variant="body2" color="textSecondary" mb={0.5}>
//                     Street Name *
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     name="street_name"
//                     value={formData.street_name}
//                     onChange={handleChange}
//                     error={!!errors.street_name}
//                     helperText={errors.street_name}
//                     size="small"
//                     placeholder="Street name"
//                   />
//                 </Box>
//               </Box>
              
//               <Box>
//                 <Typography variant="body2" color="textSecondary" mb={0.5}>
//                   Suburb *
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="suburb"
//                   value={formData.suburb}
//                   onChange={handleChange}
//                   error={!!errors.suburb}
//                   helperText={errors.suburb}
//                   size="small"
//                   placeholder="Enter suburb"
//                 />
//               </Box>
              
//               <Box display="flex" gap={2}>
//   <Box flex={1}>
//     <Typography variant="body2" color="textSecondary" mb={0.5}>
//       State *
//     </Typography>
//     <TextField
//       select
//       fullWidth
//       name="state"
//       value={formData.state}
//       onChange={handleChange}
//       error={!!errors.state}
//       helperText={errors.state}
//       size="small"
//     >
//       {australianStates.map((state) => (
//         <MenuItem key={state.value} value={state.value}>
//           {state.label}
//         </MenuItem>
//       ))}
//     </TextField>
//   </Box>
//                 <Box flex={1}>
//                   <Typography variant="body2" color="textSecondary" mb={0.5}>
//                     Postcode *
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     name="postcode"
//                     value={formData.postcode}
//                     onChange={handleChange}
//                     error={!!errors.postcode}
//                     helperText={errors.postcode}
//                     size="small"
//                     placeholder="Postcode"
//                   />
//                 </Box>
//               </Box>
//             </Stack>
//           </Box>

//           {/* Status Section - Only visible in edit mode */}
//           {isEditMode && (
//             <Box>
//               <Typography variant="subtitle1" fontWeight="bold" mb={1}>
//                 Status
//               </Typography>
//               <Divider />
              
//               <Box mt={2}>
//                 <Typography variant="body2" color="textSecondary" mb={0.5}>
//                   Status
//                 </Typography>
//                 <TextField
//                   select
//                   fullWidth
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   size="small"
//                 >
//                   <MenuItem value={1}>Active</MenuItem>
//                   <MenuItem value={0}>Inactive</MenuItem>
//                 </TextField>
//               </Box>
//             </Box>
//           )}

//           {/* Form Actions */}
//           <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
//             <Button
//               variant="outlined"
//               onClick={() => navigate('/location')}
//               disabled={isSubmitting}
//               size="medium"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={isSubmitting}
//               startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />}
//               size="medium"
//             >
//               {isEditMode ? 'Update' : 'Create'}
//             </Button>
//           </Box>
//         </Stack>
//       </form>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//           variant="filled"
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Paper>
//   );
// };

// export default LocationForm;



// **********************************************

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  Autocomplete
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { httpClient } from '../../../utils/httpClientSetup';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const australianStates = [
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NSW', label: 'New South Wales' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'WA', label: 'Western Australia' }
];

const LocationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Initialize places autocomplete
  const {
    ready,
    value: addressValue,
    suggestions: { status, data },
    setValue: setAddressValue,
    clearSuggestions
  } = usePlacesAutocomplete();

  const [formData, setFormData] = useState({
    name: '',
    type_id: '', // <-- changed from type
    street_number: '',
    street_name: '',
    suburb: '',
    state: '',
    postcode: '',
    email: '',
    phone: '',
    country: '',
    contact: '',
    status: 1,
    parent: null,
    deleted: 0,
    deleted_at: null,
    created_by: 1,
    updated_by: 1
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [locationTypes, setLocationTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    const fetchLocationTypes = async () => {
      setLoadingTypes(true);
      try {
        const response = await httpClient.get('location/types/list');
        if (response.data && response.data.success) {
          setLocationTypes(response.data.data); // assuming [{id, name}]
        }
      } catch (error) {
        console.error('Error fetching location types:', error);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchLocationTypes();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchLocation = async () => {
        setIsLoading(true);
        try {
          const response = await httpClient.get(`locations/${id}`);
          if (response.data && response.data.success) {
            const locationData = response.data.data;
            setFormData({
              name: locationData.name || '',
              type_id: locationData.type_id || '',
              street_number: locationData.street_number || '',
              street_name: locationData.street_name || '',
              suburb: locationData.suburb || '',
              state: locationData.state || '',
              postcode: locationData.postcode || '',
              email: locationData.email || '',
              phone: locationData.phone || '',
              country: locationData.country || '',
              contact: locationData.contact || '',
              status: locationData.status,
              parent: locationData.parent || null,
              deleted: locationData.deleted || 0,
              deleted_at: locationData.deleted_at || null,
              created_by: locationData.created_by || 1,
              updated_by: locationData.updated_by || 1
            });

            if (locationData.street_number && locationData.street_name) {
              const fullAddress = `${locationData.street_number} ${locationData.street_name}, ${locationData.suburb}, ${locationData.state} ${locationData.postcode}`;
              setAddressValue(fullAddress);
            }
          } else {
            setSnackbar({
              open: true,
              message: response.data?.message || 'Failed to fetch location data',
              severity: 'error'
            });
          }
        } catch (error) {
          setSnackbar({
            open: true,
            message: error.message || 'Error loading location',
            severity: 'error'
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchLocation();
    }
  }, [id, isEditMode, setAddressValue]);

  const handleAddressSelect = async (address) => {
    setAddressValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);

      let streetNumber = '';
      let streetName = '';
      let suburb = '';
      let state = '';
      let postcode = '';
      let country = '';

      for (const component of results[0].address_components) {
        const types = component.types;
        if (types.includes('street_number')) streetNumber = component.long_name;
        if (types.includes('route')) streetName = component.long_name;
        if (types.includes('locality')) suburb = component.long_name;
        if (types.includes('administrative_area_level_1')) state = component.short_name;
        if (types.includes('postal_code')) postcode = component.long_name;
        if (types.includes('country')) country = component.long_name;
      }

      setFormData(prev => ({
        ...prev,
        street_number: streetNumber,
        street_name: streetName,
        suburb,
        state,
        postcode,
        country
      }));
    } catch (error) {
      console.error('Error fetching address details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.type_id) newErrors.type_id = 'Required';
    if (!formData.street_number.trim()) newErrors.street_number = 'Required';
    if (!formData.street_name.trim()) newErrors.street_name = 'Required';
    if (!formData.suburb.trim()) newErrors.suburb = 'Required';
    if (!formData.state.trim()) newErrors.state = 'Required';
    if (!formData.postcode.trim()) newErrors.postcode = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...formData, updated_by: 1 };
      if (isEditMode) {
        const response = await httpClient.put(`locations/${id}`, payload);
        if (response.data && response.data.success) {
          setSnackbar({ open: true, message: 'Location updated successfully', severity: 'success' });
          setTimeout(() => navigate('/location'), 1500);
        }
      } else {
        payload.created_by = 1;
        const response = await httpClient.post('locations', payload);
        if (response.data && response.data.success) {
          setSnackbar({ open: true, message: 'Location created successfully', severity: 'success' });
          setTimeout(() => navigate('/location'), 1500);
        }
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message || `Failed to ${isEditMode ? 'update' : 'create'} location`, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate('/location')} sx={{ mr: 1 }}><ArrowBackIcon /></IconButton>
        <Typography variant="h5" fontWeight="bold">{isEditMode ? 'Edit Location' : 'Create Location'}</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Basic Info */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Basic Information</Typography>
            <Divider />
            <Stack spacing={2} mt={2}>
              <TextField
                fullWidth
                name="name"
                 label="Location Name *"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                size="small"
                placeholder="Enter location name"
              />
              <TextField
                select
                fullWidth
                name="type_id"
                
                value={formData.type_id}
                onChange={handleChange}
                error={!!errors.type_id}
                helperText={errors.type_id}
                size="small"
                label="Type *"
                disabled={loadingTypes}
              >
                {locationTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </TextField>
              {/* <TextField
                fullWidth
                name="Primary Contact"
                label="Primary Contact"
                value={formData.contact}
                onChange={handleChange}
                size="small"
                placeholder="Contact Person"
              /> */}
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                size="small"
                placeholder="Phone"
                InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon fontSize="small" /></InputAdornment>) }}
              />
              <TextField
                fullWidth
                name="email"
                 label="Email Address"
                value={formData.email}
                onChange={handleChange}
                size="small"
                placeholder="Email"
                InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon fontSize="small" /></InputAdornment>) }}
              />
              <TextField
                fullWidth
                name="country"
                 label="Country"
                value={formData.country}
                onChange={handleChange}
                size="small"
                placeholder="Country"
              />
            </Stack>
          </Box>

          {/* Address */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Address Information</Typography>
            <Divider />
            <Stack spacing={2} mt={2}>
              <Autocomplete
                freeSolo
                disableClearable
                options={status === "OK" ? data.map(s => s.description) : []}
                value={addressValue}
                onChange={(_, newValue) => handleAddressSelect(newValue)}
                onInputChange={(_, newInputValue) => setAddressValue(newInputValue)}
                renderInput={(params) => (
                  <TextField {...params} size="small"  label="Search Address" placeholder="Start typing address..." InputProps={{ ...params.InputProps, startAdornment: (<InputAdornment position="start"><LocationIcon fontSize="small" /></InputAdornment>) }} />
                )}
              />
              <Box display="flex" gap={2}>
                <TextField fullWidth name="street_number" label="Street Number *" value={formData.street_number} onChange={handleChange} error={!!errors.street_number} helperText={errors.street_number} size="small" placeholder="Street Number *" />
                <TextField fullWidth name="street_name" label="Street Name *" value={formData.street_name} onChange={handleChange} error={!!errors.street_name} helperText={errors.street_name} size="small" placeholder="Street Name *" />
              </Box>
              <TextField fullWidth name="suburb" label="Suburb *" value={formData.suburb} onChange={handleChange} error={!!errors.suburb} helperText={errors.suburb} size="small" placeholder="Suburb *" />
              <Box display="flex" gap={2}>
                <TextField select fullWidth name="state" label="State *" value={formData.state} onChange={handleChange} error={!!errors.state} helperText={errors.state} size="small">
                  {australianStates.map(state => <MenuItem key={state.value} value={state.value}>{state.label}</MenuItem>)}
                </TextField>
                <TextField fullWidth name="postcode" label="Postcode *" value={formData.postcode} onChange={handleChange} error={!!errors.postcode} helperText={errors.postcode} size="small" placeholder="Postcode *" />
              </Box>
            </Stack>
          </Box>

          {isEditMode && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>Status</Typography>
              <Divider />
              <TextField select fullWidth name="status" value={formData.status} onChange={handleChange} size="small">
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </TextField>
            </Box>
          )}

          {/* Actions */}
          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate('/location')} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />}>
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Stack>
      </form>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default LocationForm;

