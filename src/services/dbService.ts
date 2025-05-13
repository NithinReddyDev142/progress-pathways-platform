
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
  return db.collection(COLLECTIONS.USERS).findOne({ email: email.toLowerCase() }) as Promise<User | null>;
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

// Course operations
export async function getAllCourses(): Promise<Course[]> {
  const db = getDb();
  return db.collection(COLLECTIONS.COURSES).find().toArray() as Promise<Course[]>;
}

export async function getCourseById(id: string): Promise<Course | null> {
  const db = getDb();
  return db.collection(COLLECTIONS.COURSES).findOne({ id }) as Promise<Course | null>;
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

// Learning path operations
export async function getAllLearningPaths(): Promise<LearningPath[]> {
  const db = getDb();
  return db.collection(COLLECTIONS.LEARNING_PATHS).find().toArray() as Promise<LearningPath[]>;
}

export async function getLearningPathById(id: string): Promise<LearningPath | null> {
  const db = getDb();
  return db.collection(COLLECTIONS.LEARNING_PATHS).findOne({ id }) as Promise<LearningPath | null>;
}

// More services can be added as needed for other collections
