
import { config } from '../utils/envConfig';

const apiUrl = config.apiUrl;

/**
 * Generic API request helper with environment configuration
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiUrl}/${endpoint}`.replace(/([^:]\/)\/+/g, '$1');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Example API methods
export const api = {
  get: <T = any>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'GET' }),
    
  post: <T = any>(endpoint: string, data: any) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  put: <T = any>(endpoint: string, data: any) => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  delete: <T = any>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};
