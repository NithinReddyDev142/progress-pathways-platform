
import { MongoClient, Db } from 'mongodb';
import { config } from './envConfig';

let client: MongoClient;
let db: Db;

/**
 * Initialize MongoDB connection
 */
export async function connectToMongo(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI || config.mongoUri || 'mongodb://localhost:27017/lms';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME || config.mongoDbName || 'lms');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Get MongoDB database instance
 */
export function getDb(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongo first.');
  }
  return db;
}

/**
 * Close MongoDB connection
 */
export async function closeMongo(): Promise<void> {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
