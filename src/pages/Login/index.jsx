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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../utils/api";
import LoginImage from "../../assets/bluewheelerslogo-operationsmanuals.png";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const navigate = useNavigate();
  const { login,user,token } = useAuth();

  console.log("auth storing token test", token)
  console.log("auth storing user data ",user)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const handleEmailChange = (e) => {
  const value = e.target.value;
  setEmail(value);

  if (!validateEmail(value)) {
    setEmailError("Invalid email format");
  } else {
    setEmailError("");
  }
};

  const handleClose = () => setSnackbar((s) => ({ ...s, open: false }));
const togglePasswordVisibility = () => setShowPassword((show) => !show);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
  setEmailError("Invalid email format");
  return;
}
    try {
      const res = await loginUser(email, password);
      console.log("Login success:", res);
      login(res.token,res.user);
      setSnackbar({
        open: true,
        message: "Logged in successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setSnackbar({
        open: true,
        message: "Username and password do not match",
        severity: "error",
      });
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
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              variant="outlined"
              margin="normal"
               error={!!emailError}
              value={email}
                helperText={emailError}
              onChange={handleEmailChange}
              required
            />
          
            <TextField
  label="Password"
  fullWidth
  variant="outlined"
  margin="normal"
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={togglePasswordVisibility} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Log In
            </Button>
          </form>
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
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}


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
//   InputAdornment,
//   IconButton
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { loginUser } from "../../utils/api";
// import LoginImage from "../../assets/bluewheelerslogo-operationsmanuals.png";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [emailError, setEmailError] = useState("");
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleEmailChange = (e) => {
//     const value = e.target.value;
//     setEmail(value);
//     setEmailError(validateEmail(value) ? "" : "Invalid email format");
//   };

//   const handleClose = () => setSnackbar((s) => ({ ...s, open: false }));
//   const togglePasswordVisibility = () => setShowPassword((show) => !show);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateEmail(email)) {
//       setEmailError("Invalid email format");
//       return;
//     }

//     try {
//       const res = await loginUser(email, password); // API returns {token, data: {user, role, company}}
//       console.log("Login success:", res);

//       login(res); // <-- now passing entire response to AuthContext

//       setSnackbar({
//         open: true,
//         message: "Logged in successfully!",
//         severity: "success",
//       });

//       setTimeout(() => navigate("/dashboard"), 2000);
//     } catch (error) {
//       console.error("Login error:", error);
//       setSnackbar({
//         open: true,
//         message: "Username and password do not match",
//         severity: "error",
//       });
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
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Email"
//               fullWidth
//               type="email"
//               variant="outlined"
//               margin="normal"
//               error={!!emailError}
//               helperText={emailError}
//               value={email}
//               onChange={handleEmailChange}
//               required
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
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={togglePasswordVisibility} edge="end">
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
//               Log In
//             </Button>
//           </form>
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
//         autoHideDuration={2000}
//         onClose={handleClose}
//         TransitionComponent={Fade}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
