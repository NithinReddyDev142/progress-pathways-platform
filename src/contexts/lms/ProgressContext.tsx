
import { createContext, useContext, useState, ReactNode } from "react";
import { CourseProgress } from "../../types";
import { mockCourseProgress } from "../../data/mockData";
import { toast } from "sonner";

interface ProgressContextType {
  courseProgress: CourseProgress[];
  getUserCourseProgress: (userId: string, courseId: string) => CourseProgress | undefined;
  updateCourseProgress: (userId: string, courseId: string, progress: number) => void;
  markCourseCompleted: (userId: string, courseId: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>(mockCourseProgress);

  const getUserCourseProgress = (userId: string, courseId: string) => 
    courseProgress.find(progress => progress.userId === userId && progress.courseId === courseId);

  const updateCourseProgress = (userId: string, courseId: string, progress: number) => {
    const existingProgress = getUserCourseProgress(userId, courseId);
    
    if (existingProgress) {
      setCourseProgress(progresses => 
        progresses.map(p => 
          p.userId === userId && p.courseId === courseId
            ? { ...p, progress, lastAccessed: new Date().toISOString(), completed: progress === 100 }
            : p
        )
      );
    } else {
      const newProgress: CourseProgress = {
        userId,
        courseId,
        progress,
        completed: progress === 100,
        lastAccessed: new Date().toISOString(),
      };
      setCourseProgress([...courseProgress, newProgress]);
    }
    
    if (progress === 100) {
      toast.success("Congratulations! Course completed!");
    } else {
      toast.success("Progress updated successfully!");
    }
  };

  const markCourseCompleted = (userId: string, courseId: string) => {
    updateCourseProgress(userId, courseId, 100);
  };

  const value = {
    courseProgress,
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
