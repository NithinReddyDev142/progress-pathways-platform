
import apiClient from './apiClient';
import { Course } from '@/types';
import { toast } from 'sonner';

interface CourseResponse {
  success: boolean;
  data: Course;
}

interface CoursesResponse {
  success: boolean;
  count: number;
  data: Course[];
}

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<CoursesResponse>('/courses');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      return [];
    }
  },
  
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const response = await apiClient.get<CourseResponse>(`/courses/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      toast.error('Failed to fetch course details');
      return null;
    }
  },
  
  async createCourse(courseData: Omit<Course, 'id' | 'instructorId' | 'instructorName' | 'createdAt' | 'updatedAt'>): Promise<Course | null> {
    try {
      const response = await apiClient.post<CourseResponse>('/courses', courseData);
      toast.success('Course created successfully');
      return response.data.data;
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
      return null;
    }
  },
  
  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    try {
      const response = await apiClient.put<CourseResponse>(`/courses/${id}`, updates);
      toast.success('Course updated successfully');
      return response.data.data;
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      toast.error('Failed to update course');
      return null;
    }
  },
  
  async deleteCourse(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/courses/${id}`);
      toast.success('Course deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      toast.error('Failed to delete course');
      return false;
    }
  },
  
  async getTeacherCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<CoursesResponse>('/courses/instructor/me');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      toast.error('Failed to fetch your courses');
      return [];
    }
  }
};

export default courseService;
