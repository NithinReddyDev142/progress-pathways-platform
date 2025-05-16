
import apiClient from './apiClient';
import { CourseProgress } from '../types';
import { toast } from 'sonner';

interface ProgressResponse {
  success: boolean;
  data: CourseProgress;
}

interface ProgressListResponse {
  success: boolean;
  count: number;
  data: CourseProgress[];
}

export const progressService = {
  async getUserProgress(): Promise<CourseProgress[]> {
    try {
      const response = await apiClient.get<ProgressListResponse>('/progress');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      toast.error('Failed to fetch your learning progress');
      return [];
    }
  },
  
  async getCourseProgress(courseId: string): Promise<CourseProgress | null> {
    try {
      const response = await apiClient.get<ProgressResponse>(`/progress/courses/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching course progress for course ${courseId}:`, error);
      return null;
    }
  },
  
  async updateProgress(courseId: string, progress: number): Promise<CourseProgress | null> {
    try {
      const response = await apiClient.post<ProgressResponse>(`/progress/courses/${courseId}`, { progress });
      return response.data.data;
    } catch (error) {
      console.error(`Error updating progress for course ${courseId}:`, error);
      toast.error('Failed to update course progress');
      return null;
    }
  },
  
  async markCompleted(courseId: string): Promise<CourseProgress | null> {
    try {
      const response = await apiClient.post<ProgressResponse>(`/progress/courses/${courseId}`, { progress: 100 });
      toast.success('Course marked as completed!');
      return response.data.data;
    } catch (error) {
      console.error(`Error marking course ${courseId} as completed:`, error);
      toast.error('Failed to mark course as completed');
      return null;
    }
  },
  
  async getInstructorCourseProgress(courseId: string): Promise<CourseProgress[]> {
    try {
      const response = await apiClient.get<ProgressListResponse>(`/progress/instructor/courses/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching student progress for course ${courseId}:`, error);
      toast.error('Failed to fetch student progress data');
      return [];
    }
  }
};

export default progressService;
