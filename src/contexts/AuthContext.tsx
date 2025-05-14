
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("lms-user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
        setRole(parsedUser.role);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("lms-user");
      }
    }
    
    // Initialize API health check
    const checkApiHealth = async () => {
      try {
        await apiClient.get('/status');
        console.log("API connection established");
      } catch (error) {
        console.warn("API connection failed, using mock data");
        // The API client will handle toast messages
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
      // In a real implementation, this would call the backend API
      // For now, we'll use a simpler approach for demo purposes
      const response = await apiClient.post('/auth/login', { email, password })
        .catch(error => {
          // For development/demo, fall back to local mock if API fails
          console.log("Using local auth fallback due to API error", error);
          return { data: null };
        });
      
      // If API returned a user
      if (response.data?.user) {
        const loggedInUser = response.data.user;
        setUser(loggedInUser);
        setIsAuthenticated(true);
        setRole(loggedInUser.role);
        localStorage.setItem("lms-user", JSON.stringify(loggedInUser));
        toast.success(`Welcome back, ${loggedInUser.username}!`);
        return true;
      }
      
      // Demo fallback - find a user with matching email in mock data
      // In real app, this would be removed once the API is working
      const savedUsers = localStorage.getItem("demo-users");
      let users = [];
      
      if (savedUsers) {
        users = JSON.parse(savedUsers);
      } else {
        // Default users for demo
        users = [
          {
            id: "user1",
            username: "admin",
            email: "admin@example.com",
            role: "admin",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          },
          {
            id: "user2",
            username: "teacher",
            email: "teacher@example.com",
            role: "teacher",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          },
          {
            id: "user3",
            username: "student",
            email: "student@example.com",
            role: "student",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          }
        ];
        localStorage.setItem("demo-users", JSON.stringify(users));
      }
      
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser) {
        // In a real app, you would check the password hash here
        
        // Update last login
        const updatedUser = {
          ...foundUser,
          lastLogin: new Date().toISOString(),
        };
        
        // Save to state and localStorage
        setUser(updatedUser);
        setIsAuthenticated(true);
        setRole(updatedUser.role);
        localStorage.setItem("lms-user", JSON.stringify(updatedUser));
        
        toast.success(`Welcome back, ${updatedUser.username}!`);
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("lms-user");
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
      // In a real implementation, this would call the backend API
      const response = await apiClient.post('/auth/signup', { username, email, password, role })
        .catch(error => {
          // For development/demo, fall back to local mock if API fails
          console.log("Using local auth fallback due to API error", error);
          return { data: null };
        });
      
      // If API returned a user
      if (response.data?.user) {
        const newUser = response.data.user;
        setUser(newUser);
        setIsAuthenticated(true);
        setRole(newUser.role);
        localStorage.setItem("lms-user", JSON.stringify(newUser));
        toast.success("Account created successfully!");
        return true;
      }
      
      // Demo fallback - create a user locally
      const savedUsers = localStorage.getItem("demo-users");
      let users = [];
      
      if (savedUsers) {
        users = JSON.parse(savedUsers);
        
        // Check if email already exists
        const existingUser = users.find((u: any) => u.email === email);
        if (existingUser) {
          toast.error("Email already in use");
          return false;
        }
      } else {
        // Initialize with default users
        users = [
          {
            id: "user1",
            username: "admin",
            email: "admin@example.com",
            role: "admin",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          }
        ];
      }
      
      // Create new user
      const newUser = {
        id: `user${Date.now()}`,
        username,
        email,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      // Add to local storage
      users.push(newUser);
      localStorage.setItem("demo-users", JSON.stringify(users));
      
      // Update state
      setUser(newUser);
      setIsAuthenticated(true);
      setRole(newUser.role);
      localStorage.setItem("lms-user", JSON.stringify(newUser));
      
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
