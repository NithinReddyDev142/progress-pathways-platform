
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";
import { toast } from "sonner";
import apiClient from "../services/apiClient";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (username: string, email: string, password: string, role: UserRole) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'lms-auth-token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for saved token and load user data
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (token) {
        try {
          // Set auth header
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get current user
          const response = await apiClient.get('/auth/me');
          
          if (response.data?.data) {
            const userData = response.data.data;
            
            // Map MongoDB _id to our id field
            const userWithId: User = {
              id: userData._id,
              username: userData.username,
              email: userData.email,
              role: userData.role,
              avatar: userData.avatar,
              createdAt: userData.createdAt,
              lastLogin: userData.lastLogin
            };
            
            setUser(userWithId);
            setIsAuthenticated(true);
            setRole(userData.role as UserRole);
          }
        } catch (error) {
          console.error("Failed to load user:", error);
          localStorage.removeItem(TOKEN_KEY);
          apiClient.defaults.headers.common['Authorization'] = '';
        }
      }
      
      setLoading(false);
    };
    
    loadUser();
    
    // Initialize API health check
    const checkApiHealth = async () => {
      try {
        await apiClient.get('/status');
        console.log("API connection established");
      } catch (error) {
        console.warn("API connection failed");
        toast.error("Could not connect to the server. Some features may not work.");
      }
    };
    
    checkApiHealth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return false;
    }

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.data?.success && response.data?.token && response.data?.user) {
        // Save token
        localStorage.setItem(TOKEN_KEY, response.data.token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        const userData = response.data.user;
        
        // Map MongoDB _id to our id field
        const userWithId: User = {
          id: userData._id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin
        };
        
        setUser(userWithId);
        setIsAuthenticated(true);
        setRole(userData.role as UserRole);
        
        toast.success(`Welcome back, ${userData.username}!`);
        return true;
      } else {
        toast.error(response.data?.message || "Login failed");
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "An error occurred during login");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem(TOKEN_KEY);
    apiClient.defaults.headers.common['Authorization'] = '';
    toast.info("You have been logged out");
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    // Simple validation
    if (!username || !email || !password) {
      toast.error("All fields are required");
      return false;
    }

    try {
      const response = await apiClient.post('/auth/register', { 
        username, 
        email, 
        password, 
        role 
      });
      
      if (response.data?.success && response.data?.token && response.data?.user) {
        // Save token
        localStorage.setItem(TOKEN_KEY, response.data.token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        const userData = response.data.user;
        
        // Map MongoDB _id to our id field
        const userWithId: User = {
          id: userData._id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin
        };
        
        setUser(userWithId);
        setIsAuthenticated(true);
        setRole(userData.role as UserRole);
        
        toast.success("Account created successfully!");
        return true;
      } else {
        toast.error(response.data?.message || "Registration failed");
        return false;
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "An error occurred during signup");
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    role,
    login,
    logout,
    signup,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
