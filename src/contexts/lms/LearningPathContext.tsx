
import { createContext, useContext, useState, ReactNode } from "react";
import { LearningPath } from "../../types";
import { mockLearningPaths } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";

interface LearningPathContextType {
  learningPaths: LearningPath[];
  getLearningPath: (id: string) => LearningPath | undefined;
  addLearningPath: (learningPath: Omit<LearningPath, "id" | "createdAt" | "updatedAt">) => void;
  updateLearningPath: (id: string, updates: Partial<LearningPath>) => void;
  deleteLearningPath: (id: string) => void;
}

const LearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

export const LearningPathProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(mockLearningPaths);

  const getLearningPath = (id: string) => learningPaths.find(path => path.id === id);

  const addLearningPath = (learningPath: Omit<LearningPath, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    
    const newLearningPath: LearningPath = {
      ...learningPath,
      id: `path${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setLearningPaths([...learningPaths, newLearningPath]);
    toast.success("Learning path created successfully!");
  };

  const updateLearningPath = (id: string, updates: Partial<LearningPath>) => {
    setLearningPaths(paths => 
      paths.map(path => 
        path.id === id ? { ...path, ...updates, updatedAt: new Date().toISOString() } : path
      )
    );
    toast.success("Learning path updated successfully!");
  };

  const deleteLearningPath = (id: string) => {
    setLearningPaths(paths => paths.filter(path => path.id !== id));
    toast.success("Learning path deleted successfully!");
  };

  const value = {
    learningPaths,
    getLearningPath,
    addLearningPath,
    updateLearningPath,
    deleteLearningPath,
  };

  return <LearningPathContext.Provider value={value}>{children}</LearningPathContext.Provider>;
};

export const useLearningPaths = () => {
  const context = useContext(LearningPathContext);
  if (context === undefined) {
    throw new Error("useLearningPaths must be used within a LearningPathProvider");
  }
  return context;
};
