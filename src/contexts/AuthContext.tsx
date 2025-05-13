
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";
import { toast } from "sonner";
import { findUserByEmail, createUser, updateUser } from "../services/dbService";
import { connectToMongo, closeMongoConnection } from "../utils/mongoClient";

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
    // Initialize MongoDB connection
    const initMongo = async () => {
      try {
        await connectToMongo();
      } catch (error) {
        console.error("Failed to initialize MongoDB connection:", error);
        toast.error("Failed to connect to database. Using local storage instead.");
      }
    };

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
    
    initMongo();

    // Clean up MongoDB connection on unmount
    return () => {
      closeMongoConnection().catch(console.error);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return false;
    }

    try {
      // Find user in MongoDB by email
      const foundUser = await findUserByEmail(email);
      
      if (foundUser) {
        // In a real app, you would check the password hash here
        
        // Update last login
        const updatedUser = {
          ...foundUser,
          lastLogin: new Date().toISOString(),
        };
        
        // Update in MongoDB
        await updateUser(foundUser.id, { lastLogin: updatedUser.lastLogin });
        
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
      // Check if email already exists
      const existingUser = await findUserByEmail(email);

      if (existingUser) {
        toast.error("Email already in use");
        return false;
      }

      // Create a new user in MongoDB
      const newUser = await createUser({
        username,
        email,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });

      // Save to state and localStorage
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
