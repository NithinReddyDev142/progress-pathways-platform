
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  Course, 
  CourseProgress, 
  LearningPath, 
  Notification, 
  Question,
  User,
  CourseType,
  CourseStatus
} from "../types";
import { 
  mockCourses, 
  mockCourseProgress, 
  mockLearningPaths, 
  mockNotifications,
  mockQuestions
} from "../data/mockData";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface LmsContextType {
  // Courses
  courses: Course[];
  getCourse: (id: string) => Course | undefined;
  addCourse: (course: Omit<Course, "id" | "createdAt" | "updatedAt" | "status">) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  // Learning Paths
  learningPaths: LearningPath[];
  getLearningPath: (id: string) => LearningPath | undefined;
  addLearningPath: (learningPath: Omit<LearningPath, "id" | "createdAt" | "updatedAt">) => void;
  updateLearningPath: (id: string, updates: Partial<LearningPath>) => void;
  deleteLearningPath: (id: string) => void;
  
  // Course Progress
  courseProgress: CourseProgress[];
  getUserCourseProgress: (userId: string, courseId: string) => CourseProgress | undefined;
  updateCourseProgress: (userId: string, courseId: string, progress: number) => void;
  markCourseCompleted: (userId: string, courseId: string) => void;
  
  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  sendNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  
  // Questions
  questions: Question[];
  getUserQuestions: (userId: string) => Question[];
  getCourseQuestions: (courseId: string) => Question[];
  askQuestion: (question: Omit<Question, "id" | "createdAt" | "answeredAt">) => void;
  answerQuestion: (id: string, answer: string) => void;
}

const LmsContext = createContext<LmsContextType | undefined>(undefined);

export const LmsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(mockLearningPaths);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>(mockCourseProgress);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);

  // Filter notifications for the current user
  const userNotifications = user ? notifications.filter(notif => notif.to === user.id) : [];
  const unreadNotificationsCount = userNotifications.filter(notif => !notif.read).length;

  // Course Management
  const getCourse = (id: string) => courses.find(course => course.id === id);

  const addCourse = (course: Omit<Course, "id" | "createdAt" | "updatedAt" | "status">) => {
    if (!user) return;
    
    const newCourse: Course = {
      ...course,
      id: `course${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft"
    };
    
    setCourses([...courses, newCourse]);
    toast.success("Course created successfully!");
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...updates, updatedAt: new Date().toISOString() } : course
    ));
    toast.success("Course updated successfully!");
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast.success("Course deleted successfully!");
  };

  // Learning Path Management
  const getLearningPath = (id: string) => learningPaths.find(path => path.id === id);

  const addLearningPath = (learningPath: Omit<LearningPath, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    
    const newLearningPath: LearningPath = {
      ...learningPath,
      id: `path${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setLearningPaths([...learningPaths, newLearningPath]);
    toast.success("Learning path created successfully!");
  };

  const updateLearningPath = (id: string, updates: Partial<LearningPath>) => {
    setLearningPaths(paths => 
      paths.map(path => 
        path.id === id ? { ...path, ...updates, updatedAt: new Date().toISOString() } : path
      )
    );
    toast.success("Learning path updated successfully!");
  };

  const deleteLearningPath = (id: string) => {
    setLearningPaths(paths => paths.filter(path => path.id !== id));
    toast.success("Learning path deleted successfully!");
  };

  // Course Progress Management
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

  // Notification Management
  const sendNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    setNotifications([...notifications, newNotification]);
    toast.success("Notification sent!");
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Question Management
  const getUserQuestions = (userId: string) => 
    questions.filter(q => q.studentId === userId || q.teacherId === userId);

  const getCourseQuestions = (courseId: string) => 
    questions.filter(q => q.courseId === courseId);

  const askQuestion = (question: Omit<Question, "id" | "createdAt" | "answeredAt">) => {
    const newQuestion: Question = {
      ...question,
      id: `q${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setQuestions([...questions, newQuestion]);
    toast.success("Question submitted successfully!");
  };

  const answerQuestion = (id: string, answer: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, answer, answeredAt: new Date().toISOString() } : q
    ));
    toast.success("Answer submitted!");
  };

  const value = {
    courses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
    
    learningPaths,
    getLearningPath,
    addLearningPath,
    updateLearningPath,
    deleteLearningPath,
    
    courseProgress,
    getUserCourseProgress,
    updateCourseProgress,
    markCourseCompleted,
    
    notifications,
    unreadNotificationsCount,
    sendNotification,
    markNotificationAsRead,
    deleteNotification,
    
    questions,
    getUserQuestions,
    getCourseQuestions,
    askQuestion,
    answerQuestion,
  };

  return <LmsContext.Provider value={value}>{children}</LmsContext.Provider>;
};

export const useLms = () => {
  const context = useContext(LmsContext);
  if (context === undefined) {
    throw new Error("useLms must be used within an LmsProvider");
  }
  return context;
};
