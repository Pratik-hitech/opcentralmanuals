import axios from "axios";
import GlobalURL from "./global";

// Public axios instance for requests that do NOT require Authorization header
const publicClient = axios.create({
  baseURL: window.location.hostname === "localhost"
    ? GlobalURL[0].url // Local API
    : GlobalURL[0].url // Production API
});

export { publicClient };
