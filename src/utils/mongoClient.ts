
import { MongoClient, Db } from 'mongodb';
import { mongoConfig } from './mongoConfig';
import * as envConfig from './envConfig';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToMongo = async (): Promise<Db> => {
  try {
    if (!client) {
      client = new MongoClient(mongoConfig.uri);
      await client.connect();
      console.log('Connected to MongoDB');
      db = client.db(mongoConfig.dbName);
    }
    return db!;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongo first.');
  }
  return db;
};

export const closeMongoConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};
