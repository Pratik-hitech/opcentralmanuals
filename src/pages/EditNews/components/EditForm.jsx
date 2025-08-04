import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Fax as FaxIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { httpClient } from '../../../utils/httpClientSetup';

const LocationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const API_ENDPOINT = "https://6888d05fadf0e59551bb8590.mockapi.io/api/v1/location";
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    suburb: '',
    state: '',
    postcode: '',
    phone: '',
    email: '',
    active: true,
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchLocation = async () => {
        setIsLoading(true);
        try {
          const response = await httpClient.get(`${API_ENDPOINT}/${id}`);
          if (response.data) {
            setFormData(response.data);
          } else {
            setSnackbar({
              open: true,
              message: 'Failed to fetch location data',
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
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.location) newErrors.location = 'Address is required';
    if (!formData.suburb) newErrors.suburb = 'Suburb is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.postcode) newErrors.postcode = 'Postcode is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const url = isEditMode ? `${API_ENDPOINT}/${id}` : API_ENDPOINT;
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await httpClient[method.toLowerCase()](url, formData);
      
      if (response.data) {
        setSnackbar({
          open: true,
          message: `Location ${isEditMode ? 'updated' : 'created'} successfully`,
          severity: 'success'
        });
        // Redirect to /location after 1.5 seconds
        setTimeout(() => navigate('/location'), 1500);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || `Failed to ${isEditMode ? 'update' : 'create'} location`,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate('/location')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight="bold">
          {isEditMode ? 'Edit Location' : 'Create New Location'}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
            Basic Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Address Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
            Address Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address *"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Suburb *"
                name="suburb"
                value={formData.suburb}
                onChange={handleChange}
                error={!!errors.suburb}
                helperText={errors.suburb}
                size="small"
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="State *"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!!errors.state}
                helperText={errors.state}
                size="small"
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Postcode *"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                error={!!errors.postcode}
                helperText={errors.postcode}
                size="small"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Status Section - Only visible in edit mode */}
        {isEditMode && (
          <Box mb={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
              Status
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="active"
                  value={formData.active}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Form Actions */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={() => navigate('/location')}
            disabled={isSubmitting}
            size="large"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />}
            size="large"
          >
            {isEditMode ? 'Update Location' : 'Create Location'}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default LocationForm;