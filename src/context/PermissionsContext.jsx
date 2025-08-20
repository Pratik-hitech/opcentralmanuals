// // import { createContext, useContext, useEffect, useState } from "react";
// // import { useAuth } from "./AuthContext";

// // const PermissionContext = createContext();

// // export const PermissionProvider = ({ children }) => {
// //   const { user } = useAuth(); // coming from AuthContext
// //   const [permissions, setPermissions] = useState({});

// //   useEffect(() => {
// //     if (user?.permission) {
// //       setPermissions(user.permission);
// //     } else {
// //       setPermissions({});
// //     }
// //   }, [user]);

// //   //  helper to check if user has a specific permission
// //   const hasPermission = (key) => {
// //     if (!permissions) return false;
// //     return permissions[key] === "1"; // backend sends "1" or "0"
// //   };

// //   //  helper if you ever want to update permissions dynamically (e.g. after admin changes them)
// //   const updatePermissions = (newPermissions) => {
// //     setPermissions(newPermissions);

// //     // update user in localStorage too (so refresh keeps changes)
// //     const storedUser = localStorage.getItem("user");
// //     if (storedUser) {
// //       const parsed = JSON.parse(storedUser);
// //       parsed.permission = newPermissions;
// //       localStorage.setItem("user", JSON.stringify(parsed));
// //     }
// //   };

// //   return (
// //     <PermissionContext.Provider value={{ permissions, hasPermission, updatePermissions }}>
// //       {children}
// //     </PermissionContext.Provider>
// //   );
// // };

// // export const usePermission = () => useContext(PermissionContext);


// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";

// const PermissionContext = createContext();

// export const PermissionProvider = ({ children }) => {
//   const { user } = useAuth(); // logged-in user
//   const [permissions, setPermissions] = useState(user?.permissions || {});

//   // Initialize permissions whenever user changes
//   useEffect(() => {
//     if (user?.permissions) {
//       setPermissions(user.permissions); // Changed from user.permission to user.permissions
//     } else {
//       setPermissions({});
//     }
//   }, [user]);

//   // Check if user has a specific permission flag
//   const hasPermission = (key) => {
//     if (!permissions) return false;
//     return permissions[key] === "1";
//   };

//   // Update permissions dynamically (e.g., after admin changes them)
//   const updatePermissions = (newPermissions) => {
//     setPermissions(newPermissions);

//     // Update user in localStorage too (so refresh keeps changes)
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsed = JSON.parse(storedUser);
//       parsed.permissions = newPermissions; // Changed from permission to permissions
//       localStorage.setItem("user", JSON.stringify(parsed));
//     }

//     // Optionally: send API request to update permissions on the server
//     // httpClient.put(`roles/${user.role_id}/permissions`, newPermissions)
//     //   .catch(err => console.error("Failed to update permissions", err));
//   };
// const canEditRole = (roleId, roleName) => {
//   // Admin role itself is locked
//   if (roleName?.toLowerCase() === "admin" || roleId === 1) return false;

//   // No restrictions → can edit all except admin
//   if (permissions?.does_restrict_roles == 0) return true;

//   // Restricted → check restrict_roles
//   const restrictRoles = permissions?.restrict_roles;
//   if (!restrictRoles) return false;

//   try {
//     const arr = typeof restrictRoles === "string" ? JSON.parse(restrictRoles) : restrictRoles;
//     return arr.includes(roleId);
//   } catch (e) {
//     console.error("Invalid restrict_roles format", e);
//     return false;
//   }
// };

// const canDeleteRole = (roleId, roleName) => {
//   // Admin role itself is locked
//   if (roleName?.toLowerCase() === "admin" || roleId === 1) return false;

//   // No restrictions → can delete all except admin
//   if (permissions?.does_restrict_roles == 0) return true;

//   // Restricted → check restrict_roles
//   const restrictRoles = permissions?.restrict_roles;
//   if (!restrictRoles) return false;

//   try {
//     const arr = typeof restrictRoles === "string" ? JSON.parse(restrictRoles) : restrictRoles;
//     return arr.includes(roleId);
//   } catch (e) {
//     console.error("Invalid restrict_roles format", e);
//     return false;
//   }
// };

//   return (
//     <PermissionContext.Provider
//       value={{
//         permissions,
//         hasPermission,
//         updatePermissions,
//         canEditRole,
//         canDeleteRole
//       }}
//     >
//       {children}
//     </PermissionContext.Provider>
//   );
// };

// export const usePermission = () => useContext(PermissionContext);



import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import PermissionDenied from "../components/PermissionDenied/PermissionDenied"

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const { user } = useAuth(); 
  const [permissions, setPermissions] = useState(user?.permissions || {});
  const [deniedMessage, setDeniedMessage] = useState("");
  const [showDenied, setShowDenied] = useState(false);

  useEffect(() => {
    if (user?.permissions) {
      setPermissions(user.permissions);
    } else {
      setPermissions({});
    }
  }, [user]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user" && e.newValue) {
        const updatedUser = JSON.parse(e.newValue);
        if (updatedUser?.permissions) {
          setPermissions(updatedUser.permissions);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isAdmin = () => {
    return user?.role?.name.toLowerCase() === "admin" || user?.is_admin === true;
  };

  const canEditRole = (roleName) => {
    if (!isAdmin()) return false;
    if (roleName?.toLowerCase() === "admin") return false;
    return true;
  };

  const canDeleteRole = (roleName) => {
    if (!isAdmin()) return false;
    if (roleName?.toLowerCase() === "admin") return false;
    return true;
  };

  // 🔹 Modified hasPermission
  const hasPermission = (key, showModal = false) => {
    if (!permissions || permissions[key] !== "1") {
      if (showModal) {
        setDeniedMessage(`Permission "${key}" is required.`);
        setShowDenied(true);
      }
      return false;
    }
    return true;
  };

  const updatePermissions = (newPermissions) => {
    setPermissions(newPermissions);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      parsed.permissions = newPermissions;
      localStorage.setItem("user", JSON.stringify(parsed));
    }
  };

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        hasPermission,
        updatePermissions,
        isAdmin,
        canEditRole,
        canDeleteRole,
      }}
    >
      {children}

      {/* 🔹 Global PermissionDenied modal */}
      {showDenied && (
        <PermissionDenied
          overlay
          message={deniedMessage}
        />
      )}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => useContext(PermissionContext);

