
import { useCourses } from "./CourseContext";
import { useLearningPaths } from "./LearningPathContext";
import { useProgress } from "./ProgressContext";
import { useNotifications } from "./NotificationContext";
import { useQuestions } from "./QuestionContext";

// This hook aggregates all domain-specific hooks for backward compatibility
export const useLms = () => {
  const courses = useCourses();
  const learningPaths = useLearningPaths();
  const progress = useProgress();
  const notifications = useNotifications();
  const questions = useQuestions();
  
  return {
    ...courses,
    ...learningPaths,
    ...progress,
    ...notifications,
    ...questions,
  };
};
