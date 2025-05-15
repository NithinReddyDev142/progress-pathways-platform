
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questionService } from "@/services/questionService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface QuestionFormProps {
  courseId: string;
  onQuestionSubmit?: () => void;
}

const QuestionForm = ({ courseId, onQuestionSubmit }: QuestionFormProps) => {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Please enter your question");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await questionService.askQuestion(courseId, question);
      setQuestion("");
      if (onQuestionSubmit) {
        onQuestionSubmit();
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Only students can ask questions
  if (user?.role !== "student") {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mb-4"
            rows={4}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
