import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes/router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import { PermissionProvider } from "./context/PermissionsContext";

const theme = createTheme({
  typography: {
    fontFamily: `"Rubik", sans-serif `,
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PermissionProvider>
        <RouterProvider router={router} />
        </PermissionProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
