// import { useState } from "react";
// import {
//   Card,
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Snackbar,
//   Alert,
//   Fade,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import LoginImage from "../../assets/bluewheelerslogo-operationsmanuals.png";
// import { InputAdornment, IconButton } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { httpClient } from "../../utils/httpClientSetup"; // Import the fixed httpClient
// import qs from "qs";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [emailError, setEmailError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const validateEmail = (email) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const handleEmailChange = (e) => {
//     const value = e.target.value;
//     setEmail(value);

//     if (value && !validateEmail(value)) {
//       setEmailError("Invalid email format");
//     } else {
//       setEmailError("");
//     }
//   };

//   const handleClose = () => setSnackbar((s) => ({ ...s, open: false }));
//   const togglePasswordVisibility = () => setShowPassword((show) => !show);

//   const handleSubmit = async () => {
//     if (!validateEmail(email)) {
//       setEmailError("Invalid email format");
//       return;
//     }
    
//     if (!password) {
//       setSnackbar({
//         open: true,
//         message: "Please enter your password",
//         severity: "error",
//       });
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       // Use httpClient with URLSearchParams (the interceptor will handle Content-Type)
//       const formData = new URLSearchParams();
//       formData.append('email', email);
//       formData.append('password', password);

//       const response = await httpClient.post("login", formData);

//       if (response.data && response.data.success && response.data.token) {
//         const token = response.data.token;
//         const user = response.data.data;
        
//         console.log("Login success:", response.data);
        
//         login(token, user);
        
//         setSnackbar({
//           open: true,
//           message: response.data.message || "Logged in successfully!",
//           severity: "success",
//         });
        
//         setTimeout(() => navigate("/dashboard"), 1000);
//       } else {
//         throw new Error(response.data.message || "Invalid response from server");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
      
//       let errorMessage = "Username and password do not match";
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: "error",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Grid
//       container
//       justifyContent="center"
//       alignItems="center"
//       minHeight="100vh"
//       bgcolor="#f5f5f5"
//     >
//       <Card sx={{ width: 800, height: 400, display: "flex", borderRadius: 4 }}>
//         <Box
//           flex={1}
//           p={4}
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//         >
//           <Typography variant="h5" fontWeight="bold" mb={2}>
//             Login
//           </Typography>
          
//           <Box component="form">
//             <TextField
//               label="Email"
//               fullWidth
//               type="email"
//               variant="outlined"
//               margin="normal"
//               error={!!emailError}
//               value={email}
//               helperText={emailError}
//               onChange={handleEmailChange}
//               required
//               disabled={isSubmitting}
//               autoComplete="email"
//             />
          
//             <TextField
//               label="Password"
//               fullWidth
//               variant="outlined"
//               margin="normal"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               disabled={isSubmitting}
//               autoComplete="current-password"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton 
//                       onClick={togglePasswordVisibility} 
//                       edge="end"
//                       disabled={isSubmitting}
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Button 
//               onClick={handleSubmit}
//               fullWidth 
//               variant="contained" 
//               sx={{ mt: 2 }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Logging in..." : "Log In"}
//             </Button>
//           </Box>
//         </Box>

//         <Box
//           flex={1}
//           sx={{
//             backgroundImage: `url(${LoginImage})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             borderTopRightRadius: 16,
//             borderBottomRightRadius: 16,
//           }}
//         />
//       </Card>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={handleClose}
//         TransitionComponent={Fade}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleClose}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Grid>
//   );
// }



// **********************

import { useState } from "react";
import {
  Card,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Fade,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginImage from "../../assets/bluewheelerslogo-operationsmanuals.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { httpClient } from "../../utils/httpClientSetup";
import ForgotPassword from "./components/ForgotPassword"

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [forgotOpen, setForgotOpen] = useState(false); // ✅ State for modal

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(value && !validateEmail(value) ? "Invalid email format" : "");
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }
    if (!password) {
      setSnackbar({
        open: true,
        message: "Please enter your password",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      const response = await httpClient.post("/login", formData);

      if (response.data?.success && response.data.token) {
        login(response.data.token, response.data.data);

        setSnackbar({
          open: true,
          message: response.data.message || "Logged in successfully!",
          severity: "success",
        });

        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        throw new Error(response.data?.message || "Invalid credentials");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || error.message || "Login failed",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Card sx={{ width: 800, height: 400, display: "flex", borderRadius: 4 }}>
        <Box
          flex={1}
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              helperText={emailError}
              error={!!emailError}
              onChange={handleEmailChange}
              disabled={isSubmitting}
              required
              autoComplete="email"
            />

            <TextField
              label="Password"
              fullWidth
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Forgot Password Link */}
          <Box textAlign="right" mt={1}>
  <Button
    variant="text"
    size="small"
    sx={{ textTransform: "none" }}
    onClick={() => {
      // ✅ Remove focus from login email field before opening modal
      document.activeElement?.blur();
      setForgotOpen(true);
    }}
  >
    Forgot Password?
  </Button>
</Box>


            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </Box>
        </Box>

        <Box
          flex={1}
          sx={{
            backgroundImage: `url(${LoginImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          }}
        />
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Forgot Password Modal */}
      <ForgotPassword open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </Grid>
  );
}
