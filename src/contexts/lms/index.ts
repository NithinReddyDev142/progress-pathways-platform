
// Export all hooks and providers from a single file
export { useCourses } from './CourseContext';
export { useLearningPaths } from './LearningPathContext';
export { useProgress } from './ProgressContext';
export { useNotifications } from './NotificationContext';
export { useQuestions } from './QuestionContext';
export { LmsProvider } from './LmsProvider';

// Backward compatibility
export * from './useLms';
