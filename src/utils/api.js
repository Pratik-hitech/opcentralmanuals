// import qs from "qs";
// import { httpClient } from "./httpClientSetup";

// export const loginUser = (email, password) => {
//   return httpClient.post(
//     "manual-login",
//     qs.stringify({
//       email, 
//       password
//     }),
//     {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     }
//   )
//   .then((response) => {
//     if (response.data && response.data.token) {
//       const token = response.data.token;
//       const user = response.data.data;
//       console.log("user data from api", user);
//       return { token, user };
//     } else {
//       throw new Error("Invalid response from server");
//     }
//   })
//   .catch((error) => {
//     let message = "An unexpected error occurred. Try again";
    
//     if (error.response) {
//       // The server responded with an error status
//       message = error.response.data?.message || 
//                 error.response.data?.error || 
//                 `Server error: ${error.response.status}`;
//     } else if (error.request) {
//       // The request was made but no response was received
//       message = "No response from server. Please check your connection.";
//     } else {
//       // Something happened in setting up the request
//       message = error.message || "Request setup error";
//     }
    
//     console.error("Login API error:", error);
//     throw new Error(message);
//   });
// };