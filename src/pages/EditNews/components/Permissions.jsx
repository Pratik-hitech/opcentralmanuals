import React from 'react'
import { Box, Typography, Paper, Button, TextField } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const Permissions = () => {
 



  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        borderRadius: 2
      }}
    >
      <ConstructionIcon sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
      
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        🚧 Under Construction
      </Typography>
      
      <Typography variant="h6" color="textSecondary" paragraph>
        We're building something amazing for you!
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ maxWidth: '600px', margin: '0 auto' }}>
        This section is currently in development. We're working hard to bring you 
        new features and improved functionality. Check back soon!
      </Typography>
      
      
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          We will soon notify you about the enhancements
        </Typography>
      
      </Box>
      
      <Typography variant="caption" display="block" sx={{ mt: 3, color: '#666' }}>
        {/* Estimated launch: October 2023 */}
      </Typography>
    </Paper>
  );
};


  


export default Permissions