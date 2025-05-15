
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Course, CourseStatus } from "../../types";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import courseService from "../../services/courseService";

interface CourseContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  getCourse: (id: string) => Course | undefined;
  addCourse: (course: Omit<Course, "id" | "createdAt" | "updatedAt" | "instructorId" | "instructorName">) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const fetchedCourses = await courseService.getAllCourses();
        setCourses(fetchedCourses);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses');
        toast.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getCourse = (id: string) => courses.find(course => course.id === id);

  const addCourse = async (course: Omit<Course, "id" | "createdAt" | "updatedAt" | "instructorId" | "instructorName">) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const newCourse = await courseService.createCourse(course);
      
      if (newCourse) {
        setCourses(prevCourses => [...prevCourses, newCourse]);
        toast.success("Course created successfully!");
      }
    } catch (err) {
      console.error('Error creating course:', err);
      toast.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      setLoading(true);
      const updated = await courseService.updateCourse(id, updates);
      
      if (updated) {
        setCourses(courses.map(course => 
          course.id === id ? { ...course, ...updates, updatedAt: new Date().toISOString() } : course
        ));
        toast.success("Course updated successfully!");
      }
    } catch (err) {
      console.error('Error updating course:', err);
      toast.error('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      setLoading(true);
      const deleted = await courseService.deleteCourse(id);
      
      if (deleted) {
        setCourses(courses.filter(course => course.id !== id));
        toast.success("Course deleted successfully!");
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      toast.error('Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    courses,
    loading,
    error,
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
