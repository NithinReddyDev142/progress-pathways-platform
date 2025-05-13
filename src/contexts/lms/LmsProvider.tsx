
import { ReactNode } from "react";
import { CourseProvider } from "./CourseContext";
import { LearningPathProvider } from "./LearningPathContext";
import { ProgressProvider } from "./ProgressContext";
import { NotificationProvider } from "./NotificationContext";
import { QuestionProvider } from "./QuestionContext";

interface LmsProviderProps {
  children: ReactNode;
}

// This is a composite provider that wraps all the domain-specific providers
export const LmsProvider = ({ children }: LmsProviderProps) => {
  return (
    <CourseProvider>
      <LearningPathProvider>
        <ProgressProvider>
          <NotificationProvider>
            <QuestionProvider>
              {children}
            </QuestionProvider>
          </NotificationProvider>
        </ProgressProvider>
      </LearningPathProvider>
    </CourseProvider>
  );
};
