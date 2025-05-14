
// Environment configuration utility for frontend

// Default development values
const defaultConfig = {
  API_URL: 'http://localhost:5000/api',
  NODE_ENV: 'development',
};

// Environment variables from Vite (if available)
const envConfig = {
  API_URL: import.meta.env.VITE_API_URL || defaultConfig.API_URL,
  NODE_ENV: import.meta.env.MODE || defaultConfig.NODE_ENV,
};

export const config = {
  apiUrl: envConfig.API_URL,
  isDevelopment: envConfig.NODE_ENV === 'development',
  isProduction: envConfig.NODE_ENV === 'production',
};

// Log the current environment (only in development)
if (envConfig.NODE_ENV === 'development') {
  console.log('Environment Config:', {
    ...envConfig,
    config,
  });
}
