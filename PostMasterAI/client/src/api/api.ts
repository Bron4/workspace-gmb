import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log("api.ts: Request interceptor - checking for access token");
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log("api.ts: Access token found, adding to request headers");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("api.ts: No access token found in localStorage");
    }
    console.log("api.ts: Making request to:", config.url, "with method:", config.method);
    return config;
  },
  (error) => {
    console.error("api.ts: Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log("api.ts: Response interceptor - successful response from:", response.config.url);
    return response;
  },
  async (error) => {
    console.error("api.ts: Response interceptor - error response:", error.response?.status, "from:", error.config?.url);
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("api.ts: 401 error detected, attempting token refresh");
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log("api.ts: Refresh token found:", !!refreshToken);
        
        if (refreshToken) {
          console.log("api.ts: Making token refresh request");
          const response = await axios.post('/api/auth/refresh', {
            refreshToken: refreshToken
          });

          console.log("api.ts: Token refresh successful");
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          console.log("api.ts: New tokens stored, retrying original request");
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          console.log("api.ts: No refresh token available, redirecting to login");
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error("api.ts: Token refresh failed:", refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;