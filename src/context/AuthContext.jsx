import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored ? stored : null;
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(() => localStorage.getItem("token") || null);
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : null;
//   });
//   const [userName, setUserName] = useState(() => localStorage.getItem("userName") || null);
//   const [role, setRole] = useState(() => {
//     const stored = localStorage.getItem("role");
//     return stored ? JSON.parse(stored) : null;
//   });
//   const [companyId, setCompanyId] = useState(() => localStorage.getItem("company_id") || null);

//   useEffect(() => {
//     if (token) localStorage.setItem("token", token);
//     else localStorage.removeItem("token");
//   }, [token]);

//   useEffect(() => {
//     if (user) localStorage.setItem("user", JSON.stringify(user));
//     else localStorage.removeItem("user");
//   }, [user]);

//   useEffect(() => {
//     if (userName) localStorage.setItem("userName", userName);
//     else localStorage.removeItem("userName");
//   }, [userName]);

//   useEffect(() => {
//     if (role) localStorage.setItem("role", JSON.stringify(role));
//     else localStorage.removeItem("role");
//   }, [role]);

//   useEffect(() => {
//     if (companyId) localStorage.setItem("company_id", companyId);
//     else localStorage.removeItem("company_id");
//   }, [companyId]);

//   const login = (apiResponse) => {
//     if (!apiResponse || !apiResponse.success) return;

//     const { token: newToken, data } = apiResponse;
//     setToken(newToken || null);
//     setUser(data || null);
//     setUserName(data?.name || null);  // <-- Save user name here
//     setRole(data?.role || null);
//     setCompanyId(data?.company_id ? data.company_id.toString() : null);
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     setUserName(null);
//     setRole(null);
//     setCompanyId(null);
//     localStorage.clear();
//   };

//   const isAuthenticated = Boolean(token && user);

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         userName,
//         role,
//         companyId,
//         login,
//         logout,
//         isAuthenticated,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
