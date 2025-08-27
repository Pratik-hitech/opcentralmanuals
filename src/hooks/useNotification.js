import { useContext } from "react";
import { NotificationContext } from "../context/notification-context/NotificationContext";

/**
 * Custom hook to use the notification context.
 * Provides a function to show notification alerts.
 *
 * @returns {Function} showNotification - Function to show notification alerts.
 */
export const useNotification = () => useContext(NotificationContext);
