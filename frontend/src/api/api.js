import axios from "axios";
import { LogOut } from "lucide-react";

const API = axios.create({
  baseURL: "http://localhost:5000", 
  withCredentials: true // important to send cookies
});

// Interceptor: attach access token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // or context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: auto-refresh on 401 (expired access token)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // call refresh endpoint
        const res = await axios.post(
          "http://localhost:5000/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed, logging out...");
        localStorage.removeItem("accessToken");
        
      }
    }
    return Promise.reject(error);
  }
);

export default API;
