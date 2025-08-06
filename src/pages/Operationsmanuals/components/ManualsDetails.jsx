import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Container
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';

const ManualsDetails = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: null,
    thumbnailPreview: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData(prev => ({
      ...prev,
      thumbnail: null,
      thumbnailPreview: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    if (formData.thumbnail) {
      submitData.append('thumbnail', formData.thumbnail);
    }
    console.log('Form data ready for API:', submitData);
  };

  return (
    <Container maxWidth={false} sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100%',
      py: 4
    }}>
      <Box sx={{ 
        width: '65%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
          Manual Details
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              variant="outlined"
              size="medium"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1">Thumbnail Image</Typography>
              
              {formData.thumbnailPreview ? (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  flexDirection: 'column'
                }}>
                  <Box
                    component="img"
                    src={formData.thumbnailPreview}
                    alt="Thumbnail preview"
                    sx={{ 
                      maxHeight: 150, 
                      maxWidth: '100%',
                      borderRadius: 1
                    }}
                  />
                  <Button
                    onClick={handleRemoveThumbnail}
                    color="error"
                    variant="outlined"
                    startIcon={<Delete />}
                  >
                    Remove Image
                  </Button>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Upload Thumbnail
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              )}
              <Typography variant="caption" color="text.secondary">
                Optional: Upload a thumbnail image (JPEG, PNG)
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ 
                mt: 2,
                alignSelf: 'center',
                px: 4,
                py: 1.5
              }}
            >
              Save Details
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ManualsDetails;