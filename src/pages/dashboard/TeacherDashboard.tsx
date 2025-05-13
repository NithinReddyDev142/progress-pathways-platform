
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLms } from "@/contexts/LmsContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, BookPlus, Plus, User, Users } from "lucide-react";
import { mockUsers } from "@/data/mockData";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { courses, courseProgress, questions } = useLms();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Filter data related to the teacher
  const teacherCourses = courses.filter(
    (course) => course.instructorId === user?.id
  );
  
  const totalStudents = mockUsers.filter(user => user.role === "student").length;
  
  // Calculate enrollments in teacher's courses
  const courseEnrollments = courseProgress.filter(progress => 
    teacherCourses.some(course => course.id === progress.courseId)
  );
  
  // Calculate unanswered questions in teacher's courses
  const unansweredQuestions = questions.filter(
    q => teacherCourses.some(c => c.id === q.courseId) && !q.answer
  );

  // Calculate average course completion
  const totalProgress = courseEnrollments.reduce((sum, item) => sum + item.progress, 0);
  const averageProgress = courseEnrollments.length > 0 
    ? totalProgress / courseEnrollments.length 
    : 0;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ElementType; 
    color: string; 
  }) => (
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
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button onClick={() => navigate("/teacher/courses/new")}>
          <Plus className="mr-2 h-4 w-4" /> Create Course
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="students">My Students</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="My Courses" 
              value={teacherCourses.length} 
              icon={BookOpen} 
              color="blue" 
            />
            <StatCard 
              title="Total Enrollments" 
              value={courseEnrollments.length} 
              icon={Users} 
              color="green" 
            />
            <StatCard 
              title="Students" 
              value={totalStudents} 
              icon={User} 
              color="indigo" 
            />
            <StatCard 
              title="Unanswered Questions" 
              value={unansweredQuestions.length} 
              icon={BookPlus} 
              color="red" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Completion</CardTitle>
                <CardDescription>
                  Average completion rate for your courses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{averageProgress.toFixed(1)}%</span>
                </div>
                <Progress value={averageProgress} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Questions</CardTitle>
                <CardDescription>
                  Questions from your students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unansweredQuestions.length > 0 ? (
                    unansweredQuestions.slice(0, 3).map((question) => (
                      <div key={question.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{question.question.substring(0, 50)}...</p>
                          <p className="text-sm text-muted-foreground">
                            from {question.studentName}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/teacher/questions/${question.id}`)}
                        >
                          Answer
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No unanswered questions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                Courses you've created and published
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherCourses.length > 0 ? (
                  teacherCourses.map((course) => (
                    <div key={course.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.techStack.slice(0, 3).join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/teacher/courses/${course.id}`)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    You haven't created any courses yet
                  </p>
                )}
              </div>
              
              {teacherCourses.length === 0 && (
                <div className="flex justify-center mt-4">
                  <Button onClick={() => navigate("/teacher/courses/new")}>
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Course
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
              <CardDescription>
                Students enrolled in your courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Display students from mock data */}
                {mockUsers
                  .filter(user => user.role === "student")
                  .slice(0, 5)
                  .map((student) => (
                    <div key={student.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{student.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/teacher/students/${student.id}`)}
                      >
                        View Progress
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Student Questions</CardTitle>
              <CardDescription>
                Questions from your courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unansweredQuestions.length > 0 ? (
                  unansweredQuestions.map((question) => (
                    <div key={question.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{question.question}</p>
                          <p className="text-sm text-muted-foreground">
                            from {question.studentName} • {new Date(question.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/teacher/questions/${question.id}`)}
                        >
                          Answer
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No unanswered questions
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

export default TeacherDashboard;
