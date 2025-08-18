/**
 * This file defines a context and provider for managing notification alerts globally in the application.
 * The NotificationProvider wraps the root component to make the notification context available throughout the app.
 */

import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

import { NotificationContext } from "./NotificationContext";

/**
 * NotificationProvider component
 * Wraps the application and provides notification state and functions via context.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children components to be wrapped by the provider.
 */
export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);

  /**
   * Function to show the notification with specified status and message.
   *
   * @param {string} status - The status of the notification ('success', 'error', etc.).
   * @param {string} message - The message to be displayed in the notification.
   * @param {number} [duration=3000] - The duration for which the notification is displayed (optional).
   */
  const showNotification = (status, message, duration = 3000) => {
    setNotificationStatus(status);
    setNotificationMessage(message);
    setAutoHideDuration(duration);
    setOpen(true);
  };

  /**
   * Function to handle the closing of the notification.
   */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={notificationStatus}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
