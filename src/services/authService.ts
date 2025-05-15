
import apiClient from './apiClient';
import { User } from '@/types';
import { toast } from 'sonner';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'student' | 'teacher' | 'admin';
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

const AUTH_TOKEN_KEY = 'lms-auth-token';
const USER_DATA_KEY = 'lms-user-data';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
  
  async register(data: RegisterData): Promise<User> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
  
  async getCurrentUser(): Promise<User | null> {
    try {
      // First try to get from localStorage
      const storedUser = localStorage.getItem(USER_DATA_KEY);
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      
      if (!storedToken) {
        return null;
      }
      
      if (storedUser) {
        // Verify token is still valid by making API call
        const response = await apiClient.get('/auth/me');
        
        if (response.data.success) {
          // Update stored user data with latest from server
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data));
          return response.data.data;
        }
      } else {
        // If no stored user but token exists, fetch user data
        const response = await apiClient.get('/auth/me');
        
        if (response.data.success) {
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data));
          return response.data.data;
        }
      }
      
      return null;
    } catch (error) {
      // Token might be invalid or expired
      this.logout();
      return null;
    }
  },
  
  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },
  
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put('/users/profile', updates);
      
      if (response.data.success) {
        // Update stored user data
        const updatedUser = response.data.data;
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
        toast.success('Profile updated successfully');
        return updatedUser;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  },
  
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await apiClient.put('/users/password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully');
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to change password');
      }
      throw error;
    }
  },
  
  getStoredToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
};

export default authService;
