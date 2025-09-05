// // ProtectedRoute.jsx
// import React from "react";
// import { useAuth } from "../context/AuthContext";
// import { usePermission } from "../context/PermissionsContext";
// import PermissionDenied from "../components/PermissionDenied/PermissionDenied";


// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   const { permissions } = usePermission();

//   const isAdmin = user?.role?.name.toLowerCase() === "admin";
//   const canManageSystem = permissions?.manage_system_setting === "1";

//   const hasAccess = isAdmin || canManageSystem;

//   if (!hasAccess) {
//     // Render overlay/modal if user is not allowed
//     return <PermissionDenied overlay />
//   }

//   return children;
// };

// export default ProtectedRoute;


// ProtectedRoute.jsx
// import React, { useEffect, useState } from "react";
// import PermissionDenied from "../components/PermissionDenied/PermissionDenied";
// import { CircularProgress, Box } from "@mui/material";
// import { useAuth } from "../context/AuthContext";
// import { httpClient } from "../utils/httpClientSetup"; // your API wrapper

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth(); // still need to know which user/role
//   const [hasAccess, setHasAccess] = useState(null); // null = loading, true/false = decided

//   useEffect(() => {
//     const checkAccess = async () => {
//       try {
//         // Here you’re fetching role data from API
//         // Example: GET roles/1 -> { id: 1, name: "Admin", permissions: { manage_system_setting: "1" } }
//         const res = await httpClient.get("roles/1");

//         const roleName = res?.data?.data.name?.toLowerCase();
//         const permissions = res?.data?.permissions || {};

//         const isAdmin = roleName === "admin";
//         const canManageSystem = permissions?.manage_system_setting === "1";

//         setHasAccess(isAdmin || canManageSystem);
//       } catch (err) {
//         console.error("Access check failed:", err);
//         setHasAccess(false);
//       }
//     };

//     checkAccess();
//   }, []);

//   if (hasAccess === null) {
//     // Loading state while verifying
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!hasAccess) {
//     // No access
//     return <PermissionDenied overlay />;
//   }

//   // Access granted
//   return children;
// };

// export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import PermissionDenied from "../components/PermissionDenied/PermissionDenied";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    if (!user) {
      setHasAccess(false);
      return;
    }

    const roleName = user?.role?.name?.toLowerCase();

    // If no roles specified → allow everyone
    if (allowedRoles.length === 0) {
      setHasAccess(true);
      return;
    }

    // Grant access if user's role matches allowed roles
    const allowed = allowedRoles.map((r) => r.toLowerCase()).includes(roleName);
    setHasAccess(allowed);
  }, [user, allowedRoles]);

  if (hasAccess === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hasAccess) {
    return <PermissionDenied  />;
  }

  return children;
};

export default ProtectedRoute;
