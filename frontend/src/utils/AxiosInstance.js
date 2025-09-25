import axios from "axios";
import { Navigate } from "react-router-dom"; // Import Navigate for redirection (or use your router method)

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://kolo-temari-backend-service.onrender.com/api/", // Use environment variable
  withCredentials: true, // Allow cookies to be sent with requests if needed
});

// Attach the token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 error, handle token refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_API_URL || "https://kolo-temari-backend-service.onrender.com/api/"}auth/refresh-token`
        );

        if (refreshResponse.data.status === "success") {
          const newToken = refreshResponse.data.token;
          localStorage.setItem("authToken", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalRequest); // Retry original request with new token
        }
      } catch (err) {
        // Handle refresh token error or expiration
        console.error("Refresh token failed or expired:", err);

        // Remove both tokens if refresh token fails
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");

        // Redirect to login page (depending on how your routing works)
        window.location.href = "/signin"; // Force navigation to the login page
        return Promise.reject(err); // Reject the request after redirection
      }
    }

    return Promise.reject(error); // For any other errors, reject the promise
  }
);

export default axiosInstance;
