
import { MongoClient, ServerApiVersion } from "mongodb";
import { mongoConfig } from "./mongoConfig";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoConfig.uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectToMongo() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB successfully");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
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
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection", error);
  }
}
