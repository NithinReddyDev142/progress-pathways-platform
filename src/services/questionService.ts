
import apiClient from './apiClient';
import { Question } from '@/types';
import { toast } from 'sonner';

interface QuestionResponse {
  success: boolean;
  data: Question;
}

interface QuestionsResponse {
  success: boolean;
  count: number;
  data: Question[];
}

export const questionService = {
  async getStudentQuestions(): Promise<Question[]> {
    try {
      const response = await apiClient.get<QuestionsResponse>('/questions/student');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching student questions:', error);
      toast.error('Failed to fetch your questions');
      return [];
    }
  },
  
  async getTeacherQuestions(): Promise<Question[]> {
    try {
      const response = await apiClient.get<QuestionsResponse>('/questions/teacher');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teacher questions:', error);
      toast.error('Failed to fetch student questions');
      return [];
    }
  },
  
  async getCourseQuestions(courseId: string): Promise<Question[]> {
    try {
      const response = await apiClient.get<QuestionsResponse>(`/questions/courses/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching questions for course ${courseId}:`, error);
      toast.error('Failed to fetch course questions');
      return [];
    }
  },
  
  async askQuestion(courseId: string, questionText: string): Promise<Question | null> {
    try {
      const response = await apiClient.post<QuestionResponse>('/questions', {
        courseId,
        question: questionText
      });
      
      toast.success('Question submitted successfully');
      return response.data.data;
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question');
      return null;
    }
  },
  
  async answerQuestion(questionId: string, answer: string): Promise<Question | null> {
    try {
      const response = await apiClient.put<QuestionResponse>(`/questions/${questionId}`, {
        answer
      });
      
      toast.success('Answer submitted successfully');
      return response.data.data;
    } catch (error) {
      console.error(`Error answering question ${questionId}:`, error);
      toast.error('Failed to submit answer');
      return null;
    }
  }
};

export default questionService;
