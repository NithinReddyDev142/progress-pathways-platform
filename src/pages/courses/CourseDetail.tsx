
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "@/contexts/lms/CourseContext";
import { useProgress } from "@/contexts/lms/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, Calendar, CheckCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCourse, courses, loading } = useCourses();
  const { user } = useAuth();
  const { updateCourseProgress, getUserCourseProgress } = useProgress();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const course = id ? getCourse(id) : undefined;

  useEffect(() => {
    if (!course) return;
    if (!user) return;

    const progress = getUserCourseProgress(user.id, course.id);
    if (progress) {
      setUserProgress(progress.progress);
      setCompleted(progress.completed);
    }
  }, [course, user, getUserCourseProgress]);

  const handleStartCourse = async () => {
    if (!user || !course) return;

    try {
      await updateCourseProgress(user.id, course.id, userProgress > 0 ? userProgress : 10);
      setUserProgress(prev => prev > 0 ? prev : 10);
      toast.success("You've started the course!");
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const handleContinueCourse = async () => {
    if (!user || !course) return;

    try {
      const newProgress = Math.min(userProgress + 20, 100);
      await updateCourseProgress(user.id, course.id, newProgress);
      setUserProgress(newProgress);
      
      if (newProgress === 100) {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <p>Loading course details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Course Not Found</CardTitle>
              <CardDescription>The course you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/courses")}>
                Back to Courses
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">
              By {course.instructorName} | Created {formatDate(course.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={course.status === "published" ? "default" : "outline"}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.thumbnail && (
                  <div className="mb-6">
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold">About This Course</h2>
                  <p className="mt-2">{course.description}</p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  <div className="mt-4 p-4 border rounded-md">
                    {course.type === "video" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          <span>Video Course</span>
                        </div>
                        <Button 
                          onClick={() => window.open(course.content, "_blank")}
                          variant="outline"
                        >
                          Watch Video
                        </Button>
                      </div>
                    )}

                    {course.type === "pdf" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          <span>PDF Document</span>
                        </div>
                        <Button
                          onClick={() => window.open(course.content, "_blank")}
                          variant="outline"
                        >
                          Open PDF
                        </Button>
                      </div>
                    )}

                    {course.type === "link" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          <span>External Resource</span>
                        </div>
                        <Button
                          onClick={() => window.open(course.content, "_blank")}
                          variant="outline"
                        >
                          Visit Link
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.techStack && course.techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {completed ? "Completed" : `${userProgress}% Complete`}
                    </span>
                  </div>
                  <Progress value={userProgress} className="h-2" />
                </div>

                <div className="space-y-2">
                  {userProgress === 0 && (
                    <Button onClick={handleStartCourse} className="w-full">
                      Start Course
                    </Button>
                  )}

                  {userProgress > 0 && userProgress < 100 && (
                    <Button onClick={handleContinueCourse} className="w-full">
                      Continue Learning
                    </Button>
                  )}

                  {completed && (
                    <div className="flex items-center justify-center gap-2 text-green-600 p-2 bg-green-50 rounded-md">
                      <CheckCircle className="h-5 w-5" />
                      <span>Course Completed!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration || 0} minutes</span>
                </div>

                {course.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Deadline: {formatDate(course.deadline)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetail;
