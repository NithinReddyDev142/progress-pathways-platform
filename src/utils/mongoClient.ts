
// This is now a mock implementation for frontend use
// The real MongoDB connection will happen on the server

import { mongoConfig } from "./mongoConfig";

// Mock client for frontend
const client = {
  connect: async () => {
    console.log("Mock MongoDB connection established");
    return client;
  },
  db: (name: string) => {
    console.log(`Mock database ${name} accessed`);
    return mockDb;
  },
  close: async () => {
    console.log("Mock MongoDB connection closed");
  }
};

// Mock database operations
const mockDb = {
  collection: (name: string) => ({
    find: () => ({
      toArray: async () => {
        console.log(`Mock find operation on ${name} collection`);
        return [];
      }
    }),
    findOne: async () => {
      console.log(`Mock findOne operation on ${name} collection`);
      return null;
    },
    insertOne: async () => {
      console.log(`Mock insertOne operation on ${name} collection`);
      return { acknowledged: true, insertedId: 'mock-id' };
    },
    insertMany: async () => {
      console.log(`Mock insertMany operation on ${name} collection`);
      return { acknowledged: true, insertedIds: ['mock-id-1', 'mock-id-2'] };
    },
    updateOne: async () => {
      console.log(`Mock updateOne operation on ${name} collection`);
      return { acknowledged: true, modifiedCount: 1 };
    },
    deleteOne: async () => {
      console.log(`Mock deleteOne operation on ${name} collection`);
      return { acknowledged: true, deletedCount: 1 };
    },
    countDocuments: async () => {
      console.log(`Mock countDocuments operation on ${name} collection`);
      return 0;
    },
    createCollection: async () => {
      console.log(`Mock createCollection operation for ${name}`);
      return true;
    }
  }),
  createCollection: async (name: string) => {
    console.log(`Mock createCollection operation for ${name}`);
    return true;
  }
};

export async function connectToMongo() {
  try {
    // In a browser environment, we'll return the mock client
    console.log("Creating mock MongoDB connection (frontend environment)");
    return client;
  } catch (error) {
    console.error("Failed to create mock MongoDB connection", error);
    throw error;
  }
}

// Get database instance
export function getDb() {
  return client.db(mongoConfig.dbName);
}

// Function to close the connection
export async function closeMongoConnection() {
  try {
    await client.close();
    console.log("Mock MongoDB connection closed");
  } catch (error) {
    console.error("Error closing mock MongoDB connection", error);
  }
}
