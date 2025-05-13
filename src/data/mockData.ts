
import { User, Course, CourseProgress, Notification, Question, LearningPath } from "../types";

export const mockUsers: User[] = [
  {
    id: "admin1",
    username: "admin",
    email: "admin@edulearn.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    createdAt: "2023-01-01T00:00:00.000Z",
    lastLogin: "2023-05-13T10:30:00.000Z",
  },
  {
    id: "teacher1",
    username: "janesmith",
    email: "jane.smith@edulearn.com",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    createdAt: "2023-01-10T00:00:00.000Z",
    lastLogin: "2023-05-12T09:15:00.000Z",
  },
  {
    id: "teacher2",
    username: "robertjohnson",
    email: "robert.johnson@edulearn.com",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    createdAt: "2023-02-05T00:00:00.000Z",
    lastLogin: "2023-05-11T14:20:00.000Z",
  },
  {
    id: "student1",
    username: "alexwilson",
    email: "alex.wilson@edulearn.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    createdAt: "2023-02-15T00:00:00.000Z",
    lastLogin: "2023-05-13T08:45:00.000Z",
  },
  {
    id: "student2",
    username: "sarahmiller",
    email: "sarah.miller@edulearn.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    createdAt: "2023-03-01T00:00:00.000Z",
    lastLogin: "2023-05-12T16:30:00.000Z",
  },
];

export const mockCourses: Course[] = [
  {
    id: "course1",
    title: "Introduction to React.js",
    description: "Learn the fundamentals of React.js, a popular JavaScript library for building user interfaces.",
    type: "video",
    content: "https://example.com/courses/react-intro",
    techStack: ["React", "JavaScript", "Frontend"],
    instructorId: "teacher1",
    instructorName: "Jane Smith",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    createdAt: "2023-01-15T00:00:00.000Z",
    updatedAt: "2023-04-10T00:00:00.000Z",
    deadline: "2023-06-30T23:59:59.000Z",
    status: "published",
  },
  {
    id: "course2",
    title: "Python for Data Science",
    description: "Master Python programming for data analysis and visualization.",
    type: "pdf",
    content: "https://example.com/courses/python-data-science",
    techStack: ["Python", "Data Science", "Machine Learning"],
    instructorId: "teacher2",
    instructorName: "Robert Johnson",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    createdAt: "2023-02-20T00:00:00.000Z",
    updatedAt: "2023-04-15T00:00:00.000Z",
    deadline: "2023-07-15T23:59:59.000Z",
    status: "published",
  },
  {
    id: "course3",
    title: "Full Stack Web Development",
    description: "Learn to build complete web applications from front to back end.",
    type: "link",
    content: "https://example.com/courses/fullstack",
    techStack: ["JavaScript", "Node.js", "Express", "MongoDB", "React"],
    instructorId: "teacher1",
    instructorName: "Jane Smith",
    thumbnail: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    createdAt: "2023-03-05T00:00:00.000Z",
    updatedAt: "2023-04-20T00:00:00.000Z",
    deadline: "2023-08-01T23:59:59.000Z",
    status: "published",
  },
];

export const mockLearningPaths: LearningPath[] = [
  {
    id: "path1",
    title: "Frontend Developer Path",
    description: "Complete path to becoming a frontend developer",
    courses: ["course1", "course3"],
    createdBy: "teacher1",
    createdAt: "2023-01-20T00:00:00.000Z",
    updatedAt: "2023-04-15T00:00:00.000Z",
  },
  {
    id: "path2",
    title: "Data Science Specialization",
    description: "Learn data science from basics to advanced topics",
    courses: ["course2"],
    createdBy: "teacher2",
    createdAt: "2023-02-25T00:00:00.000Z",
    updatedAt: "2023-04-20T00:00:00.000Z",
  },
];

export const mockCourseProgress: CourseProgress[] = [
  {
    courseId: "course1",
    userId: "student1",
    progress: 75,
    completed: false,
    lastAccessed: "2023-05-12T10:15:00.000Z",
  },
  {
    courseId: "course2",
    userId: "student1",
    progress: 30,
    completed: false,
    lastAccessed: "2023-05-10T14:20:00.000Z",
  },
  {
    courseId: "course1",
    userId: "student2",
    progress: 100,
    completed: true,
    lastAccessed: "2023-05-08T09:30:00.000Z",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif1",
    title: "New Course Available",
    message: "Check out the new course: Introduction to React.js",
    from: "teacher1",
    to: "student1",
    read: false,
    createdAt: "2023-05-10T08:00:00.000Z",
  },
  {
    id: "notif2",
    title: "Deadline Reminder",
    message: "The Python for Data Science course deadline is approaching.",
    from: "teacher2",
    to: "student1",
    read: true,
    createdAt: "2023-05-09T10:30:00.000Z",
  },
];

export const mockQuestions: Question[] = [
  {
    id: "q1",
    courseId: "course1",
    studentId: "student1",
    studentName: "Alex Wilson",
    teacherId: "teacher1",
    question: "How do hooks work in React?",
    answer: "Hooks are functions that let you 'hook into' React state and lifecycle features from function components.",
    createdAt: "2023-05-08T15:20:00.000Z",
    answeredAt: "2023-05-09T09:15:00.000Z",
  },
  {
    id: "q2",
    courseId: "course2",
    studentId: "student2",
    studentName: "Sarah Miller",
    teacherId: "teacher2",
    question: "What's the difference between NumPy and Pandas?",
    createdAt: "2023-05-11T11:40:00.000Z",
  },
];
