
import { getDb } from "../utils/mongoClient";
import { 
  User, 
  Course, 
  LearningPath, 
  Notification, 
  Question, 
  CourseProgress 
} from "../types";

// Collection names
const COLLECTIONS = {
  USERS: "users",
  COURSES: "courses",
  LEARNING_PATHS: "learningPaths",
  NOTIFICATIONS: "notifications",
  QUESTIONS: "questions",
  COURSE_PROGRESS: "courseProgress",
};

// User operations
export async function findUserByEmail(email: string): Promise<User | null> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.USERS).findOne({ email: email.toLowerCase() });
  return result as unknown as User | null;
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  const db = getDb();
  const newUser = {
    ...user,
    id: `user${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  await db.collection(COLLECTIONS.USERS).insertOne(newUser);
  return newUser as User;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.USERS).updateOne(
    { id: userId },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

export async function findUserById(userId: string): Promise<User | null> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.USERS).findOne({ id: userId });
  return result as unknown as User | null;
}

export async function getAllUsers(): Promise<User[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.USERS).find().toArray();
  return results as unknown as User[];
}

// Course operations
export async function getAllCourses(): Promise<Course[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.COURSES).find().toArray();
  return results as unknown as Course[];
}

export async function getCourseById(id: string): Promise<Course | null> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.COURSES).findOne({ id });
  return result as unknown as Course | null;
}

export async function createCourse(course: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course> {
  const db = getDb();
  const now = new Date().toISOString();
  const newCourse = {
    ...course,
    id: `course${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  
  await db.collection(COLLECTIONS.COURSES).insertOne(newCourse);
  return newCourse as Course;
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.COURSES).updateOne(
    { id },
    { 
      $set: {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  );
  return result.modifiedCount > 0;
}

export async function deleteCourse(id: string): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.COURSES).deleteOne({ id });
  return result.deletedCount > 0;
}

export async function getCoursesByInstructorId(instructorId: string): Promise<Course[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.COURSES).find({ instructorId }).toArray();
  return results as unknown as Course[];
}

// Learning path operations
export async function getAllLearningPaths(): Promise<LearningPath[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.LEARNING_PATHS).find().toArray();
  return results as unknown as LearningPath[];
}

export async function getLearningPathById(id: string): Promise<LearningPath | null> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.LEARNING_PATHS).findOne({ id });
  return result as unknown as LearningPath | null;
}

// Course Progress operations
export async function getCourseProgressByUserId(userId: string): Promise<CourseProgress[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.COURSE_PROGRESS).find({ userId }).toArray();
  return results as unknown as CourseProgress[];
}

export async function getCourseProgressByCourseId(courseId: string): Promise<CourseProgress[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.COURSE_PROGRESS).find({ courseId }).toArray();
  return results as unknown as CourseProgress[];
}

export async function updateCourseProgress(
  userId: string, 
  courseId: string, 
  progress: number
): Promise<CourseProgress> {
  const db = getDb();
  const now = new Date().toISOString();
  const completed = progress >= 100;
  
  const courseProgress = {
    userId,
    courseId,
    progress,
    completed,
    lastAccessed: now
  };
  
  await db.collection(COLLECTIONS.COURSE_PROGRESS).updateOne(
    { userId, courseId },
    { $set: courseProgress },
    { upsert: true }
  );
  
  return courseProgress;
}

// Question operations
export async function getQuestionsByStudentId(studentId: string): Promise<Question[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.QUESTIONS).find({ studentId }).toArray();
  return results as unknown as Question[];
}

export async function getQuestionsByTeacherId(teacherId: string): Promise<Question[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.QUESTIONS).find({ teacherId }).toArray();
  return results as unknown as Question[];
}

export async function getQuestionsByCourseId(courseId: string): Promise<Question[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.QUESTIONS).find({ courseId }).toArray();
  return results as unknown as Question[];
}

export async function createQuestion(question: Omit<Question, "id" | "createdAt">): Promise<Question> {
  const db = getDb();
  const now = new Date().toISOString();
  const newQuestion = {
    ...question,
    id: `question${Date.now()}`,
    createdAt: now,
  };
  
  await db.collection(COLLECTIONS.QUESTIONS).insertOne(newQuestion);
  return newQuestion as Question;
}

export async function answerQuestion(id: string, answer: string): Promise<boolean> {
  const db = getDb();
  const now = new Date().toISOString();
  
  const result = await db.collection(COLLECTIONS.QUESTIONS).updateOne(
    { id },
    { 
      $set: { 
        answer,
        answeredAt: now
      } 
    }
  );
  
  return result.modifiedCount > 0;
}

// Notification operations
export async function getNotificationsByUserId(userId: string): Promise<Notification[]> {
  const db = getDb();
  const results = await db.collection(COLLECTIONS.NOTIFICATIONS).find({ 
    to: userId 
  }).sort({ createdAt: -1 }).toArray();
  
  return results as unknown as Notification[];
}

export async function createNotification(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
  const db = getDb();
  const now = new Date().toISOString();
  const newNotification = {
    ...notification,
    id: `notification${Date.now()}`,
    createdAt: now,
    read: false
  };
  
  await db.collection(COLLECTIONS.NOTIFICATIONS).insertOne(newNotification);
  return newNotification as Notification;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.NOTIFICATIONS).updateOne(
    { id },
    { $set: { read: true } }
  );
  
  return result.modifiedCount > 0;
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.NOTIFICATIONS).updateMany(
    { to: userId, read: false },
    { $set: { read: true } }
  );
  
  return result.modifiedCount > 0;
}
