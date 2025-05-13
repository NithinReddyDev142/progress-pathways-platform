
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useLms } from "@/contexts/LmsContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, Clock } from "lucide-react";
import { useState } from "react";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { courses, courseProgress } = useLms();
  const [activeTab, setActiveTab] = useState("enrolled");
  const navigate = useNavigate();

  // Get user's course progress
  const userProgress = user
    ? courseProgress.filter((progress) => progress.userId === user.id)
    : [];

  // Get courses the user is enrolled in
  const enrolledCourses = userProgress.map((progress) => {
    const course = courses.find((course) => course.id === progress.courseId);
    return course
      ? {
          ...course,
          progress: progress.progress,
          completed: progress.completed,
          lastAccessed: progress.lastAccessed,
        }
      : null;
  }).filter(Boolean) as (typeof courses[0] & { progress: number; completed: boolean; lastAccessed: string })[];

  // Calculate overall progress
  const overallProgress =
    enrolledCourses.length > 0
      ? enrolledCourses.reduce((acc, course) => acc + course.progress, 0) /
        enrolledCourses.length
      : 0;

  // Upcoming deadlines - courses with deadlines in the future
  const upcomingDeadlines = enrolledCourses
    .filter(
      (course) =>
        course.deadline &&
        new Date(course.deadline) > new Date() &&
        !course.completed
    )
    .sort(
      (a, b) =>
        new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    );

  // Recently accessed courses
  const recentlyAccessed = [...enrolledCourses]
    .sort(
      (a, b) =>
        new Date(b.lastAccessed).getTime() -
        new Date(a.lastAccessed).getTime()
    )
    .slice(0, 3);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format relative time helper
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Learning</h1>
        <Button onClick={() => navigate("/courses")}>
          Browse All Courses
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">{overallProgress.toFixed(0)}%</div>
              <Progress value={overallProgress} className="my-2" />
              <p className="text-sm text-muted-foreground">
                Across {enrolledCourses.length} courses
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-2">
                {upcomingDeadlines.slice(0, 2).map((course) => (
                  <div key={course.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium line-clamp-1">{course.title}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" /> 
                        {course.deadline ? formatDate(course.deadline) : "No deadline"}
                      </div>
                    </div>
                    <Badge variant={getDaysLeft(course.deadline!) < 3 ? "destructive" : "outline"}>
                      {getDaysLeft(course.deadline!)} days left
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No upcoming deadlines
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">
                {enrolledCourses.filter((c) => c.completed).length}
              </div>
              <p className="text-sm text-muted-foreground">
                out of {enrolledCourses.length} enrolled courses
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          <Card>
            <CardHeader>
              <CardTitle>My Enrolled Courses</CardTitle>
              <CardDescription>Courses you're currently taking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses
                    .filter((course) => !course.completed)
                    .map((course) => (
                      <div
                        key={course.id}
                        className="flex justify-between items-center border-b pb-4 last:border-0"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-sm text-muted-foreground">
                              by {course.instructorName}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={course.progress}
                              className="w-[100px]"
                            />
                            <span className="text-sm font-medium w-[40px] text-right">
                              {course.progress}%
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/courses/${course.id}`)}
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    You are not enrolled in any courses yet.
                  </p>
                )}
              </div>
              {enrolledCourses.length === 0 && (
                <div className="flex justify-center mt-4">
                  <Button onClick={() => navigate("/courses")}>
                    Browse Courses
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyAccessed.length > 0 ? (
                  recentlyAccessed.map((course) => (
                    <div
                      key={course.id}
                      className="flex justify-between items-center border-b pb-4 last:border-0"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" /> 
                            {getRelativeTime(course.lastAccessed)}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        Continue
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No recently viewed courses
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Courses</CardTitle>
              <CardDescription>Courses you've finished</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrolledCourses.filter((course) => course.completed).length > 0 ? (
                  enrolledCourses
                    .filter((course) => course.completed)
                    .map((course) => (
                      <div
                        key={course.id}
                        className="flex justify-between items-center border-b pb-4 last:border-0"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-sm text-muted-foreground">
                              by {course.instructorName}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-green-50">Completed</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => navigate(`/courses/${course.id}`)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    You haven't completed any courses yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to calculate days left until deadline
function getDaysLeft(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export default StudentDashboard;
