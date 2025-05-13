
import { createContext, useContext, useState, ReactNode } from "react";
import { Course, CourseStatus } from "../../types";
import { mockCourses } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";

interface CourseContextType {
  courses: Course[];
  getCourse: (id: string) => Course | undefined;
  addCourse: (course: Omit<Course, "id" | "createdAt" | "updatedAt" | "status">) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  const getCourse = (id: string) => courses.find(course => course.id === id);

  const addCourse = (course: Omit<Course, "id" | "createdAt" | "updatedAt" | "status">) => {
    if (!user) return;
    
    const newCourse: Course = {
      ...course,
      id: `course${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft"
    };
    
    setCourses([...courses, newCourse]);
    toast.success("Course created successfully!");
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...updates, updatedAt: new Date().toISOString() } : course
    ));
    toast.success("Course updated successfully!");
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast.success("Course deleted successfully!");
  };

  const value = {
    courses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
