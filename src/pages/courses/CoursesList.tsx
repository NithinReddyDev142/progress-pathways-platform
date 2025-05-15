
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "@/contexts/lms/CourseContext";
import { useProgress } from "@/contexts/lms/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import MainLayout from "@/components/layout/MainLayout";

const CoursesList = () => {
  const { courses, loading } = useCourses();
  const { courseProgress } = useProgress();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  
  const getUserCourseProgress = (courseId: string) => {
    if (!user) return null;
    return courseProgress.find(progress => 
      progress.userId === user.id && progress.courseId === courseId
    );
  };

  const filteredCourses = courses
    .filter(course => {
      // Only show published courses to students
      if (user?.role === 'student' && course.status !== 'published') {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !course.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by difficulty
      if (difficultyFilter && course.difficulty !== difficultyFilter) {
        return false;
      }

      // Filter by tab
      if (selectedTab === "enrolled" && user) {
        const progress = getUserCourseProgress(course.id);
        return !!progress;
      }
      
      if (selectedTab === "completed" && user) {
        const progress = getUserCourseProgress(course.id);
        return progress?.completed || false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p>Loading courses...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Courses</h1>
          {user?.role === 'teacher' && (
            <Button onClick={() => navigate('/courses/create')}>
              Create New Course
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
          <Card className="h-fit">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Search</h3>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Filter by Difficulty</h3>
                <Select
                  value={difficultyFilter}
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {user && (
                <div className="pt-4 border-t space-y-2">
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="all" className="flex-1">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="enrolled" className="flex-1">
                        Enrolled
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="flex-1">
                        Completed
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const progress = getUserCourseProgress(course.id);
                  
                  return (
                    <Card key={course.id} className="flex flex-col overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={course.thumbnail || "https://placehold.co/600x400/e2e8f0/475569?text=Course"}
                            alt={course.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                        
                        {progress && (
                          <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-3 py-1">
                            <Progress value={progress.progress} className="h-1" />
                            <p className="text-xs text-right mt-1">
                              {progress.progress}% {progress.completed ? "Complete" : ""}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="flex flex-col flex-grow p-4">
                        <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {course.description}
                        </p>
                        
                        <div className="mt-3 flex flex-wrap gap-1">
                          <Badge variant="outline">
                            {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {course.difficulty || "beginner"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.instructorName}</span>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-4 pt-0 mt-auto">
                        <Button 
                          onClick={() => navigate(`/courses/${course.id}`)} 
                          className="w-full"
                          variant={progress?.completed ? "outline" : "default"}
                        >
                          {!progress ? "Enroll Now" : 
                            progress.completed ? "Review Course" : "Continue Learning"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-lg bg-muted/40">
                <p className="text-center text-muted-foreground">
                  No courses found that match your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CoursesList;
