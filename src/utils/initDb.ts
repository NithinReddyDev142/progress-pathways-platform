
import { connectToMongo, closeMongoConnection } from './mongoClient';

export const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    const db = await connectToMongo();
    
    if (!db) {
      console.error('Failed to connect to database');
      return;
    }
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    await closeMongoConnection();
  }
};
