// import axios from "axios";
// import GlobalURL from "./global"
// // import { useAuth } from "../context/AuthContext";
 
// const loginData = localStorage.getItem('token');
// const token = loginData ? loginData : null;
// let localhttpclient = axios.create({
//     baseURL :GlobalURL[0].url,
//     headers:{
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
//         "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
//  Authorization: 'Bearer ' + token,
//     }
// });

// let livehttpclient = axios.create({
//     baseURL:GlobalURL[0].url,
//     headers:{
//       "Access-Control-Allow-Origin": "*",  
//       "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
//       "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
     
//      Authorization: 'Bearer ' + token,
//     }
// })

// export const httpClient = window.location.hostname === "localhost"? localhttpclient:livehttpclient;


// utils/httpClient.js
// import axios from "axios";
// import GlobalURL from "./global"; // Assumes GlobalURL[0].url is correct

// // Determine environment
// const baseURL = window.location.hostname === "localhost"
//   ? GlobalURL[0].url  // local API URL
//   : GlobalURL[0].url; // prod API URL (you can change this logic if needed)

// // Create Axios instance
// const httpClient = axios.create({
//   baseURL,
// });

// // Add request interceptor to set Authorization header dynamically
// httpClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // (Optional) Add response interceptor to handle token expiration
// httpClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token is invalid or expired
//       localStorage.removeItem("token");
//       window.location.href = "/login"; // Redirect to login page
//     }
//     return Promise.reject(error);
//   }
// );

// export { httpClient };


import axios from "axios";
import GlobalURL from "./global"; // Assumes GlobalURL[0].url is correct

const baseURL = window.location.hostname === "localhost"
  ? GlobalURL[0].url
  : GlobalURL[0].url; 

const httpClient = axios.create({ baseURL });

// Add request interceptor to set Authorization header dynamically
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Remove window.location.href to prevent reload
// Instead, return the error and handle 401 in the component
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally clear token locally
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Return a custom error to handle in component
      return Promise.reject({
        ...error,
        message: "Unauthorized. Please login again.",
        status: 401
      });
    }
    return Promise.reject(error);
  }
);

export { httpClient };
