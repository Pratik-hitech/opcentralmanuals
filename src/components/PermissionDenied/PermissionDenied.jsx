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

// import { Box, Button, Typography, Paper } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const PermissionDenied = ({ status = 403, overlay = false }) => {
//   const navigate = useNavigate();

//   const message = status === 403 
//     ? "You don't have permission to access this section."
//     : "An unexpected error occurred.";

//   const title = status === 403 ? "Access Denied" : "Error";

//   if (!overlay) {
//     // Inline card
//     return (
//       <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', my: 4 }}>
//         <Typography variant="h6" color="error" gutterBottom>
//           {title}
//         </Typography>
//         <Typography variant="body1" sx={{ mb: 3 }}>
//           {message}
//         </Typography>
//         <Typography variant="body2" sx={{ mb: 3 }}>
//           Please contact your administrator for assistance.
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

//   // Full-screen overlay
//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         bgcolor: 'rgba(0, 0, 0, 0.5)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 1300,
//         backdropFilter: 'blur(2px)',
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
//           {title}
//         </Typography>
//         <Typography variant="body1" sx={{ mb: 3 }}>
//           {message}
//         </Typography>
//         <Typography variant="body2" sx={{ mb: 3 }}>
//           Please contact your administrator for assistance.
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
import { useNavigate, useRouteError } from 'react-router-dom';

const PermissionDenied = ({ 
  message = null, 
  statusCode = null, 
  overlay = false 
}) => {
  const navigate = useNavigate();
  const error = useRouteError();

  // Try to get status code from multiple sources (React Router + Axios + props)
  const effectiveStatusCode =
    error?.status || error?.response?.status || statusCode;

  // Log error details for debugging
  console.log("🔹 Full Error Object:", error);
  console.log("🔹 Effective Status Code:", effectiveStatusCode);

  // Get custom or default message
  const errorMessage =
    error?.data?.message ||
    error?.response?.data?.message ||
    error?.message ||
    message;

  // Default messages for common status codes
  const statusMessages = {
    403: {
      title: "Access Denied",
      message: "You don't have permission to access this section.",
      action: "Please contact your administrator for access."
    }
  };

  const getErrorDetails = () => {
    if (effectiveStatusCode === 403) {
      return statusMessages[403];
    }

    return {
      title: "Permission/Unexpected Error",
      message: "You might not have permission to access this resource ",
      action: "Please try again or contact support if the problem persists."
    };
  };

  const { title, message: statusMessage, action } = getErrorDetails();
  const displayMessage = errorMessage || statusMessage;

  if (!overlay) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', my: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {displayMessage}
        </Typography>
        {effectiveStatusCode && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Error code: {effectiveStatusCode}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mb: 3 }}>
          {action}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          Go Back
        </Button>
        <Button variant="outlined" onClick={() => navigate('/dashboard')}>
          Home
        </Button>
      </Paper>
    );
  }

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
        backdropFilter: 'blur(2px)'
      }}
    >
      <Paper elevation={5} sx={{ p: 4, textAlign: 'center', maxWidth: 600, width: '90%' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {displayMessage}
        </Typography>
        {effectiveStatusCode && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Error code: {effectiveStatusCode}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mb: 3 }}>
          {action}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>
            Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PermissionDenied;
