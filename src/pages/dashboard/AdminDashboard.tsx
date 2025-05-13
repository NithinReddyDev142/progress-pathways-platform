
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLms } from "@/contexts/LmsContext";
import { mockUsers } from "@/data/mockData";
import { BookOpen, Users, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const { courses, learningPaths, courseProgress } = useLms();
  const [timeFilter, setTimeFilter] = useState("all");
  
  // Calculate statistics
  const totalStudents = mockUsers.filter(user => user.role === "student").length;
  const totalTeachers = mockUsers.filter(user => user.role === "teacher").length;
  const totalCourses = courses.length;
  const totalLearningPaths = learningPaths.length;
  
  // Calculate average completion rate
  const completedCourses = courseProgress.filter(progress => progress.completed).length;
  const totalEnrollments = courseProgress.length;
  const completionRate = totalEnrollments > 0 ? (completedCourses / totalEnrollments) * 100 : 0;
  
  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: React.ElementType, color: string }) => (
    <Card>
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-full p-2 bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Tabs defaultValue="all" className="w-[400px]" onValueChange={setTimeFilter}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={totalStudents} 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          title="Total Teachers" 
          value={totalTeachers} 
          icon={Users} 
          color="green" 
        />
        <StatCard 
          title="Total Courses" 
          value={totalCourses} 
          icon={BookOpen} 
          color="indigo" 
        />
        <StatCard 
          title="Learning Paths" 
          value={totalLearningPaths} 
          icon={Calendar} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rate</CardTitle>
            <CardDescription>
              Average completion rate across all courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Completion</span>
                <span className="font-medium">{completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>
              Recent activities across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">New Course Published</p>
                  <p className="text-sm text-muted-foreground">
                    Introduction to React.js by Jane Smith
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">New User Registered</p>
                  <p className="text-sm text-muted-foreground">
                    Sarah Miller joined as student
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">3 days ago</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Learning Path Created</p>
                  <p className="text-sm text-muted-foreground">
                    Frontend Developer Path by Jane Smith
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">5 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Courses</CardTitle>
            <CardDescription>
              Courses with the highest enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="flex justify-between items-center">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {course.instructorName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {Math.floor(Math.random() * 50) + 10} students
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {course.techStack.slice(0, 2).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
