
import { 
  getAllCourses, 
  getCourseById, 
  createCourse as dbCreateCourse, 
  updateCourse as dbUpdateCourse,
  deleteCourse as dbDeleteCourse
} from "./dbService";
import { getDb } from "../utils/mongoClient";
import { 
  Course, 
  LearningPath, 
  CourseProgress, 
  Notification, 
  Question 
} from "../types";

const COLLECTIONS = {
  LEARNING_PATHS: "learningPaths",
  COURSE_PROGRESS: "courseProgress",
  NOTIFICATIONS: "notifications",
  QUESTIONS: "questions",
};

// Course operations
export const fetchAllCourses = getAllCourses;
export const fetchCourseById = getCourseById;

export const createCourse = async (course: Omit<Course, "id" | "createdAt" | "updatedAt" | "status">) => {
  return await dbCreateCourse({
    ...course,
    status: "draft"
  });
};

export const updateCourse = dbUpdateCourse;
export const deleteCourse = dbDeleteCourse;

// Learning Path operations
export async function fetchAllLearningPaths(): Promise<LearningPath[]> {
  const db = getDb();
  return db.collection(COLLECTIONS.LEARNING_PATHS).find().toArray() as Promise<LearningPath[]>;
}

export async function fetchLearningPathById(id: string): Promise<LearningPath | null> {
  const db = getDb();
  return db.collection(COLLECTIONS.LEARNING_PATHS).findOne({ id }) as Promise<LearningPath | null>;
}

export async function createLearningPath(learningPath: Omit<LearningPath, "id" | "createdAt" | "updatedAt">): Promise<LearningPath> {
  const db = getDb();
  const now = new Date().toISOString();
  const newLearningPath = {
    ...learningPath,
    id: `path${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  
  await db.collection(COLLECTIONS.LEARNING_PATHS).insertOne(newLearningPath);
  return newLearningPath as LearningPath;
}

export async function updateLearningPath(id: string, updates: Partial<LearningPath>): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.LEARNING_PATHS).updateOne(
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

export async function deleteLearningPath(id: string): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(COLLECTIONS.LEARNING_PATHS).deleteOne({ id });
  return result.deletedCount > 0;
}

// Course progress operations
export async function fetchUserCourseProgress(userId: string, courseId: string): Promise<CourseProgress | null> {
  const db = getDb();
  return db.collection(COLLECTIONS.COURSE_PROGRESS).findOne({ 
    userId, 
    courseId 
  }) as Promise<CourseProgress | null>;
}

export async function updateUserCourseProgress(
  userId: string, 
  courseId: string, 
  progress: number
): Promise<CourseProgress> {
  const db = getDb();
  const now = new Date().toISOString();
  const completed = progress === 100;
  
  const existingProgress = await fetchUserCourseProgress(userId, courseId);
  
  if (existingProgress) {
    await db.collection(COLLECTIONS.COURSE_PROGRESS).updateOne(
      { userId, courseId },
      { $set: { progress, completed, lastAccessed: now } }
    );
    
    return {
      ...existingProgress,
      progress,
      completed,
      lastAccessed: now
    };
  } else {
    const newProgress: CourseProgress = {
      userId,
      courseId,
      progress,
      completed,
      lastAccessed: now,
    };
    
    await db.collection(COLLECTIONS.COURSE_PROGRESS).insertOne(newProgress);
    return newProgress;
  }
}

// Additional functions for notifications and questions can be implemented similarly
