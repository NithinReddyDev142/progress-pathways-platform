
import axios from 'axios';
import { toast } from 'sonner';

// Get the API URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth headers
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (!response) {
      toast.error('Network error. Please check your connection.');
    } else if (response.status === 401) {
      toast.error('Your session has expired. Please log in again.');
      // You could also redirect to login here
    } else if (response.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (response.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      const message = response.data?.message || 'An unexpected error occurred.';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default apiClient;
