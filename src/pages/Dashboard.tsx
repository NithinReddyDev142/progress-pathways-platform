
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import TeacherDashboard from "@/pages/dashboard/TeacherDashboard";
import StudentDashboard from "@/pages/dashboard/StudentDashboard";

const Dashboard = () => {
  const { role } = useAuth();

  return (
    <MainLayout>
      {role === "admin" && <AdminDashboard />}
      {role === "teacher" && <TeacherDashboard />}
      {role === "student" && <StudentDashboard />}
    </MainLayout>
  );
};

export default Dashboard;
