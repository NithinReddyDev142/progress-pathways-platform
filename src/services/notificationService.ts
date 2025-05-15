
import apiClient from './apiClient';
import { Notification } from '@/types';
import { toast } from 'sonner';

interface NotificationResponse {
  success: boolean;
  data: Notification;
}

interface NotificationsResponse {
  success: boolean;
  count: number;
  data: Notification[];
}

export const notificationService = {
  async getUserNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<NotificationsResponse>('/notifications');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
  
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await apiClient.put(`/notifications/${notificationId}`);
      return true;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      return false;
    }
  },
  
  async markAllAsRead(): Promise<boolean> {
    try {
      await apiClient.put('/notifications/read-all');
      toast.success('All notifications marked as read');
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
      return false;
    }
  },
  
  async sendNotification(userId: string, title: string, message: string): Promise<Notification | null> {
    try {
      const response = await apiClient.post<NotificationResponse>('/notifications', {
        to: userId,
        title,
        message
      });
      
      toast.success('Notification sent');
      return response.data.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
      return null;
    }
  }
};

export default notificationService;
