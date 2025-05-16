
import apiClient from './apiClient';
import { CourseProgress } from '@/types';
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
      console.error('Error fetching progress:', error);
      return [];
    }
  },
  
  async getCourseProgress(courseId: string): Promise<CourseProgress | null> {
    try {
      const response = await apiClient.get<ProgressResponse>(`/progress/courses/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching progress for course ${courseId}:`, error);
      return null;
    }
  },
  
  async updateProgress(courseId: string, progress: number): Promise<CourseProgress | null> {
    try {
      const response = await apiClient.post<ProgressResponse>(`/progress/courses/${courseId}`, {
        progress
      });
      
      if (progress === 100) {
        toast.success('Congratulations! Course completed!');
      } else {
        toast.success('Progress updated successfully');
      }
      
      return response.data.data;
    } catch (error) {
      console.error(`Error updating progress for course ${courseId}:`, error);
      toast.error('Failed to update progress');
      return null;
    }
  },
  
  async getStudentsProgressForCourse(courseId: string): Promise<CourseProgress[]> {
    try {
      const response = await apiClient.get<ProgressListResponse>(`/progress/instructor/courses/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching student progress for course ${courseId}:`, error);
      toast.error('Failed to fetch student progress');
      return [];
    }
  }
};

export default progressService;
