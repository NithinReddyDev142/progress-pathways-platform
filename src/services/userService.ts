
import apiClient from './apiClient';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const userService = {
  async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUserProfile(updates: Partial<Omit<User, 'password'>> & { currentPassword?: string, password?: string }): Promise<User> {
    try {
      const response = await apiClient.put('/users/profile', updates);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get('/users');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
};
