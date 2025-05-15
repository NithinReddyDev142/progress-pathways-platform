
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export type CourseType = 'pdf' | 'video' | 'link';

export type CourseStatus = 'draft' | 'published' | 'archived';

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  type: CourseType;
  content: string;
  techStack: string[];
  instructorId: string;
  instructorName: string;
  thumbnail?: string;
  duration?: number;
  difficulty?: CourseDifficulty;
  rating?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  status: CourseStatus;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[]; // Course IDs
  createdBy: string; // Instructor ID
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  progress: number; // 0-100
  completed: boolean;
  lastAccessed: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  from: string;
  to: string;
  read: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  question: string;
  answer?: string;
  createdAt: string;
  answeredAt?: string;
}
