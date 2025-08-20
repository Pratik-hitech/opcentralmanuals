import qs from "qs";
import {httpClient} from "./httpClientSetup";

export const loginUser = (email,password)=>{
  return httpClient.post(
    "login",
    qs.stringify({
      email,password
    }),

  ).then((response)=>{
    const token = response.data.token;
    const user = response.data.data;
    console.log("user data from api",user)
    return {token,user}
  })
  .catch((error)=>{
    const message = error.response?.data?.message || "An unexpected error occured.Try again";
    throw new Error (message)
  })
  
}