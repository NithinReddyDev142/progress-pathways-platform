
import { useState, useEffect } from "react";
import { Question } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { questionService } from "@/services/questionService";
import { format } from "date-fns";

interface QuestionListProps {
  questions: Question[];
  onAnswerSubmit?: () => void;
}

const QuestionList = ({ questions, onAnswerSubmit }: QuestionListProps) => {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
  const handleAnswerSubmit = async (questionId: string) => {
    const answer = answers[questionId];
    
    if (!answer || !answer.trim()) {
      return;
    }
    
    setSubmitting((prev) => ({
      ...prev,
      [questionId]: true,
    }));
    
    try {
      await questionService.answerQuestion(questionId, answer);
      
      // Clear the answer field
      setAnswers((prev) => ({
        ...prev,
        [questionId]: "",
      }));
      
      if (onAnswerSubmit) {
        onAnswerSubmit();
      }
    } catch (error) {
      console.error(`Error submitting answer for question ${questionId}:`, error);
    } finally {
      setSubmitting((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "PPp");
    } catch (error) {
      return dateString;
    }
  };
  
  const isTeacher = user?.role === "teacher";
  
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">No questions yet</p>
            {user?.role === "student" && (
              <p className="mt-2">
                Feel free to ask your first question about this course.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-medium text-base">
                  {question.question}
                </CardTitle>
                <CardDescription>
                  By {question.studentName} • {formatDate(question.createdAt)}
                </CardDescription>
              </div>
              <div className="px-2 py-1 bg-slate-100 text-xs rounded">
                {!question.answer ? "Unanswered" : "Answered"}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {question.answer ? (
              <div className="bg-slate-50 p-3 rounded-md mt-2">
                <p className="font-medium">Answer:</p>
                <p className="mt-1">{question.answer}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Answered {formatDate(question.answeredAt)}
                </p>
              </div>
            ) : isTeacher && user?.id === question.teacherId ? (
              <div className="mt-3">
                <Textarea
                  placeholder="Type your answer here..."
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={() => handleAnswerSubmit(question.id)}
                    disabled={submitting[question.id] || !answers[question.id]?.trim()}
                  >
                    {submitting[question.id] ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-3 rounded-md mt-2">
                <p className="italic text-muted-foreground">
                  This question hasn't been answered yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionList;
