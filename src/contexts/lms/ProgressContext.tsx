
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CourseProgress } from "../../types";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import progressService from "../../services/progressService";

interface ProgressContextType {
  courseProgress: CourseProgress[];
  loading: boolean;
  error: string | null;
  getUserCourseProgress: (userId: string, courseId: string) => CourseProgress | undefined;
  updateCourseProgress: (userId: string, courseId: string, progress: number) => Promise<void>;
  markCourseCompleted: (userId: string, courseId: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user progress when user is available
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const progress = await progressService.getUserProgress();
        setCourseProgress(progress);
        setError(null);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError('Failed to fetch course progress');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [user]);

  const getUserCourseProgress = (userId: string, courseId: string) => 
    courseProgress.find(progress => progress.userId === userId && progress.courseId === courseId);

  const updateCourseProgress = async (userId: string, courseId: string, progress: number) => {
    try {
      setLoading(true);
      const updatedProgress = await progressService.updateProgress(courseId, progress);
      
      if (updatedProgress) {
        setCourseProgress(prevProgresses => {
          const existingIndex = prevProgresses.findIndex(
            p => p.userId === userId && p.courseId === courseId
          );
          
          if (existingIndex >= 0) {
            const newProgresses = [...prevProgresses];
            newProgresses[existingIndex] = updatedProgress;
            return newProgresses;
          } else {
            return [...prevProgresses, updatedProgress];
          }
        });
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      toast.error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const markCourseCompleted = async (userId: string, courseId: string) => {
    await updateCourseProgress(userId, courseId, 100);
  };

  const value = {
    courseProgress,
    loading,
    error,
    getUserCourseProgress,
    updateCourseProgress,
    markCourseCompleted,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
