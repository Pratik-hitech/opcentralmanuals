import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes/router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import { PermissionProvider } from "./context/PermissionsContext";
import ErrorBoundary from "./components/ErrorHandlers/ErrorBoundary";
import PermissionDenied from "./components/PermissionDenied/PermissionDenied";
import { NotificationProvider } from "./context/notification-context/NotificationProvider";

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
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </PermissionProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
