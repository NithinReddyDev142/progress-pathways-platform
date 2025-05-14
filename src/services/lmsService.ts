import apiClient from "./apiClient";
import { 
  Course, 
  LearningPath, 
  CourseProgress, 
  Notification, 
  Question 
} from "../types";

// Local storage keys for fallback data
const STORAGE_KEYS = {
  COURSES: "demo-courses",
  LEARNING_PATHS: "demo-learning-paths",
  COURSE_PROGRESS: "demo-course-progress",
  NOTIFICATIONS: "demo-notifications",
  QUESTIONS: "demo-questions",
};

// Helper function to get demo data from localStorage
const getDemoData = (key: string, defaultData: any[] = []) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
      return defaultData;
    }
  }
  return defaultData;
};

// Helper to save demo data to localStorage
const saveDemoData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Course operations
export async function fetchAllCourses(): Promise<Course[]> {
  try {
    const response = await apiClient.get('/courses');
    return response.data.courses;
  } catch (error) {
    console.warn("Using demo course data due to API error");
    return getDemoData(STORAGE_KEYS.COURSES);
  }
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  try {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data.course;
  } catch (error) {
    console.warn(`Using demo data for course ${id} due to API error`);
    const courses = getDemoData(STORAGE_KEYS.COURSES);
    return courses.find((c: Course) => c.id === id) || null;
  }
}

export async function createCourse(course: Omit<Course, "id" | "createdAt" | "updatedAt" | "status">): Promise<Course> {
  try {
    const response = await apiClient.post('/courses', { 
      ...course, 
      status: "draft" 
    });
    return response.data.course;
  } catch (error) {
    console.warn("Using demo storage for course creation due to API error");
    const courses = getDemoData(STORAGE_KEYS.COURSES);
    const now = new Date().toISOString();
    const newCourse = {
      ...course,
      id: `course${Date.now()}`,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    
    courses.push(newCourse);
    saveDemoData(STORAGE_KEYS.COURSES, courses);
    return newCourse as Course;
  }
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<boolean> {
  try {
    const response = await apiClient.put(`/courses/${id}`, updates);
    return response.data.success;
  } catch (error) {
    console.warn(`Using demo storage for course update ${id} due to API error`);
    const courses = getDemoData(STORAGE_KEYS.COURSES);
    const courseIndex = courses.findIndex((c: Course) => c.id === id);
    
    if (courseIndex >= 0) {
      courses[courseIndex] = {
        ...courses[courseIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDemoData(STORAGE_KEYS.COURSES, courses);
      return true;
    }
    return false;
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data.success;
  } catch (error) {
    console.warn(`Using demo storage for course deletion ${id} due to API error`);
    const courses = getDemoData(STORAGE_KEYS.COURSES);
    const filteredCourses = courses.filter((c: Course) => c.id !== id);
    
    if (filteredCourses.length < courses.length) {
      saveDemoData(STORAGE_KEYS.COURSES, filteredCourses);
      return true;
    }
    return false;
  }
}

// Learning Path operations
export async function fetchAllLearningPaths(): Promise<LearningPath[]> {
  try {
    const response = await apiClient.get('/learning-paths');
    return response.data.learningPaths;
  } catch (error) {
    console.warn("Using demo learning path data due to API error");
    return getDemoData(STORAGE_KEYS.LEARNING_PATHS);
  }
}

export async function fetchLearningPathById(id: string): Promise<LearningPath | null> {
  try {
    const response = await apiClient.get(`/learning-paths/${id}`);
    return response.data.learningPath;
  } catch (error) {
    console.warn(`Using demo data for learning path ${id} due to API error`);
    const learningPaths = getDemoData(STORAGE_KEYS.LEARNING_PATHS);
    return learningPaths.find((lp: LearningPath) => lp.id === id) || null;
  }
}

export async function createLearningPath(learningPath: Omit<LearningPath, "id" | "createdAt" | "updatedAt">): Promise<LearningPath> {
  try {
    const response = await apiClient.post('/learning-paths', learningPath);
    return response.data.learningPath;
  } catch (error) {
    console.warn("Using demo storage for learning path creation due to API error");
    const learningPaths = getDemoData(STORAGE_KEYS.LEARNING_PATHS);
    const now = new Date().toISOString();
    const newLearningPath = {
      ...learningPath,
      id: `path${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    
    learningPaths.push(newLearningPath);
    saveDemoData(STORAGE_KEYS.LEARNING_PATHS, learningPaths);
    return newLearningPath as LearningPath;
  }
}

export async function updateLearningPath(id: string, updates: Partial<LearningPath>): Promise<boolean> {
  try {
    const response = await apiClient.put(`/learning-paths/${id}`, updates);
    return response.data.success;
  } catch (error) {
    console.warn(`Using demo storage for learning path update ${id} due to API error`);
    const learningPaths = getDemoData(STORAGE_KEYS.LEARNING_PATHS);
    const learningPathIndex = learningPaths.findIndex((lp: LearningPath) => lp.id === id);
    
    if (learningPathIndex >= 0) {
      learningPaths[learningPathIndex] = {
        ...learningPaths[learningPathIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDemoData(STORAGE_KEYS.LEARNING_PATHS, learningPaths);
      return true;
    }
    return false;
  }
}

export async function deleteLearningPath(id: string): Promise<boolean> {
  try {
    const response = await apiClient.delete(`/learning-paths/${id}`);
    return response.data.success;
  } catch (error) {
    console.warn(`Using demo storage for learning path deletion ${id} due to API error`);
    const learningPaths = getDemoData(STORAGE_KEYS.LEARNING_PATHS);
    const filteredLearningPaths = learningPaths.filter((lp: LearningPath) => lp.id !== id);
    
    if (filteredLearningPaths.length < learningPaths.length) {
      saveDemoData(STORAGE_KEYS.LEARNING_PATHS, filteredLearningPaths);
      return true;
    }
    return false;
  }
}

// Course progress operations
export async function fetchUserCourseProgress(userId: string, courseId: string): Promise<CourseProgress | null> {
  try {
    const response = await apiClient.get(`/progress/${userId}/${courseId}`);
    return response.data.progress;
  } catch (error) {
    console.warn(`Using demo data for course progress of user ${userId} and course ${courseId} due to API error`);
    const courseProgress = getDemoData(STORAGE_KEYS.COURSE_PROGRESS);
    return courseProgress.find((cp: CourseProgress) => cp.userId === userId && cp.courseId === courseId) || null;
  }
}

export async function updateUserCourseProgress(
  userId: string, 
  courseId: string, 
  progress: number
): Promise<CourseProgress> {
  try {
    const response = await apiClient.put(`/progress/${userId}/${courseId}`, { progress });
    return response.data.progress;
  } catch (error) {
    console.warn(`Using demo storage for course progress update of user ${userId} and course ${courseId} due to API error`);
    const courseProgress = getDemoData(STORAGE_KEYS.COURSE_PROGRESS);
    const now = new Date().toISOString();
    const completed = progress === 100;
    
    const existingProgressIndex = courseProgress.findIndex(
      (cp: CourseProgress) => cp.userId === userId && cp.courseId === courseId
    );
    
    if (existingProgressIndex >= 0) {
      courseProgress[existingProgressIndex] = {
        ...courseProgress[existingProgressIndex],
        progress,
        completed,
        lastAccessed: now
      };
      saveDemoData(STORAGE_KEYS.COURSE_PROGRESS, courseProgress);
      return courseProgress[existingProgressIndex];
    } else {
      const newProgress: CourseProgress = {
        userId,
        courseId,
        progress,
        completed,
        lastAccessed: now,
      };
      courseProgress.push(newProgress);
      saveDemoData(STORAGE_KEYS.COURSE_PROGRESS, courseProgress);
      return newProgress;
    }
  }
}

// Additional functions for notifications and questions can be implemented similarly
