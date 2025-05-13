
import { createContext, useContext, useState, ReactNode } from "react";
import { Question } from "../../types";
import { mockQuestions } from "../../data/mockData";
import { toast } from "sonner";

interface QuestionContextType {
  questions: Question[];
  getUserQuestions: (userId: string) => Question[];
  getCourseQuestions: (courseId: string) => Question[];
  askQuestion: (question: Omit<Question, "id" | "createdAt" | "answeredAt">) => void;
  answerQuestion: (id: string, answer: string) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);

  const getUserQuestions = (userId: string) => 
    questions.filter(q => q.studentId === userId || q.teacherId === userId);

  const getCourseQuestions = (courseId: string) => 
    questions.filter(q => q.courseId === courseId);

  const askQuestion = (question: Omit<Question, "id" | "createdAt" | "answeredAt">) => {
    const newQuestion: Question = {
      ...question,
      id: `q${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setQuestions([...questions, newQuestion]);
    toast.success("Question submitted successfully!");
  };

  const answerQuestion = (id: string, answer: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, answer, answeredAt: new Date().toISOString() } : q
    ));
    toast.success("Answer submitted!");
  };

  const value = {
    questions,
    getUserQuestions,
    getCourseQuestions,
    askQuestion,
    answerQuestion,
  };

  return <QuestionContext.Provider value={value}>{children}</QuestionContext.Provider>;
};

export const useQuestions = () => {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error("useQuestions must be used within a QuestionProvider");
  }
  return context;
};
