
// MongoDB configuration
export const mongoConfig = {
  uri: import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/lms',
  dbName: import.meta.env.VITE_MONGODB_DB_NAME || 'lms',
};
