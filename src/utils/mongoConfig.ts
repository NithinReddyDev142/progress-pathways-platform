
// MongoDB configuration with environment support

// Get MongoDB connection string from environment or use default
const getMongoUri = (): string => {
  const defaultUri = 'mongodb://localhost:27017/lms';
  
  // Try to get from environment
  if (import.meta.env.VITE_MONGODB_URI) {
    return import.meta.env.VITE_MONGODB_URI;
  }
  
  console.warn('Using default MongoDB connection string. Set VITE_MONGODB_URI for custom connection.');
  return defaultUri;
};

// Export configuration
export const mongoConfig = {
  uri: getMongoUri(),
  dbName: import.meta.env.VITE_MONGODB_DB_NAME || 'lms',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
