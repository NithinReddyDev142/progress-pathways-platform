
import { MongoClient } from 'mongodb';
import { mongoConfig } from './mongoConfig';
import config from './envConfig';

let client: MongoClient | null = null;

export const connectToMongo = async () => {
  try {
    if (!client) {
      client = new MongoClient(mongoConfig.uri);
      await client.connect();
      console.log('Connected to MongoDB');
    }
    return client.db(mongoConfig.dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const closeMongoConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    console.log('MongoDB connection closed');
  }
};
