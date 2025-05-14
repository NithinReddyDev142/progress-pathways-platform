
import { connectToMongo, closeMongoConnection } from "./mongoClient";
import { mockUsers, mockCourses, mockLearningPaths, mockCourseProgress, mockNotifications, mockQuestions } from "../data/mockData";

async function initializeDatabase() {
  try {
    const client = await connectToMongo();
    const db = client.db();
    
    console.log("Starting database initialization...");
    
    // Create collections if they don't exist
    await db.createCollection("users");
    await db.createCollection("courses");
    await db.createCollection("learningPaths");
    await db.createCollection("courseProgress");
    await db.createCollection("notifications");
    await db.createCollection("questions");
    
    // Insert mock data if collections are empty
    const usersCount = await db.collection("users").countDocuments();
    if (usersCount === 0) {
      console.log("Adding mock users...");
      await db.collection("users").insertMany(mockUsers);
    }
    
    const coursesCount = await db.collection("courses").countDocuments();
    if (coursesCount === 0) {
      console.log("Adding mock courses...");
      await db.collection("courses").insertMany(mockCourses);
    }
    
    const learningPathsCount = await db.collection("learningPaths").countDocuments();
    if (learningPathsCount === 0) {
      console.log("Adding mock learning paths...");
      await db.collection("learningPaths").insertMany(mockLearningPaths);
    }
    
    const courseProgressCount = await db.collection("courseProgress").countDocuments();
    if (courseProgressCount === 0) {
      console.log("Adding mock course progress...");
      await db.collection("courseProgress").insertMany(mockCourseProgress);
    }
    
    const notificationsCount = await db.collection("notifications").countDocuments();
    if (notificationsCount === 0) {
      console.log("Adding mock notifications...");
      await db.collection("notifications").insertMany(mockNotifications);
    }
    
    const questionsCount = await db.collection("questions").countDocuments();
    if (questionsCount === 0) {
      console.log("Adding mock questions...");
      await db.collection("questions").insertMany(mockQuestions);
    }
    
    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    await closeMongoConnection();
  }
}

// Expose function to initialize database
export default initializeDatabase;
