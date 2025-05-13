
import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB connection string - replace with your actual MongoDB URI
const uri = "mongodb://localhost:27017/lms";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
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
  return client.db("lms");
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
