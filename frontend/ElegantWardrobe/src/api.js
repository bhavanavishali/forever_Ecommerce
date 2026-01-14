import axios from "axios";
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN, ADMIN_ACCESS_TOKEN, ADMIN_REFRESH_TOKEN } from "./constants";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Log API configuration on startup (only in development)
if (import.meta.env.DEV) {
  if (!API_BASE_URL) {
    console.error('⚠️ VITE_API_BASE_URL environment variable is not set!');
    console.error('📝 To fix this:');
    console.error('   1. Create a .env file in frontend/ElegantWardrobe/ directory');
    console.error('   2. Add this line: VITE_API_BASE_URL=http://localhost:8000/api');
    console.error('   3. Restart your Vite dev server');
    console.error('');
    console.error('   Note: The URL should end with /api because Django routes are under /api/');
    console.error('   Note: Adjust the port (8000) if your Django backend runs on a different port.');
  } else {
    console.log('✅ API Configuration:', {
      API_BASE_URL: API_BASE_URL,
      'Status': 'Configured correctly'
    });
  }
}

// ----- User API Instance -----
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Fixed interceptor with proper error handling
api.interceptors.response.use(
  (response) => {
    // Check if response is HTML instead of JSON (indicates wrong URL or backend not running)
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('text/html') || (typeof response.data === 'string' && response.data.trim().startsWith('<!'))) {
      console.error('API returned HTML instead of JSON. Check your VITE_API_BASE_URL environment variable.');
      console.error('Current API_BASE_URL:', API_BASE_URL || 'UNDEFINED - using relative URLs');
      console.error('Request URL:', response.config.baseURL + response.config.url);
      return Promise.reject(new Error('API returned HTML - backend may not be running or VITE_API_BASE_URL is incorrect'));
    }
    console.log('interceptor response');
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error?.response?.status;
    
    // Only log non-auth errors to reduce console noise
    if (statusCode !== 401 && statusCode !== 403) {
      console.log('API error status = ', statusCode);
    }
    
    // Don't try to refresh token for public endpoints or if already retried
    const isPublicEndpoint = originalRequest.url.includes("/products/") || 
                            originalRequest.url.includes("/token/refresh/") ||
                            originalRequest.url.includes("/login/") ||
                            originalRequest.url.includes("/register/") ||
                            originalRequest.url.includes("/send-otp/") ||
                            originalRequest.url.includes("/verify-otp/");
    
    // Try to refresh token only for authenticated endpoints with 401/403 errors
    if (
      (statusCode === 401 || statusCode === 403) &&
      !originalRequest._retry &&
      !isPublicEndpoint
    ) {
      originalRequest._retry = true;

      try {
        console.log("Refreshing token...");
        // Make sure to use withCredentials for refresh request too
        await api.post("/token/refresh/", { withCredentials: true });

        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        // If refresh fails, user is not authenticated - this is normal for public pages
        if (refreshError?.response?.status === 401) {
          // Silently fail for unauthenticated users - they just need to login
          return Promise.reject(error);
        }
        console.error("Refresh token failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ----- Admin API Instance -----
export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.response.use(
  (response) => {
    // Check if response is HTML instead of JSON
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('text/html') || (typeof response.data === 'string' && response.data.trim().startsWith('<!'))) {
      console.error('Admin API returned HTML instead of JSON. Check your VITE_API_BASE_URL environment variable.');
      return Promise.reject(new Error('API returned HTML - backend may not be running or VITE_API_BASE_URL is incorrect'));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error?.response?.status;
    
    // Don't try to refresh token for public endpoints or if already retried
    const isPublicEndpoint = originalRequest.url.includes("/admin_login/") ||
                            originalRequest.url.includes("/token/refresh/");

    // Try to refresh token only for authenticated endpoints with 401/403 errors
    if (
      (statusCode === 401 || statusCode === 403) &&
      !originalRequest._retry &&
      !isPublicEndpoint
    ) {
      originalRequest._retry = true;
      
      try {
        console.log('Refreshing admin token...');
        // Use adminApi instance for consistency
        await adminApi.post("/token/refresh/", {}, { withCredentials: true });

        return adminApi(originalRequest);
      } catch (refreshError) {
        // If refresh fails, admin is not authenticated - this is normal
        if (refreshError?.response?.status === 401) {
          return Promise.reject(error);
        }
        console.error("Admin token refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;