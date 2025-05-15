
import apiClient from './apiClient';
import { User } from '@/types';
import { toast } from 'sonner';

interface UserResponse {
  success: boolean;
  data: User;
}

interface UsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<UsersResponse>('/users');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      return [];
    }
  },
  
  async getUserProfile(): Promise<User | null> {
    try {
      const response = await apiClient.get<UserResponse>('/users/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to fetch profile');
      return null;
    }
  },
  
  async updateUserProfile(updates: Partial<User>): Promise<User | null> {
    try {
      const response = await apiClient.put<UserResponse>('/users/profile', updates);
      toast.success('Profile updated successfully');
      return response.data.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return null;
    }
  },
  
  async changeUserRole(userId: string, role: 'student' | 'teacher' | 'admin'): Promise<User | null> {
    try {
      const response = await apiClient.put<UserResponse>(`/users/${userId}/role`, { role });
      toast.success(`User role changed to ${role}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error changing role for user ${userId}:`, error);
      toast.error('Failed to change user role');
      return null;
    }
  },
  
  async getTeacherStudents(): Promise<User[]> {
    try {
      const response = await apiClient.get<UsersResponse>('/users/teacher/students');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teacher students:', error);
      toast.error('Failed to fetch students');
      return [];
    }
  }
};

export default userService;
