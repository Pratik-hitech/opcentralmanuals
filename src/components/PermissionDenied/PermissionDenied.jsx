// import { Box, Button, Typography, Paper } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const PermissionDenied = ({ message = "You don't have permission to access this section.", overlay = false }) => {
//   const navigate = useNavigate();

//   if (!overlay) {
//     // Normal inline card
//     return (
//       <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', my: 4 }}>
//         <Typography variant="h6" color="error" gutterBottom>
//           Access Denied
//         </Typography>
//         <Typography variant="body1" sx={{ mb: 3 }}>
//           {message}
//         </Typography>
//         <Typography variant="body2" sx={{ mb: 3 }}>
//           Please contact your administrator for access.
//         </Typography>
//         <Button 
//           variant="contained" 
//           color="primary" 
//           onClick={() => navigate(-1)}
//         >
//           Go Back
//         </Button>
//       </Paper>
//     );
//   }

//   // Full-screen overlay version with darker shade
//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         bgcolor: 'rgba(0, 0, 0, 0.5)', // darker semi-transparent black
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 1300,
//         backdropFilter: 'blur(2px)' // optional subtle blur effect
//       }}
//     >
//       <Paper elevation={5} sx={{ 
//         p: 4, 
//         textAlign: 'center', 
//         maxWidth: 600, 
//         width: '90%',
//         backgroundColor: 'background.paper',
//         borderRadius: 2
//       }}>
//         <Typography variant="h5" color="error" gutterBottom>
//           Access Denied
//         </Typography>
//         <Typography variant="body1" sx={{ mb: 3 }}>
//           {message}
//         </Typography>
//         <Typography variant="body2" sx={{ mb: 3 }}>
//           Please contact your administrator for access.
//         </Typography>
//         <Button 
//           variant="contained" 
//           color="primary" 
//           onClick={() => navigate(-1)}
//           sx={{ mt: 2 }}
//         >
//           Go Back
//         </Button>
//       </Paper>
//     </Box>
//   );
// };

// export default PermissionDenied;

import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PermissionDenied = ({ status = 403, overlay = false }) => {
  const navigate = useNavigate();

  const message = status === 403 
    ? "You don't have permission to access this section."
    : "An unexpected error occurred.";

  const title = status === 403 ? "Access Denied" : "Error";

  if (!overlay) {
    // Inline card
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', my: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Please contact your administrator for assistance.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Paper>
    );
  }

  // Full-screen overlay
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        backdropFilter: 'blur(2px)',
      }}
    >
      <Paper elevation={5} sx={{ 
        p: 4, 
        textAlign: 'center', 
        maxWidth: 600, 
        width: '90%',
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Please contact your administrator for assistance.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Paper>
    </Box>
  );
};

export default PermissionDenied;
